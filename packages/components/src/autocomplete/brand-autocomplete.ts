/**
 * @component brand-autocomplete
 * @description Intelligent search input with suggestions, async loading, and keyboard selection
 * @spec docs/phase-3-spec.md#3-autocomplete-brand-autocomplete
 *
 * @slot default - autocomplete-option and autocomplete-group elements
 *
 * @attribute value - Current selected value(s)
 * @attribute placeholder - Placeholder text for input
 * @attribute disabled - Whether the autocomplete is disabled
 * @attribute loading - Whether data is being loaded
 * @attribute multiple - Allow multiple selections
 * @attribute debounce - Debounce delay in ms (default: 300)
 * @attribute filter-mode - 'local' | 'remote' (default: 'local')
 * @attribute min-chars - Minimum characters before showing suggestions (default: 0)
 *
 * @event autocomplete-search - Fired when user types (for remote filtering)
 * @event autocomplete-select - Fired when option is selected
 * @event autocomplete-clear - Fired when input is cleared
 *
 * @accessibility
 * - WAI-ARIA Combobox pattern
 * - Full keyboard navigation
 * - Screen reader announcements
 * - Live regions for results count
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="autocomplete" part="autocomplete">
    <div class="input-wrapper" part="input-wrapper">
      <input
        type="text"
        class="input"
        part="input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-controls="listbox"
      />
      <button class="clear-button" part="clear-button" type="button" hidden aria-label="Clear input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div class="spinner" part="spinner" hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
        </svg>
      </div>
    </div>
    <div class="listbox-wrapper" part="listbox-wrapper" hidden>
      <div
        class="listbox"
        part="listbox"
        role="listbox"
        id="listbox"
      >
        <slot></slot>
      </div>
      <div class="empty-state" part="empty-state" hidden>
        No results found
      </div>
    </div>
    <div class="live-region" aria-live="polite" aria-atomic="true"></div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    position: relative;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .autocomplete {
    position: relative;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    flex: 1;
    font-family: var(--font-family-base, system-ui, sans-serif);
    font-size: var(--font-size-base, 1rem);
    line-height: var(--line-height-base, 1.5);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus {
    border-color: var(--color-primary, #007bff);
    box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(0, 123, 255, 0.1));
  }

  .input::placeholder {
    color: var(--color-text-muted, #666666);
  }

  .clear-button,
  .spinner {
    position: absolute;
    right: var(--space-3, 0.75rem);
    top: 50%;
    transform: translateY(-50%);
  }

  .clear-button {
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--color-text-muted, #666666);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button:hover {
    color: var(--color-text, #1a1a1a);
  }

  .clear-button svg {
    width: 100%;
    height: 100%;
  }

  .spinner {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  .spinner svg {
    width: 100%;
    height: 100%;
  }

  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }

  .listbox-wrapper {
    position: absolute;
    top: calc(100% + var(--space-1, 0.25rem));
    left: 0;
    right: 0;
    z-index: var(--z-dropdown, 1000);
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
    max-height: 300px;
    overflow-y: auto;
  }

  .listbox {
    padding: var(--space-1, 0.25rem);
  }

  .empty-state {
    padding: var(--space-4, 1rem);
    text-align: center;
    color: var(--color-text-muted, #666666);
  }

  .live-region {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`);

export class BrandAutocomplete extends BaseComponent {
  static styles = styles;
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'placeholder', 'disabled', 'loading', 'multiple', 'debounce', 'filter-mode', 'min-chars', 'name'];
  }

  private _internals: ElementInternals;
  private input: HTMLInputElement | null = null;
  private listboxWrapper: HTMLElement | null = null;
  private listbox: HTMLElement | null = null;
  private emptyState: HTMLElement | null = null;
  private clearButton: HTMLButtonElement | null = null;
  private spinner: HTMLElement | null = null;
  private liveRegion: HTMLElement | null = null;

  private _value: string | string[] = '';
  private _searchQuery: string = '';
  private _debounceTimer: number | null = null;
  private _activeDescendantId: string | null = null;
  private _selectedOptions: Set<string> = new Set();

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.input = this.root.querySelector('.input');
    this.listboxWrapper = this.root.querySelector('.listbox-wrapper');
    this.listbox = this.root.querySelector('.listbox');
    this.emptyState = this.root.querySelector('.empty-state');
    this.clearButton = this.root.querySelector('.clear-button');
    this.spinner = this.root.querySelector('.spinner');
    this.liveRegion = this.root.querySelector('.live-region');

    this.setupEventListeners();
    this.updateInputAttributes();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'placeholder':
        if (this.input) {
          this.input.placeholder = newValue || '';
        }
        break;
      case 'disabled':
        if (this.input) {
          this.input.disabled = this.disabled;
        }
        break;
      case 'loading':
        this.updateLoadingState();
        break;
      case 'value':
        this._value = this.multiple ? (newValue?.split(',').filter(Boolean) || []) : (newValue || '');
        this.updateInputValue();
        break;
    }
  }

  private setupEventListeners(): void {
    // Input events
    this.listen(this.input!, 'input', () => this.handleInput());
    this.listen(this.input!, 'focus', () => this.handleFocus());
    this.listen(this.input!, 'blur', (e: FocusEvent) => this.handleBlur(e));
    this.listen(this.input!, 'keydown', (e: KeyboardEvent) => this.handleKeydown(e));

    // Clear button
    this.listen(this.clearButton!, 'click', () => this.clear());

    // Option selection
    this.listen(this, 'option-select' as any, (e: CustomEvent) => this.handleOptionSelect(e));

    // Outside click
    this.listen(document, 'click', (e: Event) => this.handleOutsideClick(e));
  }

  private handleInput(): void {
    if (!this.input) return;

    this._searchQuery = this.input.value;
    this.updateClearButton();

    // Check min characters
    if (this._searchQuery.length < this.minChars) {
      this.hideListbox();
      return;
    }

    // Clear previous debounce
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    // Debounce search
    this._debounceTimer = window.setTimeout(() => {
      this.performSearch();
    }, this.debounce);
  }

  private async performSearch(): Promise<void> {
    if (this.filterMode === 'remote') {
      // Dispatch event for remote filtering
      this.dispatchEvent(new CustomEvent('autocomplete-search', {
        bubbles: true,
        composed: true,
        detail: { query: this._searchQuery }
      }));
    } else {
      // Local filtering
      await this.filterOptions(this._searchQuery);
    }

    this.showListbox();
    this.announceResults();
  }

  private async filterOptions(query: string): Promise<void> {
    // Wait for custom elements to be defined
    await customElements.whenDefined('brand-autocomplete-option');

    const options = this.getAllOptions();
    const lowerQuery = query.toLowerCase();

    let visibleCount = 0;

    options.forEach((option: any) => {
      const text = option.textContent?.toLowerCase() || '';
      const matches = text.includes(lowerQuery);

      if (matches) {
        option.hidden = false;
        visibleCount++;

        // Highlight matching text
        if (query && typeof option.highlightText === 'function') {
          option.highlightText(query);
        } else if (typeof option.clearHighlight === 'function') {
          option.clearHighlight();
        }
      } else {
        option.hidden = true;
      }
    });

    // Show/hide empty state
    if (this.emptyState) {
      this.emptyState.hidden = visibleCount > 0;
    }
  }

  private handleFocus(): void {
    if (this._searchQuery.length >= this.minChars) {
      this.showListbox();
    }
  }

  private handleBlur(e: FocusEvent): void {
    // Don't close if focusing within component
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && this.contains(relatedTarget)) {
      return;
    }

    // Delay to allow option click
    setTimeout(() => {
      this.hideListbox();
    }, 200);
  }

  private handleKeydown(e: KeyboardEvent): void {
    const options = this.getVisibleOptions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.navigateOptions(options, 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateOptions(options, -1);
        break;
      case 'Enter':
        e.preventDefault();
        this.selectActiveOption();
        break;
      case 'Escape':
        e.preventDefault();
        this.hideListbox();
        this.input?.blur();
        break;
      case 'Home':
        if (e.ctrlKey) {
          e.preventDefault();
          this.setActiveOption(options[0]);
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          e.preventDefault();
          this.setActiveOption(options[options.length - 1]);
        }
        break;
    }
  }

  private navigateOptions(options: any[], direction: number): void {
    if (options.length === 0) return;

    const currentIndex = options.findIndex((opt: any) => opt.id === this._activeDescendantId);
    let nextIndex: number;

    if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : options.length - 1;
    } else {
      nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = options.length - 1;
      if (nextIndex >= options.length) nextIndex = 0;
    }

    this.setActiveOption(options[nextIndex]);
  }

  private setActiveOption(option: any): void {
    if (!option) return;

    // Clear previous active
    const allOptions = this.getAllOptions();
    allOptions.forEach((opt: any) => {
      opt.active = false;
    });

    // Set new active
    option.active = true;
    this._activeDescendantId = option.id;

    if (this.input) {
      this.input.setAttribute('aria-activedescendant', option.id);
    }

    // Scroll into view
    option.scrollIntoView({ block: 'nearest' });
  }

  private selectActiveOption(): void {
    if (!this._activeDescendantId) return;

    const option = this.querySelector(`#${this._activeDescendantId}`);
    if (option) {
      (option as any).select();
    }
  }

  private handleOptionSelect(e: CustomEvent): void {
    const { optionId, value, text } = e.detail;

    if (this.multiple) {
      // Toggle selection
      if (this._selectedOptions.has(optionId)) {
        this._selectedOptions.delete(optionId);
      } else {
        this._selectedOptions.add(optionId);
      }

      // Update value
      this._value = Array.from(this._selectedOptions);
      this.setAttribute('value', this._value.join(','));

      // Update input to show count
      if (this.input) {
        this.input.value = `${this._selectedOptions.size} selected`;
      }
    } else {
      // Single selection
      this._value = value;
      this.setAttribute('value', value);

      if (this.input) {
        this.input.value = text;
        this._searchQuery = text;
      }

      this.hideListbox();
    }

    // Update form value
    this._internals.setFormValue(Array.isArray(this._value) ? this._value.join(',') : this._value);

    // Dispatch select event
    this.dispatchEvent(new CustomEvent('autocomplete-select', {
      bubbles: true,
      composed: true,
      detail: { value: this._value }
    }));
  }

  private handleOutsideClick(e: Event): void {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.hideListbox();
    }
  }

  private showListbox(): void {
    if (!this.listboxWrapper || !this.input) return;

    this.listboxWrapper.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  private hideListbox(): void {
    if (!this.listboxWrapper || !this.input) return;

    this.listboxWrapper.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');
    this._activeDescendantId = null;
    this.input.removeAttribute('aria-activedescendant');
  }

  private updateClearButton(): void {
    if (!this.clearButton) return;
    this.clearButton.hidden = !this._searchQuery;
  }

  private updateLoadingState(): void {
    if (!this.spinner) return;
    this.spinner.hidden = !this.loading;
  }

  private updateInputAttributes(): void {
    if (!this.input) return;

    this.input.placeholder = this.placeholder;
    this.input.disabled = this.disabled;
  }

  private updateInputValue(): void {
    if (!this.input) return;

    if (this.multiple && Array.isArray(this._value)) {
      this.input.value = this._value.length > 0 ? `${this._value.length} selected` : '';
    } else {
      this.input.value = this._value as string;
    }

    this._searchQuery = this.input.value;
    this.updateClearButton();
  }

  private announceResults(): void {
    if (!this.liveRegion) return;

    const count = this.getVisibleOptions().length;
    this.liveRegion.textContent = `${count} result${count !== 1 ? 's' : ''} available`;
  }

  private getAllOptions(): any[] {
    return Array.from(this.querySelectorAll('brand-autocomplete-option'));
  }

  private getVisibleOptions(): any[] {
    return this.getAllOptions().filter((opt: any) => !opt.hidden);
  }

  async clear(): Promise<void> {
    this._value = this.multiple ? [] : '';
    this._searchQuery = '';
    this._selectedOptions.clear();

    if (this.input) {
      this.input.value = '';
    }

    this.removeAttribute('value');
    this._internals.setFormValue('');

    await this.filterOptions('');
    this.hideListbox();
    this.updateClearButton();

    this.dispatchEvent(new CustomEvent('autocomplete-clear', {
      bubbles: true,
      composed: true
    }));
  }

  focus(): void {
    this.input?.focus();
  }

  // Form integration
  formResetCallback(): void {
    this.clear();
  }

  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  // Properties
  get value(): string | string[] {
    return this._value;
  }

  set value(val: string | string[]) {
    const newValue = Array.isArray(val) ? val.join(',') : val;
    this.setAttribute('value', newValue);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
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

  get loading(): boolean {
    return this.hasAttribute('loading');
  }

  set loading(val: boolean) {
    if (val) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }

  set multiple(val: boolean) {
    if (val) {
      this.setAttribute('multiple', '');
    } else {
      this.removeAttribute('multiple');
    }
  }

  get debounce(): number {
    return parseInt(this.getAttribute('debounce') || '300', 10);
  }

  set debounce(val: number) {
    this.setAttribute('debounce', val.toString());
  }

  get filterMode(): 'local' | 'remote' {
    return (this.getAttribute('filter-mode') as 'local' | 'remote') || 'local';
  }

  set filterMode(val: 'local' | 'remote') {
    this.setAttribute('filter-mode', val);
  }

  get minChars(): number {
    return parseInt(this.getAttribute('min-chars') || '0', 10);
  }

  set minChars(val: number) {
    this.setAttribute('min-chars', val.toString());
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }

  set name(val: string) {
    this.setAttribute('name', val);
  }
}

if (!customElements.get('brand-autocomplete')) {
  customElements.define('brand-autocomplete', BrandAutocomplete);
}
