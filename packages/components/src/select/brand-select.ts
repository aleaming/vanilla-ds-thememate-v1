/**
 * BrandSelect - Select dropdown component with full form integration
 * Per PRD Section 7 - Form-Associated Custom Elements
 *
 * Features:
 * - Extends BaseComponent
 * - formAssociated = true for native form participation
 * - ElementInternals API (setFormValue, validity, validation)
 * - Native select with custom wrapper styling
 * - Placeholder support via disabled first option
 * - Disabled state
 * - Multiple option support via slot
 * - Native validation support (required)
 * - Form lifecycle callbacks (formResetCallback, formDisabledCallback, etc.)
 * - Constructable stylesheet for memory efficiency
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Custom :state() pseudo-class for invalid/valid states
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all select instances
 * Memory efficient: one parsed stylesheet instead of N for N selects
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
    width: 100%;
  }

  .select-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 500;
    color: var(--color-text-primary, var(--primitive-gray-900, #111827));
    line-height: 1.5;
  }

  .select-container {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  select {
    width: 100%;
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    padding-right: calc(var(--space-3, 0.75rem) + 1.5rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text, var(--primitive-gray-900, #111827));
    background: var(--color-surface, var(--primitive-white, #ffffff));
    border: 1px solid var(--color-border, var(--primitive-gray-300, #d1d5db));
    border-radius: var(--radius-input, 0.375rem);
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    transition: border-color var(--motion-duration, 200ms) var(--motion-easing, ease-out),
                box-shadow var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  /* Custom dropdown arrow */
  .select-container::after {
    content: '';
    position: absolute;
    right: var(--space-3, 0.75rem);
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 0.375rem solid transparent;
    border-right: 0.375rem solid transparent;
    border-top: 0.375rem solid var(--color-text, var(--primitive-gray-900, #111827));
    pointer-events: none;
  }

  /* Placeholder styling */
  select option[disabled] {
    color: var(--color-text-muted, var(--primitive-gray-400, #9ca3af));
  }

  /* Placeholder text when first option is selected and disabled */
  select:invalid {
    color: var(--color-text-muted, var(--primitive-gray-400, #9ca3af));
  }

  select:valid {
    color: var(--color-text, var(--primitive-gray-900, #111827));
  }

  /* Focus state */
  select:focus {
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(29, 78, 216, 0.1));
  }

  /* Disabled state */
  select:disabled {
    background: var(--color-disabled-bg, var(--primitive-gray-100, #f3f4f6));
    color: var(--color-disabled-text, var(--primitive-gray-500, #6b7280));
    cursor: not-allowed;
    opacity: 0.6;
  }

  select:disabled + .select-container::after {
    border-top-color: var(--color-disabled-text, var(--primitive-gray-500, #6b7280));
    opacity: 0.6;
  }

  /* Invalid state via custom :state() pseudo-class */
  :host(:state(invalid)) select {
    border-color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  :host(:state(invalid)) select:focus {
    box-shadow: 0 0 0 3px var(--color-error-alpha, rgba(220, 38, 38, 0.1));
  }

  /* Valid state via custom :state() pseudo-class */
  :host(:state(valid)) select {
    border-color: var(--color-success, var(--primitive-green-600, #16a34a));
  }

  /* Focus-visible for accessibility (WCAG 2.1 AA) */
  select:focus-visible {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Label with required indicator */
  label .required {
    color: var(--color-error, var(--primitive-red-600, #dc2626));
    margin-left: var(--space-1, 0.25rem);
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `
  <div class="select-wrapper">
    <label part="label"></label>
    <div class="select-container">
      <select part="select">
        <slot></slot>
      </select>
    </div>
  </div>
`;

/**
 * BrandSelect Web Component
 * Provides select dropdown with full native form integration via ElementInternals
 */
export class BrandSelect extends BaseComponent {
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
    'label',
    'value',
    'placeholder',
    'disabled',
    'required',
    'name',
  ];

  /**
   * Internal select element reference
   * Used for targeted DOM updates and validation
   */
  private select: HTMLSelectElement | null = null;

  /**
   * Internal label element reference
   * Used for label-select association
   */
  private labelElement: HTMLLabelElement | null = null;

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
   * Placeholder option element (created if placeholder attribute is set)
   */
  private placeholderOption: HTMLOptionElement | null = null;

  /**
   * Unique ID for label-select association
   * Per WCAG 1.3.1: Info and Relationships
   */
  private selectId: string = `brand-select-${Math.random().toString(36).substr(2, 9)}`;

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

    // Get reference to internal select and label
    this.select = this.root.querySelector('select');
    this.labelElement = this.root.querySelector('label');

    if (!this.select) return;

    // Set unique ID for label association
    this.select.id = this.selectId;

    // Set up event listeners for form integration
    this.listen(this.select, 'change', this.handleChange.bind(this));
    this.listen(this.select, 'blur', this.handleBlur.bind(this));
    this.listen(this.select, 'invalid', this.handleInvalid.bind(this));

    // Initial attribute synchronization
    this.syncAttributes();

    // Sync initial value after element setup is complete
    this.syncInitialValue();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or select not yet rendered
    if (oldValue === newValue || !this.select) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal select
   * Per PRD Section 6: Attributes controlled via direct property setting
   */
  private syncAttributes(): void {
    if (!this.select) return;

    // Label attribute - associate with select
    const label = this.getAttribute('label');
    const required = this.hasAttribute('required');

    if (label && this.labelElement) {
      this.labelElement.textContent = label;
      this.labelElement.setAttribute('for', this.selectId);
      this.labelElement.style.display = '';

      // Add required indicator
      if (required) {
        const requiredSpan = this.createElement('span', { className: 'required' }, '*');
        this.labelElement.appendChild(requiredSpan);
      }
    } else if (this.labelElement) {
      this.labelElement.style.display = 'none';
    }

    // Placeholder attribute - create disabled first option
    const placeholder = this.getAttribute('placeholder');
    if (placeholder !== null) {
      this.ensurePlaceholder(placeholder);
    } else {
      this.removePlaceholder();
    }

    // Disabled state
    const disabled = this.hasAttribute('disabled');
    this.select.disabled = disabled;
    this.internals.ariaDisabled = disabled ? 'true' : null;

    // Required validation
    this.select.required = required;
    this.internals.ariaRequired = required ? 'true' : null;

    // If required and has placeholder, make placeholder value invalid
    if (required && this.placeholderOption) {
      this.placeholderOption.value = '';
      this.select.required = true;
    }

    // Name (for form association)
    const name = this.getAttribute('name');
    if (name !== null) {
      this.select.name = name;
    } else {
      this.select.removeAttribute('name');
    }

    // Value synchronization
    const attrValue = this.getAttribute('value');
    if (attrValue !== null && this._value !== attrValue) {
      this.value = attrValue;
    }

    // Update validation state
    this.updateValidationState();
  }

  /**
   * Ensure placeholder option exists and is first
   */
  private ensurePlaceholder(text: string): void {
    if (!this.select) return;

    if (!this.placeholderOption) {
      // Create placeholder option
      this.placeholderOption = this.createElement('option');
      this.placeholderOption.value = '';
      this.placeholderOption.disabled = true;
      this.placeholderOption.selected = true;
      this.placeholderOption.hidden = true;
      this.select.insertBefore(this.placeholderOption, this.select.firstChild);
    }

    this.placeholderOption.textContent = text;
  }

  /**
   * Remove placeholder option if it exists
   */
  private removePlaceholder(): void {
    if (this.placeholderOption && this.placeholderOption.parentNode) {
      this.placeholderOption.parentNode.removeChild(this.placeholderOption);
      this.placeholderOption = null;
    }
  }

  /**
   * Sync initial value after options are rendered
   */
  private syncInitialValue(): void {
    if (!this.select) return;

    const attrValue = this.getAttribute('value');
    if (attrValue !== null) {
      this.value = attrValue;
    } else {
      // If no value set, update internal value from select
      this._value = this.select.value;
      this.internals.setFormValue(this._value);
      this.updateValidationState();
    }
  }

  /**
   * Handle change event - update value and form state
   * Per PRD 7.1: Synchronize value with internals.setFormValue()
   */
  private handleChange(e: Event): void {
    if (!this.select) return;

    this._value = this.select.value;
    this.internals.setFormValue(this._value);

    // Dispatch custom change event that bubbles out of shadow DOM
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      })
    );

    // Update validation state on change
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
   */
  private updateValidationState(): void {
    if (!this.select) return;

    const isValid = this.select.validity.valid;

    if (isValid) {
      this.internals.setValidity({});
      this.internals.states.delete('invalid');
      // Add valid state if a non-placeholder value is selected
      if (this._value && this._value !== '') {
        this.internals.states.add('valid');
      } else {
        this.internals.states.delete('valid');
      }
    } else {
      // Copy native validity state to ElementInternals
      this.internals.setValidity(
        this.select.validity,
        this.select.validationMessage,
        this.select
      );
      this.internals.states.add('invalid');
      this.internals.states.delete('valid');
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

    if (this.select) {
      this.select.value = v;
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
   */
  setCustomValidity(message: string): void {
    if (!this.select) return;

    if (message) {
      this.internals.setValidity({ customError: true }, message, this.select);
      this.internals.states.add('invalid');
      this.internals.states.delete('valid');
    } else {
      this.internals.setValidity({});
      this.internals.states.delete('invalid');
      if (this._value && this._value !== '') {
        this.internals.states.add('valid');
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

    // If has placeholder and no initial value, select placeholder
    if (this.placeholderOption && initialValue === '') {
      if (this.select) {
        this.placeholderOption.selected = true;
      }
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
   * Focus the select programmatically
   * Useful for accessibility and form handling
   */
  focus(): void {
    this.select?.focus();
  }

  /**
   * Blur the select programmatically
   */
  blur(): void {
    this.select?.blur();
  }

  /**
   * Get selected option index
   */
  get selectedIndex(): number {
    return this.select?.selectedIndex ?? -1;
  }

  /**
   * Set selected option index
   */
  set selectedIndex(index: number) {
    if (this.select) {
      this.select.selectedIndex = index;
      this._value = this.select.value;
      this.internals.setFormValue(this._value);
      this.updateValidationState();
    }
  }

  /**
   * Get selected option element
   */
  get selectedOption(): HTMLOptionElement | null {
    return this.select?.selectedOptions[0] ?? null;
  }

  /**
   * Get all options (from slotted content)
   */
  get options(): HTMLOptionsCollection | null {
    return this.select?.options ?? null;
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-select> in HTML
 */
customElements.define('brand-select', BrandSelect);
