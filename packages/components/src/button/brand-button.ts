/**
 * BrandButton - Primary action trigger component
 * Per PRD Appendix B - Reference implementation showing all patterns:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements variants: primary, secondary, ghost, destructive
 * - Implements states: loading, disabled
 * - Uses ElementInternals for custom :state() pseudo-class
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all button instances
 * Memory efficient: one parsed stylesheet instead of N for N buttons
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-base, 1rem);
    font-weight: 500;
    line-height: 1.5;
    border: none;
    border-radius: var(--radius-button, 0.375rem);
    cursor: pointer;
    transition: background var(--motion-duration, 200ms) var(--motion-easing, ease-out),
                transform var(--motion-duration, 200ms) var(--motion-easing, ease-out);
    user-select: none;
    white-space: nowrap;
  }

  /* Primary variant (default) */
  button[data-variant="primary"] {
    background: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    color: var(--color-on-primary, var(--primitive-white, #ffffff));
  }

  button[data-variant="primary"]:hover:not(:disabled) {
    background: var(--color-primary-hover, var(--primitive-blue-800, #1e40af));
  }

  button[data-variant="primary"]:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Secondary variant */
  button[data-variant="secondary"] {
    background: var(--color-secondary, var(--primitive-gray-200, #e5e7eb));
    color: var(--color-on-secondary, var(--primitive-gray-900, #111827));
  }

  button[data-variant="secondary"]:hover:not(:disabled) {
    background: var(--color-secondary-hover, var(--primitive-gray-300, #d1d5db));
  }

  button[data-variant="secondary"]:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Ghost variant */
  button[data-variant="ghost"] {
    background: transparent;
    color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
  }

  button[data-variant="ghost"]:hover:not(:disabled) {
    background: var(--color-ghost-hover, var(--primitive-gray-100, #f3f4f6));
  }

  button[data-variant="ghost"]:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Destructive variant */
  button[data-variant="destructive"] {
    background: var(--color-error, var(--primitive-red-600, #dc2626));
    color: var(--color-on-error, var(--primitive-white, #ffffff));
  }

  button[data-variant="destructive"]:hover:not(:disabled) {
    background: var(--color-error-hover, var(--primitive-red-700, #b91c1c));
  }

  button[data-variant="destructive"]:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Disabled state */
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading state via custom :state() pseudo-class */
  :host(:state(loading)) button {
    pointer-events: none;
    opacity: 0.7;
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  button:focus-visible {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Icon slot spacing - Per PRD Section 9 */
  ::slotted([slot="icon-start"]) {
    margin-inline-end: var(--space-2, 0.5rem);
  }

  ::slotted([slot="icon-end"]) {
    margin-inline-start: var(--space-2, 0.5rem);
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 * Per PRD Section 9: Icon slots (icon-start, icon-end)
 */
const template = document.createElement('template');
template.innerHTML = `<button part="button"><slot name="icon-start"></slot><slot></slot><slot name="icon-end"></slot></button>`;

/**
 * BrandButton Web Component
 * Provides primary action trigger with multiple variants and states
 */
export class BrandButton extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['variant', 'disabled', 'loading'];

  /**
   * Internal button element reference
   * Used for targeted DOM updates
   */
  private button: HTMLButtonElement | null = null;

  /**
   * ElementInternals for custom states and ARIA
   * Per PRD 7.3: Custom states via internals.states.add/delete
   */
  public internals: ElementInternals;

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

    // Get reference to internal button
    this.button = this.root.querySelector('button');

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or button not yet rendered
    if (oldValue === newValue || !this.button) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal button
   * Per PRD Section 6: Variants controlled via data attributes on internal button
   */
  private syncAttributes(): void {
    if (!this.button) return;

    // Variant: Set via data attribute for CSS targeting
    const variant = this.getAttribute('variant') ?? 'primary';
    this.button.dataset.variant = variant;

    // Disabled and Loading states
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    // Button is disabled if either disabled OR loading
    this.button.disabled = disabled || loading;

    // Update ARIA for accessibility
    this.internals.ariaDisabled = disabled || loading ? 'true' : null;
    this.internals.ariaBusy = loading ? 'true' : null;

    // Custom state for loading (enables :state(loading) CSS pseudo-class)
    // Per PRD 7.3: Use internals.states.add/delete for custom states
    if (loading) {
      this.internals.states.add('loading');
    } else {
      this.internals.states.delete('loading');
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-button> in HTML
 */
customElements.define('brand-button', BrandButton);
