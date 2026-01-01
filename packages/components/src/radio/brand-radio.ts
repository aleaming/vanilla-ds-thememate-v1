/**
 * BrandRadio - Form-associated radio component with group controller
 * Per PRD Section 6.2 - Demonstrates:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements FormAssociated mixin for native form participation
 * - Implements ElementInternals API for form value and validation
 * - Radio group keyboard navigation (arrow keys)
 * - Only one radio selected per group (same name attribute)
 * - Keyboard accessible (Arrow keys for navigation, Space to select)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all radio instances
 * Memory efficient: one parsed stylesheet instead of N for N radios
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

  .radio-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .radio-button {
    position: relative;
    width: var(--radio-size, 1.25rem);
    height: var(--radio-size, 1.25rem);
    border: 2px solid var(--color-border, var(--primitive-gray-400, #9ca3af));
    border-radius: 50%;
    background: var(--color-surface, var(--primitive-white, #ffffff));
    transition: all var(--motion-duration, 200ms) var(--motion-easing, ease-out);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .radio-button:hover {
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  /* Checked state */
  :host([checked]) .radio-button {
    border-color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  :host([checked]) .radio-button::after {
    content: '';
    position: absolute;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  /* Disabled state */
  :host([disabled]) .radio-button {
    border-color: var(--color-border-disabled, var(--primitive-gray-300, #d1d5db));
    background: var(--color-surface-disabled, var(--primitive-gray-100, #f3f4f6));
  }

  :host([disabled][checked]) .radio-button::after {
    background: var(--color-primary-disabled, var(--primitive-gray-400, #9ca3af));
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .radio-button,
  :host(:focus-within) .radio-button {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Label slot */
  .radio-label {
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--color-text, var(--primitive-gray-900, #111827));
  }

  :host([disabled]) .radio-label {
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
  <div class="radio-container" part="container">
    <div class="radio-button" part="button" role="radio" tabindex="0"></div>
    <div class="radio-label" part="label">
      <slot></slot>
    </div>
  </div>
  <input type="radio" aria-hidden="true" tabindex="-1">
`;

/**
 * RadioGroupController - Manages radio button groups
 * Ensures only one radio is checked per group (same name)
 * Handles keyboard navigation within groups
 * Uses document-scoped registry for SSR safety
 */
class RadioGroupController {
  /**
   * Get the document-scoped registry for radio groups
   * This prevents state leaks across different document contexts in SSR/hydration
   */
  private static getDocumentRegistry(doc: Document): Map<string, Set<BrandRadio>> {
    // FIXME(nitpick): Consider WeakMap<Document, Map> for better type safety instead of (doc as any) - code-reviewer, 2025-12-31, Severity: Cosmetic
    const symbol = Symbol.for('brand-radio-groups');
    if (!(doc as any)[symbol]) {
      (doc as any)[symbol] = new Map<string, Set<BrandRadio>>();
    }
    return (doc as any)[symbol];
  }

  /**
   * Register a radio button in a group
   */
  static register(radio: BrandRadio): void {
    const name = radio.name;
    if (!name) return;

    const groups = this.getDocumentRegistry(radio.ownerDocument);
    if (!groups.has(name)) {
      groups.set(name, new Set());
    }
    groups.get(name)!.add(radio);
  }

  /**
   * Unregister a radio button from a group
   */
  static unregister(radio: BrandRadio): void {
    const name = radio.name;
    if (!name) return;

    const groups = this.getDocumentRegistry(radio.ownerDocument);
    const group = groups.get(name);
    if (group) {
      group.delete(radio);
      if (group.size === 0) {
        groups.delete(name);
      }
    }
  }

  /**
   * Update group when name changes
   */
  static updateName(radio: BrandRadio, oldName: string, newName: string): void {
    if (oldName) {
      const groups = this.getDocumentRegistry(radio.ownerDocument);
      const oldGroup = groups.get(oldName);
      if (oldGroup) {
        oldGroup.delete(radio);
        if (oldGroup.size === 0) {
          groups.delete(oldName);
        }
      }
    }
    if (newName) {
      this.register(radio);
    }
  }

  /**
   * Uncheck all other radios in the same group
   */
  static uncheckOthers(radio: BrandRadio): void {
    const name = radio.name;
    if (!name) return;

    const groups = this.getDocumentRegistry(radio.ownerDocument);
    const group = groups.get(name);
    if (group) {
      for (const other of group) {
        if (other !== radio && other.checked) {
          other.checked = false;
        }
      }
    }
  }

  /**
   * Get all radios in a group
   */
  static getGroup(name: string, doc: Document): BrandRadio[] {
    const groups = this.getDocumentRegistry(doc);
    const group = groups.get(name);
    return group ? Array.from(group) : [];
  }

  /**
   * Navigate to next radio in group
   */
  static navigateNext(radio: BrandRadio): void {
    const name = radio.name;
    if (!name) return;

    const radios = this.getGroup(name, radio.ownerDocument).filter(r => !r.disabled);
    if (radios.length === 0) return;

    const currentIndex = radios.indexOf(radio);
    const nextIndex = (currentIndex + 1) % radios.length;
    const nextRadio = radios[nextIndex];

    nextRadio.focus();
    nextRadio.checked = true;
  }

  /**
   * Navigate to previous radio in group
   */
  static navigatePrevious(radio: BrandRadio): void {
    const name = radio.name;
    if (!name) return;

    const radios = this.getGroup(name, radio.ownerDocument).filter(r => !r.disabled);
    if (radios.length === 0) return;

    const currentIndex = radios.indexOf(radio);
    const prevIndex = (currentIndex - 1 + radios.length) % radios.length;
    const prevRadio = radios[prevIndex];

    prevRadio.focus();
    prevRadio.checked = true;
  }
}

/**
 * BrandRadio Web Component
 * Provides form-associated radio with group management
 */
export class BrandRadio extends BaseComponent {
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
   * Internal radio button element reference
   */
  private radioButton: HTMLElement | null = null;

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
   * Store previous name for group management
   */
  private _previousName: string = '';

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
      // Uncheck others in the same group
      RadioGroupController.uncheckOthers(this);
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
   * Called when element is added to DOM
   * Per PRD 6.4: Clone template (safe - no interpolation)
   */
  connectedCallback(): void {
    // Clone template for safe DOM construction
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Get references to internal elements
    this.radioButton = this.root.querySelector('[part="button"]');
    this.hiddenInput = this.root.querySelector('input');

    // Register with group controller
    this._previousName = this.name;
    RadioGroupController.register(this);

    // Set up event listeners for keyboard and click interaction
    this.setupEventListeners();

    // Initial attribute synchronization
    this.syncAttributes();
    this.syncFormValue();
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Unregister from group controller
    RadioGroupController.unregister(this);
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or element not yet rendered
    if (oldValue === newValue || !this.radioButton) return;

    // Handle name changes for group management
    if (name === 'name' && oldValue !== null) {
      RadioGroupController.updateName(this, oldValue, newValue ?? '');
      this._previousName = newValue ?? '';
    }

    this.syncAttributes();
    this.syncFormValue();
  }

  /**
   * Set up event listeners for interaction
   */
  private setupEventListeners(): void {
    if (!this.radioButton) return;

    // Click handler for the radio button
    this.listen(this.radioButton, 'click', (e) => {
      e.preventDefault();
      this.select();
    });

    // Keyboard handler for Space and Arrow keys
    this.listen(this.radioButton, 'keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.select();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        RadioGroupController.navigateNext(this);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        RadioGroupController.navigatePrevious(this);
      }
    });
  }

  /**
   * Select this radio button
   * Public method for programmatic selection
   */
  public select(): void {
    if (this.disabled) return;

    // Only trigger change if not already checked
    const wasChecked = this.checked;
    this.checked = true;

    if (!wasChecked) {
      // Dispatch change event
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Focus this radio button
   */
  public focus(): void {
    if (this.radioButton) {
      this.radioButton.focus();
    }
  }

  /**
   * Synchronize component attributes to internal elements
   */
  private syncAttributes(): void {
    if (!this.radioButton || !this.hiddenInput) return;

    const checked = this.checked;
    const disabled = this.disabled;
    const required = this.required;

    // Update ARIA attributes on radio button
    this.radioButton.setAttribute('aria-checked', String(checked));
    this.radioButton.setAttribute('aria-disabled', String(disabled));
    if (required) {
      this.radioButton.setAttribute('aria-required', 'true');
    } else {
      this.radioButton.removeAttribute('aria-required');
    }

    // Update tabindex based on disabled state
    this.radioButton.setAttribute('tabindex', disabled ? '-1' : '0');

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
    // For radio groups, at least one radio must be checked if required
    if (this.required && this.name) {
      const group = RadioGroupController.getGroup(this.name, this.ownerDocument);
      const hasChecked = group.some(radio => radio.checked);

      if (!hasChecked) {
        this.internals.setValidity(
          { valueMissing: true },
          'Please select one of these options.'
        );
      } else {
        this.internals.setValidity({});
      }
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
 * Component can be used as <brand-radio> in HTML
 */
customElements.define('brand-radio', BrandRadio);
