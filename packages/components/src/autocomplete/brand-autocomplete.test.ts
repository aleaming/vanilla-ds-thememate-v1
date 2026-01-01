/**
 * @file brand-autocomplete.test.ts
 * @description Tests for brand-autocomplete component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './brand-autocomplete';
import './brand-autocomplete-option';
import './brand-autocomplete-group';

describe('brand-autocomplete', () => {
  let autocomplete: any;

  beforeEach(() => {
    autocomplete = document.createElement('brand-autocomplete');
    document.body.appendChild(autocomplete);
  });

  afterEach(() => {
    document.body.removeChild(autocomplete);
  });

  describe('Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('brand-autocomplete')).toBeDefined();
    });

    it('should render shadow DOM', () => {
      expect(autocomplete.shadowRoot).toBeTruthy();
    });

    it('should have form-associated', () => {
      const constructor = customElements.get('brand-autocomplete') as any;
      expect(constructor.formAssociated).toBe(true);
    });
  });

  describe('Initial State', () => {
    it('should have combobox role on input', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-autocomplete="list"', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('should have aria-expanded="false" initially', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have hidden listbox initially', () => {
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');
      expect(listbox?.hidden).toBe(true);
    });

    it('should have hidden clear button initially', () => {
      const clearButton = autocomplete.shadowRoot?.querySelector('.clear-button');
      expect(clearButton?.hidden).toBe(true);
    });

    it('should have hidden spinner initially', () => {
      const spinner = autocomplete.shadowRoot?.querySelector('.spinner');
      expect(spinner?.hidden).toBe(true);
    });
  });

  describe('Attributes', () => {
    it('should reflect placeholder attribute', () => {
      autocomplete.setAttribute('placeholder', 'Search...');
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.placeholder).toBe('Search...');
    });

    it('should reflect disabled attribute', () => {
      autocomplete.setAttribute('disabled', '');
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });

    it('should reflect loading attribute', () => {
      autocomplete.setAttribute('loading', '');
      const spinner = autocomplete.shadowRoot?.querySelector('.spinner');
      expect(spinner?.hidden).toBe(false);
    });

    it('should reflect value attribute', () => {
      autocomplete.setAttribute('value', 'test');
      expect(autocomplete.value).toBe('test');
    });

    it('should parse multiple values from comma-separated string', () => {
      autocomplete.setAttribute('multiple', '');
      autocomplete.setAttribute('value', 'a,b,c');
      expect(autocomplete.value).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Properties', () => {
    it('should get/set value', () => {
      autocomplete.value = 'test';
      expect(autocomplete.getAttribute('value')).toBe('test');
    });

    it('should get/set placeholder', () => {
      autocomplete.placeholder = 'Search...';
      expect(autocomplete.getAttribute('placeholder')).toBe('Search...');
    });

    it('should get/set disabled', () => {
      autocomplete.disabled = true;
      expect(autocomplete.hasAttribute('disabled')).toBe(true);
    });

    it('should get/set loading', () => {
      autocomplete.loading = true;
      expect(autocomplete.hasAttribute('loading')).toBe(true);
    });

    it('should get/set multiple', () => {
      autocomplete.multiple = true;
      expect(autocomplete.hasAttribute('multiple')).toBe(true);
    });

    it('should get/set debounce', () => {
      autocomplete.debounce = 500;
      expect(autocomplete.getAttribute('debounce')).toBe('500');
    });

    it('should get/set filter-mode', () => {
      autocomplete.filterMode = 'remote';
      expect(autocomplete.getAttribute('filter-mode')).toBe('remote');
    });

    it('should get/set min-chars', () => {
      autocomplete.minChars = 2;
      expect(autocomplete.getAttribute('min-chars')).toBe('2');
    });
  });

  describe('Input Interaction', () => {
    it('should show clear button when typing', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const clearButton = autocomplete.shadowRoot?.querySelector('.clear-button');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(clearButton?.hidden).toBe(false);
    });

    it('should show listbox when typing (min-chars: 0)', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350)); // Wait for debounce

      expect(listbox?.hidden).toBe(false);
    });

    it('should not show listbox if below min-chars', async () => {
      autocomplete.minChars = 3;
      const input = autocomplete.shadowRoot?.querySelector('input');
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');

      input.value = 'ab';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(listbox?.hidden).toBe(true);
    });

    it('should debounce input events', async () => {
      vi.useFakeTimers();
      autocomplete.debounce = 300;

      const input = autocomplete.shadowRoot?.querySelector('input');
      const searchSpy = vi.fn();
      autocomplete.addEventListener('autocomplete-search', searchSpy);
      autocomplete.filterMode = 'remote';

      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      vi.advanceTimersByTime(100);

      input.value = 'ab';
      input.dispatchEvent(new Event('input'));
      vi.advanceTimersByTime(100);

      input.value = 'abc';
      input.dispatchEvent(new Event('input'));
      vi.advanceTimersByTime(100);

      // Only 1 search should have fired (debounced)
      expect(searchSpy).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(100); // Total 300ms
      expect(searchSpy).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should clear input when clear button clicked', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const clearButton = autocomplete.shadowRoot?.querySelector('.clear-button');

      autocomplete.value = 'test';
      input.value = 'test';
      clearButton.click();

      expect(autocomplete.value).toBe('');
      expect(input.value).toBe('');
    });

    it('should dispatch autocomplete-clear event on clear', () => {
      const clearSpy = vi.fn();
      autocomplete.addEventListener('autocomplete-clear', clearSpy);

      autocomplete.clear();
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Local Filtering', () => {
    beforeEach(() => {
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="apple">Apple</brand-autocomplete-option>
        <brand-autocomplete-option value="banana">Banana</brand-autocomplete-option>
        <brand-autocomplete-option value="cherry">Cherry</brand-autocomplete-option>
        <brand-autocomplete-option value="apricot">Apricot</brand-autocomplete-option>
      `;
    });

    it('should filter options locally', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = 'ap';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      const visibleOptions = options.filter((opt: any) => !opt.hidden);

      expect(visibleOptions.length).toBe(2); // Apple, Apricot
    });

    it('should show all options for empty query', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = '';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      const visibleOptions = options.filter((opt: any) => !opt.hidden);

      expect(visibleOptions.length).toBe(4);
    });

    it('should show empty state when no matches', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const emptyState = autocomplete.shadowRoot?.querySelector('.empty-state');

      input.value = 'xyz';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(emptyState?.hidden).toBe(false);
    });

    it('should be case-insensitive', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = 'APPLE';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      const visibleOptions = options.filter((opt: any) => !opt.hidden);

      expect(visibleOptions.length).toBe(1);
    });
  });

  describe('Remote Filtering', () => {
    it('should dispatch autocomplete-search event for remote filtering', async () => {
      autocomplete.filterMode = 'remote';
      const searchSpy = vi.fn();
      autocomplete.addEventListener('autocomplete-search', searchSpy);

      const input = autocomplete.shadowRoot?.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy.mock.calls[0][0].detail.query).toBe('test');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Option 2</brand-autocomplete-option>
        <brand-autocomplete-option value="3">Option 3</brand-autocomplete-option>
      `;
    });

    it('should navigate down with ArrowDown', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.focus();
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      input.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      expect((options[0] as any).active).toBe(true);
    });

    it('should navigate up with ArrowUp', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.focus();
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      // Go to last option with ArrowUp
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      input.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      expect((options[2] as any).active).toBe(true);
    });

    it('should wrap navigation at boundaries', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.focus();
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      // Go down to first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Go down to second
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Go down to third
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Wrap to first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      expect((options[0] as any).active).toBe(true);
    });

    it('should close listbox with Escape', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(listbox?.hidden).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(listbox?.hidden).toBe(true);
    });

    it('should select active option with Enter', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const selectSpy = vi.fn();
      autocomplete.addEventListener('autocomplete-select', selectSpy);

      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      // Navigate to first option
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Select with Enter
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy.mock.calls[0][0].detail.value).toBe('1');
    });

    it('should go to first option with Ctrl+Home', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', ctrlKey: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      expect((options[0] as any).active).toBe(true);
    });

    it('should go to last option with Ctrl+End', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', ctrlKey: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      expect((options[2] as any).active).toBe(true);
    });
  });

  describe('Option Selection', () => {
    beforeEach(() => {
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Option 2</brand-autocomplete-option>
      `;
    });

    it('should select option on click', () => {
      const option = autocomplete.querySelector('brand-autocomplete-option');
      const selectSpy = vi.fn();
      autocomplete.addEventListener('autocomplete-select', selectSpy);

      option.click();

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(autocomplete.value).toBe('1');
    });

    it('should update input value on selection (single)', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const option = autocomplete.querySelector('brand-autocomplete-option');

      option.click();

      expect(input.value).toBe('Option 1');
    });

    it('should close listbox after selection (single)', async () => {
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');
      const option = autocomplete.querySelector('brand-autocomplete-option');

      // Open listbox
      const input = autocomplete.shadowRoot?.querySelector('input');
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      option.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(listbox?.hidden).toBe(true);
    });
  });

  describe('Multiple Selection', () => {
    beforeEach(() => {
      autocomplete.multiple = true;
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Option 2</brand-autocomplete-option>
        <brand-autocomplete-option value="3">Option 3</brand-autocomplete-option>
      `;
    });

    it('should allow multiple selections', () => {
      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));

      (options[0] as HTMLElement).click();
      (options[1] as HTMLElement).click();

      expect(autocomplete.value).toEqual(expect.arrayContaining(['1', '2']));
    });

    it('should show count in input for multiple selections', () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));

      (options[0] as HTMLElement).click();
      (options[1] as HTMLElement).click();

      expect(input.value).toBe('2 selected');
    });

    it('should toggle selection in multiple mode', () => {
      const option = autocomplete.querySelector('brand-autocomplete-option');

      option.click(); // Select
      expect(autocomplete.value).toContain('1');

      option.click(); // Deselect
      expect(autocomplete.value).not.toContain('1');
    });

    it('should not close listbox after selection (multiple)', async () => {
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const option = autocomplete.querySelector('brand-autocomplete-option');
      option.click();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(listbox?.hidden).toBe(false);
    });
  });

  describe('Focus Management', () => {
    it('should show listbox on focus (if min-chars met)', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      // Close listbox
      listbox.hidden = true;

      // Focus again
      input.dispatchEvent(new Event('focus'));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(listbox?.hidden).toBe(false);
    });

    it('should have focus() method', () => {
      autocomplete.focus();
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(document.activeElement).toBe(autocomplete);
    });
  });

  describe('ARIA Attributes', () => {
    it('should update aria-expanded when opening listbox', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(input.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-activedescendant when navigating', async () => {
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
      `;

      const input = autocomplete.shadowRoot?.querySelector('input');
      input.value = 'opt';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      const option = autocomplete.querySelector('brand-autocomplete-option');
      expect(input.getAttribute('aria-activedescendant')).toBe(option.id);
    });

    it('should have live region for announcements', () => {
      const liveRegion = autocomplete.shadowRoot?.querySelector('.live-region');
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should announce result count', async () => {
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Apple</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Banana</brand-autocomplete-option>
      `;

      const input = autocomplete.shadowRoot?.querySelector('input');
      const liveRegion = autocomplete.shadowRoot?.querySelector('.live-region');

      input.value = 'ap';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(liveRegion?.textContent).toContain('1 result');
    });
  });

  describe('Form Integration', () => {
    it('should participate in form submission', () => {
      const form = document.createElement('form');
      form.appendChild(autocomplete);
      autocomplete.name = 'search';
      autocomplete.value = 'test';

      const formData = new FormData(form);
      expect(formData.get('search')).toBe('test');
    });

    it('should reset on form reset', () => {
      const form = document.createElement('form');
      form.appendChild(autocomplete);

      autocomplete.value = 'test';
      form.reset();

      expect(autocomplete.value).toBe('');
    });

    it('should restore state', () => {
      autocomplete.formStateRestoreCallback('restored-value');
      expect(autocomplete.value).toBe('restored-value');
    });
  });

  describe('Grouped Options', () => {
    beforeEach(() => {
      autocomplete.innerHTML = `
        <brand-autocomplete-group label="Fruits">
          <brand-autocomplete-option value="apple">Apple</brand-autocomplete-option>
          <brand-autocomplete-option value="banana">Banana</brand-autocomplete-option>
        </brand-autocomplete-group>
        <brand-autocomplete-group label="Vegetables">
          <brand-autocomplete-option value="carrot">Carrot</brand-autocomplete-option>
        </brand-autocomplete-group>
      `;
    });

    it('should render groups', () => {
      const groups = autocomplete.querySelectorAll('brand-autocomplete-group');
      expect(groups.length).toBe(2);
    });

    it('should filter within groups', async () => {
      const input = autocomplete.shadowRoot?.querySelector('input');

      input.value = 'ap';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      const visibleOptions = options.filter((opt: any) => !opt.hidden);

      expect(visibleOptions.length).toBe(1); // Only Apple
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled attribute set', () => {
      autocomplete.disabled = true;
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });

    it('should not open listbox when disabled', async () => {
      autocomplete.disabled = true;
      const input = autocomplete.shadowRoot?.querySelector('input');
      const listbox = autocomplete.shadowRoot?.querySelector('.listbox-wrapper');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(listbox?.hidden).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      autocomplete.loading = true;
      const spinner = autocomplete.shadowRoot?.querySelector('.spinner');
      expect(spinner?.hidden).toBe(false);
    });

    it('should hide spinner when not loading', () => {
      autocomplete.loading = false;
      const spinner = autocomplete.shadowRoot?.querySelector('.spinner');
      expect(spinner?.hidden).toBe(true);
    });
  });

  describe('Clear Functionality', () => {
    it('should clear all state', () => {
      autocomplete.value = 'test';
      autocomplete.clear();

      expect(autocomplete.value).toBe('');
      const input = autocomplete.shadowRoot?.querySelector('input');
      expect(input?.value).toBe('');
    });

    it('should clear multiple selections', () => {
      autocomplete.multiple = true;
      autocomplete.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Option 2</brand-autocomplete-option>
      `;

      const options = Array.from(autocomplete.querySelectorAll('brand-autocomplete-option'));
      (options[0] as HTMLElement).click();
      (options[1] as HTMLElement).click();

      autocomplete.clear();

      expect(autocomplete.value).toEqual([]);
    });
  });
});
