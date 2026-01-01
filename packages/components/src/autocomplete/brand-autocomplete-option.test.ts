/**
 * @file brand-autocomplete-option.test.ts
 * @description Tests for brand-autocomplete-option component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './brand-autocomplete-option';

describe('brand-autocomplete-option', () => {
  let option: any;

  beforeEach(() => {
    option = document.createElement('brand-autocomplete-option');
    option.textContent = 'Test Option';
    document.body.appendChild(option);
  });

  afterEach(() => {
    document.body.removeChild(option);
  });

  describe('Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('brand-autocomplete-option')).toBeDefined();
    });

    it('should render shadow DOM', () => {
      expect(option.shadowRoot).toBeTruthy();
    });

    it('should have option role', () => {
      const optionEl = option.shadowRoot?.querySelector('.option');
      expect(optionEl?.getAttribute('role')).toBe('option');
    });
  });

  describe('Initial State', () => {
    it('should have auto-generated ID if not provided', () => {
      expect(option.id).toBeTruthy();
      expect(option.id).toMatch(/^option-/);
    });

    it('should preserve explicit ID', () => {
      const customOption = document.createElement('brand-autocomplete-option');
      customOption.id = 'custom-id';
      document.body.appendChild(customOption);

      expect(customOption.id).toBe('custom-id');

      document.body.removeChild(customOption);
    });

    it('should have aria-selected="false" initially', () => {
      const optionEl = option.shadowRoot?.querySelector('.option');
      expect(optionEl?.getAttribute('aria-selected')).toBe('false');
    });

    it('should not be selected initially', () => {
      expect(option.selected).toBe(false);
    });

    it('should not be active initially', () => {
      expect(option.active).toBe(false);
    });

    it('should not be disabled initially', () => {
      expect(option.disabled).toBe(false);
    });
  });

  describe('Attributes', () => {
    it('should reflect value attribute', () => {
      option.setAttribute('value', 'test-value');
      expect(option.value).toBe('test-value');
    });

    it('should use text content as value if no value attribute', () => {
      expect(option.value).toBe('Test Option');
    });

    it('should reflect selected attribute', () => {
      option.setAttribute('selected', '');
      expect(option.selected).toBe(true);
    });

    it('should reflect active attribute', () => {
      option.setAttribute('active', '');
      expect(option.active).toBe(true);
    });

    it('should reflect disabled attribute', () => {
      option.setAttribute('disabled', '');
      expect(option.disabled).toBe(true);
    });
  });

  describe('Properties', () => {
    it('should get/set value', () => {
      option.value = 'new-value';
      expect(option.getAttribute('value')).toBe('new-value');
    });

    it('should get/set selected', () => {
      option.selected = true;
      expect(option.hasAttribute('selected')).toBe(true);
      expect(option.selected).toBe(true);

      option.selected = false;
      expect(option.hasAttribute('selected')).toBe(false);
      expect(option.selected).toBe(false);
    });

    it('should get/set active', () => {
      option.active = true;
      expect(option.hasAttribute('active')).toBe(true);

      option.active = false;
      expect(option.hasAttribute('active')).toBe(false);
    });

    it('should get/set disabled', () => {
      option.disabled = true;
      expect(option.hasAttribute('disabled')).toBe(true);

      option.disabled = false;
      expect(option.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Selection', () => {
    it('should dispatch option-select event on click', () => {
      const selectSpy = vi.fn();
      option.addEventListener('option-select', selectSpy);

      const optionEl = option.shadowRoot?.querySelector('.option');
      optionEl.click();

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy.mock.calls[0][0].detail).toEqual({
        optionId: option.id,
        value: option.value,
        text: 'Test Option'
      });
    });

    it('should not dispatch event when disabled', () => {
      const selectSpy = vi.fn();
      option.addEventListener('option-select', selectSpy);
      option.disabled = true;

      option.select();

      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('should have select() method', () => {
      const selectSpy = vi.fn();
      option.addEventListener('option-select', selectSpy);

      option.select();

      expect(selectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Text Highlighting', () => {
    it('should highlight matching text', () => {
      option.highlightText('test');
      const optionEl = option.shadowRoot?.querySelector('.option');

      expect(optionEl?.innerHTML).toContain('<mark');
      expect(optionEl?.innerHTML).toContain('Test');
    });

    it('should be case-insensitive', () => {
      option.textContent = 'Test Option';
      option.highlightText('test');
      const optionEl = option.shadowRoot?.querySelector('.option');

      expect(optionEl?.innerHTML).toContain('<mark');
    });

    it('should clear highlight', () => {
      option.highlightText('test');
      option.clearHighlight();
      const optionEl = option.shadowRoot?.querySelector('.option');

      expect(optionEl?.innerHTML).not.toContain('<mark');
      expect(optionEl?.textContent).toBe('Test Option');
    });

    it('should not highlight if no match', () => {
      option.highlightText('xyz');
      const optionEl = option.shadowRoot?.querySelector('.option');

      expect(optionEl?.innerHTML).not.toContain('<mark');
    });

    it('should preserve original text after highlighting', () => {
      const originalText = option.textContent;
      option.highlightText('test');
      option.clearHighlight();

      const optionEl = option.shadowRoot?.querySelector('.option');
      expect(optionEl?.textContent).toBe(originalText);
    });
  });

  describe('ARIA Attributes', () => {
    it('should update aria-selected when selected changes', () => {
      const optionEl = option.shadowRoot?.querySelector('.option');

      option.selected = true;
      expect(optionEl?.getAttribute('aria-selected')).toBe('true');

      option.selected = false;
      expect(optionEl?.getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria-disabled when disabled', () => {
      const optionEl = option.shadowRoot?.querySelector('.option');

      option.disabled = true;
      expect(optionEl?.getAttribute('aria-disabled')).toBe('true');

      option.disabled = false;
      expect(optionEl?.hasAttribute('aria-disabled')).toBe(false);
    });
  });

  describe('Mouse Interaction', () => {
    it('should dispatch option-hover event on mouseenter', () => {
      const hoverSpy = vi.fn();
      option.addEventListener('option-hover', hoverSpy);

      const optionEl = option.shadowRoot?.querySelector('.option');
      optionEl.dispatchEvent(new Event('mouseenter'));

      expect(hoverSpy).toHaveBeenCalledTimes(1);
      expect(hoverSpy.mock.calls[0][0].detail.optionId).toBe(option.id);
    });

    it('should not dispatch hover event when disabled', () => {
      const hoverSpy = vi.fn();
      option.addEventListener('option-hover', hoverSpy);
      option.disabled = true;

      const optionEl = option.shadowRoot?.querySelector('.option');
      optionEl.dispatchEvent(new Event('mouseenter'));

      expect(hoverSpy).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply active styling', () => {
      option.active = true;
      expect(option.hasAttribute('active')).toBe(true);
    });

    it('should apply selected styling', () => {
      option.selected = true;
      expect(option.hasAttribute('selected')).toBe(true);
    });

    it('should apply disabled styling', () => {
      option.disabled = true;
      expect(option.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('CSS Parts', () => {
    it('should expose option part', () => {
      const optionEl = option.shadowRoot?.querySelector('[part="option"]');
      expect(optionEl).toBeTruthy();
    });
  });
});
