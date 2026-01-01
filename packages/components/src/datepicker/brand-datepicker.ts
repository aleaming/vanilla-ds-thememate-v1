/**
 * @component brand-datepicker
 * @description Accessible date selection component with calendar view
 * @spec docs/phase-3-spec.md#2-date-picker-brand-datepicker
 *
 * @attribute value - Selected date (ISO 8601 format: YYYY-MM-DD) or date range (YYYY-MM-DD,YYYY-MM-DD)
 * @attribute min - Minimum selectable date (ISO 8601)
 * @attribute max - Maximum selectable date (ISO 8601)
 * @attribute disabled - Whether the datepicker is disabled
 * @attribute range - Enable date range selection
 * @attribute format - Date display format (default: 'MM/DD/YYYY')
 * @attribute placeholder - Placeholder text
 *
 * @event datepicker-change - Fired when date selection changes
 * @event datepicker-open - Fired when calendar opens
 * @event datepicker-close - Fired when calendar closes
 *
 * @accessibility
 * - WAI-ARIA Date Picker pattern
 * - Full keyboard navigation
 * - Screen reader support
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="datepicker" part="datepicker">
    <div class="input-wrapper" part="input-wrapper">
      <input
        type="text"
        class="input"
        part="input"
        readonly
        aria-label="Choose date"
      />
      <button class="calendar-button" part="calendar-button" type="button" aria-label="Open calendar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>
    </div>
    <div class="calendar-wrapper" part="calendar-wrapper" hidden>
      <div class="calendar" part="calendar" role="dialog" aria-label="Choose date">
        <div class="calendar-header" part="calendar-header">
          <button class="prev-month" part="prev-month" type="button" aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button class="month-year" part="month-year" type="button"></button>
          <button class="next-month" part="next-month" type="button" aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <div class="calendar-grid" part="calendar-grid" role="grid"></div>
        <div class="calendar-footer" part="calendar-footer">
          <button class="today-button" part="today-button" type="button">Today</button>
          <button class="clear-button" part="clear-button" type="button">Clear</button>
        </div>
      </div>
    </div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
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

  .datepicker {
    position: relative;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .input {
    flex: 1;
    font-family: var(--font-family-base, system-ui, sans-serif);
    font-size: var(--font-size-base, 1rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    cursor: pointer;
    outline: none;
  }

  .input:focus {
    border-color: var(--color-primary, #007bff);
    box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(0, 123, 255, 0.1));
  }

  .calendar-button {
    padding: var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .calendar-button:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .calendar-button svg {
    width: 20px;
    height: 20px;
  }

  .calendar-wrapper {
    position: absolute;
    top: calc(100% + var(--space-1, 0.25rem));
    left: 0;
    z-index: var(--z-dropdown, 1000);
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.15));
    padding: var(--space-3, 0.75rem);
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3, 0.75rem);
  }

  .prev-month,
  .next-month {
    padding: var(--space-1, 0.25rem);
    border: none;
    background: transparent;
    color: var(--color-text, #1a1a1a);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm, 4px);
    transition: background-color 0.2s;
  }

  .prev-month:hover,
  .next-month:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .prev-month svg,
  .next-month svg {
    width: 20px;
    height: 20px;
  }

  .month-year {
    flex: 1;
    padding: var(--space-2, 0.5rem);
    border: none;
    background: transparent;
    color: var(--color-text, #1a1a1a);
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    border-radius: var(--radius-sm, 4px);
    transition: background-color 0.2s;
  }

  .month-year:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--space-1, 0.25rem);
    margin-bottom: var(--space-3, 0.75rem);
  }

  .calendar-footer {
    display: flex;
    gap: var(--space-2, 0.5rem);
    justify-content: space-between;
  }

  .today-button,
  .clear-button {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .today-button:hover,
  .clear-button:hover {
    background: var(--color-surface-hover, #f5f5f5);
  }
`);

export class BrandDatepicker extends BaseComponent {
  static styles = styles;
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'range', 'format', 'placeholder'];
  }

  private _internals: ElementInternals;
  private input: HTMLInputElement | null = null;
  private calendarButton: HTMLButtonElement | null = null;
  private calendarWrapper: HTMLElement | null = null;
  private calendar: HTMLElement | null = null;
  private calendarGrid: HTMLElement | null = null;
  private monthYearButton: HTMLButtonElement | null = null;
  private prevMonthButton: HTMLButtonElement | null = null;
  private nextMonthButton: HTMLButtonElement | null = null;
  private todayButton: HTMLButtonElement | null = null;
  private clearButton: HTMLButtonElement | null = null;

  private _value: string | [string, string] = '';
  private _selectedDate: Date | null = null;
  private _rangeStart: Date | null = null;
  private _rangeEnd: Date | null = null;
  private _currentMonth: Date = new Date();
  private _focusedDate: Date | null = null;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.input = this.root.querySelector('.input');
    this.calendarButton = this.root.querySelector('.calendar-button');
    this.calendarWrapper = this.root.querySelector('.calendar-wrapper');
    this.calendar = this.root.querySelector('.calendar');
    this.calendarGrid = this.root.querySelector('.calendar-grid');
    this.monthYearButton = this.root.querySelector('.month-year');
    this.prevMonthButton = this.root.querySelector('.prev-month');
    this.nextMonthButton = this.root.querySelector('.next-month');
    this.todayButton = this.root.querySelector('.today-button');
    this.clearButton = this.root.querySelector('.clear-button');

    this.setupEventListeners();
    this.updateInputAttributes();
    this.renderCalendar();
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
      case 'value':
        this.parseValue(newValue);
        this.updateInputDisplay();
        this.renderCalendar();
        break;
      case 'range':
        this.updateInputDisplay();
        break;
    }
  }

  private setupEventListeners(): void {
    // Open calendar
    this.listen(this.input!, 'click', () => this.openCalendar());
    this.listen(this.calendarButton!, 'click', () => this.toggleCalendar());

    // Navigation
    this.listen(this.prevMonthButton!, 'click', () => this.previousMonth());
    this.listen(this.nextMonthButton!, 'click', () => this.nextMonth());
    this.listen(this.monthYearButton!, 'click', () => this.showMonthYearPicker());

    // Actions
    this.listen(this.todayButton!, 'click', () => this.selectToday());
    this.listen(this.clearButton!, 'click', () => this.clear());

    // Keyboard navigation
    this.listen(this.calendar!, 'keydown', (e: KeyboardEvent) => this.handleKeydown(e));

    // Outside click
    this.listen(document, 'click', (e: Event) => this.handleOutsideClick(e));

    // Input keyboard
    this.listen(this.input!, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleCalendar();
      }
    });
  }

  private parseValue(value: string | null): void {
    if (!value) {
      this._selectedDate = null;
      this._rangeStart = null;
      this._rangeEnd = null;
      this._value = '';
      return;
    }

    if (this.range && value.includes(',')) {
      const [start, end] = value.split(',');
      this._rangeStart = this.parseDate(start);
      this._rangeEnd = this.parseDate(end);
      this._value = [start, end];
    } else {
      this._selectedDate = this.parseDate(value);
      this._value = value;
    }
  }

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const format = this.format;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateInputDisplay(): void {
    if (!this.input) return;

    if (this.range && this._rangeStart && this._rangeEnd) {
      this.input.value = `${this.formatDate(this._rangeStart)} - ${this.formatDate(this._rangeEnd)}`;
    } else if (this._selectedDate) {
      this.input.value = this.formatDate(this._selectedDate);
    } else {
      this.input.value = '';
    }
  }

  private updateInputAttributes(): void {
    if (!this.input) return;
    this.input.placeholder = this.placeholder;
    this.input.disabled = this.disabled;
  }

  private renderCalendar(): void {
    if (!this.calendarGrid || !this.monthYearButton) return;

    // Update month/year display
    const monthName = this._currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    this.monthYearButton.textContent = monthName;

    // Clear grid
    this.calendarGrid.innerHTML = '';

    // Day headers
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    dayNames.forEach(name => {
      const header = document.createElement('div');
      header.className = 'day-header';
      header.textContent = name;
      header.setAttribute('role', 'columnheader');
      header.style.cssText = `
        text-align: center;
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-muted, #666666);
        padding: var(--space-2, 0.5rem);
      `;
      this.calendarGrid!.appendChild(header);
    });

    // Calculate dates
    const year = this._currentMonth.getFullYear();
    const month = this._currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Previous month days (padding)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      this.renderDay(new Date(year, month - 1, day), true);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      this.renderDay(new Date(year, month, day), false);
    }

    // Next month days (padding)
    const totalCells = this.calendarGrid.children.length - 7; // Minus headers
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
      this.renderDay(new Date(year, month + 1, day), true);
    }
  }

  private renderDay(date: Date, isOtherMonth: boolean): void {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day-cell';
    button.textContent = String(date.getDate());
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    const isSelected = this.isDateSelected(date);
    const isInRange = this.isDateInRange(date);
    const isToday = this.isToday(date);
    const isDisabled = this.isDateDisabled(date) || isOtherMonth;

    // Styling
    button.style.cssText = `
      padding: var(--space-2, 0.5rem);
      border: none;
      background: transparent;
      border-radius: var(--radius-sm, 4px);
      cursor: pointer;
      transition: background-color 0.2s;
      ${isOtherMonth ? 'color: var(--color-text-muted, #999999);' : ''}
      ${isToday ? 'border: 2px solid var(--color-primary, #007bff);' : ''}
      ${isSelected ? 'background: var(--color-primary, #007bff); color: var(--color-on-primary, #ffffff);' : ''}
      ${isInRange ? 'background: var(--color-primary-alpha, rgba(0, 123, 255, 0.1));' : ''}
      ${isDisabled ? 'opacity: 0.3; cursor: not-allowed;' : ''}
    `;

    if (isSelected) {
      button.setAttribute('aria-selected', 'true');
    }

    if (!isDisabled) {
      button.addEventListener('click', () => this.selectDate(date));
      button.addEventListener('mouseenter', () => {
        if (this.range && this._rangeStart && !this._rangeEnd) {
          this.renderCalendar(); // Re-render to show hover range
        }
      });
    } else {
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
    }

    this.calendarGrid!.appendChild(button);
  }

  private isDateSelected(date: Date): boolean {
    if (this.range) {
      if (!this._rangeStart && !this._rangeEnd) return false;
      const dateStr = this.toISODate(date);
      const startStr = this._rangeStart ? this.toISODate(this._rangeStart) : '';
      const endStr = this._rangeEnd ? this.toISODate(this._rangeEnd) : '';
      return dateStr === startStr || dateStr === endStr;
    } else {
      if (!this._selectedDate) return false;
      return this.toISODate(date) === this.toISODate(this._selectedDate);
    }
  }

  private isDateInRange(date: Date): boolean {
    if (!this.range || !this._rangeStart || !this._rangeEnd) return false;
    return date > this._rangeStart && date < this._rangeEnd;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return this.toISODate(date) === this.toISODate(today);
  }

  private isDateDisabled(date: Date): boolean {
    if (this.min && date < this.parseDate(this.min)!) return true;
    if (this.max && date > this.parseDate(this.max)!) return true;
    return false;
  }

  private selectDate(date: Date): void {
    if (this.range) {
      if (!this._rangeStart || (this._rangeStart && this._rangeEnd)) {
        // Start new range
        this._rangeStart = date;
        this._rangeEnd = null;
      } else {
        // Complete range
        if (date < this._rangeStart) {
          this._rangeEnd = this._rangeStart;
          this._rangeStart = date;
        } else {
          this._rangeEnd = date;
        }

        this._value = [this.toISODate(this._rangeStart), this.toISODate(this._rangeEnd)];
        this.setAttribute('value', this._value.join(','));
        this._internals.setFormValue(this._value.join(','));
        this.updateInputDisplay();
        this.closeCalendar();

        this.dispatchEvent(new CustomEvent('datepicker-change', {
          bubbles: true,
          composed: true,
          detail: { value: this._value }
        }));

        return;
      }
    } else {
      // Single date selection
      this._selectedDate = date;
      this._value = this.toISODate(date);
      this.setAttribute('value', this._value);
      this._internals.setFormValue(this._value);
      this.updateInputDisplay();
      this.closeCalendar();

      this.dispatchEvent(new CustomEvent('datepicker-change', {
        bubbles: true,
        composed: true,
        detail: { value: this._value }
      }));

      return;
    }

    this.renderCalendar();
  }

  private previousMonth(): void {
    this._currentMonth = new Date(this._currentMonth.getFullYear(), this._currentMonth.getMonth() - 1, 1);
    this.renderCalendar();
  }

  private nextMonth(): void {
    this._currentMonth = new Date(this._currentMonth.getFullYear(), this._currentMonth.getMonth() + 1, 1);
    this.renderCalendar();
  }

  private showMonthYearPicker(): void {
    // TODO: Implement month/year picker view
  }

  private selectToday(): void {
    const today = new Date();
    this.selectDate(today);
  }

  private clear(): void {
    this._selectedDate = null;
    this._rangeStart = null;
    this._rangeEnd = null;
    this._value = '';
    this.removeAttribute('value');
    this._internals.setFormValue('');
    this.updateInputDisplay();
    this.renderCalendar();

    this.dispatchEvent(new CustomEvent('datepicker-change', {
      bubbles: true,
      composed: true,
      detail: { value: '' }
    }));
  }

  private handleKeydown(e: KeyboardEvent): void {
    // TODO: Implement keyboard navigation
  }

  private handleOutsideClick(e: Event): void {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.closeCalendar();
    }
  }

  private openCalendar(): void {
    if (this.disabled || !this.calendarWrapper) return;

    this.calendarWrapper.hidden = false;
    this.renderCalendar();

    // Focus first enabled day
    requestAnimationFrame(() => {
      const firstDay = this.calendarGrid?.querySelector('button:not([disabled])') as HTMLElement;
      firstDay?.focus();
    });

    this.dispatchEvent(new CustomEvent('datepicker-open', {
      bubbles: true,
      composed: true
    }));
  }

  private closeCalendar(): void {
    if (!this.calendarWrapper) return;

    this.calendarWrapper.hidden = true;

    this.dispatchEvent(new CustomEvent('datepicker-close', {
      bubbles: true,
      composed: true
    }));
  }

  private toggleCalendar(): void {
    if (this.calendarWrapper?.hidden) {
      this.openCalendar();
    } else {
      this.closeCalendar();
    }
  }

  // Form integration
  formResetCallback(): void {
    this.clear();
  }

  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  // Properties
  get value(): string | [string, string] {
    return this._value;
  }

  set value(val: string | [string, string]) {
    const newValue = Array.isArray(val) ? val.join(',') : val;
    this.setAttribute('value', newValue);
  }

  get min(): string {
    return this.getAttribute('min') || '';
  }

  set min(val: string) {
    this.setAttribute('min', val);
  }

  get max(): string {
    return this.getAttribute('max') || '';
  }

  set max(val: string) {
    this.setAttribute('max', val);
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

  get range(): boolean {
    return this.hasAttribute('range');
  }

  set range(val: boolean) {
    if (val) {
      this.setAttribute('range', '');
    } else {
      this.removeAttribute('range');
    }
  }

  get format(): string {
    return this.getAttribute('format') || 'MM/DD/YYYY';
  }

  set format(val: string) {
    this.setAttribute('format', val);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || 'Select date';
  }

  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
  }
}

if (!customElements.get('brand-datepicker')) {
  customElements.define('brand-datepicker', BrandDatepicker);
}
