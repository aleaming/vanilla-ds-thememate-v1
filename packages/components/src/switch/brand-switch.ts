/**
 * BrandSwitch - Form-associated toggle switch component
 * Per PRD Section 6.2 - Demonstrates:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements FormAssociated mixin for native form participation
 * - Implements ElementInternals API for form value and validation
 * - Toggle switch UI (visually distinct from checkbox)
 * - Label positioning options (left, right)
 * - Size variants (small, medium, large)
 * - Keyboard accessible (Space to toggle)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all switch instances
 * Memory efficient: one parsed stylesheet instead of N for N switches
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

  .switch-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  /* Label positioning */
  :host([label-position="left"]) .switch-container {
    flex-direction: row-reverse;
  }

  /* Switch track - base styles */
  .switch-track {
    position: relative;
    border-radius: var(--radius-full, 9999px);
    background: var(--color-surface-secondary, var(--primitive-gray-300, #d1d5db));
    transition: all var(--motion-duration, 200ms) var(--motion-easing, ease-out);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* Small size */
  :host([size="small"]) .switch-track {
    width: 2rem;
    height: 1.125rem;
    padding: 0.125rem;
  }

  :host([size="small"]) .switch-thumb {
    width: 0.875rem;
    height: 0.875rem;
  }

  :host([size="small"][checked]) .switch-thumb {
    transform: translateX(0.875rem);
  }

  /* Medium size (default) */
  :host([size="medium"]) .switch-track,
  :host(:not([size])) .switch-track {
    width: 2.75rem;
    height: 1.5rem;
    padding: 0.125rem;
  }

  :host([size="medium"]) .switch-thumb,
  :host(:not([size])) .switch-thumb {
    width: 1.25rem;
    height: 1.25rem;
  }

  :host([size="medium"][checked]) .switch-thumb,
  :host(:not([size])[checked]) .switch-thumb {
    transform: translateX(1.25rem);
  }

  /* Large size */
  :host([size="large"]) .switch-track {
    width: 3.5rem;
    height: 2rem;
    padding: 0.25rem;
  }

  :host([size="large"]) .switch-thumb {
    width: 1.5rem;
    height: 1.5rem;
  }

  :host([size="large"][checked]) .switch-thumb {
    transform: translateX(1.5rem);
  }

  .switch-track:hover {
    background: var(--color-surface-secondary-hover, var(--primitive-gray-400, #9ca3af));
  }

  /* Checked state */
  :host([checked]) .switch-track {
    background: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  :host([checked]) .switch-track:hover {
    background: var(--color-primary-hover, var(--primitive-blue-800, #1e40af));
  }

  /* Switch thumb (sliding circle) */
  .switch-thumb {
    border-radius: var(--radius-full, 9999px);
    background: var(--color-on-surface, var(--primitive-white, #ffffff));
    transition: transform var(--motion-duration, 200ms) var(--motion-easing, ease-out);
    box-shadow: var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
  }

  /* Disabled state */
  :host([disabled]) .switch-track {
    background: var(--color-surface-disabled, var(--primitive-gray-200, #e5e7eb));
  }

  :host([disabled][checked]) .switch-track {
    background: var(--color-primary-disabled, var(--primitive-gray-400, #9ca3af));
  }

  :host([disabled]) .switch-thumb {
    background: var(--color-surface, var(--primitive-gray-100, #f3f4f6));
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .switch-track,
  :host(:focus-within) .switch-track {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Label slot */
  .switch-label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text, var(--primitive-gray-900, #111827));
  }

  :host([size="small"]) .switch-label {
    font-size: var(--text-sm, 0.875rem);
  }

  :host([size="large"]) .switch-label {
    font-size: var(--text-lg, 1.125rem);
  }

  :host([disabled]) .switch-label {
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
  <div class="switch-container" part="container">
    <div class="switch-track" part="track" role="switch" tabindex="0">
      <div class="switch-thumb" part="thumb"></div>
    </div>
    <div class="switch-label" part="label">
      <slot></slot>
    </div>
  </div>
  <input type="checkbox" aria-hidden="true" tabindex="-1">
`;

/**
 * BrandSwitch Web Component
 * Provides form-associated toggle switch with size and label position variants
 */
export class BrandSwitch extends BaseComponent {
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
  static observedAttributes = [
    'checked',
    'disabled',
    'name',
    'value',
    'required',
    'size',
    'label-position',
  ];

  /**
   * Internal switch track element reference
   */
  private switchTrack: HTMLElement | null = null;

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
   * Public getter for size variant
   */
  get size(): 'small' | 'medium' | 'large' {
    const size = this.getAttribute('size');
    if (size === 'small' || size === 'large') {
      return size;
    }
    return 'medium';
  }

  /**
   * Public setter for size variant
   */
  set size(value: 'small' | 'medium' | 'large') {
    this.setAttribute('size', value);
  }

  /**
   * Public getter for label position
   */
  get labelPosition(): 'left' | 'right' {
    return this.getAttribute('label-position') === 'left' ? 'left' : 'right';
  }

  /**
   * Public setter for label position
   */
  set labelPosition(value: 'left' | 'right') {
    this.setAttribute('label-position', value);
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
    this.switchTrack = this.root.querySelector('[part="track"]');
    this.hiddenInput = this.root.querySelector('input');

    // Set up event listeners for keyboard and click interaction
    this.setupEventListeners();

    // Initial attribute synchronization
    this.syncAttributes();
    this.syncFormValue();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or element not yet rendered
    if (oldValue === newValue || !this.switchTrack) return;

    this.syncAttributes();
    this.syncFormValue();
  }

  /**
   * Set up event listeners for interaction
   */
  private setupEventListeners(): void {
    if (!this.switchTrack) return;

    // Click handler for the switch track
    this.listen(this.switchTrack, 'click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Keyboard handler for Space key
    this.listen(this.switchTrack, 'keydown', (e) => {
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

    // Toggle checked state
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
    if (!this.switchTrack || !this.hiddenInput) return;

    const checked = this.checked;
    const disabled = this.disabled;
    const required = this.required;

    // Update ARIA attributes on switch track
    this.switchTrack.setAttribute('aria-checked', String(checked));
    this.switchTrack.setAttribute('aria-disabled', String(disabled));
    if (required) {
      this.switchTrack.setAttribute('aria-required', 'true');
    } else {
      this.switchTrack.removeAttribute('aria-required');
    }

    // Update tabindex based on disabled state
    this.switchTrack.setAttribute('tabindex', disabled ? '-1' : '0');

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
   * Update validity based on required attribute
   */
  private updateValidity(): void {
    if (this.required && !this.checked) {
      this.internals.setValidity(
        { valueMissing: true },
        'Please enable this switch if you want to proceed.'
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
 * Component can be used as <brand-switch> in HTML
 */
customElements.define('brand-switch', BrandSwitch);
