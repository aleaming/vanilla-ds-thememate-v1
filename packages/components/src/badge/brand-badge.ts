/**
 * BrandBadge - Status indicator component
 * Per PRD Requirements - Provides status badges with:
 * - Extends BaseComponent class
 * - Variants: success, warning, error, info
 * - Notification count support (numeric badge)
 * - Pill-shaped design
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all badge instances
 * Memory efficient: one parsed stylesheet instead of N for N badges
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 500;
    line-height: 1.25;
    border-radius: var(--radius-pill, 9999px);
    white-space: nowrap;
    user-select: none;
    min-width: 1.25rem;
    transition: background var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  /* Success variant (default) */
  .badge[data-variant="success"] {
    background: var(--color-success, var(--primitive-green-100, #dcfce7));
    color: var(--color-on-success, var(--primitive-green-800, #166534));
    border: 1px solid var(--color-success-border, var(--primitive-green-300, #86efac));
  }

  /* Warning variant */
  .badge[data-variant="warning"] {
    background: var(--color-warning, var(--primitive-yellow-100, #fef3c7));
    color: var(--color-on-warning, var(--primitive-yellow-800, #854d0e));
    border: 1px solid var(--color-warning-border, var(--primitive-yellow-300, #fde047));
  }

  /* Error variant */
  .badge[data-variant="error"] {
    background: var(--color-error-bg, var(--primitive-red-100, #fee2e2));
    color: var(--color-on-error, var(--primitive-red-800, #991b1b));
    border: 1px solid var(--color-error-border, var(--primitive-red-300, #fca5a5));
  }

  /* Info variant */
  .badge[data-variant="info"] {
    background: var(--color-info, var(--primitive-blue-100, #dbeafe));
    color: var(--color-on-info, var(--primitive-blue-800, #1e40af));
    border: 1px solid var(--color-info-border, var(--primitive-blue-300, #93c5fd));
  }

  /* Notification count styling */
  .badge[data-count]:not([data-count=""]) {
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 var(--space-2, 0.5rem);
    font-size: var(--text-xs, 0.75rem);
    font-weight: 600;
  }

  /* Small count badges (1-2 digits) */
  .badge[data-count]:not([data-count=""]) {
    padding: 0 var(--space-2, 0.5rem);
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .badge {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `<span class="badge" part="badge"><slot></slot></span>`;

/**
 * BrandBadge Web Component
 * Provides status indicator with multiple variants and notification count support
 */
export class BrandBadge extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['variant', 'count'];

  /**
   * Internal badge element reference
   * Used for targeted DOM updates
   */
  private badge: HTMLSpanElement | null = null;

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

    // Get reference to internal badge
    this.badge = this.root.querySelector('.badge');

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or badge not yet rendered
    if (oldValue === newValue || !this.badge) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal badge
   * Per PRD Section 6: Variants controlled via data attributes on internal badge
   */
  private syncAttributes(): void {
    if (!this.badge) return;

    // Variant: Set via data attribute for CSS targeting
    const variant = this.getAttribute('variant') ?? 'success';
    this.badge.dataset.variant = variant;

    // Count: Set via data attribute for notification count styling
    const count = this.getAttribute('count');
    if (count !== null) {
      this.badge.dataset.count = count;
      // Update ARIA for accessibility
      this.internals.ariaLabel = `${count} notifications`;
    } else {
      delete this.badge.dataset.count;
      this.internals.ariaLabel = null;
    }

    // Set role for accessibility
    this.internals.role = 'status';
  }

  /**
   * Public getter for variant
   * Allows programmatic access to current variant
   */
  get variant(): string {
    return this.getAttribute('variant') ?? 'success';
  }

  /**
   * Public setter for variant
   * Allows programmatic updates: badge.variant = 'error'
   */
  set variant(value: string) {
    this.setAttribute('variant', value);
  }

  /**
   * Public getter for count
   * Allows programmatic access to current count
   */
  get count(): string | null {
    return this.getAttribute('count');
  }

  /**
   * Public setter for count
   * Allows programmatic updates: badge.count = '5'
   */
  set count(value: string | null) {
    if (value === null) {
      this.removeAttribute('count');
    } else {
      this.setAttribute('count', value);
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-badge> in HTML
 */
customElements.define('brand-badge', BrandBadge);
