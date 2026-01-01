/**
 * @file brand-datepicker.test.ts
 * @description Tests for brand-datepicker component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './brand-datepicker';

describe('brand-datepicker', () => {
  let datepicker: any;

  beforeEach(() => {
    datepicker = document.createElement('brand-datepicker');
    document.body.appendChild(datepicker);
  });

  afterEach(() => {
    document.body.removeChild(datepicker);
  });

  describe('Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('brand-datepicker')).toBeDefined();
    });

    it('should render shadow DOM', () => {
      expect(datepicker.shadowRoot).toBeTruthy();
    });

    it('should have form-associated', () => {
      const constructor = customElements.get('brand-datepicker') as any;
      expect(constructor.formAssociated).toBe(true);
    });
  });

  describe('Initial State', () => {
    it('should have readonly input', () => {
      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.readOnly).toBe(true);
    });

    it('should have hidden calendar initially', () => {
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');
      expect(calendar?.hidden).toBe(true);
    });

    it('should have calendar button', () => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      expect(button).toBeTruthy();
    });

    it('should have today and clear buttons', () => {
      const today = datepicker.shadowRoot?.querySelector('.today-button');
      const clear = datepicker.shadowRoot?.querySelector('.clear-button');
      expect(today).toBeTruthy();
      expect(clear).toBeTruthy();
    });
  });

  describe('Attributes', () => {
    it('should reflect value attribute', () => {
      datepicker.setAttribute('value', '2025-01-15');
      expect(datepicker.value).toBe('2025-01-15');
    });

    it('should reflect min attribute', () => {
      datepicker.setAttribute('min', '2025-01-01');
      expect(datepicker.min).toBe('2025-01-01');
    });

    it('should reflect max attribute', () => {
      datepicker.setAttribute('max', '2025-12-31');
      expect(datepicker.max).toBe('2025-12-31');
    });

    it('should reflect disabled attribute', () => {
      datepicker.setAttribute('disabled', '');
      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });

    it('should reflect range attribute', () => {
      datepicker.setAttribute('range', '');
      expect(datepicker.range).toBe(true);
    });

    it('should reflect format attribute', () => {
      datepicker.setAttribute('format', 'DD/MM/YYYY');
      expect(datepicker.format).toBe('DD/MM/YYYY');
    });

    it('should reflect placeholder attribute', () => {
      datepicker.setAttribute('placeholder', 'Pick a date');
      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.placeholder).toBe('Pick a date');
    });
  });

  describe('Properties', () => {
    it('should get/set value', () => {
      datepicker.value = '2025-01-15';
      expect(datepicker.getAttribute('value')).toBe('2025-01-15');
    });

    it('should get/set min', () => {
      datepicker.min = '2025-01-01';
      expect(datepicker.getAttribute('min')).toBe('2025-01-01');
    });

    it('should get/set max', () => {
      datepicker.max = '2025-12-31';
      expect(datepicker.getAttribute('max')).toBe('2025-12-31');
    });

    it('should get/set disabled', () => {
      datepicker.disabled = true;
      expect(datepicker.hasAttribute('disabled')).toBe(true);
    });

    it('should get/set range', () => {
      datepicker.range = true;
      expect(datepicker.hasAttribute('range')).toBe(true);
    });

    it('should get/set format', () => {
      datepicker.format = 'DD/MM/YYYY';
      expect(datepicker.getAttribute('format')).toBe('DD/MM/YYYY');
    });

    it('should get/set placeholder', () => {
      datepicker.placeholder = 'Pick a date';
      expect(datepicker.getAttribute('placeholder')).toBe('Pick a date');
    });
  });

  describe('Calendar Display', () => {
    it('should open calendar on input click', () => {
      const input = datepicker.shadowRoot?.querySelector('input');
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');

      input.click();

      expect(calendar?.hidden).toBe(false);
    });

    it('should open calendar on calendar button click', () => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');

      button.click();

      expect(calendar?.hidden).toBe(false);
    });

    it('should toggle calendar on button click', () => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');

      button.click();
      expect(calendar?.hidden).toBe(false);

      button.click();
      expect(calendar?.hidden).toBe(true);
    });

    it('should dispatch datepicker-open event', () => {
      const openSpy = vi.fn();
      datepicker.addEventListener('datepicker-open', openSpy);

      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      button.click();

      expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch datepicker-close event', () => {
      const closeSpy = vi.fn();
      datepicker.addEventListener('datepicker-close', closeSpy);

      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      button.click(); // Open
      button.click(); // Close

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render calendar grid', () => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      button.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const cells = grid?.querySelectorAll('button');

      // Should have day headers (7) + day cells
      expect(cells!.length).toBeGreaterThan(7);
    });

    it('should display current month/year', () => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      button.click();

      const monthYear = datepicker.shadowRoot?.querySelector('.month-year');
      expect(monthYear?.textContent).toMatch(/\w+ \d{4}/);
    });
  });

  describe('Date Selection', () => {
    it('should select date on day click', async () => {
      const changeSpy = vi.fn();
      datepicker.addEventListener('datepicker-change', changeSpy);

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const dayCells = Array.from(grid?.querySelectorAll('button') || []).slice(7); // Skip headers
      const firstDay = dayCells.find((cell: any) => !cell.disabled) as HTMLButtonElement;

      if (firstDay) {
        firstDay.click();

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(datepicker.value).toBeTruthy();
      }
    });

    it('should update input value after selection', async () => {
      datepicker.value = '2025-01-15';

      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.value).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should close calendar after single date selection', async () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');

      calendarButton.click();
      expect(calendar?.hidden).toBe(false);

      await new Promise(resolve => setTimeout(resolve, 0));

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const dayCells = Array.from(grid?.querySelectorAll('button') || []).slice(7);
      const firstDay = dayCells.find((cell: any) => !cell.disabled) as HTMLButtonElement;

      if (firstDay) {
        firstDay.click();
        expect(calendar?.hidden).toBe(true);
      }
    });

    it('should format date according to format attribute', () => {
      datepicker.format = 'DD/MM/YYYY';
      datepicker.value = '2025-01-15';

      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.value).toBe('15/01/2025');
    });
  });

  describe('Range Selection', () => {
    beforeEach(() => {
      datepicker.range = true;
    });

    it('should allow range selection', async () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const dayCells = Array.from(grid?.querySelectorAll('button') || [])
        .slice(7)
        .filter((cell: any) => !cell.disabled) as HTMLButtonElement[];

      if (dayCells.length >= 2) {
        dayCells[0].click(); // Start
        expect(datepicker.value).toBe(''); // Not complete yet

        dayCells[5].click(); // End
        expect(Array.isArray(datepicker.value)).toBe(true);
      }
    });

    it('should display range in input', () => {
      datepicker.value = '2025-01-15,2025-01-20';

      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.value).toContain(' - ');
    });

    it('should swap dates if end is before start', async () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      await new Promise(resolve => setTimeout(resolve, 0));

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const dayCells = Array.from(grid?.querySelectorAll('button') || [])
        .slice(7)
        .filter((cell: any) => !cell.disabled) as HTMLButtonElement[];

      if (dayCells.length >= 2) {
        dayCells[10].click(); // Later date first
        dayCells[2].click(); // Earlier date second

        const [start, end] = datepicker.value as [string, string];
        expect(new Date(start) < new Date(end)).toBe(true);
      }
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      const button = datepicker.shadowRoot?.querySelector('.calendar-button');
      button.click();
    });

    it('should navigate to previous month', () => {
      const monthYear = datepicker.shadowRoot?.querySelector('.month-year');
      const originalText = monthYear?.textContent;

      const prevButton = datepicker.shadowRoot?.querySelector('.prev-month');
      prevButton.click();

      expect(monthYear?.textContent).not.toBe(originalText);
    });

    it('should navigate to next month', () => {
      const monthYear = datepicker.shadowRoot?.querySelector('.month-year');
      const originalText = monthYear?.textContent;

      const nextButton = datepicker.shadowRoot?.querySelector('.next-month');
      nextButton.click();

      expect(monthYear?.textContent).not.toBe(originalText);
    });
  });

  describe('Today Button', () => {
    it('should select today on click', () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const todayButton = datepicker.shadowRoot?.querySelector('.today-button');
      todayButton.click();

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayISO = `${year}-${month}-${day}`;

      expect(datepicker.value).toBe(todayISO);
    });
  });

  describe('Clear Button', () => {
    it('should clear selection', () => {
      datepicker.value = '2025-01-15';

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const clearButton = datepicker.shadowRoot?.querySelector('.clear-button');
      clearButton.click();

      expect(datepicker.value).toBe('');
    });

    it('should dispatch change event on clear', () => {
      datepicker.value = '2025-01-15';

      const changeSpy = vi.fn();
      datepicker.addEventListener('datepicker-change', changeSpy);

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const clearButton = datepicker.shadowRoot?.querySelector('.clear-button');
      clearButton.click();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy.mock.calls[0][0].detail.value).toBe('');
    });
  });

  describe('Date Constraints', () => {
    it('should disable dates before min', () => {
      datepicker.min = '2025-01-15';

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const cells = Array.from(grid?.querySelectorAll('button') || []).slice(7);

      // Check if early dates are disabled
      const hasDisabled = cells.some((cell: any) => cell.disabled);
      expect(hasDisabled).toBe(true);
    });

    it('should disable dates after max', () => {
      datepicker.max = '2025-01-15';

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const cells = Array.from(grid?.querySelectorAll('button') || []).slice(7);

      const hasDisabled = cells.some((cell: any) => cell.disabled);
      expect(hasDisabled).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should participate in form submission', () => {
      const form = document.createElement('form');
      form.appendChild(datepicker);
      datepicker.setAttribute('name', 'date');
      datepicker.value = '2025-01-15';

      const formData = new FormData(form);
      expect(formData.get('date')).toBe('2025-01-15');
    });

    it('should reset on form reset', () => {
      const form = document.createElement('form');
      form.appendChild(datepicker);

      datepicker.value = '2025-01-15';
      form.reset();

      expect(datepicker.value).toBe('');
    });

    it('should restore state', () => {
      datepicker.formStateRestoreCallback('2025-01-15');
      expect(datepicker.value).toBe('2025-01-15');
    });
  });

  describe('Disabled State', () => {
    it('should not open calendar when disabled', () => {
      datepicker.disabled = true;

      const input = datepicker.shadowRoot?.querySelector('input');
      const calendar = datepicker.shadowRoot?.querySelector('.calendar-wrapper');

      input.click();

      expect(calendar?.hidden).toBe(true);
    });

    it('should disable input when disabled', () => {
      datepicker.disabled = true;
      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on input', () => {
      const input = datepicker.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have role=dialog on calendar', () => {
      const calendar = datepicker.shadowRoot?.querySelector('.calendar');
      expect(calendar?.getAttribute('role')).toBe('dialog');
    });

    it('should have role=grid on calendar grid', () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      expect(grid?.getAttribute('role')).toBe('grid');
    });

    it('should have aria-label on day cells', () => {
      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const cells = grid?.querySelectorAll('button');
      const firstCell = cells?.[7]; // First day cell (after headers)

      expect(firstCell?.getAttribute('aria-label')).toMatch(/\w+, \w+ \d+, \d{4}/);
    });

    it('should set aria-selected on selected dates', () => {
      datepicker.value = '2025-01-15';

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const selectedCell = Array.from(grid?.querySelectorAll('button') || [])
        .find((cell: any) => cell.getAttribute('aria-selected') === 'true');

      expect(selectedCell).toBeTruthy();
    });

    it('should set aria-disabled on disabled dates', () => {
      datepicker.min = '2025-01-15';

      const calendarButton = datepicker.shadowRoot?.querySelector('.calendar-button');
      calendarButton.click();

      const grid = datepicker.shadowRoot?.querySelector('.calendar-grid');
      const disabledCell = Array.from(grid?.querySelectorAll('button') || [])
        .find((cell: any) => cell.getAttribute('aria-disabled') === 'true');

      expect(disabledCell).toBeTruthy();
    });
  });

  describe('CSS Parts', () => {
    it('should expose datepicker part', () => {
      const part = datepicker.shadowRoot?.querySelector('[part="datepicker"]');
      expect(part).toBeTruthy();
    });

    it('should expose calendar part', () => {
      const part = datepicker.shadowRoot?.querySelector('[part="calendar"]');
      expect(part).toBeTruthy();
    });

    it('should expose input part', () => {
      const part = datepicker.shadowRoot?.querySelector('[part="input"]');
      expect(part).toBeTruthy();
    });
  });
});
