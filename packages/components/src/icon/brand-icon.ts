/**
 * BrandIcon - SVG icon component with size variants
 * Per PRD Section 6 - Web Component Architecture:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements size variants: xs, sm, md, lg, xl
 * - Color inheritance via currentColor
 * - Accessible labels (aria-label or aria-hidden)
 * - Icon sprite support via SVG symbol/use pattern OR inline SVG slot
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all icon instances
 * Memory efficient: one parsed stylesheet instead of N for N icons
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  svg {
    display: block;
    width: var(--icon-size, 1rem);
    height: var(--icon-size, 1rem);
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 0;
  }

  /* Size variants using CSS custom properties */
  :host([size="xs"]) {
    --icon-size: var(--size-icon-xs, 0.75rem);
  }

  :host([size="sm"]) {
    --icon-size: var(--size-icon-sm, 1rem);
  }

  :host([size="md"]) {
    --icon-size: var(--size-icon-md, 1.25rem);
  }

  :host([size="lg"]) {
    --icon-size: var(--size-icon-lg, 1.5rem);
  }

  :host([size="xl"]) {
    --icon-size: var(--size-icon-xl, 2rem);
  }

  /* Default size is md */
  :host(:not([size])) {
    --icon-size: var(--size-icon-md, 1.25rem);
  }

  /* Support for inline SVG via slot */
  ::slotted(svg) {
    display: block;
    width: var(--icon-size, 1rem);
    height: var(--icon-size, 1rem);
    fill: currentColor;
    stroke: currentColor;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * Supports both sprite pattern (via 'name' attribute) and inline SVG (via slot)
 */
const template = document.createElement('template');
template.innerHTML = `
  <svg part="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <use></use>
  </svg>
  <slot></slot>
`;

/**
 * BrandIcon Web Component
 * Provides scalable vector icon rendering with accessibility features
 */
export class BrandIcon extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['name', 'size', 'aria-label'];

  /**
   * Internal SVG element reference
   * Used for targeted DOM updates
   */
  private svg: SVGElement | null = null;

  /**
   * Internal use element for sprite pattern
   */
  private use: SVGUseElement | null = null;

  /**
   * Internal slot element for inline SVG
   */
  private slotElement: HTMLSlotElement | null = null;

  /**
   * ElementInternals for ARIA
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
    this.svg = this.root.querySelector('svg');
    this.use = this.root.querySelector('use');
    this.slotElement = this.root.querySelector('slot');

    // Initial attribute synchronization
    this.syncAttributes();

    // Listen to slot changes to toggle between sprite and inline modes
    if (this.slotElement) {
      this.listen(this.slotElement, 'slotchange', () => this.handleSlotChange());
    }
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or not yet rendered
    if (oldValue === newValue || !this.svg) return;

    this.syncAttributes();
  }

  /**
   * Synchronize component attributes to internal SVG
   */
  private syncAttributes(): void {
    if (!this.svg) return;

    // Handle icon sprite name (via SVG use pattern)
    const iconName = this.getAttribute('name');
    if (iconName && this.use) {
      // TODO(review): Consider sanitizing icon names to prevent special characters in href - security-reviewer, 2025-12-31, Severity: Low
      // Set the href for sprite pattern: <use href="#icon-name"></use>
      this.use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconName}`);
      this.use.setAttribute('href', `#${iconName}`);
    }

    // Accessibility: aria-label or aria-hidden
    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel) {
      // If aria-label is provided, icon is accessible
      this.svg.removeAttribute('aria-hidden');
      this.svg.setAttribute('aria-label', ariaLabel);
      this.svg.setAttribute('role', 'img');
    } else {
      // If no aria-label, icon is decorative
      this.svg.setAttribute('aria-hidden', 'true');
      this.svg.removeAttribute('aria-label');
      this.svg.removeAttribute('role');
    }

    // Size is handled via CSS custom properties in the stylesheet
    // No need for additional synchronization here
  }

  /**
   * Handle slot changes to toggle between sprite and inline SVG modes
   */
  private handleSlotChange(): void {
    if (!this.slotElement || !this.svg) return;

    const slottedElements = this.slotElement.assignedElements();

    if (slottedElements.length > 0) {
      // Inline SVG mode: hide the sprite SVG
      this.svg.style.display = 'none';
    } else {
      // Sprite mode: show the sprite SVG
      this.svg.style.display = 'block';
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-icon> in HTML
 */
customElements.define('brand-icon', BrandIcon);
