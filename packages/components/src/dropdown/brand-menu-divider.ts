/**
 * @component brand-menu-divider
 * @description Visual separator for menu sections
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="divider" part="divider" role="separator"></div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .divider {
    height: 1px;
    margin: var(--space-2, 0.5rem) 0;
    background: var(--color-border, #e0e0e0);
  }
`);

export class BrandMenuDivider extends BaseComponent {
  static styles = styles;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);
  }
}

if (!customElements.get('brand-menu-divider')) {
  customElements.define('brand-menu-divider', BrandMenuDivider);
}
