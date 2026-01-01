/**
 * @component brand-menu-item
 * @description Individual menu item with role=menuitem
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="menu-item" part="menu-item" role="menuitem" tabindex="0">
    <slot name="icon"></slot>
    <span class="label" part="label">
      <slot></slot>
    </span>
    <slot name="shortcut"></slot>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    cursor: pointer;
    color: var(--color-text, #000);
    font-size: var(--font-size-sm, 0.875rem);
    transition: background 150ms var(--ease-out, ease-out);
    outline: none;
  }

  .menu-item:hover,
  .menu-item:focus-visible {
    background: var(--color-surface-variant, #f5f5f5);
  }

  .menu-item:active {
    background: var(--color-surface-active, #e0e0e0);
  }

  :host([disabled]) .menu-item {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :host([danger]) .menu-item {
    color: var(--color-error, #d32f2f);
  }

  :host([danger]) .menu-item:hover,
  :host([danger]) .menu-item:focus-visible {
    background: var(--color-error-surface, #ffebee);
  }

  .label {
    flex: 1;
  }

  ::slotted([slot="icon"]) {
    flex-shrink: 0;
  }

  ::slotted([slot="shortcut"]) {
    flex-shrink: 0;
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #666);
  }
`);

export class BrandMenuItem extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['disabled', 'danger', 'value'];
  }

  private menuItem: HTMLElement | null = null;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.menuItem = this.root.querySelector('.menu-item');

    this.listen(this.menuItem!, 'click', () => this.handleClick());
    this.listen(this.menuItem!, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    });

    this.updateAttributes();
  }

  attributeChangedCallback(): void {
    this.updateAttributes();
  }

  private handleClick(): void {
    if (this.disabled) return;

    this.dispatchEvent(new CustomEvent('menu-item-select', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        label: this.textContent?.trim()
      }
    }));
  }

  private updateAttributes(): void {
    if (!this.menuItem) return;

    if (this.disabled) {
      this.menuItem.setAttribute('aria-disabled', 'true');
      this.menuItem.tabIndex = -1;
    } else {
      this.menuItem.removeAttribute('aria-disabled');
      this.menuItem.tabIndex = 0;
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

  get danger(): boolean {
    return this.hasAttribute('danger');
  }

  set danger(value: boolean) {
    if (value) {
      this.setAttribute('danger', '');
    } else {
      this.removeAttribute('danger');
    }
  }

  get value(): string {
    return this.getAttribute('value') || this.textContent?.trim() || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
  }

  focus(): void {
    this.menuItem?.focus();
  }
}

if (!customElements.get('brand-menu-item')) {
  customElements.define('brand-menu-item', BrandMenuItem);
}
