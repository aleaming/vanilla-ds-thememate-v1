/**
 * @component brand-card
 * @description Container component for grouping related content
 * @spec docs/phase-2-spec.md#component-1-brand-card
 *
 * @slot header - Card header (typically brand-text as="h3")
 * @slot media - Media content (image, icon, etc.)
 * @slot default - Main card content
 * @slot footer - Footer actions (typically brand-button)
 *
 * @attribute variant - Visual style: 'elevated' | 'outlined' | 'filled'
 * @attribute padding - Internal padding: 'none' | 'sm' | 'md' | 'lg'
 * @attribute interactive - Whether card is clickable
 *
 * @accessibility
 * - Semantic article/section based on content
 * - Optional aria-labelledby pointing to header
 * - Focus management if interactive
 * - Keyboard: Enter/Space to activate if interactive
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="card" part="card">
    <div class="card__media" part="media">
      <slot name="media"></slot>
    </div>
    <div class="card__header" part="header">
      <slot name="header"></slot>
    </div>
    <div class="card__content" part="content">
      <slot></slot>
    </div>
    <div class="card__footer" part="footer">
      <slot name="footer"></slot>
    </div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none;
  }

  .card {
    background: var(--color-surface, #fff);
    border-radius: var(--radius-md, 8px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Variant: elevated (default) */
  .card[data-variant="elevated"] {
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
  }

  /* Variant: outlined */
  .card[data-variant="outlined"] {
    border: 1px solid var(--color-border, #e0e0e0);
  }

  /* Variant: filled */
  .card[data-variant="filled"] {
    background: var(--color-surface-variant, #f5f5f5);
  }

  /* Interactive state */
  .card[data-interactive="true"] {
    cursor: pointer;
    transition: all 150ms var(--ease-out, ease-out);
  }

  .card[data-interactive="true"]:hover {
    box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.23));
    transform: translateY(-2px);
  }

  .card[data-interactive="true"]:active {
    transform: translateY(0);
  }

  .card[data-interactive="true"]:focus-visible {
    outline: 2px solid var(--color-focus, #4f46e5);
    outline-offset: 2px;
  }

  /* Padding variants */
  .card[data-padding="none"] {
    padding: 0;
  }

  .card[data-padding="sm"] > *:not(.card__media) {
    padding-inline: var(--space-3, 0.75rem);
  }

  .card[data-padding="md"] > *:not(.card__media) {
    padding-inline: var(--space-4, 1rem);
  }

  .card[data-padding="lg"] > *:not(.card__media) {
    padding-inline: var(--space-6, 1.5rem);
  }

  /* Media section */
  .card__media {
    border-radius: var(--radius-md, 8px) var(--radius-md, 8px) 0 0;
    overflow: hidden;
  }

  .card__media:empty {
    display: none;
  }

  .card__media::slotted(img),
  .card__media::slotted(picture) {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Header section */
  .card__header {
    padding-block-start: var(--space-4, 1rem);
  }

  .card__header:empty {
    display: none;
  }

  /* Content section */
  .card__content {
    flex: 1;
    padding-block: var(--space-3, 0.75rem);
  }

  /* Footer section */
  .card__footer {
    padding-block-end: var(--space-4, 1rem);
    display: flex;
    gap: var(--space-2, 0.5rem);
    align-items: center;
  }

  .card__footer:empty {
    display: none;
  }

  /* When media exists, adjust spacing */
  .card__media:not(:empty) ~ .card__header {
    padding-block-start: var(--space-3, 0.75rem);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .card[data-interactive="true"]:hover {
      transform: none;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }

    .card[data-interactive="true"]:hover {
      transform: none;
    }
  }
`);

export class BrandCard extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['variant', 'padding', 'interactive'];
  }

  /**
   * Internal DOM references
   */
  private card: HTMLDivElement | null = null;

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    // Clone template for safe DOM construction
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Get references
    this.card = this.root.querySelector('.card');

    // Set up interactive behavior
    if (this.hasAttribute('interactive')) {
      this.setupInteractive();
    }

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.card) return;

    this.syncAttributes();

    // Update interactive behavior
    if (name === 'interactive') {
      if (newValue !== null) {
        this.setupInteractive();
      } else {
        this.removeInteractive();
      }
    }
  }

  /**
   * Synchronize attributes to internal elements
   */
  private syncAttributes(): void {
    if (!this.card) return;

    const variant = this.getAttribute('variant') || 'elevated';
    const padding = this.getAttribute('padding') || 'md';
    const interactive = this.hasAttribute('interactive');

    this.card.dataset.variant = variant;
    this.card.dataset.padding = padding;
    this.card.dataset.interactive = String(interactive);
  }

  /**
   * Set up interactive behavior (clickable card)
   */
  private setupInteractive(): void {
    if (!this.card) return;

    // Make focusable
    this.card.tabIndex = 0;
    this.card.setAttribute('role', 'button');

    // Listen for click
    this.listen(this.card, 'click', () => this.handleClick());

    // Listen for keyboard
    this.listen(this.card, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    });
  }

  /**
   * Remove interactive behavior
   */
  private removeInteractive(): void {
    if (!this.card) return;

    this.card.tabIndex = -1;
    this.card.removeAttribute('role');
  }

  /**
   * Handle card activation
   */
  private handleClick(): void {
    this.dispatchEvent(new CustomEvent('card-click', {
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Public getter for variant
   */
  get variant(): string {
    return this.getAttribute('variant') || 'elevated';
  }

  /**
   * Public setter for variant
   */
  set variant(value: string) {
    this.setAttribute('variant', value);
  }

  /**
   * Public getter for padding
   */
  get padding(): string {
    return this.getAttribute('padding') || 'md';
  }

  /**
   * Public setter for padding
   */
  set padding(value: string) {
    this.setAttribute('padding', value);
  }

  /**
   * Public getter for interactive
   */
  get interactive(): boolean {
    return this.hasAttribute('interactive');
  }

  /**
   * Public setter for interactive
   */
  set interactive(value: boolean) {
    if (value) {
      this.setAttribute('interactive', '');
    } else {
      this.removeAttribute('interactive');
    }
  }
}

// Register custom element
if (!customElements.get('brand-card')) {
  customElements.define('brand-card', BrandCard);
}
