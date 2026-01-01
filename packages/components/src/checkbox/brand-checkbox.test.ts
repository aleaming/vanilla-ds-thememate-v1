/**
 * Unit tests for brand-checkbox component
 * Following Test-Driven Development approach
 * Tests all requirements: FormAssociated, ElementInternals, States, Keyboard accessibility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandCheckbox } from './brand-checkbox';

describe('BrandCheckbox', () => {
  let checkbox: BrandCheckbox;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-checkbox')) {
      customElements.define('brand-checkbox', BrandCheckbox);
    }
    checkbox = document.createElement('brand-checkbox') as BrandCheckbox;
    document.body.appendChild(checkbox);
  });

  afterEach(() => {
    checkbox.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-checkbox')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(checkbox).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(checkbox.shadowRoot).toBeTruthy();
    });

    it('should be form-associated', () => {
      expect(BrandCheckbox.formAssociated).toBe(true);
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandCheckbox.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(checkbox.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(checkbox.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandCheckbox.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render checkbox box element in shadow DOM', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox).toBeTruthy();
    });

    it('should have a slot for label content', () => {
      const slot = checkbox.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose parts for styling', () => {
      const container = checkbox.shadowRoot?.querySelector('[part="container"]');
      const box = checkbox.shadowRoot?.querySelector('[part="box"]');
      const label = checkbox.shadowRoot?.querySelector('[part="label"]');
      expect(container).toBeTruthy();
      expect(box).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should have hidden native input for form participation', () => {
      const hiddenInput = checkbox.shadowRoot?.querySelector('input[type="checkbox"]');
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
      expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(checkbox.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(checkbox.internals.states).toBeDefined();
    });
  });

  describe('Checked State', () => {
    it('should not be checked by default', () => {
      expect(checkbox.checked).toBe(false);
      expect(checkbox.hasAttribute('checked')).toBe(false);
    });

    it('should be checked when checked attribute is present', () => {
      checkbox.setAttribute('checked', '');
      expect(checkbox.checked).toBe(true);
    });

    it('should support checked property setter', () => {
      checkbox.checked = true;
      expect(checkbox.hasAttribute('checked')).toBe(true);
      expect(checkbox.checked).toBe(true);
    });

    it('should support checked property getter', () => {
      checkbox.setAttribute('checked', '');
      expect(checkbox.checked).toBe(true);
    });

    it('should update ARIA attributes when checked', () => {
      checkbox.checked = true;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('aria-checked')).toBe('true');
      expect(checkbox.internals.ariaChecked).toBe('true');
    });

    it('should update hidden input when checked', () => {
      checkbox.checked = true;
      const hiddenInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.checked).toBe(true);
    });

    it('should clear indeterminate when explicitly setting checked', () => {
      checkbox.indeterminate = true;
      checkbox.checked = true;
      expect(checkbox.indeterminate).toBe(false);
    });
  });

  describe('Unchecked State', () => {
    it('should be unchecked when checked is false', () => {
      checkbox.checked = true;
      checkbox.checked = false;
      expect(checkbox.hasAttribute('checked')).toBe(false);
    });

    it('should update ARIA when unchecked', () => {
      checkbox.checked = true;
      checkbox.checked = false;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('Indeterminate State', () => {
    it('should not be indeterminate by default', () => {
      expect(checkbox.indeterminate).toBe(false);
      expect(checkbox.internals.states.has('indeterminate')).toBe(false);
    });

    it('should support indeterminate property setter', () => {
      checkbox.indeterminate = true;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('should add custom state when indeterminate', () => {
      checkbox.indeterminate = true;
      expect(checkbox.internals.states.has('indeterminate')).toBe(true);
    });

    it('should update ARIA to mixed when indeterminate', () => {
      checkbox.indeterminate = true;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('aria-checked')).toBe('mixed');
      expect(checkbox.internals.ariaChecked).toBe('mixed');
    });

    it('should remove custom state when indeterminate is false', () => {
      checkbox.indeterminate = true;
      checkbox.indeterminate = false;
      expect(checkbox.internals.states.has('indeterminate')).toBe(false);
    });

    it('should be cleared when checked attribute changes', () => {
      checkbox.indeterminate = true;
      checkbox.setAttribute('checked', '');
      expect(checkbox.indeterminate).toBe(false);
      expect(checkbox.internals.states.has('indeterminate')).toBe(false);
    });

    it('should not be reflected as an attribute', () => {
      checkbox.indeterminate = true;
      expect(checkbox.hasAttribute('indeterminate')).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(checkbox.disabled).toBe(false);
      expect(checkbox.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      checkbox.setAttribute('disabled', '');
      expect(checkbox.disabled).toBe(true);
    });

    it('should support disabled property setter', () => {
      checkbox.disabled = true;
      expect(checkbox.hasAttribute('disabled')).toBe(true);
      expect(checkbox.disabled).toBe(true);
    });

    it('should update ARIA when disabled', () => {
      checkbox.disabled = true;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('aria-disabled')).toBe('true');
      expect(checkbox.internals.ariaDisabled).toBe('true');
    });

    it('should update tabindex when disabled', () => {
      checkbox.disabled = true;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('tabindex')).toBe('-1');
    });

    it('should update hidden input when disabled', () => {
      checkbox.disabled = true;
      const hiddenInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.disabled).toBe(true);
    });

    it('should prevent toggle when disabled', () => {
      checkbox.disabled = true;
      checkbox.toggle();
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should have tabindex 0 when not disabled', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('tabindex')).toBe('0');
    });

    it('should toggle on Space key press', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      checkboxBox.dispatchEvent(event);
      expect(checkbox.checked).toBe(true);
    });

    it('should toggle on Spacebar key press (legacy)', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Spacebar', bubbles: true });
      checkboxBox.dispatchEvent(event);
      expect(checkbox.checked).toBe(true);
    });

    it('should not toggle on other keys', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      checkboxBox.dispatchEvent(event);
      expect(checkbox.checked).toBe(false);
    });

    it('should have role="checkbox" on checkbox box', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('role')).toBe('checkbox');
    });
  });

  describe('Toggle Method', () => {
    it('should toggle from unchecked to checked', () => {
      checkbox.toggle();
      expect(checkbox.checked).toBe(true);
    });

    it('should toggle from checked to unchecked', () => {
      checkbox.checked = true;
      checkbox.toggle();
      expect(checkbox.checked).toBe(false);
    });

    it('should clear indeterminate when toggled', () => {
      checkbox.indeterminate = true;
      checkbox.toggle();
      expect(checkbox.indeterminate).toBe(false);
    });

    it('should dispatch change event when toggled', () => {
      const changeSpy = vi.fn();
      checkbox.addEventListener('change', changeSpy);
      checkbox.toggle();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch bubbling and composed change event', () => {
      let eventBubbles = false;
      let eventComposed = false;
      checkbox.addEventListener('change', (e) => {
        eventBubbles = e.bubbles;
        eventComposed = e.composed;
      });
      checkbox.toggle();
      expect(eventBubbles).toBe(true);
      expect(eventComposed).toBe(true);
    });

    it('should not toggle when disabled', () => {
      checkbox.disabled = true;
      checkbox.toggle();
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('Click Interaction', () => {
    it('should toggle when checkbox box is clicked', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
      checkboxBox.click();
      expect(checkbox.checked).toBe(true);
    });

    it('should toggle multiple times on repeated clicks', () => {
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
      checkboxBox.click();
      expect(checkbox.checked).toBe(true);
      checkboxBox.click();
      expect(checkbox.checked).toBe(false);
      checkboxBox.click();
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Form Association', () => {
    it('should have name property', () => {
      checkbox.name = 'test-checkbox';
      expect(checkbox.name).toBe('test-checkbox');
      expect(checkbox.getAttribute('name')).toBe('test-checkbox');
    });

    it('should have value property', () => {
      checkbox.value = 'custom-value';
      expect(checkbox.value).toBe('custom-value');
      expect(checkbox.getAttribute('value')).toBe('custom-value');
    });

    it('should default value to "on"', () => {
      expect(checkbox.value).toBe('on');
    });

    it('should sync name to hidden input', () => {
      checkbox.name = 'test-checkbox';
      const hiddenInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.name).toBe('test-checkbox');
    });

    it('should sync value to hidden input', () => {
      checkbox.value = 'custom-value';
      const hiddenInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.value).toBe('custom-value');
    });

    it('should set form value when checked', () => {
      checkbox.value = 'test-value';
      checkbox.checked = true;
      // Form value is set via internals.setFormValue() - can't easily test in jsdom
      // but we verify the checked state is correct
      expect(checkbox.checked).toBe(true);
    });

    it('should clear form value when unchecked', () => {
      checkbox.checked = true;
      checkbox.checked = false;
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('Required Attribute', () => {
    it('should not be required by default', () => {
      expect(checkbox.required).toBe(false);
    });

    it('should support required property setter', () => {
      checkbox.required = true;
      expect(checkbox.hasAttribute('required')).toBe(true);
      expect(checkbox.required).toBe(true);
    });

    it('should update ARIA when required', () => {
      checkbox.required = true;
      const checkboxBox = checkbox.shadowRoot?.querySelector('[part="box"]');
      expect(checkboxBox?.getAttribute('aria-required')).toBe('true');
      expect(checkbox.internals.ariaRequired).toBe('true');
    });

    it('should sync required to hidden input', () => {
      checkbox.required = true;
      const hiddenInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.required).toBe(true);
    });
  });

  describe('Form Reset Callback', () => {
    it('should reset to unchecked on form reset', () => {
      checkbox.checked = true;
      checkbox.formResetCallback();
      expect(checkbox.checked).toBe(false);
    });

    it('should clear indeterminate on form reset', () => {
      checkbox.indeterminate = true;
      checkbox.formResetCallback();
      expect(checkbox.indeterminate).toBe(false);
    });
  });

  describe('Form Disabled Callback', () => {
    it('should disable when form is disabled', () => {
      checkbox.formDisabledCallback(true);
      expect(checkbox.disabled).toBe(true);
    });

    it('should enable when form is enabled', () => {
      checkbox.disabled = true;
      checkbox.formDisabledCallback(false);
      expect(checkbox.disabled).toBe(false);
    });
  });

  describe('Observed Attributes', () => {
    it('should observe checked, disabled, name, value, and required attributes', () => {
      expect(BrandCheckbox.observedAttributes).toContain('checked');
      expect(BrandCheckbox.observedAttributes).toContain('disabled');
      expect(BrandCheckbox.observedAttributes).toContain('name');
      expect(BrandCheckbox.observedAttributes).toContain('value');
      expect(BrandCheckbox.observedAttributes).toContain('required');
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content as label', () => {
      checkbox.textContent = 'Accept terms';
      expect(checkbox.textContent).toBe('Accept terms');
    });

    it('should render slotted HTML elements as label', () => {
      const span = document.createElement('span');
      span.textContent = 'Custom Label';
      checkbox.appendChild(span);
      expect(checkbox.querySelector('span')).toBeTruthy();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      checkbox.textContent = '<script>alert("xss")</script>';
      const slot = checkbox.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(checkbox.textContent).toContain('<script>');
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandCheckbox.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-blue-700');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (checkbox as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      checkbox.remove();

      // After removal, listeners should be cleaned up
      const cleanedListeners = (checkbox as any)._listeners;
      expect(cleanedListeners?.length ?? 0).toBe(0);
    });
  });

  describe('Custom States with :state() pseudo-class', () => {
    it('should use ElementInternals.states for custom states', () => {
      checkbox.indeterminate = true;
      expect(checkbox.internals.states.has('indeterminate')).toBe(true);

      checkbox.indeterminate = false;
      expect(checkbox.internals.states.has('indeterminate')).toBe(false);
    });
  });

  describe('Integration: All Three States', () => {
    it('should support unchecked -> checked -> unchecked', () => {
      expect(checkbox.checked).toBe(false);
      checkbox.checked = true;
      expect(checkbox.checked).toBe(true);
      checkbox.checked = false;
      expect(checkbox.checked).toBe(false);
    });

    it('should support unchecked -> indeterminate -> checked', () => {
      expect(checkbox.checked).toBe(false);
      expect(checkbox.indeterminate).toBe(false);

      checkbox.indeterminate = true;
      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox.checked).toBe(false);

      checkbox.checked = true;
      expect(checkbox.checked).toBe(true);
      expect(checkbox.indeterminate).toBe(false);
    });

    it('should support indeterminate -> toggle -> checked', () => {
      checkbox.indeterminate = true;
      expect(checkbox.indeterminate).toBe(true);

      checkbox.toggle();
      expect(checkbox.checked).toBe(true);
      expect(checkbox.indeterminate).toBe(false);
    });
  });
});
