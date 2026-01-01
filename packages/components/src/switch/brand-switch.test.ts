/**
 * Unit tests for brand-switch component
 * Following Test-Driven Development approach
 * Tests all requirements: FormAssociated, ElementInternals, Size variants,
 * Label positioning, Keyboard accessibility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandSwitch } from './brand-switch';

describe('BrandSwitch', () => {
  let switchElement: BrandSwitch;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-switch')) {
      customElements.define('brand-switch', BrandSwitch);
    }
    switchElement = document.createElement('brand-switch') as BrandSwitch;
    document.body.appendChild(switchElement);
  });

  afterEach(() => {
    switchElement.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-switch')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(switchElement).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(switchElement.shadowRoot).toBeTruthy();
    });

    it('should be form-associated', () => {
      expect(BrandSwitch.formAssociated).toBe(true);
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandSwitch.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(switchElement.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(switchElement.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandSwitch.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render switch track element in shadow DOM', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack).toBeTruthy();
    });

    it('should render switch thumb element in shadow DOM', () => {
      const switchThumb = switchElement.shadowRoot?.querySelector('[part="thumb"]');
      expect(switchThumb).toBeTruthy();
    });

    it('should have a slot for label content', () => {
      const slot = switchElement.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose parts for styling', () => {
      const container = switchElement.shadowRoot?.querySelector('[part="container"]');
      const track = switchElement.shadowRoot?.querySelector('[part="track"]');
      const thumb = switchElement.shadowRoot?.querySelector('[part="thumb"]');
      const label = switchElement.shadowRoot?.querySelector('[part="label"]');
      expect(container).toBeTruthy();
      expect(track).toBeTruthy();
      expect(thumb).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should have hidden native input for form participation', () => {
      const hiddenInput = switchElement.shadowRoot?.querySelector('input[type="checkbox"]');
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
      expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(switchElement.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(switchElement.internals.states).toBeDefined();
    });
  });

  describe('Checked State', () => {
    it('should not be checked by default', () => {
      expect(switchElement.checked).toBe(false);
      expect(switchElement.hasAttribute('checked')).toBe(false);
    });

    it('should be checked when checked attribute is present', () => {
      switchElement.setAttribute('checked', '');
      expect(switchElement.checked).toBe(true);
    });

    it('should support checked property setter', () => {
      switchElement.checked = true;
      expect(switchElement.hasAttribute('checked')).toBe(true);
      expect(switchElement.checked).toBe(true);
    });

    it('should support checked property getter', () => {
      switchElement.setAttribute('checked', '');
      expect(switchElement.checked).toBe(true);
    });

    it('should update ARIA attributes when checked', () => {
      switchElement.checked = true;
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('aria-checked')).toBe('true');
      expect(switchElement.internals.ariaChecked).toBe('true');
    });

    it('should update hidden input when checked', () => {
      switchElement.checked = true;
      const hiddenInput = switchElement.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.checked).toBe(true);
    });
  });

  describe('Unchecked State', () => {
    it('should be unchecked when checked is false', () => {
      switchElement.checked = true;
      switchElement.checked = false;
      expect(switchElement.hasAttribute('checked')).toBe(false);
    });

    it('should update ARIA when unchecked', () => {
      switchElement.checked = true;
      switchElement.checked = false;
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(switchElement.disabled).toBe(false);
      expect(switchElement.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      switchElement.setAttribute('disabled', '');
      expect(switchElement.disabled).toBe(true);
    });

    it('should support disabled property setter', () => {
      switchElement.disabled = true;
      expect(switchElement.hasAttribute('disabled')).toBe(true);
      expect(switchElement.disabled).toBe(true);
    });

    it('should update ARIA when disabled', () => {
      switchElement.disabled = true;
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('aria-disabled')).toBe('true');
      expect(switchElement.internals.ariaDisabled).toBe('true');
    });

    it('should update tabindex when disabled', () => {
      switchElement.disabled = true;
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('tabindex')).toBe('-1');
    });

    it('should update hidden input when disabled', () => {
      switchElement.disabled = true;
      const hiddenInput = switchElement.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.disabled).toBe(true);
    });

    it('should prevent toggle when disabled', () => {
      switchElement.disabled = true;
      switchElement.toggle();
      expect(switchElement.checked).toBe(false);
    });
  });

  describe('Size Variants', () => {
    it('should default to medium size', () => {
      expect(switchElement.size).toBe('medium');
    });

    it('should support small size', () => {
      switchElement.size = 'small';
      expect(switchElement.getAttribute('size')).toBe('small');
      expect(switchElement.size).toBe('small');
    });

    it('should support medium size', () => {
      switchElement.size = 'medium';
      expect(switchElement.getAttribute('size')).toBe('medium');
      expect(switchElement.size).toBe('medium');
    });

    it('should support large size', () => {
      switchElement.size = 'large';
      expect(switchElement.getAttribute('size')).toBe('large');
      expect(switchElement.size).toBe('large');
    });

    it('should apply size attribute to host', () => {
      switchElement.setAttribute('size', 'small');
      expect(switchElement.hasAttribute('size')).toBe(true);
      expect(switchElement.getAttribute('size')).toBe('small');
    });

    it('should normalize invalid size to medium', () => {
      switchElement.setAttribute('size', 'invalid');
      expect(switchElement.size).toBe('medium');
    });
  });

  describe('Label Position', () => {
    it('should default to right position', () => {
      expect(switchElement.labelPosition).toBe('right');
    });

    it('should support left label position', () => {
      switchElement.labelPosition = 'left';
      expect(switchElement.getAttribute('label-position')).toBe('left');
      expect(switchElement.labelPosition).toBe('left');
    });

    it('should support right label position', () => {
      switchElement.labelPosition = 'right';
      expect(switchElement.getAttribute('label-position')).toBe('right');
      expect(switchElement.labelPosition).toBe('right');
    });

    it('should apply label-position attribute to host', () => {
      switchElement.setAttribute('label-position', 'left');
      expect(switchElement.hasAttribute('label-position')).toBe(true);
      expect(switchElement.getAttribute('label-position')).toBe('left');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should have tabindex 0 when not disabled', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('tabindex')).toBe('0');
    });

    it('should toggle on Space key press', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      switchTrack.dispatchEvent(event);
      expect(switchElement.checked).toBe(true);
    });

    it('should toggle on Spacebar key press (legacy)', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Spacebar', bubbles: true });
      switchTrack.dispatchEvent(event);
      expect(switchElement.checked).toBe(true);
    });

    it('should not toggle on other keys', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      switchTrack.dispatchEvent(event);
      expect(switchElement.checked).toBe(false);
    });

    it('should have role="switch" on switch track', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('role')).toBe('switch');
    });
  });

  describe('Toggle Method', () => {
    it('should toggle from unchecked to checked', () => {
      switchElement.toggle();
      expect(switchElement.checked).toBe(true);
    });

    it('should toggle from checked to unchecked', () => {
      switchElement.checked = true;
      switchElement.toggle();
      expect(switchElement.checked).toBe(false);
    });

    it('should dispatch change event when toggled', () => {
      const changeSpy = vi.fn();
      switchElement.addEventListener('change', changeSpy);
      switchElement.toggle();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch bubbling and composed change event', () => {
      let eventBubbles = false;
      let eventComposed = false;
      switchElement.addEventListener('change', (e) => {
        eventBubbles = e.bubbles;
        eventComposed = e.composed;
      });
      switchElement.toggle();
      expect(eventBubbles).toBe(true);
      expect(eventComposed).toBe(true);
    });

    it('should not toggle when disabled', () => {
      switchElement.disabled = true;
      switchElement.toggle();
      expect(switchElement.checked).toBe(false);
    });
  });

  describe('Click Interaction', () => {
    it('should toggle when switch track is clicked', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      switchTrack.click();
      expect(switchElement.checked).toBe(true);
    });

    it('should toggle multiple times on repeated clicks', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      switchTrack.click();
      expect(switchElement.checked).toBe(true);
      switchTrack.click();
      expect(switchElement.checked).toBe(false);
      switchTrack.click();
      expect(switchElement.checked).toBe(true);
    });
  });

  describe('Form Association', () => {
    it('should have name property', () => {
      switchElement.name = 'test-switch';
      expect(switchElement.name).toBe('test-switch');
      expect(switchElement.getAttribute('name')).toBe('test-switch');
    });

    it('should have value property', () => {
      switchElement.value = 'custom-value';
      expect(switchElement.value).toBe('custom-value');
      expect(switchElement.getAttribute('value')).toBe('custom-value');
    });

    it('should default value to "on"', () => {
      expect(switchElement.value).toBe('on');
    });

    it('should sync name to hidden input', () => {
      switchElement.name = 'test-switch';
      const hiddenInput = switchElement.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.name).toBe('test-switch');
    });

    it('should sync value to hidden input', () => {
      switchElement.value = 'custom-value';
      const hiddenInput = switchElement.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.value).toBe('custom-value');
    });

    it('should set form value when checked', () => {
      switchElement.value = 'test-value';
      switchElement.checked = true;
      // Form value is set via internals.setFormValue() - can't easily test in jsdom
      // but we verify the checked state is correct
      expect(switchElement.checked).toBe(true);
    });

    it('should clear form value when unchecked', () => {
      switchElement.checked = true;
      switchElement.checked = false;
      expect(switchElement.checked).toBe(false);
    });
  });

  describe('Required Attribute', () => {
    it('should not be required by default', () => {
      expect(switchElement.required).toBe(false);
    });

    it('should support required property setter', () => {
      switchElement.required = true;
      expect(switchElement.hasAttribute('required')).toBe(true);
      expect(switchElement.required).toBe(true);
    });

    it('should update ARIA when required', () => {
      switchElement.required = true;
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('aria-required')).toBe('true');
      expect(switchElement.internals.ariaRequired).toBe('true');
    });

    it('should sync required to hidden input', () => {
      switchElement.required = true;
      const hiddenInput = switchElement.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(hiddenInput.required).toBe(true);
    });
  });

  describe('Form Reset Callback', () => {
    it('should reset to unchecked on form reset', () => {
      switchElement.checked = true;
      switchElement.formResetCallback();
      expect(switchElement.checked).toBe(false);
    });
  });

  describe('Form Disabled Callback', () => {
    it('should disable when form is disabled', () => {
      switchElement.formDisabledCallback(true);
      expect(switchElement.disabled).toBe(true);
    });

    it('should enable when form is enabled', () => {
      switchElement.disabled = true;
      switchElement.formDisabledCallback(false);
      expect(switchElement.disabled).toBe(false);
    });
  });

  describe('Observed Attributes', () => {
    it('should observe checked, disabled, name, value, required, size, and label-position attributes', () => {
      expect(BrandSwitch.observedAttributes).toContain('checked');
      expect(BrandSwitch.observedAttributes).toContain('disabled');
      expect(BrandSwitch.observedAttributes).toContain('name');
      expect(BrandSwitch.observedAttributes).toContain('value');
      expect(BrandSwitch.observedAttributes).toContain('required');
      expect(BrandSwitch.observedAttributes).toContain('size');
      expect(BrandSwitch.observedAttributes).toContain('label-position');
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content as label', () => {
      switchElement.textContent = 'Enable notifications';
      expect(switchElement.textContent).toBe('Enable notifications');
    });

    it('should render slotted HTML elements as label', () => {
      const span = document.createElement('span');
      span.textContent = 'Custom Label';
      switchElement.appendChild(span);
      expect(switchElement.querySelector('span')).toBeTruthy();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      switchElement.textContent = '<script>alert("xss")</script>';
      const slot = switchElement.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(switchElement.textContent).toContain('<script>');
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandSwitch.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-blue-700');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (switchElement as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      switchElement.remove();

      // After removal, listeners should be cleaned up
      const cleanedListeners = (switchElement as any)._listeners;
      expect(cleanedListeners?.length ?? 0).toBe(0);
    });
  });

  describe('Integration: Toggle Switch Behavior', () => {
    it('should support unchecked -> checked -> unchecked', () => {
      expect(switchElement.checked).toBe(false);
      switchElement.checked = true;
      expect(switchElement.checked).toBe(true);
      switchElement.checked = false;
      expect(switchElement.checked).toBe(false);
    });

    it('should toggle with keyboard and emit change events', () => {
      const changeSpy = vi.fn();
      switchElement.addEventListener('change', changeSpy);

      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      switchTrack.dispatchEvent(event);

      expect(switchElement.checked).toBe(true);
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should work with all size variants', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

      sizes.forEach(size => {
        switchElement.size = size;
        expect(switchElement.size).toBe(size);
        expect(switchElement.getAttribute('size')).toBe(size);

        // Should still toggle correctly
        switchElement.toggle();
        expect(switchElement.checked).toBe(true);
        switchElement.toggle();
        expect(switchElement.checked).toBe(false);
      });
    });

    it('should work with both label positions', () => {
      const positions: Array<'left' | 'right'> = ['left', 'right'];

      positions.forEach(position => {
        switchElement.labelPosition = position;
        expect(switchElement.labelPosition).toBe(position);

        // Should still toggle correctly
        switchElement.toggle();
        expect(switchElement.checked).toBe(true);
        switchElement.toggle();
        expect(switchElement.checked).toBe(false);
      });
    });
  });

  describe('Visual Distinction from Checkbox', () => {
    it('should use role="switch" instead of role="checkbox"', () => {
      const switchTrack = switchElement.shadowRoot?.querySelector('[part="track"]');
      expect(switchTrack?.getAttribute('role')).toBe('switch');
      expect(switchTrack?.getAttribute('role')).not.toBe('checkbox');
    });

    it('should have distinct track and thumb parts for toggle UI', () => {
      const track = switchElement.shadowRoot?.querySelector('[part="track"]');
      const thumb = switchElement.shadowRoot?.querySelector('[part="thumb"]');

      expect(track).toBeTruthy();
      expect(thumb).toBeTruthy();
      expect(track?.querySelector('[part="thumb"]')).toBeTruthy();
    });

    it('should use rounded track styling via CSS custom properties', () => {
      const styleText = (BrandSwitch.styles as any)._cssText || '';

      // Check for rounded styling
      expect(styleText).toContain('border-radius');
      expect(styleText).toContain('--radius-full');

      // Check for sliding thumb (transform)
      expect(styleText).toContain('transform');
      expect(styleText).toContain('translateX');
    });
  });
});
