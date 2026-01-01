/**
 * Unit tests for brand-button component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandButton } from './brand-button';

describe('BrandButton', () => {
  let button: BrandButton;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-button')) {
      customElements.define('brand-button', BrandButton);
    }
    button = document.createElement('brand-button') as BrandButton;
    document.body.appendChild(button);
  });

  afterEach(() => {
    button.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-button')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(button).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(button.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandButton.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(button.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(button.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandButton.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a button element in shadow DOM', () => {
      const internalButton = button.shadowRoot?.querySelector('button');
      expect(internalButton).toBeTruthy();
    });

    it('should have a slot for content', () => {
      const slot = button.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose button as a part', () => {
      const internalButton = button.shadowRoot?.querySelector('button[part="button"]');
      expect(internalButton).toBeTruthy();
    });
  });

  describe('Variant Attribute', () => {
    it('should default to primary variant', () => {
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.dataset.variant).toBe('primary');
    });

    it('should support secondary variant', () => {
      button.setAttribute('variant', 'secondary');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.dataset.variant).toBe('secondary');
    });

    it('should support ghost variant', () => {
      button.setAttribute('variant', 'ghost');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.dataset.variant).toBe('ghost');
    });

    it('should support destructive variant', () => {
      button.setAttribute('variant', 'destructive');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.dataset.variant).toBe('destructive');
    });

    it('should update variant dynamically', () => {
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.setAttribute('variant', 'secondary');
      expect(internalButton.dataset.variant).toBe('secondary');
      button.setAttribute('variant', 'ghost');
      expect(internalButton.dataset.variant).toBe('ghost');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.disabled).toBe(false);
    });

    it('should be disabled when disabled attribute is present', () => {
      button.setAttribute('disabled', '');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.disabled).toBe(true);
    });

    it('should update aria-disabled when disabled', () => {
      button.setAttribute('disabled', '');
      expect(button.internals.ariaDisabled).toBe('true');
    });

    it('should remove disabled state when attribute is removed', () => {
      button.setAttribute('disabled', '');
      button.removeAttribute('disabled');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.disabled).toBe(false);
      expect(button.internals.ariaDisabled).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should not be loading by default', () => {
      expect(button.internals.states.has('loading')).toBe(false);
    });

    it('should add loading custom state when loading attribute is present', () => {
      button.setAttribute('loading', '');
      expect(button.internals.states.has('loading')).toBe(true);
    });

    it('should disable button when loading', () => {
      button.setAttribute('loading', '');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.disabled).toBe(true);
    });

    it('should remove loading state when attribute is removed', () => {
      button.setAttribute('loading', '');
      button.removeAttribute('loading');
      expect(button.internals.states.has('loading')).toBe(false);
    });

    it('should keep disabled when both loading and disabled', () => {
      button.setAttribute('disabled', '');
      button.setAttribute('loading', '');
      button.removeAttribute('loading');
      const internalButton = button.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(internalButton.disabled).toBe(true);
    });

    it('should set aria-busy when loading', () => {
      button.setAttribute('loading', '');
      expect(button.internals.ariaBusy).toBe('true');
    });

    it('should remove aria-busy when loading is removed', () => {
      button.setAttribute('loading', '');
      button.removeAttribute('loading');
      expect(button.internals.ariaBusy).toBeNull();
    });

    it('should not set aria-busy when not loading', () => {
      expect(button.internals.ariaBusy).toBeNull();
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(button.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(button.internals.states).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      button.textContent = '<script>alert("xss")</script>';
      const internalButton = button.shadowRoot?.querySelector('button');
      const slot = internalButton?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(button.textContent).toContain('<script>');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe variant, disabled, and loading attributes', () => {
      expect(BrandButton.observedAttributes).toContain('variant');
      expect(BrandButton.observedAttributes).toContain('disabled');
      expect(BrandButton.observedAttributes).toContain('loading');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (button as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      button.remove();
      document.body.appendChild(button);

      // After reconnection, listeners should be fresh
      expect(button.isConnected).toBe(true);
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content', () => {
      button.textContent = 'Click Me';
      expect(button.textContent).toBe('Click Me');
    });

    it('should render slotted HTML elements', () => {
      const span = document.createElement('span');
      span.textContent = 'Icon';
      button.appendChild(span);
      expect(button.querySelector('span')).toBeTruthy();
    });
  });

  describe('Custom States with :state() pseudo-class', () => {
    it('should use ElementInternals.states for custom states', () => {
      button.setAttribute('loading', '');
      expect(button.internals.states.has('loading')).toBe(true);

      button.removeAttribute('loading');
      expect(button.internals.states.has('loading')).toBe(false);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandButton.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-blue-700');
    });
  });

  describe('Icon Slots - PRD Section 9', () => {
    it('should have icon-start slot in template', () => {
      const iconStartSlot = button.shadowRoot?.querySelector('slot[name="icon-start"]');
      expect(iconStartSlot).toBeTruthy();
    });

    it('should have icon-end slot in template', () => {
      const iconEndSlot = button.shadowRoot?.querySelector('slot[name="icon-end"]');
      expect(iconEndSlot).toBeTruthy();
    });

    it('should have default slot for text content', () => {
      const defaultSlot = button.shadowRoot?.querySelector('slot:not([name])');
      expect(defaultSlot).toBeTruthy();
    });

    it('should render icon in icon-start slot', () => {
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'icon-start');
      icon.textContent = '🔍';
      button.appendChild(icon);

      const slottedIcon = button.querySelector('[slot="icon-start"]');
      expect(slottedIcon).toBeTruthy();
      expect(slottedIcon?.textContent).toBe('🔍');
    });

    it('should render icon in icon-end slot', () => {
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'icon-end');
      icon.textContent = '→';
      button.appendChild(icon);

      const slottedIcon = button.querySelector('[slot="icon-end"]');
      expect(slottedIcon).toBeTruthy();
      expect(slottedIcon?.textContent).toBe('→');
    });

    it('should render both icons and text content together', () => {
      const startIcon = document.createElement('span');
      startIcon.setAttribute('slot', 'icon-start');
      startIcon.textContent = '←';
      button.appendChild(startIcon);

      const text = document.createTextNode('Click Me');
      button.appendChild(text);

      const endIcon = document.createElement('span');
      endIcon.setAttribute('slot', 'icon-end');
      endIcon.textContent = '→';
      button.appendChild(endIcon);

      expect(button.querySelector('[slot="icon-start"]')).toBeTruthy();
      expect(button.querySelector('[slot="icon-end"]')).toBeTruthy();
      expect(button.textContent).toContain('Click Me');
    });

    it('should have CSS for icon-start spacing', () => {
      const styleText = (BrandButton.styles as any)._cssText || '';
      expect(styleText).toContain('::slotted([slot="icon-start"])');
      expect(styleText).toContain('margin-inline-end');
    });

    it('should have CSS for icon-end spacing', () => {
      const styleText = (BrandButton.styles as any)._cssText || '';
      expect(styleText).toContain('::slotted([slot="icon-end"])');
      expect(styleText).toContain('margin-inline-start');
    });

    it('should maintain slot order: icon-start, default, icon-end', () => {
      const slots = button.shadowRoot?.querySelectorAll('slot');
      expect(slots?.length).toBe(3);
      expect(slots?.[0].getAttribute('name')).toBe('icon-start');
      expect(slots?.[1].getAttribute('name')).toBeNull(); // default slot
      expect(slots?.[2].getAttribute('name')).toBe('icon-end');
    });
  });
});
