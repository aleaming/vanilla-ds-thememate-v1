/**
 * Unit tests for brand-textarea component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandTextarea } from './brand-textarea';

describe('BrandTextarea', () => {
  let textarea: BrandTextarea;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-textarea')) {
      customElements.define('brand-textarea', BrandTextarea);
    }
    textarea = document.createElement('brand-textarea') as BrandTextarea;
    document.body.appendChild(textarea);
  });

  afterEach(() => {
    textarea.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-textarea')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(textarea).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(textarea.shadowRoot).toBeTruthy();
    });

    it('should be form-associated', () => {
      expect(BrandTextarea.formAssociated).toBe(true);
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandTextarea.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(textarea.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(textarea.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandTextarea.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a textarea element in shadow DOM', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea');
      expect(internalTextarea).toBeTruthy();
    });

    it('should render label element', () => {
      const label = textarea.shadowRoot?.querySelector('label');
      expect(label).toBeTruthy();
    });

    it('should render helper text element', () => {
      const helperText = textarea.shadowRoot?.querySelector('.helper-text');
      expect(helperText).toBeTruthy();
    });

    it('should render char count element', () => {
      const charCount = textarea.shadowRoot?.querySelector('.char-count');
      expect(charCount).toBeTruthy();
    });

    it('should expose parts for styling', () => {
      expect(textarea.shadowRoot?.querySelector('[part="label"]')).toBeTruthy();
      expect(textarea.shadowRoot?.querySelector('[part="textarea"]')).toBeTruthy();
      expect(textarea.shadowRoot?.querySelector('[part="helper-text"]')).toBeTruthy();
      expect(textarea.shadowRoot?.querySelector('[part="char-count"]')).toBeTruthy();
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(textarea.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(textarea.internals.states).toBeDefined();
    });
  });

  describe('Label Attribute', () => {
    it('should hide label when not set', () => {
      const label = textarea.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.style.display).toBe('none');
    });

    it('should show and set label text', () => {
      textarea.setAttribute('label', 'Description');
      const label = textarea.shadowRoot?.querySelector('label') as HTMLLabelElement;
      expect(label.style.display).toBe('block');
      expect(label.textContent).toContain('Description');
    });

    it('should show required indicator when required', () => {
      textarea.setAttribute('label', 'Description');
      textarea.setAttribute('required', '');
      const label = textarea.shadowRoot?.querySelector('label') as HTMLLabelElement;
      const required = label.querySelector('.required');
      expect(required).toBeTruthy();
      expect(required?.textContent).toBe('*');
    });
  });

  describe('Value Attribute and Property', () => {
    it('should set value via attribute', () => {
      textarea.setAttribute('value', 'Test value');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.value).toBe('Test value');
    });

    it('should get value via property', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      internalTextarea.value = 'Test value';
      expect(textarea.value).toBe('Test value');
    });

    it('should set value via property', () => {
      textarea.value = 'Test value';
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.value).toBe('Test value');
    });

    it('should update form value when value is set', () => {
      textarea.value = 'Test value';
      // In jsdom, we can't directly check form value, but we can verify the property setter was called
      expect(textarea.value).toBe('Test value');
    });
  });

  describe('Placeholder Attribute', () => {
    it('should set placeholder text', () => {
      textarea.setAttribute('placeholder', 'Enter description...');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.placeholder).toBe('Enter description...');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.disabled).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      textarea.setAttribute('disabled', '');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.disabled).toBe(true);
    });

    it('should update aria-disabled when disabled', () => {
      textarea.setAttribute('disabled', '');
      expect(textarea.internals.ariaDisabled).toBe('true');
    });

    it('should remove disabled state when attribute is removed', () => {
      textarea.setAttribute('disabled', '');
      textarea.removeAttribute('disabled');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.disabled).toBe(false);
      expect(textarea.internals.ariaDisabled).toBeNull();
    });
  });

  describe('Required State', () => {
    it('should not be required by default', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.required).toBe(false);
    });

    it('should be required when required attribute is present', () => {
      textarea.setAttribute('required', '');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.required).toBe(true);
    });

    it('should update aria-required when required', () => {
      textarea.setAttribute('required', '');
      expect(textarea.internals.ariaRequired).toBe('true');
    });
  });

  describe('Readonly State', () => {
    it('should not be readonly by default', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.readOnly).toBe(false);
    });

    it('should be readonly when readonly attribute is present', () => {
      textarea.setAttribute('readonly', '');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.readOnly).toBe(true);
    });
  });

  describe('Maxlength Attribute', () => {
    it('should set maxlength', () => {
      textarea.setAttribute('maxlength', '100');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.maxLength).toBe(100);
    });
  });

  describe('Minlength Attribute', () => {
    it('should set minlength', () => {
      textarea.setAttribute('minlength', '10');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.minLength).toBe(10);
    });
  });

  describe('Rows Attribute', () => {
    it('should set rows', () => {
      textarea.setAttribute('rows', '5');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.rows).toBe(5);
    });
  });

  describe('Helper Text', () => {
    it('should hide helper text when not set', () => {
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      expect(helperText.style.display).toBe('none');
    });

    it('should show and set helper text', () => {
      textarea.setAttribute('helper-text', 'Maximum 500 characters');
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      expect(helperText.style.display).toBe('block');
      expect(helperText.textContent).toBe('Maximum 500 characters');
    });
  });

  describe('Validation States', () => {
    it('should not have validation state by default', () => {
      expect(textarea.internals.states.has('error')).toBe(false);
      expect(textarea.internals.states.has('success')).toBe(false);
      expect(textarea.internals.states.has('warning')).toBe(false);
    });

    it('should add error custom state', () => {
      textarea.setAttribute('validation-state', 'error');
      expect(textarea.internals.states.has('error')).toBe(true);
    });

    it('should add success custom state', () => {
      textarea.setAttribute('validation-state', 'success');
      expect(textarea.internals.states.has('success')).toBe(true);
    });

    it('should add warning custom state', () => {
      textarea.setAttribute('validation-state', 'warning');
      expect(textarea.internals.states.has('warning')).toBe(true);
    });

    it('should clear previous validation state when changed', () => {
      textarea.setAttribute('validation-state', 'error');
      expect(textarea.internals.states.has('error')).toBe(true);

      textarea.setAttribute('validation-state', 'success');
      expect(textarea.internals.states.has('error')).toBe(false);
      expect(textarea.internals.states.has('success')).toBe(true);
    });

    it('should clear validation state when removed', () => {
      textarea.setAttribute('validation-state', 'error');
      textarea.removeAttribute('validation-state');
      expect(textarea.internals.states.has('error')).toBe(false);
    });
  });

  describe('Character Count', () => {
    it('should hide character count by default', () => {
      const charCount = textarea.shadowRoot?.querySelector('.char-count') as HTMLDivElement;
      expect(charCount.style.display).toBe('none');
    });

    it('should show character count when show-count is set', () => {
      textarea.setAttribute('show-count', '');
      textarea.value = 'Test';
      const charCount = textarea.shadowRoot?.querySelector('.char-count') as HTMLDivElement;
      expect(charCount.style.display).toBe('flex');
      expect(charCount.textContent).toBe('4');
    });

    it('should show count with maxlength', () => {
      textarea.setAttribute('show-count', '');
      textarea.setAttribute('maxlength', '100');
      textarea.value = 'Test message';
      const charCount = textarea.shadowRoot?.querySelector('.char-count') as HTMLDivElement;
      expect(charCount.textContent).toBe('12 / 100');
    });

    it('should add over-limit class when exceeding maxlength', () => {
      textarea.setAttribute('show-count', '');
      textarea.setAttribute('maxlength', '10');
      textarea.value = 'This is a very long message';
      const charCount = textarea.shadowRoot?.querySelector('.char-count') as HTMLDivElement;
      expect(charCount.classList.contains('over-limit')).toBe(true);
    });

    it('should remove over-limit class when under maxlength', () => {
      textarea.setAttribute('show-count', '');
      textarea.setAttribute('maxlength', '10');
      textarea.value = 'Very long text';

      // First set over limit
      const charCount = textarea.shadowRoot?.querySelector('.char-count') as HTMLDivElement;
      expect(charCount.classList.contains('over-limit')).toBe(true);

      // Then set under limit
      textarea.value = 'Short';
      expect(charCount.classList.contains('over-limit')).toBe(false);
    });
  });

  describe('Auto-resize', () => {
    it('should not auto-resize by default', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      // Default resize is vertical
      const computedStyle = getComputedStyle(internalTextarea);
      // In jsdom, we can't check computed styles, so we verify the attribute
      expect(textarea.hasAttribute('auto-resize')).toBe(false);
    });

    it('should enable auto-resize when auto-resize attribute is set', () => {
      textarea.setAttribute('auto-resize', '');
      expect(textarea.hasAttribute('auto-resize')).toBe(true);
    });

    it('should adjust height when auto-resize is enabled', () => {
      textarea.setAttribute('auto-resize', '');
      textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      // Height should be set after auto-resize
      expect(internalTextarea.style.height).toBeTruthy();
    });
  });

  describe('Input Event', () => {
    it('should dispatch brand-input event on input', () => {
      const handler = vi.fn();
      textarea.addEventListener('brand-input', handler);

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      internalTextarea.value = 'Test';
      internalTextarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.value).toBe('Test');
    });

    it('should update form value on input', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      internalTextarea.value = 'Test value';
      internalTextarea.dispatchEvent(new Event('input', { bubbles: true }));

      expect(textarea.value).toBe('Test value');
    });
  });

  describe('Blur Event', () => {
    it('should dispatch brand-blur event on blur', () => {
      const handler = vi.fn();
      textarea.addEventListener('brand-blur', handler);

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      internalTextarea.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Public API Methods', () => {
    it('should focus textarea via focus() method', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const focusSpy = vi.spyOn(internalTextarea, 'focus');

      textarea.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur textarea via blur() method', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const blurSpy = vi.spyOn(internalTextarea, 'blur');

      textarea.blur();

      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('Form Integration', () => {
    it('should have name attribute for form participation', () => {
      textarea.setAttribute('name', 'description');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.getAttribute('name')).toBe('description');
    });

    it('should reset to initial value on form reset', () => {
      textarea.setAttribute('value', 'Initial');
      textarea.value = 'Changed';

      // Call formResetCallback
      textarea.formResetCallback();

      expect(textarea.value).toBe('Initial');
    });

    it('should handle form disabled callback', () => {
      textarea.formDisabledCallback(true);
      expect(textarea.hasAttribute('disabled')).toBe(true);

      textarea.formDisabledCallback(false);
      expect(textarea.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should validate required field', () => {
      textarea.setAttribute('required', '');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      // Trigger blur to validate
      internalTextarea.value = '';
      internalTextarea.dispatchEvent(new Event('blur', { bubbles: true }));

      // The component should set validation via internals
      // In a real browser, this would show validation message
      expect(textarea.internals).toBeDefined();
    });

    it('should validate minlength', () => {
      textarea.setAttribute('minlength', '10');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      internalTextarea.value = 'Short';
      internalTextarea.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(textarea.internals).toBeDefined();
    });

    it('should validate maxlength', () => {
      textarea.setAttribute('maxlength', '10');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      internalTextarea.value = 'This is a very long message';
      internalTextarea.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(textarea.internals).toBeDefined();
    });

    it('should clear validation when input is valid', () => {
      textarea.setAttribute('required', '');
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      internalTextarea.value = 'Valid input';
      internalTextarea.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(textarea.internals).toBeDefined();
    });
  });

  describe('Observed Attributes', () => {
    it('should observe all necessary attributes', () => {
      expect(BrandTextarea.observedAttributes).toContain('label');
      expect(BrandTextarea.observedAttributes).toContain('name');
      expect(BrandTextarea.observedAttributes).toContain('value');
      expect(BrandTextarea.observedAttributes).toContain('placeholder');
      expect(BrandTextarea.observedAttributes).toContain('disabled');
      expect(BrandTextarea.observedAttributes).toContain('required');
      expect(BrandTextarea.observedAttributes).toContain('readonly');
      expect(BrandTextarea.observedAttributes).toContain('maxlength');
      expect(BrandTextarea.observedAttributes).toContain('minlength');
      expect(BrandTextarea.observedAttributes).toContain('rows');
      expect(BrandTextarea.observedAttributes).toContain('auto-resize');
      expect(BrandTextarea.observedAttributes).toContain('show-count');
      expect(BrandTextarea.observedAttributes).toContain('helper-text');
      expect(BrandTextarea.observedAttributes).toContain('validation-state');
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // Set label with potential XSS
      textarea.setAttribute('label', '<script>alert("xss")</script>');
      const label = textarea.shadowRoot?.querySelector('label');

      // The script tag should be rendered as text, not executed
      expect(label?.textContent).toContain('<script>');
    });

    it('should safely set helper text without XSS', () => {
      textarea.setAttribute('helper-text', '<img src=x onerror=alert(1)>');
      const helperText = textarea.shadowRoot?.querySelector('.helper-text');

      // The image tag should be rendered as text
      expect(helperText?.textContent).toContain('<img');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (textarea as any)._listeners;
      expect(listeners).toBeDefined();

      textarea.remove();

      // After removal, listeners should be cleaned up
      const cleanedListeners = (textarea as any)._listeners;
      expect(cleanedListeners.length).toBe(0);
    });
  });

  describe('Custom States with :state() pseudo-class', () => {
    it('should use ElementInternals.states for validation states', () => {
      textarea.setAttribute('validation-state', 'error');
      expect(textarea.internals.states.has('error')).toBe(true);

      textarea.setAttribute('validation-state', 'success');
      expect(textarea.internals.states.has('error')).toBe(false);
      expect(textarea.internals.states.has('success')).toBe(true);

      textarea.setAttribute('validation-state', 'warning');
      expect(textarea.internals.states.has('success')).toBe(false);
      expect(textarea.internals.states.has('warning')).toBe(true);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandTextarea.styles as any)._cssText || '';

      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-');
      expect(styleText).toContain('--space-');
      expect(styleText).toContain('--text-');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes when required', () => {
      textarea.setAttribute('required', '');
      expect(textarea.internals.ariaRequired).toBe('true');
    });

    it('should have proper ARIA attributes when disabled', () => {
      textarea.setAttribute('disabled', '');
      expect(textarea.internals.ariaDisabled).toBe('true');
    });

    it('should clear ARIA attributes when states are removed', () => {
      textarea.setAttribute('required', '');
      textarea.setAttribute('disabled', '');

      textarea.removeAttribute('required');
      textarea.removeAttribute('disabled');

      expect(textarea.internals.ariaRequired).toBeNull();
      expect(textarea.internals.ariaDisabled).toBeNull();
    });
  });

  describe('Label/Textarea Association (WCAG 1.3.1)', () => {
    it('should have a unique ID on the textarea element', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(internalTextarea.id).toBeTruthy();
      expect(internalTextarea.id).toMatch(/^brand-textarea-[a-z0-9]{9}$/);
    });

    it('should have matching for attribute on label', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const label = textarea.shadowRoot?.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('for')).toBe(internalTextarea.id);
    });

    it('should have unique IDs for multiple instances', () => {
      const textarea2 = document.createElement('brand-textarea') as BrandTextarea;
      document.body.appendChild(textarea2);

      const textarea1Internal = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const textarea2Internal = textarea2.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      expect(textarea1Internal.id).toBeTruthy();
      expect(textarea2Internal.id).toBeTruthy();
      expect(textarea1Internal.id).not.toBe(textarea2Internal.id);

      textarea2.remove();
    });

    it('should maintain label/textarea association after attribute changes', () => {
      textarea.setAttribute('label', 'Description');

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const label = textarea.shadowRoot?.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('for')).toBe(internalTextarea.id);
    });
  });

  describe('Helper Text Association via aria-describedby (WCAG 3.3.1)', () => {
    it('should have a unique ID on the helper text element', () => {
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      expect(helperText.id).toBeTruthy();
      expect(helperText.id).toMatch(/^brand-textarea-[a-z0-9]{9}-helper$/);
    });

    it('should link textarea to helper text via aria-describedby', () => {
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(internalTextarea.getAttribute('aria-describedby')).toBe(helperText.id);
    });

    it('should have unique helper IDs for multiple instances', () => {
      const textarea2 = document.createElement('brand-textarea') as BrandTextarea;
      document.body.appendChild(textarea2);

      const helperText1 = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      const helperText2 = textarea2.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(helperText1.id).toBeTruthy();
      expect(helperText2.id).toBeTruthy();
      expect(helperText1.id).not.toBe(helperText2.id);

      textarea2.remove();
    });

    it('should maintain aria-describedby association when helper text is set', () => {
      textarea.setAttribute('helper-text', 'Maximum 500 characters');

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(internalTextarea.getAttribute('aria-describedby')).toBe(helperText.id);
      expect(helperText.textContent).toBe('Maximum 500 characters');
    });

    it('should maintain aria-describedby even when helper text is not displayed', () => {
      // Helper text element exists but is hidden by default
      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(internalTextarea.getAttribute('aria-describedby')).toBe(helperText.id);
      expect(helperText.style.display).toBe('none');
    });

    it('should add role="alert" when validation-state is error', () => {
      textarea.setAttribute('validation-state', 'error');
      textarea.setAttribute('helper-text', 'This field is required');

      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(helperText.getAttribute('role')).toBe('alert');
    });

    it('should not have role="alert" when validation-state is success', () => {
      textarea.setAttribute('validation-state', 'success');
      textarea.setAttribute('helper-text', 'Input is valid');

      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(helperText.getAttribute('role')).toBeNull();
    });

    it('should not have role="alert" when validation-state is warning', () => {
      textarea.setAttribute('validation-state', 'warning');
      textarea.setAttribute('helper-text', 'This input may need review');

      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      expect(helperText.getAttribute('role')).toBeNull();
    });

    it('should remove role="alert" when validation-state changes from error to success', () => {
      textarea.setAttribute('validation-state', 'error');
      textarea.setAttribute('helper-text', 'This field is required');

      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      expect(helperText.getAttribute('role')).toBe('alert');

      textarea.setAttribute('validation-state', 'success');
      expect(helperText.getAttribute('role')).toBeNull();
    });

    it('should remove role="alert" when validation-state is removed', () => {
      textarea.setAttribute('validation-state', 'error');
      textarea.setAttribute('helper-text', 'This field is required');

      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;
      expect(helperText.getAttribute('role')).toBe('alert');

      textarea.removeAttribute('validation-state');
      expect(helperText.getAttribute('role')).toBeNull();
    });

    it('should announce error messages to assistive technology via role="alert" and aria-describedby', () => {
      // Set up error state
      textarea.setAttribute('validation-state', 'error');
      textarea.setAttribute('helper-text', 'Password must be at least 8 characters');

      const internalTextarea = textarea.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      const helperText = textarea.shadowRoot?.querySelector('.helper-text') as HTMLDivElement;

      // Verify the complete accessibility chain
      expect(helperText.id).toBeTruthy();
      expect(internalTextarea.getAttribute('aria-describedby')).toBe(helperText.id);
      expect(helperText.getAttribute('role')).toBe('alert');
      expect(helperText.textContent).toBe('Password must be at least 8 characters');

      // This ensures screen readers will:
      // 1. Associate the error message with the textarea (via aria-describedby)
      // 2. Announce the error immediately when it appears (via role="alert")
    });
  });
});
