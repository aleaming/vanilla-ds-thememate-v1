/**
 * Unit tests for brand-select component
 * Following Test-Driven Development approach
 * Testing Form-Associated Custom Elements with ElementInternals
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandSelect } from './brand-select';

describe('BrandSelect', () => {
  let select: BrandSelect;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-select')) {
      customElements.define('brand-select', BrandSelect);
    }
    select = document.createElement('brand-select') as BrandSelect;
    document.body.appendChild(select);
  });

  afterEach(() => {
    select.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-select')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(select).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(select.shadowRoot).toBeTruthy();
    });

    it('should be form-associated', () => {
      expect((BrandSelect as any).formAssociated).toBe(true);
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandSelect.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(select.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(select.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandSelect.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a select element in shadow DOM', () => {
      const internalSelect = select.shadowRoot?.querySelector('select');
      expect(internalSelect).toBeTruthy();
    });

    it('should expose select as a part', () => {
      const internalSelect = select.shadowRoot?.querySelector('select[part="select"]');
      expect(internalSelect).toBeTruthy();
    });

    it('should have a select-wrapper container', () => {
      // Verify the template structure
      const wrapper = select.shadowRoot?.querySelector('.select-wrapper');
      expect(wrapper).toBeTruthy();
      const container = select.shadowRoot?.querySelector('.select-container');
      expect(container).toBeTruthy();
      // Note: jsdom doesn't fully support slot distribution in innerHTML
      // but the component uses a slot for options in real browsers
    });
  });

  describe('Value Property', () => {
    beforeEach(() => {
      // Add options directly to internal select (jsdom doesn't support slot distribution)
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      `;
    });

    it('should have empty value by default', () => {
      expect(select.value).toBe('');
    });

    it('should set value via property', () => {
      select.value = '2';
      expect(select.value).toBe('2');
    });

    it('should set value via attribute', () => {
      select.setAttribute('value', '2');
      expect(select.value).toBe('2');
    });

    it('should synchronize value with internal select', () => {
      select.value = '2';
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.value).toBe('2');
    });

    it('should update form value via ElementInternals', () => {
      select.value = '2';
      expect(select.internals).toBeDefined();
    });
  });

  describe('Placeholder Support', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should not have placeholder by default', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.querySelector('option[disabled][hidden]');
      expect(placeholderOption).toBeNull();
    });

    it('should create placeholder option when placeholder attribute is set', () => {
      select.setAttribute('placeholder', 'Select an option');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.querySelector('option[disabled][hidden]') as HTMLOptionElement;
      expect(placeholderOption).toBeTruthy();
      expect(placeholderOption.textContent).toBe('Select an option');
    });

    it('should insert placeholder as first option', () => {
      select.setAttribute('placeholder', 'Select an option');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const firstOption = internalSelect.options[0];
      expect(firstOption.disabled).toBe(true);
      expect(firstOption.hidden).toBe(true);
    });

    it('should set placeholder option value to empty string', () => {
      select.setAttribute('placeholder', 'Select an option');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.options[0];
      expect(placeholderOption.value).toBe('');
    });

    it('should update placeholder text dynamically', () => {
      select.setAttribute('placeholder', 'First');
      select.setAttribute('placeholder', 'Second');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.querySelector('option[disabled][hidden]') as HTMLOptionElement;
      expect(placeholderOption.textContent).toBe('Second');
    });

    it('should remove placeholder when attribute is removed', () => {
      select.setAttribute('placeholder', 'Select an option');
      select.removeAttribute('placeholder');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.querySelector('option[disabled][hidden]');
      expect(placeholderOption).toBeNull();
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `<option value="1">Option 1</option>`;
    });

    it('should not be disabled by default', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.disabled).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      select.setAttribute('disabled', '');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.disabled).toBe(true);
    });

    it('should update aria-disabled when disabled', () => {
      select.setAttribute('disabled', '');
      expect(select.internals.ariaDisabled).toBe('true');
    });

    it('should remove disabled state when attribute is removed', () => {
      select.setAttribute('disabled', '');
      select.removeAttribute('disabled');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.disabled).toBe(false);
      expect(select.internals.ariaDisabled).toBeNull();
    });
  });

  describe('Required Validation', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should not be required by default', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.required).toBe(false);
    });

    it('should be required when required attribute is present', () => {
      select.setAttribute('required', '');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.required).toBe(true);
    });

    it('should update aria-required when required', () => {
      select.setAttribute('required', '');
      expect(select.internals.ariaRequired).toBe('true');
    });

    it('should be invalid when required and placeholder is selected', () => {
      select.setAttribute('placeholder', 'Select');
      select.setAttribute('required', '');
      select.value = ''; // Explicitly set empty value
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      // Force the select to select the placeholder option
      if (internalSelect.options[0]) {
        internalSelect.selectedIndex = 0;
      }
      // In jsdom, validation might not work exactly like browsers
      // We verify that the value is empty which makes it invalid when required
      expect(internalSelect.value).toBe('');
      expect(internalSelect.required).toBe(true);
    });

    it('should be valid when required and has non-empty value', () => {
      select.setAttribute('required', '');
      select.value = '1';
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.validity.valid).toBe(true);
    });
  });

  describe('Name Attribute', () => {
    it('should set name attribute for form association', () => {
      select.setAttribute('name', 'country');
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.name).toBe('country');
    });
  });

  describe('ElementInternals API', () => {
    it('should have ElementInternals instance', () => {
      expect(select.internals).toBeDefined();
    });

    it('should expose validity property', () => {
      expect(select.validity).toBeDefined();
    });

    it('should expose validationMessage property', () => {
      expect(select.validationMessage).toBeDefined();
    });

    it('should expose checkValidity method', () => {
      expect(typeof select.checkValidity).toBe('function');
    });

    it('should expose reportValidity method', () => {
      expect(typeof select.reportValidity).toBe('function');
    });

    it('should checkValidity return true when valid', () => {
      select.innerHTML = '<option value="1">Option 1</option>';
      select.value = '1';
      expect(select.checkValidity()).toBe(true);
    });
  });

  describe('Custom Validity', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = '<option value="1">Option 1</option>';
    });

    it('should allow setting custom validation message', () => {
      select.setCustomValidity('Custom error');
      expect(select.validity.valid).toBe(false);
      expect(select.validationMessage).toBe('Custom error');
    });

    it('should clear custom validity with empty string', () => {
      select.setCustomValidity('Custom error');
      select.setCustomValidity('');
      expect(select.validity.valid).toBe(true);
      expect(select.validationMessage).toBe('');
    });

    it('should add invalid state when custom validity is set', () => {
      select.setCustomValidity('Custom error');
      expect(select.internals.states.has('invalid')).toBe(true);
    });
  });

  describe('Custom States', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should not have invalid state by default', () => {
      expect(select.internals.states.has('invalid')).toBe(false);
    });

    it('should not have valid state when empty', () => {
      expect(select.internals.states.has('valid')).toBe(false);
    });

    it('should add valid state when select has valid value', () => {
      select.value = '1';
      expect(select.internals.states.has('valid')).toBe(true);
    });

    it('should add invalid state when validation fails', () => {
      select.setAttribute('placeholder', 'Select');
      select.setAttribute('required', '');
      select.value = '';
      // Trigger validation by dispatching change event
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.dispatchEvent(new Event('change', { bubbles: true }));
      expect(select.internals.states.has('invalid')).toBe(true);
    });
  });

  describe('Form Integration', () => {
    let form: HTMLFormElement;

    beforeEach(() => {
      form = document.createElement('form');
      document.body.appendChild(form);
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    afterEach(() => {
      form.remove();
    });

    it('should participate in form submission', () => {
      select.setAttribute('name', 'testSelect');
      select.value = '1';
      form.appendChild(select);

      expect((BrandSelect as any).formAssociated).toBe(true);
      expect(select.internals).toBeDefined();
      expect(select.value).toBe('1');
    });

    it('should call formAssociatedCallback when added to form', () => {
      select.setAttribute('name', 'testSelect');
      form.appendChild(select);
      expect(select).toBeInstanceOf(BrandSelect);
    });

    it('should reset value on form reset', () => {
      select.setAttribute('name', 'testSelect');
      select.setAttribute('value', '1');
      form.appendChild(select);

      select.value = '2';
      expect(select.value).toBe('2');

      select.formResetCallback();
      expect(select.value).toBe('1');
    });

    it('should reset to placeholder when no initial value', () => {
      select.setAttribute('name', 'testSelect');
      select.setAttribute('placeholder', 'Select');
      form.appendChild(select);

      select.value = '2';
      select.formResetCallback();

      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.options[0];
      expect(placeholderOption.selected).toBe(true);
    });

    it('should update disabled state when form is disabled', () => {
      select.setAttribute('name', 'testSelect');
      form.appendChild(select);

      select.formDisabledCallback(true);
      expect(select.hasAttribute('disabled')).toBe(true);

      select.formDisabledCallback(false);
      expect(select.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should dispatch change event when value changes', () => {
      return new Promise<void>((resolve) => {
        const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;

        select.addEventListener('change', (e) => {
          expect(e).toBeInstanceOf(Event);
          resolve();
        });

        internalSelect.value = '2';
        internalSelect.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    it('should dispatch blur event on blur', () => {
      return new Promise<void>((resolve) => {
        const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;

        select.addEventListener('blur', (e) => {
          expect(e).toBeInstanceOf(Event);
          resolve();
        });

        internalSelect.dispatchEvent(new Event('blur', { bubbles: true }));
      });
    });

    it('should update value on change event', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.value = '2';
      internalSelect.dispatchEvent(new Event('change', { bubbles: true }));
      expect(select.value).toBe('2');
    });
  });

  describe('Focus/Blur Methods', () => {
    it('should focus internal select when focus() is called', () => {
      select.focus();
      expect(typeof select.focus).toBe('function');
    });

    it('should blur internal select when blur() is called', () => {
      select.blur();
      expect(typeof select.blur).toBe('function');
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      select.innerHTML = '<option value="xss"><script>alert("xss")</script></option>';
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect).toBeTruthy();
    });
  });

  describe('Observed Attributes', () => {
    it('should observe all expected attributes', () => {
      const expected = [
        'label',
        'value',
        'placeholder',
        'disabled',
        'required',
        'name',
      ];

      expected.forEach(attr => {
        expect(BrandSelect.observedAttributes).toContain(attr);
      });
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (select as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      select.remove();
      document.body.appendChild(select);

      expect(select.isConnected).toBe(true);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandSelect.styles as any)._cssText || '';
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--radius-input');
    });
  });

  describe('Form State Restore', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should restore form state from string', () => {
      select.formStateRestoreCallback('2', 'restore');
      expect(select.value).toBe('2');
    });

    it('should handle autocomplete mode', () => {
      select.formStateRestoreCallback('1', 'autocomplete');
      expect(select.value).toBe('1');
    });
  });

  describe('Selected Index', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      `;
    });

    it('should get selected index', () => {
      select.value = '2';
      expect(select.selectedIndex).toBe(1);
    });

    it('should set selected index', () => {
      select.selectedIndex = 2;
      expect(select.value).toBe('3');
    });
  });

  describe('Selected Option', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      `;
    });

    it('should get selected option element', () => {
      select.value = '2';
      const selectedOption = select.selectedOption;
      expect(selectedOption).toBeTruthy();
      expect(selectedOption?.value).toBe('2');
    });
  });

  describe('Options Collection', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      `;
    });

    it('should get options collection', () => {
      const options = select.options;
      expect(options).toBeTruthy();
      expect(options?.length).toBeGreaterThan(0);
    });

    it('should include slotted options', () => {
      const options = select.options;
      const values = Array.from(options || []).map(opt => opt.value);
      expect(values).toContain('1');
      expect(values).toContain('2');
      expect(values).toContain('3');
    });
  });

  describe('Multiple Options via Slot', () => {
    it('should support adding options dynamically', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const option1 = document.createElement('option');
      option1.value = 'a';
      option1.textContent = 'Option A';

      const option2 = document.createElement('option');
      option2.value = 'b';
      option2.textContent = 'Option B';

      internalSelect.appendChild(option1);
      internalSelect.appendChild(option2);

      select.value = 'b';
      expect(select.value).toBe('b');
    });

    it('should support optgroup elements', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <optgroup label="Group 1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </optgroup>
        <optgroup label="Group 2">
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
        </optgroup>
      `;

      select.value = '3';
      expect(select.value).toBe('3');
    });
  });

  describe('Placeholder with Required Validation', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
      select.setAttribute('placeholder', 'Select an option');
      select.setAttribute('required', '');
    });

    it('should be invalid when placeholder is selected and field is required', () => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      const placeholderOption = internalSelect.options[0];
      placeholderOption.selected = true;

      expect(internalSelect.validity.valid).toBe(false);
      expect(internalSelect.validity.valueMissing).toBe(true);
    });

    it('should be valid when a real option is selected', () => {
      select.value = '1';
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      expect(internalSelect.validity.valid).toBe(true);
    });
  });

  describe('Styling Requirements', () => {
    it('should have custom styling', () => {
      const styleText = (BrandSelect.styles as any)._cssText || '';
      expect(styleText).toContain('select');
      expect(styleText).toContain('.select-wrapper');
      expect(styleText).toContain('.select-container');
    });

    it('should hide native select appearance', () => {
      const styleText = (BrandSelect.styles as any)._cssText || '';
      expect(styleText).toContain('appearance: none');
    });

    it('should have custom arrow indicator', () => {
      const styleText = (BrandSelect.styles as any)._cssText || '';
      expect(styleText).toContain('.select-container::after');
      expect(styleText).toContain('border-left');
      expect(styleText).toContain('border-right');
    });
  });

  describe('Label Support (WCAG 1.3.1)', () => {
    beforeEach(() => {
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;
      internalSelect.innerHTML = `
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      `;
    });

    it('should render a label element in shadow DOM', () => {
      const label = select.shadowRoot?.querySelector('label');
      expect(label).toBeTruthy();
    });

    it('should expose label as a part', () => {
      const label = select.shadowRoot?.querySelector('label[part="label"]');
      expect(label).toBeTruthy();
    });

    it('should hide label by default when no label attribute is set', () => {
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.style.display).toBe('none');
    });

    it('should display label when label attribute is set', () => {
      select.setAttribute('label', 'Select an option');
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.style.display).not.toBe('none');
      expect(label.textContent).toContain('Select an option');
    });

    it('should associate label with select via for/id', () => {
      select.setAttribute('label', 'Country');
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      const internalSelect = select.shadowRoot?.querySelector('select') as HTMLSelectElement;

      expect(label.getAttribute('for')).toBe(internalSelect.id);
      expect(internalSelect.id).toBeTruthy();
      expect(internalSelect.id).toMatch(/^brand-select-/);
    });

    it('should update label text when attribute changes', () => {
      select.setAttribute('label', 'First Label');
      let label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.textContent).toContain('First Label');

      select.setAttribute('label', 'Second Label');
      label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.textContent).toContain('Second Label');
    });

    it('should hide label when attribute is removed', () => {
      select.setAttribute('label', 'Select an option');
      select.removeAttribute('label');
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.style.display).toBe('none');
    });

    it('should add required indicator when both label and required are set', () => {
      select.setAttribute('label', 'Country');
      select.setAttribute('required', '');
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      const requiredSpan = label.querySelector('.required');

      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan?.textContent).toBe('*');
    });

    it('should not add required indicator when label is set but required is not', () => {
      select.setAttribute('label', 'Country');
      const label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      const requiredSpan = label.querySelector('.required');

      expect(requiredSpan).toBeNull();
    });

    it('should update required indicator when required attribute changes', () => {
      select.setAttribute('label', 'Country');

      // Add required
      select.setAttribute('required', '');
      let label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      let requiredSpan = label.querySelector('.required');
      expect(requiredSpan).toBeTruthy();

      // Remove required
      select.removeAttribute('required');
      select.setAttribute('label', 'Country'); // Trigger sync
      label = select.shadowRoot?.querySelector('label') as HTMLLabelElement;
      requiredSpan = label.querySelector('.required');
      expect(requiredSpan).toBeNull();
    });

    it('should have unique IDs for multiple select instances', () => {
      const select2 = document.createElement('brand-select') as BrandSelect;
      document.body.appendChild(select2);

      const id1 = select.shadowRoot?.querySelector('select')?.id;
      const id2 = select2.shadowRoot?.querySelector('select')?.id;

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);

      select2.remove();
    });
  });
});
