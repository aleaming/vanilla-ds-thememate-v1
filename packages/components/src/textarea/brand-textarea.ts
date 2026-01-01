/**
 * BrandTextarea - Multi-line text input component
 * Per PRD Section 6 - Form-associated custom element with:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - ElementInternals API for form participation
 * - Auto-resize functionality
 * - Character count support
 * - Validation states (error, success, warning)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all textarea instances
 * Memory efficient: one parsed stylesheet instead of N for N textareas
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    position: relative;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
  }

  label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 500;
    color: var(--color-text-primary, var(--primitive-gray-900, #111827));
    line-height: 1.5;
  }

  .input-wrapper {
    position: relative;
  }

  textarea {
    display: block;
    width: 100%;
    min-height: 80px;
    padding: var(--space-3, 0.75rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text-primary, var(--primitive-gray-900, #111827));
    background: var(--color-surface, var(--primitive-white, #ffffff));
    border: 1px solid var(--color-border, var(--primitive-gray-300, #d1d5db));
    border-radius: var(--radius-input, 0.375rem);
    resize: vertical;
    transition: border-color var(--motion-duration, 200ms) var(--motion-easing, ease-out),
                box-shadow var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  textarea::placeholder {
    color: var(--color-text-secondary, var(--primitive-gray-500, #6b7280));
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(29, 78, 216, 0.1));
  }

  /* Disabled state */
  textarea:disabled {
    background: var(--color-surface-disabled, var(--primitive-gray-100, #f3f4f6));
    color: var(--color-text-disabled, var(--primitive-gray-500, #6b7280));
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Auto-resize mode */
  :host([auto-resize]) textarea {
    resize: none;
    overflow: hidden;
  }

  /* Error state via custom :state() pseudo-class */
  :host(:state(error)) textarea {
    border-color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  :host(:state(error)) textarea:focus {
    border-color: var(--color-error, var(--primitive-red-600, #dc2626));
    box-shadow: 0 0 0 3px var(--color-error-alpha, rgba(220, 38, 38, 0.1));
  }

  /* Success state */
  :host(:state(success)) textarea {
    border-color: var(--color-success, var(--primitive-green-600, #16a34a));
  }

  :host(:state(success)) textarea:focus {
    border-color: var(--color-success, var(--primitive-green-600, #16a34a));
    box-shadow: 0 0 0 3px var(--color-success-alpha, rgba(22, 163, 74, 0.1));
  }

  /* Warning state */
  :host(:state(warning)) textarea {
    border-color: var(--color-warning, var(--primitive-yellow-600, #ca8a04));
  }

  :host(:state(warning)) textarea:focus {
    border-color: var(--color-warning, var(--primitive-yellow-600, #ca8a04));
    box-shadow: 0 0 0 3px var(--color-warning-alpha, rgba(202, 138, 4, 0.1));
  }

  /* Helper text styles */
  .helper-text {
    font-size: var(--text-xs, 0.75rem);
    line-height: 1.5;
    color: var(--color-text-secondary, var(--primitive-gray-500, #6b7280));
  }

  :host(:state(error)) .helper-text {
    color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  :host(:state(success)) .helper-text {
    color: var(--color-success, var(--primitive-green-600, #16a34a));
  }

  :host(:state(warning)) .helper-text {
    color: var(--color-warning, var(--primitive-yellow-600, #ca8a04));
  }

  /* Character count */
  .char-count {
    display: flex;
    justify-content: flex-end;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, var(--primitive-gray-500, #6b7280));
    margin-top: var(--space-1, 0.25rem);
  }

  .char-count.over-limit {
    color: var(--color-error, var(--primitive-red-600, #dc2626));
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  textarea:focus-visible {
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
  <div class="container">
    <label part="label"></label>
    <div class="input-wrapper">
      <textarea part="textarea"></textarea>
    </div>
    <div class="helper-text" part="helper-text"></div>
    <div class="char-count" part="char-count"></div>
  </div>
`;

/**
 * BrandTextarea Web Component
 * Form-associated custom element for multi-line text input
 */
export class BrandTextarea extends BaseComponent {
  /**
   * Enable form participation
   * Per PRD 7.3: FormData integration via ElementInternals
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
    'name',
    'value',
    'placeholder',
    'disabled',
    'required',
    'readonly',
    'maxlength',
    'minlength',
    'rows',
    'auto-resize',
    'show-count',
    'helper-text',
    'validation-state',
  ];

  /**
   * Internal textarea element reference
   * Used for targeted DOM updates
   */
  private textarea: HTMLTextAreaElement | null = null;

  /**
   * ElementInternals for form participation and custom states
   * Per PRD 7.3: Custom states via internals.states.add/delete
   */
  public internals: ElementInternals;

  /**
   * References to DOM elements for updates
   */
  private labelEl: HTMLLabelElement | null = null;
  private helperTextEl: HTMLDivElement | null = null;
  private charCountEl: HTMLDivElement | null = null;

  /**
   * Unique ID for label/textarea association
   * Per WCAG 1.3.1: Info and Relationships
   */
  private textareaId: string = `brand-textarea-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Unique ID for helper text association
   * Per WCAG 3.3.1: Error Identification
   */
  private helperId: string = `${this.textareaId}-helper`;

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

    // Get references to internal elements
    this.textarea = this.root.querySelector('textarea');
    this.labelEl = this.root.querySelector('label');
    this.helperTextEl = this.root.querySelector('.helper-text');
    this.charCountEl = this.root.querySelector('.char-count');

    // Set label/textarea association for WCAG 1.3.1
    if (this.textarea) {
      this.textarea.id = this.textareaId;
    }

    if (this.labelEl) {
      this.labelEl.setAttribute('for', this.textareaId);
    }

    // Set helper text ID and link to textarea via aria-describedby for WCAG 3.3.1
    if (this.helperTextEl) {
      this.helperTextEl.id = this.helperId;
    }

    if (this.textarea && this.helperTextEl) {
      this.textarea.setAttribute('aria-describedby', this.helperId);
    }

    // Set up event listeners for form integration
    if (this.textarea) {
      this.listen(this.textarea, 'input', this.handleInput.bind(this));
      this.listen(this.textarea, 'blur', this.handleBlur.bind(this));
    }

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or textarea not yet rendered
    if (oldValue === newValue || !this.textarea) return;

    this.syncAttributes();
  }

  /**
   * Handle input events
   * Updates form value and handles auto-resize
   */
  private handleInput(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;

    // Update form value via ElementInternals
    this.internals.setFormValue(value);

    // Auto-resize if enabled
    if (this.hasAttribute('auto-resize')) {
      this.autoResize();
    }

    // Update character count
    this.updateCharCount();

    // Dispatch custom input event
    this.dispatchEvent(
      new CustomEvent('brand-input', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle blur events
   * Triggers validation
   */
  private handleBlur(): void {
    this.validate();

    this.dispatchEvent(
      new CustomEvent('brand-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Auto-resize textarea to fit content
   */
  private autoResize(): void {
    if (!this.textarea) return;

    // Reset height to auto to get correct scrollHeight
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  /**
   * Update character count display
   */
  private updateCharCount(): void {
    if (!this.charCountEl || !this.textarea) return;

    const showCount = this.hasAttribute('show-count');
    if (!showCount) {
      this.charCountEl.style.display = 'none';
      return;
    }

    this.charCountEl.style.display = 'flex';

    const currentLength = this.textarea.value.length;
    const maxLength = this.textarea.maxLength;

    if (maxLength > 0) {
      this.charCountEl.textContent = `${currentLength} / ${maxLength}`;

      // Add over-limit class if over maxlength
      if (currentLength > maxLength) {
        this.charCountEl.classList.add('over-limit');
      } else {
        this.charCountEl.classList.remove('over-limit');
      }
    } else {
      this.charCountEl.textContent = `${currentLength}`;
    }
  }

  /**
   * Validate the textarea
   * Updates validation state and internals
   */
  private validate(): void {
    if (!this.textarea) return;

    const value = this.textarea.value;
    const required = this.hasAttribute('required');
    const minLength = parseInt(this.getAttribute('minlength') || '0');
    const maxLength = parseInt(this.getAttribute('maxlength') || '-1');

    let validationMessage = '';

    // Required validation
    if (required && !value.trim()) {
      validationMessage = 'This field is required';
    }
    // Min length validation
    else if (minLength > 0 && value.length < minLength) {
      validationMessage = `Minimum ${minLength} characters required`;
    }
    // Max length validation
    else if (maxLength > 0 && value.length > maxLength) {
      validationMessage = `Maximum ${maxLength} characters allowed`;
    }

    // Update ElementInternals validity
    if (validationMessage) {
      this.internals.setValidity(
        { customError: true },
        validationMessage,
        this.textarea
      );
    } else {
      this.internals.setValidity({});
    }
  }

  /**
   * Synchronize component attributes to internal elements
   * Per PRD Section 6: Controlled via data attributes and properties
   */
  private syncAttributes(): void {
    if (!this.textarea || !this.labelEl || !this.helperTextEl) return;

    // Label
    const label = this.getAttribute('label') || '';
    const required = this.hasAttribute('required');

    if (label) {
      this.labelEl.style.display = 'block';
      // Safe text content setting (no XSS)
      this.labelEl.textContent = label;

      // Add required indicator
      if (required) {
        const requiredSpan = this.createElement('span', { className: 'required' }, '*');
        this.labelEl.appendChild(requiredSpan);
      }
    } else {
      this.labelEl.style.display = 'none';
    }

    // Name attribute for form participation
    const name = this.getAttribute('name');
    if (name) {
      this.textarea.setAttribute('name', name);
    }

    // Value
    const value = this.getAttribute('value');
    if (value !== null && this.textarea.value !== value) {
      this.textarea.value = value;
      this.internals.setFormValue(value);
    }

    // Placeholder
    const placeholder = this.getAttribute('placeholder');
    if (placeholder) {
      this.textarea.placeholder = placeholder;
    }

    // Disabled
    const disabled = this.hasAttribute('disabled');
    this.textarea.disabled = disabled;
    this.internals.ariaDisabled = disabled ? 'true' : null;

    // Required
    this.textarea.required = required;
    this.internals.ariaRequired = required ? 'true' : null;

    // Readonly
    const readonly = this.hasAttribute('readonly');
    this.textarea.readOnly = readonly;

    // Maxlength
    const maxlength = this.getAttribute('maxlength');
    if (maxlength) {
      this.textarea.maxLength = parseInt(maxlength);
    }

    // Minlength
    const minlength = this.getAttribute('minlength');
    if (minlength) {
      this.textarea.minLength = parseInt(minlength);
    }

    // Rows
    const rows = this.getAttribute('rows');
    if (rows) {
      this.textarea.rows = parseInt(rows);
    }

    // Helper text
    const helperText = this.getAttribute('helper-text');
    if (helperText) {
      this.helperTextEl.style.display = 'block';
      this.helperTextEl.textContent = helperText;
    } else {
      this.helperTextEl.style.display = 'none';
    }

    // Validation state (error, success, warning)
    const validationState = this.getAttribute('validation-state');

    // Clear all validation states
    this.internals.states.delete('error');
    this.internals.states.delete('success');
    this.internals.states.delete('warning');

    // Set current validation state
    if (validationState) {
      this.internals.states.add(validationState);
    }

    // Add role="alert" for error state to announce errors to assistive technology (WCAG 3.3.1)
    if (this.helperTextEl) {
      if (validationState === 'error') {
        this.helperTextEl.setAttribute('role', 'alert');
      } else {
        this.helperTextEl.removeAttribute('role');
      }
    }

    // Update character count
    this.updateCharCount();

    // Auto-resize if enabled
    if (this.hasAttribute('auto-resize')) {
      this.autoResize();
    }
  }

  /**
   * Public API: Get current value
   */
  get value(): string {
    return this.textarea?.value || '';
  }

  /**
   * Public API: Set value
   */
  set value(val: string) {
    if (this.textarea) {
      this.textarea.value = val;
      this.internals.setFormValue(val);
      this.updateCharCount();

      if (this.hasAttribute('auto-resize')) {
        this.autoResize();
      }
    }
  }

  /**
   * Public API: Focus the textarea
   */
  focus(): void {
    this.textarea?.focus();
  }

  /**
   * Public API: Blur the textarea
   */
  blur(): void {
    this.textarea?.blur();
  }

  /**
   * Form lifecycle: Reset
   * Called when parent form is reset
   */
  formResetCallback(): void {
    if (this.textarea) {
      this.textarea.value = this.getAttribute('value') || '';
      this.internals.setFormValue(this.textarea.value);
      this.updateCharCount();

      if (this.hasAttribute('auto-resize')) {
        this.autoResize();
      }
    }
  }

  /**
   * Form lifecycle: Disabled
   * Called when form disabled state changes
   */
  formDisabledCallback(disabled: boolean): void {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-textarea> in HTML
 */
customElements.define('brand-textarea', BrandTextarea);
