/**
 * @component brand-tabs
 * @description Container for tab navigation and panels
 * @spec docs/phase-2-spec.md#component-3-brand-tabs
 *
 * @slot default - tab-list and tab-panel elements
 *
 * @attribute active-tab - ID of the active tab
 * @attribute orientation - 'horizontal' | 'vertical'
 *
 * @event tab-change - Fired when active tab changes
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="tabs" part="tabs">
    <slot></slot>
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

  .tabs {
    display: flex;
    flex-direction: column;
  }

  :host([orientation="vertical"]) .tabs {
    flex-direction: row;
  }
`);

export class BrandTabs extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['active-tab', 'orientation'];
  }

  private _activeTab: string = '';

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Listen for tab activation
    this.listen(this, 'tab-activate' as any, (e: CustomEvent) => {
      this.activateTab(e.detail.tabId);
    });

    // Set initial active tab
    requestAnimationFrame(() => {
      if (!this._activeTab) {
        const firstTab = this.querySelector('brand-tab');
        if (firstTab?.id) {
          this.activateTab(firstTab.id);
        }
      } else {
        this.activateTab(this._activeTab);
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'active-tab' && newValue) {
      this._activeTab = newValue;
      this.activateTab(newValue);
    }
  }

  private activateTab(tabId: string): void {
    const tabs = Array.from(this.querySelectorAll('brand-tab'));
    const panels = Array.from(this.querySelectorAll('brand-tab-panel'));

    tabs.forEach((tab: any) => {
      const isActive = tab.id === tabId;
      tab.active = isActive;
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel: any) => {
      const isActive = panel.getAttribute('tab') === tabId;
      panel.hidden = !isActive;
    });

    if (this._activeTab !== tabId) {
      this._activeTab = tabId;
      this.setAttribute('active-tab', tabId);

      this.dispatchEvent(new CustomEvent('tab-change', {
        bubbles: true,
        composed: true,
        detail: { tabId }
      }));
    }
  }

  get activeTab(): string {
    return this._activeTab;
  }

  set activeTab(value: string) {
    this.setAttribute('active-tab', value);
  }

  get orientation(): string {
    return this.getAttribute('orientation') || 'horizontal';
  }

  set orientation(value: string) {
    this.setAttribute('orientation', value);
  }
}

if (!customElements.get('brand-tabs')) {
  customElements.define('brand-tabs', BrandTabs);
}
