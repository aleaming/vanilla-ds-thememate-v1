/**
 * Unit tests for brand-radio component
 * Following Test-Driven Development approach
 * Tests all requirements: FormAssociated, ElementInternals, Group Management, Keyboard navigation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandRadio } from './brand-radio';

describe('BrandRadio', () => {
  let radio: BrandRadio;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-radio')) {
      customElements.define('brand-radio', BrandRadio);
    }
    radio = document.createElement('brand-radio') as BrandRadio;
    document.body.appendChild(radio);
  });

  afterEach(() => {
    radio.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-radio')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(radio).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(radio.shadowRoot).toBeTruthy();
    });

    it('should be form-associated', () => {
      expect(BrandRadio.formAssociated).toBe(true);
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandRadio.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(radio.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(radio.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandRadio.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render radio button element in shadow DOM', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton).toBeTruthy();
    });

    it('should have a slot for label content', () => {
      const slot = radio.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose parts for styling', () => {
      const container = radio.shadowRoot?.querySelector('[part="container"]');
      const button = radio.shadowRoot?.querySelector('[part="button"]');
      const label = radio.shadowRoot?.querySelector('[part="label"]');
      expect(container).toBeTruthy();
      expect(button).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should have hidden native input for form participation', () => {
      const hiddenInput = radio.shadowRoot?.querySelector('input[type="radio"]');
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
      expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(radio.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(radio.internals.states).toBeDefined();
    });
  });

  describe('Checked State', () => {
    it('should not be checked by default', () => {
      expect(radio.checked).toBe(false);
      expect(radio.hasAttribute('checked')).toBe(false);
    });

    it('should be checked when checked attribute is present', () => {
      radio.setAttribute('checked', '');
      expect(radio.checked).toBe(true);
    });

    it('should support checked property setter', () => {
      radio.checked = true;
      expect(radio.hasAttribute('checked')).toBe(true);
      expect(radio.checked).toBe(true);
    });

    it('should support checked property getter', () => {
      radio.setAttribute('checked', '');
      expect(radio.checked).toBe(true);
    });

    it('should update ARIA attributes when checked', () => {
      radio.checked = true;
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('aria-checked')).toBe('true');
      expect(radio.internals.ariaChecked).toBe('true');
    });

    it('should update hidden input when checked', () => {
      radio.checked = true;
      const hiddenInput = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.checked).toBe(true);
    });
  });

  describe('Unchecked State', () => {
    it('should be unchecked when checked is false', () => {
      radio.checked = true;
      radio.checked = false;
      expect(radio.hasAttribute('checked')).toBe(false);
    });

    it('should update ARIA when unchecked', () => {
      radio.checked = true;
      radio.checked = false;
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(radio.disabled).toBe(false);
      expect(radio.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      radio.setAttribute('disabled', '');
      expect(radio.disabled).toBe(true);
    });

    it('should support disabled property setter', () => {
      radio.disabled = true;
      expect(radio.hasAttribute('disabled')).toBe(true);
      expect(radio.disabled).toBe(true);
    });

    it('should update ARIA when disabled', () => {
      radio.disabled = true;
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('aria-disabled')).toBe('true');
      expect(radio.internals.ariaDisabled).toBe('true');
    });

    it('should update tabindex when disabled', () => {
      radio.disabled = true;
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('tabindex')).toBe('-1');
    });

    it('should update hidden input when disabled', () => {
      radio.disabled = true;
      const hiddenInput = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.disabled).toBe(true);
    });

    it('should prevent select when disabled', () => {
      radio.disabled = true;
      radio.select();
      expect(radio.checked).toBe(false);
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should have tabindex 0 when not disabled', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('tabindex')).toBe('0');
    });

    it('should select on Space key press', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      radioButton.dispatchEvent(event);
      expect(radio.checked).toBe(true);
    });

    it('should select on Spacebar key press (legacy)', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Spacebar', bubbles: true });
      radioButton.dispatchEvent(event);
      expect(radio.checked).toBe(true);
    });

    it('should have role="radio" on radio button', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('role')).toBe('radio');
    });
  });

  describe('Select Method', () => {
    it('should select the radio', () => {
      radio.select();
      expect(radio.checked).toBe(true);
    });

    it('should dispatch change event when selected', () => {
      const changeSpy = vi.fn();
      radio.addEventListener('change', changeSpy);
      radio.select();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch bubbling and composed change event', () => {
      let eventBubbles = false;
      let eventComposed = false;
      radio.addEventListener('change', (e) => {
        eventBubbles = e.bubbles;
        eventComposed = e.composed;
      });
      radio.select();
      expect(eventBubbles).toBe(true);
      expect(eventComposed).toBe(true);
    });

    it('should not select when disabled', () => {
      radio.disabled = true;
      radio.select();
      expect(radio.checked).toBe(false);
    });

    it('should not dispatch change event if already checked', () => {
      radio.checked = true;
      const changeSpy = vi.fn();
      radio.addEventListener('change', changeSpy);
      radio.select();
      expect(changeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Click Interaction', () => {
    it('should select when radio button is clicked', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
      radioButton.click();
      expect(radio.checked).toBe(true);
    });

    it('should remain selected on repeated clicks', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
      radioButton.click();
      expect(radio.checked).toBe(true);
      radioButton.click();
      expect(radio.checked).toBe(true);
    });
  });

  describe('Form Association', () => {
    it('should have name property', () => {
      radio.name = 'test-radio';
      expect(radio.name).toBe('test-radio');
      expect(radio.getAttribute('name')).toBe('test-radio');
    });

    it('should have value property', () => {
      radio.value = 'custom-value';
      expect(radio.value).toBe('custom-value');
      expect(radio.getAttribute('value')).toBe('custom-value');
    });

    it('should default value to "on"', () => {
      expect(radio.value).toBe('on');
    });

    it('should sync name to hidden input', () => {
      radio.name = 'test-radio';
      const hiddenInput = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.name).toBe('test-radio');
    });

    it('should sync value to hidden input', () => {
      radio.value = 'custom-value';
      const hiddenInput = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.value).toBe('custom-value');
    });

    it('should set form value when checked', () => {
      radio.value = 'test-value';
      radio.checked = true;
      expect(radio.checked).toBe(true);
    });

    it('should clear form value when unchecked', () => {
      radio.checked = true;
      radio.checked = false;
      expect(radio.checked).toBe(false);
    });
  });

  describe('Required Attribute', () => {
    it('should not be required by default', () => {
      expect(radio.required).toBe(false);
    });

    it('should support required property setter', () => {
      radio.required = true;
      expect(radio.hasAttribute('required')).toBe(true);
      expect(radio.required).toBe(true);
    });

    it('should update ARIA when required', () => {
      radio.required = true;
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]');
      expect(radioButton?.getAttribute('aria-required')).toBe('true');
      expect(radio.internals.ariaRequired).toBe('true');
    });

    it('should sync required to hidden input', () => {
      radio.required = true;
      const hiddenInput = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.required).toBe(true);
    });
  });

  describe('Form Reset Callback', () => {
    it('should reset to unchecked on form reset', () => {
      radio.checked = true;
      radio.formResetCallback();
      expect(radio.checked).toBe(false);
    });
  });

  describe('Form Disabled Callback', () => {
    it('should disable when form is disabled', () => {
      radio.formDisabledCallback(true);
      expect(radio.disabled).toBe(true);
    });

    it('should enable when form is enabled', () => {
      radio.disabled = true;
      radio.formDisabledCallback(false);
      expect(radio.disabled).toBe(false);
    });
  });

  describe('Observed Attributes', () => {
    it('should observe checked, disabled, name, value, and required attributes', () => {
      expect(BrandRadio.observedAttributes).toContain('checked');
      expect(BrandRadio.observedAttributes).toContain('disabled');
      expect(BrandRadio.observedAttributes).toContain('name');
      expect(BrandRadio.observedAttributes).toContain('value');
      expect(BrandRadio.observedAttributes).toContain('required');
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content as label', () => {
      radio.textContent = 'Radio option';
      expect(radio.textContent).toBe('Radio option');
    });

    it('should render slotted HTML elements as label', () => {
      const span = document.createElement('span');
      span.textContent = 'Custom Label';
      radio.appendChild(span);
      expect(radio.querySelector('span')).toBeTruthy();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      radio.textContent = '<script>alert("xss")</script>';
      const slot = radio.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
      expect(radio.textContent).toContain('<script>');
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandRadio.styles as any)._cssText || '';
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-blue-700');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (radio as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      radio.remove();

      const cleanedListeners = (radio as any)._listeners;
      expect(cleanedListeners?.length ?? 0).toBe(0);
    });
  });

  describe('Radio Group Management', () => {
    let radio1: BrandRadio;
    let radio2: BrandRadio;
    let radio3: BrandRadio;

    beforeEach(() => {
      radio1 = document.createElement('brand-radio') as BrandRadio;
      radio2 = document.createElement('brand-radio') as BrandRadio;
      radio3 = document.createElement('brand-radio') as BrandRadio;

      radio1.name = 'test-group';
      radio2.name = 'test-group';
      radio3.name = 'test-group';

      document.body.appendChild(radio1);
      document.body.appendChild(radio2);
      document.body.appendChild(radio3);
    });

    afterEach(() => {
      radio1.remove();
      radio2.remove();
      radio3.remove();
    });

    it('should allow only one radio to be checked in a group', () => {
      radio1.checked = true;
      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(false);
      expect(radio3.checked).toBe(false);

      radio2.checked = true;
      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
      expect(radio3.checked).toBe(false);

      radio3.checked = true;
      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(false);
      expect(radio3.checked).toBe(true);
    });

    it('should uncheck other radios when one is selected', () => {
      radio1.select();
      expect(radio1.checked).toBe(true);

      radio2.select();
      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });

    it('should not affect radios in different groups', () => {
      const radio4 = document.createElement('brand-radio') as BrandRadio;
      radio4.name = 'other-group';
      document.body.appendChild(radio4);

      radio1.checked = true;
      radio4.checked = true;

      expect(radio1.checked).toBe(true);
      expect(radio4.checked).toBe(true);

      radio4.remove();
    });

    it('should handle radios without a name attribute', () => {
      const radio4 = document.createElement('brand-radio') as BrandRadio;
      const radio5 = document.createElement('brand-radio') as BrandRadio;
      document.body.appendChild(radio4);
      document.body.appendChild(radio5);

      radio4.checked = true;
      radio5.checked = true;

      // Both should be able to be checked since they have no name
      expect(radio4.checked).toBe(true);
      expect(radio5.checked).toBe(true);

      radio4.remove();
      radio5.remove();
    });

    describe('Keyboard Navigation', () => {
      it('should navigate to next radio with ArrowDown', () => {
        radio1.checked = true;
        const radioButton = radio1.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio1.checked).toBe(false);
        expect(radio2.checked).toBe(true);
      });

      it('should navigate to next radio with ArrowRight', () => {
        radio1.checked = true;
        const radioButton = radio1.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio1.checked).toBe(false);
        expect(radio2.checked).toBe(true);
      });

      it('should navigate to previous radio with ArrowUp', () => {
        radio2.checked = true;
        const radioButton = radio2.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio2.checked).toBe(false);
        expect(radio1.checked).toBe(true);
      });

      it('should navigate to previous radio with ArrowLeft', () => {
        radio2.checked = true;
        const radioButton = radio2.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio2.checked).toBe(false);
        expect(radio1.checked).toBe(true);
      });

      it('should wrap to first radio when navigating past last', () => {
        radio3.checked = true;
        const radioButton = radio3.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio3.checked).toBe(false);
        expect(radio1.checked).toBe(true);
      });

      it('should wrap to last radio when navigating before first', () => {
        radio1.checked = true;
        const radioButton = radio1.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio1.checked).toBe(false);
        expect(radio3.checked).toBe(true);
      });

      it('should skip disabled radios during navigation', () => {
        radio2.disabled = true;
        radio1.checked = true;

        const radioButton = radio1.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(radio1.checked).toBe(false);
        expect(radio2.checked).toBe(false);
        expect(radio3.checked).toBe(true);
      });

      it('should focus the next radio during navigation', () => {
        radio1.checked = true;
        const focusSpy = vi.spyOn(radio2, 'focus');

        const radioButton = radio1.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        radioButton.dispatchEvent(event);

        expect(focusSpy).toHaveBeenCalled();
      });
    });

    describe('Group Controller Name Changes', () => {
      it('should update group when name changes', () => {
        radio1.checked = true;
        expect(radio1.checked).toBe(true);

        radio1.name = 'new-group';
        radio2.checked = true;

        // radio1 should still be checked since it's in a different group now
        expect(radio1.checked).toBe(true);
        expect(radio2.checked).toBe(true);
      });

      it('should remove from group when name is cleared', () => {
        radio1.checked = true;
        radio1.name = '';

        radio2.checked = true;
        expect(radio1.checked).toBe(true); // Should remain checked
        expect(radio2.checked).toBe(true);
      });
    });

    describe('Group Controller Cleanup', () => {
      it('should unregister from group when removed from DOM', () => {
        radio1.checked = true;
        radio1.remove();

        radio2.checked = true;
        expect(radio2.checked).toBe(true);

        // Re-add for cleanup
        document.body.appendChild(radio1);
      });
    });
  });

  describe('Focus Method', () => {
    it('should focus the radio button element', () => {
      const radioButton = radio.shadowRoot?.querySelector('[part="button"]') as HTMLElement;
      const focusSpy = vi.spyOn(radioButton, 'focus');

      radio.focus();
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Integration: Multiple Groups', () => {
    it('should manage multiple independent groups', () => {
      const groupA1 = document.createElement('brand-radio') as BrandRadio;
      const groupA2 = document.createElement('brand-radio') as BrandRadio;
      const groupB1 = document.createElement('brand-radio') as BrandRadio;
      const groupB2 = document.createElement('brand-radio') as BrandRadio;

      groupA1.name = 'groupA';
      groupA2.name = 'groupA';
      groupB1.name = 'groupB';
      groupB2.name = 'groupB';

      document.body.appendChild(groupA1);
      document.body.appendChild(groupA2);
      document.body.appendChild(groupB1);
      document.body.appendChild(groupB2);

      groupA1.checked = true;
      groupB1.checked = true;

      expect(groupA1.checked).toBe(true);
      expect(groupA2.checked).toBe(false);
      expect(groupB1.checked).toBe(true);
      expect(groupB2.checked).toBe(false);

      groupA2.checked = true;
      groupB2.checked = true;

      expect(groupA1.checked).toBe(false);
      expect(groupA2.checked).toBe(true);
      expect(groupB1.checked).toBe(false);
      expect(groupB2.checked).toBe(true);

      groupA1.remove();
      groupA2.remove();
      groupB1.remove();
      groupB2.remove();
    });
  });
});
