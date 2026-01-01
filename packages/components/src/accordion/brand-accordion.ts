/**
 * @component brand-accordion
 * @description Vertically stacked collapsible sections
 * @spec docs/phase-2-spec.md#component-4-brand-accordion
 *
 * @slot default - accordion-item elements
 *
 * @attribute allow-multiple - Allow multiple panels open simultaneously
 * @attribute collapse-all - Allow all panels to be closed
 *
 * @accessibility
 * - WAI-ARIA Accordion pattern
 * - Keyboard navigation between headers
 * - Focus management
 * - Screen reader announcements
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="accordion" part="accordion" role="group">
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

  .accordion {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
  }
`);

export class BrandAccordion extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['allow-multiple', 'collapse-all'];
  }

  /**
   * Internal references
   */
  private accordion: HTMLDivElement | null = null;

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.accordion = this.root.querySelector('.accordion');

    // Listen for item toggle events
    this.listen(this, 'accordion-item-toggle' as any, (e: CustomEvent) => {
      this.handleItemToggle(e);
    });

    // Set up keyboard navigation
    this.listen(this, 'keydown', (e: KeyboardEvent) => {
      this.handleKeydown(e);
    });
  }

  /**
   * Handle item toggle
   */
  private handleItemToggle(e: CustomEvent): void {
    const { itemId, open } = e.detail;

    // If not allowing multiple, close other items
    if (open && !this.allowMultiple) {
      this.closeOtherItems(itemId);
    }
  }

  /**
   * Close all items except the specified one
   */
  private closeOtherItems(exceptId: string): void {
    const items = this.querySelectorAll('brand-accordion-item');
    items.forEach((item: any) => {
      if (item.id !== exceptId) {
        item.open = false;
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;

    // Only handle if focus is on an accordion header
    if (!target.matches('brand-accordion-header')) {
      return;
    }

    const headers = Array.from(this.querySelectorAll('brand-accordion-header'));
    const currentIndex = headers.indexOf(target as any);

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % headers.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + headers.length) % headers.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = headers.length - 1;
        break;
      default:
        return;
    }

    (headers[nextIndex] as any).focus();
  }

  /**
   * Public getter for allow-multiple
   */
  get allowMultiple(): boolean {
    return this.hasAttribute('allow-multiple');
  }

  /**
   * Public setter for allow-multiple
   */
  set allowMultiple(value: boolean) {
    if (value) {
      this.setAttribute('allow-multiple', '');
    } else {
      this.removeAttribute('allow-multiple');
    }
  }

  /**
   * Public getter for collapse-all
   */
  get collapseAll(): boolean {
    return this.hasAttribute('collapse-all');
  }

  /**
   * Public setter for collapse-all
   */
  set collapseAll(value: boolean) {
    if (value) {
      this.setAttribute('collapse-all', '');
    } else {
      this.removeAttribute('collapse-all');
    }
  }
}

// Register custom element
if (!customElements.get('brand-accordion')) {
  customElements.define('brand-accordion', BrandAccordion);
}
