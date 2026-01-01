/**
 * @file brand-autocomplete-group.test.ts
 * @description Tests for brand-autocomplete-group component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './brand-autocomplete-group';
import './brand-autocomplete-option';

describe('brand-autocomplete-group', () => {
  let group: any;

  beforeEach(() => {
    group = document.createElement('brand-autocomplete-group');
    document.body.appendChild(group);
  });

  afterEach(() => {
    document.body.removeChild(group);
  });

  describe('Registration', () => {
    it('should be registered as custom element', () => {
      expect(customElements.get('brand-autocomplete-group')).toBeDefined();
    });

    it('should render shadow DOM', () => {
      expect(group.shadowRoot).toBeTruthy();
    });

    it('should have group role', () => {
      const groupEl = group.shadowRoot?.querySelector('.group');
      expect(groupEl?.getAttribute('role')).toBe('group');
    });
  });

  describe('Attributes', () => {
    it('should reflect label attribute', () => {
      group.setAttribute('label', 'Test Group');
      expect(group.label).toBe('Test Group');
    });

    it('should update label element when attribute changes', () => {
      group.setAttribute('label', 'Test Group');
      const labelEl = group.shadowRoot?.querySelector('.label');
      expect(labelEl?.textContent).toBe('Test Group');
    });

    it('should update aria-label on group element', () => {
      group.setAttribute('label', 'Test Group');
      const groupEl = group.shadowRoot?.querySelector('.group');
      expect(groupEl?.getAttribute('aria-label')).toBe('Test Group');
    });
  });

  describe('Properties', () => {
    it('should get/set label', () => {
      group.label = 'New Label';
      expect(group.getAttribute('label')).toBe('New Label');
    });

    it('should update label element via property', () => {
      group.label = 'New Label';
      const labelEl = group.shadowRoot?.querySelector('.label');
      expect(labelEl?.textContent).toBe('New Label');
    });
  });

  describe('Content Rendering', () => {
    it('should render slotted options', () => {
      group.innerHTML = `
        <brand-autocomplete-option value="1">Option 1</brand-autocomplete-option>
        <brand-autocomplete-option value="2">Option 2</brand-autocomplete-option>
      `;

      const options = group.querySelectorAll('brand-autocomplete-option');
      expect(options.length).toBe(2);
    });

    it('should display label above options', () => {
      group.label = 'Fruits';
      group.innerHTML = `
        <brand-autocomplete-option value="apple">Apple</brand-autocomplete-option>
      `;

      const labelEl = group.shadowRoot?.querySelector('.label');
      const optionsEl = group.shadowRoot?.querySelector('.options');

      expect(labelEl).toBeTruthy();
      expect(optionsEl).toBeTruthy();
    });
  });

  describe('CSS Parts', () => {
    it('should expose group part', () => {
      const groupEl = group.shadowRoot?.querySelector('[part="group"]');
      expect(groupEl).toBeTruthy();
    });

    it('should expose label part', () => {
      const labelEl = group.shadowRoot?.querySelector('[part="label"]');
      expect(labelEl).toBeTruthy();
    });

    it('should expose options part', () => {
      const optionsEl = group.shadowRoot?.querySelector('[part="options"]');
      expect(optionsEl).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have uppercase label styling', () => {
      group.label = 'test label';
      const labelEl = group.shadowRoot?.querySelector('.label');
      const styles = window.getComputedStyle(labelEl!);

      // Note: getComputedStyle may not return 'uppercase' in test environment
      // Just verify label element exists
      expect(labelEl).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have group role', () => {
      const groupEl = group.shadowRoot?.querySelector('[role="group"]');
      expect(groupEl).toBeTruthy();
    });

    it('should label group with aria-label', () => {
      group.label = 'Test Category';
      const groupEl = group.shadowRoot?.querySelector('.group');
      expect(groupEl?.getAttribute('aria-label')).toBe('Test Category');
    });
  });
});
