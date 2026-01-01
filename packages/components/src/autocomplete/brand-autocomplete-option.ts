/**
 * @component brand-autocomplete-option
 * @description Individual option in autocomplete dropdown
 * @spec docs/phase-3-spec.md#3-autocomplete-brand-autocomplete
 *
 * @slot default - Option text content
 *
 * @attribute value - Option value
 * @attribute selected - Whether option is selected
 * @attribute active - Whether option is keyboard-focused
 * @attribute disabled - Whether option is disabled
 *
 * @event option-select - Fired when option is clicked/selected
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="option" part="option" role="option">
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

  .option {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    cursor: pointer;
    user-select: none;
    border-radius: var(--radius-sm, 4px);
    transition: background-color 0.15s;
  }

  .option:hover {
    background-color: var(--color-surface-hover, #f5f5f5);
  }

  :host([active]) .option {
    background-color: var(--color-primary-alpha, rgba(0, 123, 255, 0.1));
  }

  :host([selected]) .option {
    background-color: var(--color-primary, #007bff);
    color: var(--color-on-primary, #ffffff);
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :host([disabled]) .option {
    cursor: not-allowed;
  }
`);

export class BrandAutocompleteOption extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['value', 'selected', 'active', 'disabled'];
  }

  private option: HTMLElement | null = null;
  private originalContent: string = '';

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.option = this.root.querySelector('.option');

    // Ensure option has ID for aria-activedescendant
    if (!this.id) {
      this.id = `option-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Store original content for highlighting
    this.originalContent = this.textContent || '';

    this.updateARIA();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'selected' || name === 'active' || name === 'disabled') {
      this.updateARIA();
    }
  }

  private setupEventListeners(): void {
    // Listen on host element (captures both user clicks and programmatic .click())
    this.listen(this, 'click', (e: Event) => {
      // Prevent double-firing if clicking shadow DOM element
      if (e.target !== this) {
        e.stopPropagation();
      }
      this.select();
    });

    this.listen(this.option!, 'mouseenter', () => this.handleMouseEnter());
  }

  private handleMouseEnter(): void {
    if (this.disabled) return;

    // Notify parent to update active descendant
    this.dispatchEvent(new CustomEvent('option-hover', {
      bubbles: true,
      composed: true,
      detail: { optionId: this.id }
    }));
  }

  private updateARIA(): void {
    if (!this.option) return;

    this.option.setAttribute('aria-selected', this.selected.toString());

    if (this.disabled) {
      this.option.setAttribute('aria-disabled', 'true');
    } else {
      this.option.removeAttribute('aria-disabled');
    }
  }

  select(): void {
    if (this.disabled) return;

    this.dispatchEvent(new CustomEvent('option-select', {
      bubbles: true,
      composed: true,
      detail: {
        optionId: this.id,
        value: this.value,
        text: this.textContent?.trim() || ''
      }
    }));
  }

  highlightText(query: string): void {
    if (!query || !this.option) return;

    const text = this.originalContent;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      this.option.textContent = text;
      return;
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    this.option.innerHTML = `${before}<mark style="background-color: var(--color-highlight, #ffeb3b); font-weight: bold;">${match}</mark>${after}`;
  }

  clearHighlight(): void {
    if (!this.option) return;
    this.option.textContent = this.originalContent;
  }

  // Properties
  get value(): string {
    return this.getAttribute('value') || this.textContent?.trim() || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
  }

  get selected(): boolean {
    return this.hasAttribute('selected');
  }

  set selected(val: boolean) {
    if (val) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  get active(): boolean {
    return this.hasAttribute('active');
  }

  set active(val: boolean) {
    if (val) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

if (!customElements.get('brand-autocomplete-option')) {
  customElements.define('brand-autocomplete-option', BrandAutocompleteOption);
}
