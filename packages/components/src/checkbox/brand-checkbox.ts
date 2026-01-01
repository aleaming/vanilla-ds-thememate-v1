/**
 * BrandCheckbox - Form-associated checkbox component with indeterminate state
 * Per PRD Section 6.2 - Demonstrates:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements FormAssociated mixin for native form participation
 * - Implements ElementInternals API for form value and validation
 * - States: checked, unchecked, indeterminate
 * - Keyboard accessible (Space to toggle)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all checkbox instances
 * Memory efficient: one parsed stylesheet instead of N for N checkboxes
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
  }

  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .checkbox-box {
    position: relative;
    width: var(--checkbox-size, 1.25rem);
    height: var(--checkbox-size, 1.25rem);
    border: 2px solid var(--color-border, var(--primitive-gray-400, #9ca3af));
    border-radius: var(--radius-checkbox, 0.25rem);
    background: var(--color-surface, var(--primitive-white, #ffffff));
    transition: all var(--motion-duration, 200ms) var(--motion-easing, ease-out);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .checkbox-box:hover {
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  /* Checked state */
  :host([checked]) .checkbox-box {
    background: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  :host([checked]) .checkbox-box::after {
    content: '';
    position: absolute;
    width: 0.375rem;
    height: 0.625rem;
    border: solid var(--color-on-primary, var(--primitive-white, #ffffff));
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    top: 0.125rem;
  }

  /* Indeterminate state */
  :host(:state(indeterminate)) .checkbox-box {
    background: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  :host(:state(indeterminate)) .checkbox-box::after {
    content: '';
    position: absolute;
    width: 0.625rem;
    height: 2px;
    background: var(--color-on-primary, var(--primitive-white, #ffffff));
    border: none;
    transform: none;
    top: 50%;
    margin-top: -1px;
  }

  /* Disabled state */
  :host([disabled]) .checkbox-box {
    border-color: var(--color-border-disabled, var(--primitive-gray-300, #d1d5db));
    background: var(--color-surface-disabled, var(--primitive-gray-100, #f3f4f6));
  }

  :host([disabled][checked]) .checkbox-box,
  :host([disabled]:state(indeterminate)) .checkbox-box {
    background: var(--color-primary-disabled, var(--primitive-gray-400, #9ca3af));
    border-color: var(--color-primary-disabled, var(--primitive-gray-400, #9ca3af));
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .checkbox-box,
  :host(:focus-within) .checkbox-box {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Label slot */
  .checkbox-label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text, var(--primitive-gray-900, #111827));
  }

  :host([disabled]) .checkbox-label {
    color: var(--color-text-disabled, var(--primitive-gray-500, #6b7280));
  }

  /* Hidden native input for form participation */
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `
  <div class="checkbox-container" part="container">
    <div class="checkbox-box" part="box" role="checkbox" tabindex="0"></div>
    <div class="checkbox-label" part="label">
      <slot></slot>
    </div>
  </div>
  <input type="checkbox" aria-hidden="true" tabindex="-1">
`;

/**
 * BrandCheckbox Web Component
 * Provides form-associated checkbox with indeterminate state support
 */
export class BrandCheckbox extends BaseComponent {
  /**
   * Enable form association
   * Per PRD 7.4: Form-associated custom elements
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
  static observedAttributes = ['checked', 'disabled', 'name', 'value', 'required'];

  /**
   * Internal checkbox box element reference
   */
  private checkboxBox: HTMLElement | null = null;

  /**
   * Internal hidden input for form participation
   */
  private hiddenInput: HTMLInputElement | null = null;

  /**
   * ElementInternals for custom states, form value, and ARIA
   * Per PRD 7.3: Custom states via internals.states.add/delete
   * Per PRD 7.4: Form value via internals.setFormValue()
   */
  public internals: ElementInternals;

  /**
   * Internal indeterminate state
   * Not reflected as an attribute, only accessible via property
   */
  private _indeterminate = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * Public getter for checked state
   */
  get checked(): boolean {
    return this.hasAttribute('checked');
  }

  /**
   * Public setter for checked state
   */
  set checked(value: boolean) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
    // Clear indeterminate when explicitly setting checked
    this.indeterminate = false;
  }

  /**
   * Public getter for indeterminate state
   */
  get indeterminate(): boolean {
    return this._indeterminate;
  }

  /**
   * Public setter for indeterminate state
   */
  set indeterminate(value: boolean) {
    this._indeterminate = value;
    this.syncIndeterminate();
  }

  /**
   * Public getter for disabled state
   */
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  /**
   * Public setter for disabled state
   */
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * Public getter for name (form field name)
   */
  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  /**
   * Public setter for name
   */
  set name(value: string) {
    this.setAttribute('name', value);
  }

  /**
   * Public getter for value
   */
  get value(): string {
    return this.getAttribute('value') ?? 'on';
  }

  /**
   * Public setter for value
   */
  set value(value: string) {
    this.setAttribute('value', value);
  }

  /**
   * Public getter for required state
   */
  get required(): boolean {
    return this.hasAttribute('required');
  }

  /**
   * Public setter for required state
   */
  set required(value: boolean) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
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
    this.checkboxBox = this.root.querySelector('[part="box"]');
    this.hiddenInput = this.root.querySelector('input');

    // Set up event listeners for keyboard and click interaction
    this.setupEventListeners();

    // Initial attribute synchronization
    this.syncAttributes();
    this.syncFormValue();
    this.syncIndeterminate();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or element not yet rendered
    if (oldValue === newValue || !this.checkboxBox) return;

    this.syncAttributes();
    this.syncFormValue();

    // Clear indeterminate when checked attribute changes
    if (name === 'checked') {
      this._indeterminate = false;
      this.syncIndeterminate();
    }
  }

  /**
   * Set up event listeners for interaction
   */
  private setupEventListeners(): void {
    if (!this.checkboxBox) return;

    // Click handler for the checkbox box
    this.listen(this.checkboxBox, 'click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Keyboard handler for Space key
    this.listen(this.checkboxBox, 'keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Toggle checked state
   * Public method for programmatic toggling
   */
  public toggle(): void {
    if (this.disabled) return;

    // Clear indeterminate and toggle checked
    this._indeterminate = false;
    this.checked = !this.checked;

    // Dispatch change event
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Synchronize component attributes to internal elements
   */
  private syncAttributes(): void {
    if (!this.checkboxBox || !this.hiddenInput) return;

    const checked = this.checked;
    const disabled = this.disabled;
    const required = this.required;

    // Update ARIA attributes on checkbox box
    this.checkboxBox.setAttribute('aria-checked', String(checked));
    this.checkboxBox.setAttribute('aria-disabled', String(disabled));
    if (required) {
      this.checkboxBox.setAttribute('aria-required', 'true');
    } else {
      this.checkboxBox.removeAttribute('aria-required');
    }

    // Update tabindex based on disabled state
    this.checkboxBox.setAttribute('tabindex', disabled ? '-1' : '0');

    // Sync hidden input for native form behavior
    this.hiddenInput.checked = checked;
    this.hiddenInput.disabled = disabled;
    this.hiddenInput.required = required;
    this.hiddenInput.name = this.name;
    this.hiddenInput.value = this.value;

    // Update ElementInternals ARIA
    this.internals.ariaChecked = String(checked);
    this.internals.ariaDisabled = disabled ? 'true' : null;
    this.internals.ariaRequired = required ? 'true' : null;
  }

  /**
   * Synchronize form value via ElementInternals
   * Per PRD 7.4: Form participation via internals.setFormValue()
   */
  private syncFormValue(): void {
    const checked = this.checked;
    const value = this.value;

    if (checked) {
      // Set form value when checked
      this.internals.setFormValue(value);
    } else {
      // Clear form value when unchecked
      this.internals.setFormValue(null);
    }

    // Update validity
    this.updateValidity();
  }

  /**
   * Synchronize indeterminate state
   * Per PRD 7.3: Use internals.states for custom states
   */
  private syncIndeterminate(): void {
    if (!this.checkboxBox) return;

    if (this._indeterminate) {
      // Add custom state for CSS :state(indeterminate) selector
      this.internals.states.add('indeterminate');
      // Update ARIA
      this.checkboxBox.setAttribute('aria-checked', 'mixed');
      this.internals.ariaChecked = 'mixed';
    } else {
      // Remove custom state
      this.internals.states.delete('indeterminate');
      // Restore ARIA to match checked state
      this.checkboxBox.setAttribute('aria-checked', String(this.checked));
      this.internals.ariaChecked = String(this.checked);
    }
  }

  /**
   * Update validity based on required attribute
   */
  private updateValidity(): void {
    if (this.required && !this.checked) {
      this.internals.setValidity(
        { valueMissing: true },
        'Please check this box if you want to proceed.'
      );
    } else {
      this.internals.setValidity({});
    }
  }

  /**
   * Form lifecycle: called when form is reset
   * Per PRD 7.4: Implement formResetCallback
   */
  formResetCallback(): void {
    this.checked = false;
    this.indeterminate = false;
  }

  /**
   * Form lifecycle: called when form is disabled
   * Per PRD 7.4: Implement formDisabledCallback
   */
  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-checkbox> in HTML
 */
customElements.define('brand-checkbox', BrandCheckbox);
