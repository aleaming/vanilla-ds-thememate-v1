/**
 * @component brand-dropdown
 * @description Dropdown menu container with trigger button
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="dropdown" part="dropdown">
    <div class="trigger" part="trigger">
      <slot name="trigger"></slot>
    </div>
    <div class="menu-container" part="menu-container" hidden>
      <slot name="menu"></slot>
    </div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
    position: relative;
  }

  .dropdown {
    position: relative;
  }

  .trigger {
    cursor: pointer;
  }

  .menu-container {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: var(--space-1, 0.25rem);
    z-index: var(--z-dropdown, 1000);
  }

  :host([placement="top"]) .menu-container {
    top: auto;
    bottom: 100%;
    margin-top: 0;
    margin-bottom: var(--space-1, 0.25rem);
  }

  :host([placement="right"]) .menu-container {
    left: 100%;
    top: 0;
    margin-top: 0;
    margin-left: var(--space-1, 0.25rem);
  }

  :host([placement="left"]) .menu-container {
    left: auto;
    right: 100%;
    top: 0;
    margin-top: 0;
    margin-right: var(--space-1, 0.25rem);
  }

  .menu-container[hidden] {
    display: none;
  }
`);

export class BrandDropdown extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['open', 'placement'];
  }

  private menuContainer: HTMLElement | null = null;
  private trigger: HTMLElement | null = null;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.menuContainer = this.root.querySelector('.menu-container');
    this.trigger = this.root.querySelector('.trigger');

    // Listen for trigger clicks
    this.listen(this.trigger!, 'click', () => this.toggle());

    // Listen for outside clicks to close
    this.listen(document, 'click', (e: Event) => this.handleOutsideClick(e));

    // Listen for menu item selection
    this.listen(this, 'menu-item-select' as any, () => {
      this.open = false;
    });

    // Listen for Escape key
    this.listen(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.open) {
        this.open = false;
      }
    });

    this.updateMenuVisibility();
  }

  attributeChangedCallback(): void {
    this.updateMenuVisibility();
  }

  private handleOutsideClick(e: Event): void {
    if (!this.open) return;

    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
  }

  private updateMenuVisibility(): void {
    if (!this.menuContainer) return;

    if (this.open) {
      this.menuContainer.hidden = false;
    } else {
      this.menuContainer.hidden = true;
    }
  }

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }

  toggle(): void {
    this.open = !this.open;
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    const wasOpen = this.open;

    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }

    // Fire events on state change
    if (value && !wasOpen) {
      this.dispatchEvent(new CustomEvent('dropdown-open', {
        bubbles: true,
        composed: true
      }));
    } else if (!value && wasOpen) {
      this.dispatchEvent(new CustomEvent('dropdown-close', {
        bubbles: true,
        composed: true
      }));
    }
  }

  get placement(): string {
    return this.getAttribute('placement') || 'bottom';
  }

  set placement(value: string) {
    this.setAttribute('placement', value);
  }
}

if (!customElements.get('brand-dropdown')) {
  customElements.define('brand-dropdown', BrandDropdown);
}
