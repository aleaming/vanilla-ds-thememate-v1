/**
 * @component brand-tab
 * @description Individual tab button
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <button class="tab" part="tab" role="tab" type="button">
    <slot></slot>
  </button>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .tab {
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text-secondary, #666);
    transition: all 150ms var(--ease-out, ease-out);
  }

  .tab:hover {
    color: var(--color-text, #000);
    background: var(--color-surface-variant, #f5f5f5);
  }

  .tab[aria-selected="true"] {
    color: var(--color-primary, #4f46e5);
    border-bottom-color: var(--color-primary, #4f46e5);
  }

  .tab:focus-visible {
    outline: 2px solid var(--color-focus, #4f46e5);
    outline-offset: -2px;
  }

  .tab[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`);

export class BrandTab extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['active', 'disabled', 'panel'];
  }

  private button: HTMLButtonElement | null = null;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.button = this.root.querySelector('.tab');

    if (!this.id) {
      this.id = `tab-${Math.random().toString(36).substr(2, 9)}`;
    }

    this.listen(this.button!, 'click', () => this.handleClick());
    this.updateAttributes();
  }

  attributeChangedCallback(): void {
    this.updateAttributes();
  }

  private handleClick(): void {
    if (this.disabled) return;

    this.dispatchEvent(new CustomEvent('tab-activate', {
      bubbles: true,
      composed: true,
      detail: { tabId: this.id }
    }));
  }

  private updateAttributes(): void {
    if (!this.button) return;

    this.button.setAttribute('aria-selected', String(this.active));
    this.button.tabIndex = this.active ? 0 : -1;

    const panelId = this.getAttribute('panel');
    if (panelId) {
      this.button.setAttribute('aria-controls', panelId);
    }

    if (this.disabled) {
      this.button.setAttribute('aria-disabled', 'true');
    } else {
      this.button.removeAttribute('aria-disabled');
    }
  }

  get active(): boolean {
    return this.hasAttribute('active');
  }

  set active(value: boolean) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  focus(): void {
    this.button?.focus();
  }
}

if (!customElements.get('brand-tab')) {
  customElements.define('brand-tab', BrandTab);
}
