/**
 * @component brand-accordion-panel
 * @description Collapsible content panel for accordion item
 * @spec docs/phase-2-spec.md#component-4-brand-accordion
 *
 * @slot default - Panel content
 *
 * @accessibility
 * - role="region"
 * - aria-labelledby (points to header)
 * - Hidden when collapsed
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="panel" part="panel" role="region">
    <div class="panel__content" part="content">
      <slot></slot>
    </div>
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

  .panel {
    overflow: hidden;
    transition: max-height 300ms var(--ease-out, ease-out);
  }

  .panel[data-expanded="false"] {
    max-height: 0;
  }

  .panel[data-expanded="true"] {
    max-height: var(--accordion-panel-max-height, 1000px);
  }

  .panel__content {
    padding: var(--space-4, 1rem);
    border-top: 1px solid var(--color-border, #e0e0e0);
  }

  .panel[data-expanded="false"] .panel__content {
    visibility: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none;
    }

    .panel[data-expanded="false"] {
      display: none;
    }

    .panel[data-expanded="true"] {
      display: block;
    }
  }
`);

export class BrandAccordionPanel extends BaseComponent {
  static styles = styles;

  /**
   * Internal references
   */
  private panel: HTMLDivElement | null = null;
  private headerId: string = '';

  /**
   * Expanded state (controlled by parent item)
   */
  private _expanded = false;

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.panel = this.root.querySelector('.panel');

    // Ensure panel has an ID
    if (!this.id) {
      this.id = `panel-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Find associated header for aria-labelledby
    const item = this.closest('brand-accordion-item');
    if (item) {
      const header = item.querySelector('brand-accordion-header');
      if (header && !header.id) {
        header.id = `header-${Math.random().toString(36).substr(2, 9)}`;
      }
      this.headerId = header?.id || '';
    }

    this.updateAttributes();
  }

  /**
   * Update ARIA attributes and state
   */
  private updateAttributes(): void {
    if (!this.panel) return;

    this.panel.dataset.expanded = String(this._expanded);

    if (this.headerId) {
      this.panel.setAttribute('aria-labelledby', this.headerId);
    }

    // Hide from accessibility tree when collapsed
    if (!this._expanded) {
      this.panel.setAttribute('aria-hidden', 'true');
    } else {
      this.panel.removeAttribute('aria-hidden');
    }
  }

  /**
   * Set expanded state (called by parent item)
   */
  set expanded(value: boolean) {
    this._expanded = value;
    this.updateAttributes();
  }

  get expanded(): boolean {
    return this._expanded;
  }
}

// Register custom element
if (!customElements.get('brand-accordion-panel')) {
  customElements.define('brand-accordion-panel', BrandAccordionPanel);
}
