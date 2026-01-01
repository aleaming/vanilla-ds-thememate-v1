/**
 * @component brand-menu
 * @description Menu container with role=menu
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="menu" part="menu" role="menu">
    <slot></slot>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .menu {
    min-width: 12rem;
    padding: var(--space-2, 0.5rem) 0;
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-2, 0.5rem);
    box-shadow: var(--shadow-2, 0 2px 8px rgba(0, 0, 0, 0.1));
    outline: none;
  }

  :host([size="sm"]) .menu {
    min-width: 8rem;
  }

  :host([size="lg"]) .menu {
    min-width: 16rem;
  }
`);

export class BrandMenu extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['size'];
  }

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    const menu = this.root.querySelector('.menu');
    menu?.setAttribute('tabindex', '-1');

    // Keyboard navigation
    this.listen(this, 'keydown', (e: KeyboardEvent) => this.handleKeydown(e));
  }

  private handleKeydown(e: KeyboardEvent): void {
    const items = Array.from(this.querySelectorAll('brand-menu-item:not([disabled])')) as any[];
    const currentIndex = items.findIndex(item => item === document.activeElement);

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    items[nextIndex]?.focus();
  }
}

if (!customElements.get('brand-menu')) {
  customElements.define('brand-menu', BrandMenu);
}
