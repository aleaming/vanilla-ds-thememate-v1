/**
 * @component brand-autocomplete-group
 * @description Grouped options in autocomplete dropdown
 * @spec docs/phase-3-spec.md#3-autocomplete-brand-autocomplete
 *
 * @slot default - autocomplete-option elements
 *
 * @attribute label - Group label text
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="group" part="group" role="group">
    <div class="label" part="label"></div>
    <div class="options" part="options">
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

  .group {
    display: flex;
    flex-direction: column;
  }

  .label {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-muted, #666666);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .options {
    display: flex;
    flex-direction: column;
  }

  .options::before {
    content: '';
    display: block;
    height: 1px;
    background-color: var(--color-border, #e0e0e0);
    margin: var(--space-1, 0.25rem) 0;
  }
`);

export class BrandAutocompleteGroup extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['label'];
  }

  private labelEl: HTMLElement | null = null;
  private group: HTMLElement | null = null;

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.labelEl = this.root.querySelector('.label');
    this.group = this.root.querySelector('.group');

    this.updateLabel();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'label') {
      this.updateLabel();
    }
  }

  private updateLabel(): void {
    if (!this.labelEl) return;
    this.labelEl.textContent = this.label;

    if (this.group) {
      this.group.setAttribute('aria-label', this.label);
    }
  }

  // Properties
  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }
}

if (!customElements.get('brand-autocomplete-group')) {
  customElements.define('brand-autocomplete-group', BrandAutocompleteGroup);
}
