/**
 * BrandInput - Text input component with full form integration
 * Per PRD Section 7 - Form-Associated Custom Elements
 *
 * Features:
 * - Extends BaseComponent
 * - formAssociated = true for native form participation
 * - ElementInternals API (setFormValue, validity, validation)
 * - Types: text, email, password, number, search
 * - Native validation support (required, pattern, min, max, etc.)
 * - Form lifecycle callbacks (formResetCallback, formDisabledCallback, etc.)
 * - Constructable stylesheet for memory efficiency
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Custom :state() pseudo-class for invalid/valid states
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all input instances
 * Memory efficient: one parsed stylesheet instead of N for N inputs
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
    width: 100%;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, var(--primitive-gray-900, #111827));
    margin-bottom: var(--space-1, 0.25rem);
  }

  input {
    width: 100%;
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text, var(--primitive-gray-900, #111827));
    background: var(--color-surface, var(--primitive-white, #ffffff));
    border: 1px solid var(--color-border, var(--primitive-gray-300, #d1d5db));
    border-radius: var(--radius-input, 0.375rem);
    outline: none;
    transition: border-color var(--motion-duration, 200ms) var(--motion-easing, ease-out),
                box-shadow var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  input::placeholder {
    color: var(--color-text-muted, var(--primitive-gray-400, #9ca3af));
  }

  /* Focus state */
  input:focus {
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(29, 78, 216, 0.1));
  }

  /* Disabled state */
  input:disabled {
    background: var(--color-disabled-bg, var(--primitive-gray-100, #f3f4f6));
    color: var(--color-disabled-text, var(--primitive-gray-500, #6b7280));
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Invalid state via custom :state() pseudo-class */
  :host(:state(invalid)) input {
    border-color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  :host(:state(invalid)) input:focus {
    box-shadow: 0 0 0 3px var(--color-error-alpha, rgba(220, 38, 38, 0.1));
  }

  /* Valid state via custom :state() pseudo-class */
  :host(:state(valid)) input {
    border-color: var(--color-success, var(--primitive-green-600, #16a34a));
  }

  /* Readonly state */
  input:read-only {
    background: var(--color-readonly-bg, var(--primitive-gray-50, #f9fafb));
    cursor: default;
  }

  /* Search input specific styles */
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }

  /* Number input spinner controls */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Focus-visible for accessibility (WCAG 2.1 AA) */
  input:focus-visible {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Error message (WCAG 3.3.1 - Error Identification) */
  .error-message {
    display: none;
    margin-top: var(--space-1, 0.25rem);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  .error-message:not(:empty) {
    display: block;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `
  <div class="input-wrapper">
    <label part="label"></label>
    <input part="input" />
    <div class="error-message" part="error" role="alert" aria-live="polite"></div>
  </div>
`;

/**
 * BrandInput Web Component
 * Provides text input with full native form integration via ElementInternals
 */
export class BrandInput extends BaseComponent {
  /**
   * Enable form association for native form participation
   * Per PRD 7.1: Required flag for Form-Associated Custom Elements
   */
  static formAssociated = true;

  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = [
    'type',
    'value',
    'placeholder',
    'disabled',
    'readonly',
    'required',
    'pattern',
    'min',
    'max',
    'minlength',
    'maxlength',
    'step',
    'autocomplete',
    'name',
    'label',
  ];

  /**
   * Internal input element reference
   * Used for targeted DOM updates and validation
   */
  private input: HTMLInputElement | null = null;

  /**
   * Internal label element reference
   * Used for programmatic label association
   */
  private labelElement: HTMLLabelElement | null = null;

  /**
   * Internal error message element reference
   * Used for error announcement (WCAG 3.3.1 - Error Identification)
   */
  private errorElement: HTMLDivElement | null = null;

  /**
   * ElementInternals for form participation, validation, and custom states
   * Per PRD 7.1: Provides setFormValue, validity, validation, and custom states
   */
  public internals: ElementInternals;

  /**
   * Internal value storage
   * Synchronized with internals.setFormValue()
   */
  private _value: string = '';

  /**
   * Unique ID for label/input association
   * Generated once per instance for proper ARIA association
   */
  private inputId: string = `brand-input-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Unique ID for error message association
   * Generated once per instance for ARIA error announcement
   */
  private errorId: string = `${this.inputId}-error`;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * Called when element is added to DOM
   * Per PRD 6.4: Clone template (safe - no interpolation)
   */
  connectedCallback(): void {
    // Clone template for safe DOM construction
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Get reference to internal input, label, and error elements
    this.input = this.root.querySelector('input');
    this.labelElement = this.root.querySelector('label');
    this.errorElement = this.root.querySelector('.error-message');

    if (!this.input) return;

    // Set up event listeners for form integration
    this.listen(this.input, 'input', this.handleInput.bind(this));
    this.listen(this.input, 'blur', this.handleBlur.bind(this));
    this.listen(this.input, 'invalid', this.handleInvalid.bind(this));

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or input not yet rendered
    if (oldValue === newValue || !this.input) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal input
   * Per PRD Section 6: Attributes controlled via direct property setting
   */
  private syncAttributes(): void {
    if (!this.input) return;

    // Type attribute
    const type = this.getAttribute('type') ?? 'text';
    const validTypes = ['text', 'email', 'password', 'number', 'search'];
    this.input.type = validTypes.includes(type) ? type : 'text';

    // Value synchronization
    const attrValue = this.getAttribute('value');
    if (attrValue !== null && this._value !== attrValue) {
      this.value = attrValue;
    }

    // Placeholder
    const placeholder = this.getAttribute('placeholder');
    if (placeholder !== null) {
      this.input.placeholder = placeholder;
    } else {
      this.input.removeAttribute('placeholder');
    }

    // Disabled state
    const disabled = this.hasAttribute('disabled');
    this.input.disabled = disabled;
    this.internals.ariaDisabled = disabled ? 'true' : null;

    // Readonly state
    const readonly = this.hasAttribute('readonly');
    this.input.readOnly = readonly;

    // Required validation
    const required = this.hasAttribute('required');
    this.input.required = required;
    this.internals.ariaRequired = required ? 'true' : null;

    // Pattern validation
    const pattern = this.getAttribute('pattern');
    if (pattern !== null) {
      this.input.pattern = pattern;
    } else {
      this.input.removeAttribute('pattern');
    }

    // Min/Max for number/date inputs
    const min = this.getAttribute('min');
    if (min !== null) {
      this.input.min = min;
    } else {
      this.input.removeAttribute('min');
    }

    const max = this.getAttribute('max');
    if (max !== null) {
      this.input.max = max;
    } else {
      this.input.removeAttribute('max');
    }

    // MinLength/MaxLength for text inputs
    const minlength = this.getAttribute('minlength');
    if (minlength !== null) {
      this.input.minLength = parseInt(minlength, 10);
    } else {
      this.input.removeAttribute('minlength');
    }

    const maxlength = this.getAttribute('maxlength');
    if (maxlength !== null) {
      this.input.maxLength = parseInt(maxlength, 10);
    } else {
      this.input.removeAttribute('maxlength');
    }

    // Step for number inputs
    const step = this.getAttribute('step');
    if (step !== null) {
      this.input.step = step;
    } else {
      this.input.removeAttribute('step');
    }

    // Autocomplete
    const autocomplete = this.getAttribute('autocomplete');
    if (autocomplete !== null) {
      this.input.setAttribute('autocomplete', autocomplete);
    } else {
      this.input.removeAttribute('autocomplete');
    }

    // Name (for form association)
    const name = this.getAttribute('name');
    if (name !== null) {
      this.input.name = name;
    } else {
      this.input.removeAttribute('name');
    }

    // Label association (WCAG 1.3.1 - Info and Relationships)
    const label = this.getAttribute('label');
    if (label && this.labelElement) {
      this.labelElement.textContent = label;
      this.labelElement.setAttribute('for', this.inputId);
      this.input.id = this.inputId;
      this.labelElement.style.display = '';
    } else if (this.labelElement) {
      this.labelElement.style.display = 'none';
    }

    // Update validation state
    this.updateValidationState();
  }

  /**
   * Handle input event - update value and form state
   * Per PRD 7.1: Synchronize value with internals.setFormValue()
   */
  private handleInput(e: Event): void {
    if (!this.input) return;

    this._value = this.input.value;
    this.internals.setFormValue(this._value);

    // Dispatch custom input event that bubbles out of shadow DOM
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      })
    );

    // Update validation state on input
    this.updateValidationState();
  }

  /**
   * Handle blur event - validate and update state
   * Per PRD 7.3: Update custom states based on validation
   */
  private handleBlur(): void {
    this.updateValidationState();

    // Dispatch custom blur event
    this.dispatchEvent(
      new Event('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle invalid event from native validation
   */
  private handleInvalid(e: Event): void {
    e.preventDefault(); // Prevent default browser validation UI
    this.updateValidationState();
  }

  /**
   * Update validation state and custom states
   * Per PRD 7.3: Use internals.states for custom :state() pseudo-classes
   * Per WCAG 3.3.1: Announce error messages to screen readers
   */
  private updateValidationState(): void {
    if (!this.input) return;

    const isValid = this.input.validity.valid;

    if (isValid) {
      this.internals.setValidity({});
      this.internals.states.delete('invalid');
      if (this._value) {
        this.internals.states.add('valid');
      } else {
        this.internals.states.delete('valid');
      }
      // Clear error message
      if (this.errorElement) {
        this.errorElement.textContent = '';
        this.input.removeAttribute('aria-describedby');
      }
    } else {
      // Copy native validity state to ElementInternals
      this.internals.setValidity(
        this.input.validity,
        this.input.validationMessage,
        this.input
      );
      this.internals.states.add('invalid');
      this.internals.states.delete('valid');
      // Set error message for screen reader announcement
      if (this.errorElement) {
        this.errorElement.textContent = this.input.validationMessage;
        this.errorElement.id = this.errorId;
        this.input.setAttribute('aria-describedby', this.errorId);
      }
    }
  }

  /**
   * Value property getter
   * Per PRD 7.1: Expose value via public property
   */
  get value(): string {
    return this._value;
  }

  /**
   * Value property setter
   * Per PRD 7.1: Synchronize with internals.setFormValue()
   */
  set value(v: string) {
    this._value = v;
    this.internals.setFormValue(v);

    if (this.input) {
      this.input.value = v;
      this.updateValidationState();
    }
  }

  /**
   * Validity state getter
   * Per PRD 7.1: Expose native ValidityState
   */
  get validity(): ValidityState {
    return this.internals.validity;
  }

  /**
   * Validation message getter
   * Per PRD 7.1: Expose native validation message
   */
  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  /**
   * Check validity without showing validation UI
   * Per PRD 7.1: Native validation integration
   */
  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  /**
   * Check validity and show validation UI
   * Per PRD 7.1: Native validation integration
   */
  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  /**
   * Set custom validation message
   * Per PRD 7.1: Custom validation support
   * Per WCAG 3.3.1: Announce custom error messages to screen readers
   */
  setCustomValidity(message: string): void {
    if (!this.input) return;

    if (message) {
      this.internals.setValidity({ customError: true }, message, this.input);
      this.internals.states.add('invalid');
      this.internals.states.delete('valid');
      // Set error message for screen reader announcement
      if (this.errorElement) {
        this.errorElement.textContent = message;
        this.errorElement.id = this.errorId;
        this.input.setAttribute('aria-describedby', this.errorId);
      }
    } else {
      this.internals.setValidity({});
      this.internals.states.delete('invalid');
      if (this._value) {
        this.internals.states.add('valid');
      }
      // Clear error message
      if (this.errorElement) {
        this.errorElement.textContent = '';
        this.input.removeAttribute('aria-describedby');
      }
    }
  }

  /**
   * Form lifecycle callback: element associated with form
   * Per PRD 7.2: Form association lifecycle hook
   */
  formAssociatedCallback(form: HTMLFormElement | null): void {
    // Lifecycle hook - called when element is associated with a form
    // Currently no action needed as ElementInternals handles form association
  }

  /**
   * Form lifecycle callback: form disabled state changed
   * Per PRD 7.2: Synchronize disabled state
   */
  formDisabledCallback(disabled: boolean): void {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * Form lifecycle callback: form reset
   * Per PRD 7.2: Reset to default value and clear validation
   */
  formResetCallback(): void {
    // Reset to initial value attribute or empty string
    const initialValue = this.getAttribute('value') ?? '';
    this.value = initialValue;
    this.internals.setValidity({});
    this.internals.states.delete('invalid');
    this.internals.states.delete('valid');
    // Clear error message
    if (this.errorElement && this.input) {
      this.errorElement.textContent = '';
      this.input.removeAttribute('aria-describedby');
    }
  }

  /**
   * Form lifecycle callback: form state restored (browser back/forward)
   * Per PRD 7.2: Restore saved form state
   */
  formStateRestoreCallback(state: string | FormData, mode: 'restore' | 'autocomplete'): void {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  /**
   * Focus the input programmatically
   * Useful for accessibility and form handling
   */
  focus(): void {
    this.input?.focus();
  }

  /**
   * Blur the input programmatically
   */
  blur(): void {
    this.input?.blur();
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-input> in HTML
 */
customElements.define('brand-input', BrandInput);
