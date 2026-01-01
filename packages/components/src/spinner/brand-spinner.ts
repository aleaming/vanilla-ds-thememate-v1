/**
 * BrandSpinner - Loading indicator component
 * Per PRD Requirements - Provides loading indicator with:
 * - Extends BaseComponent class
 * - Size variants: xs, sm, md, lg, xl
 * - Color inheritance via currentColor
 * - CSS animation (rotating circle)
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Accessible with aria-label, role="status", aria-live="polite"
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all spinner instances
 * Memory efficient: one parsed stylesheet instead of N for N spinners
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Rotating circle animation */
  .spinner-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-right-color: currentColor;
    animation: spinner-rotate var(--motion-duration-slow, 800ms) linear infinite;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Size variants */
  .spinner[data-size="xs"] {
    width: var(--size-4, 1rem);
    height: var(--size-4, 1rem);
  }

  .spinner[data-size="xs"] .spinner-circle {
    border-width: 1px;
  }

  .spinner[data-size="sm"] {
    width: var(--size-6, 1.5rem);
    height: var(--size-6, 1.5rem);
  }

  .spinner[data-size="sm"] .spinner-circle {
    border-width: 2px;
  }

  .spinner[data-size="md"] {
    width: var(--size-8, 2rem);
    height: var(--size-8, 2rem);
  }

  .spinner[data-size="md"] .spinner-circle {
    border-width: 2px;
  }

  .spinner[data-size="lg"] {
    width: var(--size-12, 3rem);
    height: var(--size-12, 3rem);
  }

  .spinner[data-size="lg"] .spinner-circle {
    border-width: 3px;
  }

  .spinner[data-size="xl"] {
    width: var(--size-16, 4rem);
    height: var(--size-16, 4rem);
  }

  .spinner[data-size="xl"] .spinner-circle {
    border-width: 4px;
  }

  /* Accessibility: Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .spinner-circle {
      animation-duration: 2s;
    }
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .spinner {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
    border-radius: 50%;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `
  <div class="spinner" part="spinner" role="status" aria-live="polite">
    <div class="spinner-circle"></div>
  </div>
`;

/**
 * BrandSpinner Web Component
 * Provides loading indicator with multiple size variants and accessibility features
 */
export class BrandSpinner extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['size', 'aria-label'];

  /**
   * Internal spinner element reference
   * Used for targeted DOM updates
   */
  private spinner: HTMLDivElement | null = null;

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

    // Get reference to internal spinner
    this.spinner = this.root.querySelector('.spinner');

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or spinner not yet rendered
    if (oldValue === newValue || !this.spinner) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal spinner
   * Per PRD Section 6: Size controlled via data attributes on internal spinner
   */
  private syncAttributes(): void {
    if (!this.spinner) return;

    // Size: Set via data attribute for CSS targeting
    const size = this.getAttribute('size') ?? 'md';
    this.spinner.dataset.size = size;

    // ARIA label: Set for accessibility
    const ariaLabel = this.getAttribute('aria-label') ?? 'Loading';
    this.spinner.setAttribute('aria-label', ariaLabel);

    // Set role and aria-live for accessibility
    this.spinner.setAttribute('role', 'status');
    this.spinner.setAttribute('aria-live', 'polite');
  }

  /**
   * Public getter for size
   * Allows programmatic access to current size
   */
  get size(): string {
    return this.getAttribute('size') ?? 'md';
  }

  /**
   * Public setter for size
   * Allows programmatic updates: spinner.size = 'lg'
   */
  set size(value: string) {
    this.setAttribute('size', value);
  }

  /**
   * Public getter for aria-label
   * Allows programmatic access to current aria-label
   */
  get ariaLabel(): string {
    return this.getAttribute('aria-label') ?? 'Loading';
  }

  /**
   * Public setter for aria-label
   * Allows programmatic updates: spinner.ariaLabel = 'Loading data'
   */
  set ariaLabel(value: string) {
    this.setAttribute('aria-label', value);
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-spinner> in HTML
 */
customElements.define('brand-spinner', BrandSpinner);
