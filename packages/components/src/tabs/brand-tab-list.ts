/**
 * @component brand-tab-list
 * @description Container for tab buttons
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="tab-list" part="tab-list" role="tablist">
    <slot></slot>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .tab-list {
    display: flex;
    gap: var(--space-2, 0.5rem);
    border-bottom: 2px solid var(--color-border, #e0e0e0);
  }

  :host([orientation="vertical"]) .tab-list {
    flex-direction: column;
    border-bottom: none;
    border-right: 2px solid var(--color-border, #e0e0e0);
  }
`);

export class BrandTabList extends BaseComponent {
  static styles = styles;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Keyboard navigation
    this.listen(this, 'keydown', (e: KeyboardEvent) => this.handleKeydown(e));
  }

  private handleKeydown(e: KeyboardEvent): void {
    const tabs = Array.from(this.querySelectorAll('brand-tab')) as any[];

    // Find the currently active tab (not e.target, as event may bubble from child)
    const currentIndex = tabs.findIndex(tab => tab.active || tab === document.activeElement);

    if (currentIndex === -1) return;

    const orientation = this.closest('brand-tabs')?.getAttribute('orientation') || 'horizontal';
    let nextIndex = currentIndex;

    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (e.key === nextKey) {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === prevKey) {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[nextIndex];
    nextTab?.shadowRoot?.querySelector('button')?.click();
    nextTab?.focus();
  }
}

if (!customElements.get('brand-tab-list')) {
  customElements.define('brand-tab-list', BrandTabList);
}
