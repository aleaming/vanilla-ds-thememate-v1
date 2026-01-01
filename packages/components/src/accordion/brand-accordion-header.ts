/**
 * @component brand-accordion-header
 * @description Clickable header for accordion item
 * @spec docs/phase-2-spec.md#component-4-brand-accordion
 *
 * @slot default - Header content
 * @slot icon - Custom expand/collapse icon
 *
 * @accessibility
 * - role="button"
 * - aria-expanded
 * - aria-controls
 * - Keyboard: Space/Enter to toggle
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <button class="header" part="header" type="button">
    <span class="header__content" part="content">
      <slot></slot>
    </span>
    <span class="header__icon" part="icon">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </slot>
    </span>
  </button>
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

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3, 0.75rem);
    padding: var(--space-4, 1rem);
    background: var(--color-surface, #fff);
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
    transition: background-color 150ms var(--ease-out, ease-out);
  }

  .header:hover {
    background: var(--color-surface-variant, #f5f5f5);
  }

  .header:focus-visible {
    outline: 2px solid var(--color-focus, #4f46e5);
    outline-offset: -2px;
    z-index: 1;
  }

  .header[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .header__content {
    flex: 1;
    font-weight: var(--font-weight-medium, 500);
  }

  .header__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 200ms var(--ease-out, ease-out);
  }

  .header[aria-expanded="true"] .header__icon {
    transform: rotate(180deg);
  }

  .header__icon svg {
    width: 100%;
    height: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .header,
    .header__icon {
      transition: none;
    }
  }
`);

export class BrandAccordionHeader extends BaseComponent {
  static styles = styles;

  /**
   * Internal references
   */
  private button: HTMLButtonElement | null = null;
  private panelId: string = '';

  /**
   * Expanded state (controlled by parent item)
   */
  private _expanded = false;
  private _disabled = false;

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.button = this.root.querySelector('.header');

    // Generate panel ID for aria-controls
    const item = this.closest('brand-accordion-item');
    if (item) {
      const panel = item.querySelector('brand-accordion-panel');
      if (panel && !panel.id) {
        panel.id = `panel-${Math.random().toString(36).substr(2, 9)}`;
      }
      this.panelId = panel?.id || '';
    }

    // Set up event handlers
    if (this.button) {
      this.listen(this.button, 'click', () => this.handleClick());
    }

    // Make focusable
    this.tabIndex = 0;

    this.updateAttributes();
  }

  /**
   * Handle click
   */
  private handleClick(): void {
    if (this._disabled) return;

    this.dispatchEvent(new CustomEvent('accordion-header-click', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Update ARIA attributes
   */
  private updateAttributes(): void {
    if (!this.button) return;

    this.button.setAttribute('aria-expanded', String(this._expanded));

    if (this.panelId) {
      this.button.setAttribute('aria-controls', this.panelId);
    }

    if (this._disabled) {
      this.button.setAttribute('aria-disabled', 'true');
    } else {
      this.button.removeAttribute('aria-disabled');
    }
  }

  /**
   * Set expanded state (called by parent item)
   */
  set expanded(value: boolean) {
    this._expanded = value;
    this.updateAttributes();
  }

  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * Set disabled state (called by parent item)
   */
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateAttributes();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Override focus to focus the button
   */
  focus(): void {
    this.button?.focus();
  }
}

// Register custom element
if (!customElements.get('brand-accordion-header')) {
  customElements.define('brand-accordion-header', BrandAccordionHeader);
}
