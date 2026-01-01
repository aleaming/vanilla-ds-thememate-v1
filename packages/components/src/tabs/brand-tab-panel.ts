/**
 * @component brand-tab-panel
 * @description Content panel for a tab
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="panel" part="panel" role="tabpanel">
    <slot></slot>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    padding: var(--space-4, 1rem);
  }

  :host([hidden]) {
    display: none;
  }

  .panel {
    outline: none;
  }
`);

export class BrandTabPanel extends BaseComponent {
  static styles = styles;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    const panel = this.root.querySelector('.panel');

    if (!this.id) {
      this.id = `panel-${Math.random().toString(36).substr(2, 9)}`;
    }

    const tabId = this.getAttribute('tab');
    if (tabId) {
      panel?.setAttribute('aria-labelledby', tabId);
    }

    panel?.setAttribute('tabindex', '0');
  }
}

if (!customElements.get('brand-tab-panel')) {
  customElements.define('brand-tab-panel', BrandTabPanel);
}
