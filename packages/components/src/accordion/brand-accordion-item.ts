/**
 * @component brand-accordion-item
 * @description Individual accordion item containing header and panel
 * @spec docs/phase-2-spec.md#component-4-brand-accordion
 *
 * @slot default - header and panel elements
 *
 * @attribute open - Whether the item is expanded
 * @attribute disabled - Whether the item is disabled
 *
 * @event item-toggle - Fired when item is toggled
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="accordion-item" part="item">
    <slot></slot>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    box-sizing: border-box;
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
  }

  :host([hidden]) {
    display: none;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .accordion-item {
    display: flex;
    flex-direction: column;
  }
`);

export class BrandAccordionItem extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['open', 'disabled'];
  }

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Ensure item has an ID
    if (!this.id) {
      this.id = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Listen for header clicks
    this.listen(this, 'accordion-header-click' as any, () => {
      this.toggle();
    });

    // Sync initial state to child elements
    this.syncState();
  }

  /**
   * Called when attributes change
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open') {
      // Use microtask to ensure children are ready
      Promise.resolve().then(() => {
        this.syncState();

        // Dispatch event when open state changes
        this.dispatchEvent(new CustomEvent('accordion-item-toggle', {
          bubbles: true,
          composed: true,
          detail: {
            itemId: this.id,
            open: this.open
          }
        }));
      });
    } else if (name === 'disabled') {
      this.syncState();
    }
  }

  /**
   * Toggle the item open/closed
   */
  toggle(): void {
    if (this.disabled) return;

    this.open = !this.open;

    // Notify parent accordion
    this.dispatchEvent(new CustomEvent('accordion-item-toggle', {
      bubbles: true,
      composed: true,
      detail: {
        itemId: this.id,
        open: this.open
      }
    }));
  }

  /**
   * Sync state to child header and panel
   */
  private syncState(): void {
    const header = this.querySelector('brand-accordion-header');
    const panel = this.querySelector('brand-accordion-panel');

    if (header) {
      (header as any).expanded = this.open;
      (header as any).disabled = this.disabled;
    }

    if (panel) {
      (panel as any).expanded = this.open;
    }
  }

  /**
   * Public getter for open
   */
  get open(): boolean {
    return this.hasAttribute('open');
  }

  /**
   * Public setter for open
   */
  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  /**
   * Public getter for disabled
   */
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  /**
   * Public setter for disabled
   */
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

// Register custom element
if (!customElements.get('brand-accordion-item')) {
  customElements.define('brand-accordion-item', BrandAccordionItem);
}
