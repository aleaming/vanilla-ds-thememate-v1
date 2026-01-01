/**
 * BrandDivider - Content separator component
 * Per PRD Requirements - Provides visual separation with:
 * - Extends BaseComponent class
 * - Orientation: horizontal (default), vertical
 * - Optional label slot (text in center of divider)
 * - Spacing variants (margin control)
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all divider instances
 * Memory efficient: one parsed stylesheet instead of N for N dividers
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    position: relative;
  }

  /* Horizontal orientation (default) */
  :host([orientation="horizontal"]) {
    width: 100%;
  }

  /* Vertical orientation */
  :host([orientation="vertical"]) {
    display: inline-block;
    height: 100%;
    min-height: 1rem;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Horizontal divider layout */
  .divider[data-orientation="horizontal"] {
    width: 100%;
    flex-direction: row;
  }

  /* Vertical divider layout */
  .divider[data-orientation="vertical"] {
    height: 100%;
    flex-direction: column;
    min-height: inherit;
  }

  /* The actual line element */
  .line {
    background: var(--color-border, var(--primitive-gray-300, #d1d5db));
    transition: background var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  /* Horizontal line */
  .divider[data-orientation="horizontal"] .line {
    height: 1px;
    flex: 1;
  }

  /* Vertical line */
  .divider[data-orientation="vertical"] .line {
    width: 1px;
    flex: 1;
  }

  /* Label container */
  .label {
    display: none;
    padding: 0 var(--space-3, 0.75rem);
    font-family: var(--font-body, system-ui);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-muted, var(--primitive-gray-600, #4b5563));
    white-space: nowrap;
    user-select: none;
  }

  /* Show label when slot has content */
  .label:not(:empty),
  .label.has-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Vertical label padding */
  .divider[data-orientation="vertical"] .label {
    padding: var(--space-3, 0.75rem) 0;
  }

  /* Spacing variants - control margins */
  /* None spacing - no margin */
  :host([spacing="none"]) {
    margin: 0;
  }

  /* Small spacing */
  :host([spacing="sm"]) {
    margin: var(--space-2, 0.5rem) 0;
  }

  :host([orientation="vertical"][spacing="sm"]) {
    margin: 0 var(--space-2, 0.5rem);
  }

  /* Medium spacing (default) */
  :host([spacing="md"]),
  :host(:not([spacing])) {
    margin: var(--space-4, 1rem) 0;
  }

  :host([orientation="vertical"][spacing="md"]),
  :host([orientation="vertical"]:not([spacing])) {
    margin: 0 var(--space-4, 1rem);
  }

  /* Large spacing */
  :host([spacing="lg"]) {
    margin: var(--space-6, 1.5rem) 0;
  }

  :host([orientation="vertical"][spacing="lg"]) {
    margin: 0 var(--space-6, 1.5rem);
  }

  /* Extra large spacing */
  :host([spacing="xl"]) {
    margin: var(--space-8, 2rem) 0;
  }

  :host([orientation="vertical"][spacing="xl"]) {
    margin: 0 var(--space-8, 2rem);
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .divider {
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
template.innerHTML = `
  <div class="divider" part="divider" role="separator">
    <span class="line" part="line"></span>
    <span class="label" part="label">
      <slot></slot>
    </span>
    <span class="line" part="line"></span>
  </div>
`;

/**
 * BrandDivider Web Component
 * Provides content separation with optional label and configurable spacing
 */
export class BrandDivider extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['orientation', 'spacing'];

  /**
   * Internal divider element reference
   * Used for targeted DOM updates
   */
  private divider: HTMLDivElement | null = null;

  /**
   * Internal label element reference
   * Used for checking slot content
   */
  private label: HTMLSpanElement | null = null;

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

    // Get references to internal elements
    this.divider = this.root.querySelector('.divider');
    this.label = this.root.querySelector('.label');

    // Initial attribute synchronization
    this.syncAttributes();

    // Set up slot change listener to update label visibility
    if (this.label) {
      const slot = this.label.querySelector('slot');
      if (slot) {
        this.listen(slot, 'slotchange', () => this.handleSlotChange());
      }
    }

    // Initial slot check
    this.handleSlotChange();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or divider not yet rendered
    if (oldValue === newValue || !this.divider) return;

    this.syncAttributes();
  }

  /**
   * Handle slot content changes
   * Shows/hides label based on whether slot has content
   */
  private handleSlotChange(): void {
    if (!this.label) return;

    const slot = this.label.querySelector('slot');
    if (slot) {
      const assignedNodes = slot.assignedNodes();
      const hasContent = assignedNodes.some(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() !== '';
        }
        return true;
      });

      if (hasContent) {
        this.label.classList.add('has-content');
      } else {
        this.label.classList.remove('has-content');
      }
    }
  }

  /**
   * Synchronize component attributes to internal divider
   * Per PRD Section 6: Orientation and spacing controlled via data attributes
   */
  private syncAttributes(): void {
    if (!this.divider) return;

    // Orientation: Set via data attribute for CSS targeting
    const orientation = this.getAttribute('orientation') ?? 'horizontal';
    this.divider.dataset.orientation = orientation;

    // Update ARIA orientation for accessibility
    this.divider.setAttribute('aria-orientation', orientation);

    // Set role for accessibility
    this.internals.role = 'separator';
  }

  /**
   * Public getter for orientation
   * Allows programmatic access to current orientation
   */
  get orientation(): string {
    return this.getAttribute('orientation') ?? 'horizontal';
  }

  /**
   * Public setter for orientation
   * Allows programmatic updates: divider.orientation = 'vertical'
   */
  set orientation(value: string) {
    this.setAttribute('orientation', value);
  }

  /**
   * Public getter for spacing
   * Allows programmatic access to current spacing
   */
  get spacing(): string {
    return this.getAttribute('spacing') ?? 'md';
  }

  /**
   * Public setter for spacing
   * Allows programmatic updates: divider.spacing = 'lg'
   */
  set spacing(value: string) {
    this.setAttribute('spacing', value);
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-divider> in HTML
 */
customElements.define('brand-divider', BrandDivider);
