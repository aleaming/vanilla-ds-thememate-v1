/**
 * BrandText - Typography component for headings and text
 * Per PRD Section 6 - Typography component with:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Heading levels: h1, h2, h3, h4, h5, h6
 * - Text styles: body, caption, label
 * - Weight control: normal, medium, semibold, bold
 * - Renders appropriate semantic HTML (h1-h6, p, span)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Valid heading levels
 */
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Valid text styles
 */
type TextStyle = 'body' | 'caption' | 'label';

/**
 * Combined variant type
 */
type TextVariant = HeadingLevel | TextStyle;

/**
 * Valid font weights
 */
type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Create shared stylesheet once for all text instances
 * Memory efficient: one parsed stylesheet instead of N for N text elements
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  /* Base text styling */
  .text {
    margin: 0;
    padding: 0;
    font-family: var(--font-body, system-ui);
    color: var(--color-text, var(--primitive-gray-900, #111827));
  }

  /* Heading levels */
  .text[data-variant="h1"] {
    font-size: var(--text-5xl, 3rem);
    line-height: var(--line-height-tight, 1.25);
    letter-spacing: var(--letter-spacing-tight, -0.02em);
  }

  .text[data-variant="h2"] {
    font-size: var(--text-4xl, 2.25rem);
    line-height: var(--line-height-tight, 1.25);
    letter-spacing: var(--letter-spacing-tight, -0.02em);
  }

  .text[data-variant="h3"] {
    font-size: var(--text-3xl, 1.875rem);
    line-height: var(--line-height-snug, 1.375);
    letter-spacing: var(--letter-spacing-tight, -0.02em);
  }

  .text[data-variant="h4"] {
    font-size: var(--text-2xl, 1.5rem);
    line-height: var(--line-height-snug, 1.375);
    letter-spacing: var(--letter-spacing-normal, 0);
  }

  .text[data-variant="h5"] {
    font-size: var(--text-xl, 1.25rem);
    line-height: var(--line-height-normal, 1.5);
    letter-spacing: var(--letter-spacing-normal, 0);
  }

  .text[data-variant="h6"] {
    font-size: var(--text-lg, 1.125rem);
    line-height: var(--line-height-normal, 1.5);
    letter-spacing: var(--letter-spacing-normal, 0);
  }

  /* Text styles */
  .text[data-variant="body"] {
    font-size: var(--text-base, 1rem);
    line-height: var(--line-height-relaxed, 1.625);
    letter-spacing: var(--letter-spacing-normal, 0);
  }

  .text[data-variant="caption"] {
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--line-height-normal, 1.5);
    letter-spacing: var(--letter-spacing-normal, 0);
  }

  .text[data-variant="label"] {
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--line-height-normal, 1.5);
    letter-spacing: var(--letter-spacing-wide, 0.025em);
    text-transform: uppercase;
  }

  /* Font weights */
  .text[data-weight="normal"] {
    font-weight: var(--font-weight-normal, 400);
  }

  .text[data-weight="medium"] {
    font-weight: var(--font-weight-medium, 500);
  }

  .text[data-weight="semibold"] {
    font-weight: var(--font-weight-semibold, 600);
  }

  .text[data-weight="bold"] {
    font-weight: var(--font-weight-bold, 700);
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 *
 * We'll create the element dynamically based on variant
 */
const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

/**
 * BrandText Web Component
 * Provides typography with semantic HTML and design tokens
 */
export class BrandText extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['variant', 'weight'];

  /**
   * Internal text element reference
   * Used for targeted DOM updates
   */
  private textElement: HTMLElement | null = null;

  constructor() {
    super();
  }

  /**
   * Called when element is added to DOM
   * Per PRD 6.4: Create element safely (no interpolation)
   */
  connectedCallback(): void {
    // Render the appropriate element based on variant
    this.render();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change
    if (oldValue === newValue) return;

    // If variant changed, we need to re-render with different element
    if (name === 'variant') {
      this.render();
    } else {
      // For weight changes, just update the data attribute
      this.syncAttributes();
    }
  }

  /**
   * Render or re-render the component
   * Creates the appropriate semantic HTML element based on variant
   */
  private render(): void {
    // Clear existing content
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }

    // Determine the appropriate HTML tag
    const tag = this.getSemanticTag();

    // Create element using createElement (safe from XSS)
    this.textElement = this.createElement(tag as keyof HTMLElementTagNameMap, {
      className: 'text'
    });

    // Add slot for content
    const slot = this.createElement('slot');
    this.textElement.appendChild(slot);

    // Add to shadow root
    this.root.appendChild(this.textElement);

    // Sync attributes to the element
    this.syncAttributes();
  }

  /**
   * Determine the appropriate semantic HTML tag
   */
  private getSemanticTag(): string {
    const variant = this.getAttribute('variant') ?? 'body';

    // Headings use their corresponding semantic tag
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
      return variant;
    }

    // Body uses <p> tag
    if (variant === 'body') {
      return 'p';
    }

    // Caption and label use <span>
    return 'span';
  }

  /**
   * Synchronize component attributes to internal element
   * Per PRD Section 6: Variants controlled via data attributes
   */
  private syncAttributes(): void {
    if (!this.textElement) return;

    // Variant: Set via data attribute for CSS targeting
    const variant = this.getAttribute('variant') ?? 'body';
    this.textElement.dataset.variant = variant;

    // Weight: Set via data attribute for CSS targeting
    const weight = this.getAttribute('weight') ?? 'normal';
    this.textElement.dataset.weight = weight;
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-text> in HTML
 */
customElements.define('brand-text', BrandText);
