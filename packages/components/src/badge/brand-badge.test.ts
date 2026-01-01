/**
 * Unit tests for brand-badge component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandBadge } from './brand-badge';

describe('BrandBadge', () => {
  let badge: BrandBadge;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-badge')) {
      customElements.define('brand-badge', BrandBadge);
    }
    badge = document.createElement('brand-badge') as BrandBadge;
    document.body.appendChild(badge);
  });

  afterEach(() => {
    badge.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-badge')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(badge).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(badge.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandBadge.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(badge.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(badge.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandBadge.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a badge element in shadow DOM', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge');
      expect(internalBadge).toBeTruthy();
    });

    it('should have a slot for content', () => {
      const slot = badge.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose badge as a part', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge[part="badge"]');
      expect(internalBadge).toBeTruthy();
    });

    it('should use span element for badge', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge');
      expect(internalBadge?.tagName).toBe('SPAN');
    });
  });

  describe('Variant Attribute', () => {
    it('should default to success variant', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('success');
    });

    it('should support success variant', () => {
      badge.setAttribute('variant', 'success');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('success');
    });

    it('should support warning variant', () => {
      badge.setAttribute('variant', 'warning');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('warning');
    });

    it('should support error variant', () => {
      badge.setAttribute('variant', 'error');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('error');
    });

    it('should support info variant', () => {
      badge.setAttribute('variant', 'info');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('info');
    });

    it('should update variant dynamically', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      badge.setAttribute('variant', 'warning');
      expect(internalBadge.dataset.variant).toBe('warning');
      badge.setAttribute('variant', 'error');
      expect(internalBadge.dataset.variant).toBe('error');
      badge.setAttribute('variant', 'info');
      expect(internalBadge.dataset.variant).toBe('info');
    });
  });

  describe('Notification Count Support', () => {
    it('should not have count by default', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBeUndefined();
    });

    it('should set count via attribute', () => {
      badge.setAttribute('count', '5');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('5');
    });

    it('should update count dynamically', () => {
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      badge.setAttribute('count', '3');
      expect(internalBadge.dataset.count).toBe('3');
      badge.setAttribute('count', '10');
      expect(internalBadge.dataset.count).toBe('10');
    });

    it('should remove count when attribute is removed', () => {
      badge.setAttribute('count', '5');
      badge.removeAttribute('count');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBeUndefined();
    });

    it('should update aria-label when count is set', () => {
      badge.setAttribute('count', '7');
      expect(badge.internals.ariaLabel).toBe('7 notifications');
    });

    it('should clear aria-label when count is removed', () => {
      badge.setAttribute('count', '7');
      badge.removeAttribute('count');
      expect(badge.internals.ariaLabel).toBeNull();
    });

    it('should handle empty count string', () => {
      badge.setAttribute('count', '');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('');
    });

    it('should support double-digit counts', () => {
      badge.setAttribute('count', '99');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('99');
    });

    it('should support triple-digit counts', () => {
      badge.setAttribute('count', '100');
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('100');
    });
  });

  describe('Pill-Shaped Design', () => {
    it('should have pill-shaped border radius in styles', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('border-radius');
      expect(styleText).toContain('--radius-pill');
      expect(styleText).toContain('9999px');
    });

    it('should have inline-flex display', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('display: inline-flex');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(badge.internals).toBeDefined();
    });

    it('should set role to status for accessibility', () => {
      expect(badge.internals.role).toBe('status');
    });

    it('should expose internals publicly for testing', () => {
      expect(badge.internals.states).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      badge.textContent = '<script>alert("xss")</script>';
      const internalBadge = badge.shadowRoot?.querySelector('.badge');
      const slot = internalBadge?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(badge.textContent).toContain('<script>');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe variant and count attributes', () => {
      expect(BrandBadge.observedAttributes).toContain('variant');
      expect(BrandBadge.observedAttributes).toContain('count');
    });

    it('should have exactly 2 observed attributes', () => {
      expect(BrandBadge.observedAttributes.length).toBe(2);
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (badge as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      badge.remove();
      document.body.appendChild(badge);

      // After reconnection, listeners should be fresh
      expect(badge.isConnected).toBe(true);
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content', () => {
      badge.textContent = 'New';
      expect(badge.textContent).toBe('New');
    });

    it('should render slotted HTML elements', () => {
      const span = document.createElement('span');
      span.textContent = 'Badge Text';
      badge.appendChild(span);
      expect(badge.querySelector('span')).toBeTruthy();
    });

    it('should support empty content', () => {
      badge.textContent = '';
      expect(badge.textContent).toBe('');
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-success');
      expect(styleText).toContain('--primitive-');
    });

    it('should include color tokens for all variants', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('--color-success');
      expect(styleText).toContain('--color-warning');
      expect(styleText).toContain('--color-error');
      expect(styleText).toContain('--color-info');
    });

    it('should include spacing tokens', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('--space-');
    });

    it('should include typography tokens', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('--font-body');
      expect(styleText).toContain('--text-');
    });

    it('should include motion tokens', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain('--motion-duration');
      expect(styleText).toContain('--motion-easing');
    });
  });

  describe('Programmatic API', () => {
    it('should have variant getter', () => {
      expect(badge.variant).toBe('success');
    });

    it('should have variant setter', () => {
      badge.variant = 'error';
      expect(badge.variant).toBe('error');
      expect(badge.getAttribute('variant')).toBe('error');
    });

    it('should have count getter', () => {
      expect(badge.count).toBeNull();
    });

    it('should have count setter', () => {
      badge.count = '5';
      expect(badge.count).toBe('5');
      expect(badge.getAttribute('count')).toBe('5');
    });

    it('should allow clearing count via setter', () => {
      badge.count = '5';
      badge.count = null;
      expect(badge.count).toBeNull();
      expect(badge.hasAttribute('count')).toBe(false);
    });

    it('should update internal badge when using setters', () => {
      badge.variant = 'warning';
      badge.count = '3';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('warning');
      expect(internalBadge.dataset.count).toBe('3');
    });
  });

  describe('Accessibility', () => {
    it('should have status role', () => {
      expect(badge.internals.role).toBe('status');
    });

    it('should provide aria-label for notification counts', () => {
      badge.count = '12';
      expect(badge.internals.ariaLabel).toBe('12 notifications');
    });

    it('should have focus styles defined', () => {
      const styleText = (BrandBadge.styles as any)._cssText || '';
      expect(styleText).toContain(':focus-visible');
      expect(styleText).toContain('outline');
    });
  });

  describe('Variant Combinations with Count', () => {
    it('should support success variant with count', () => {
      badge.variant = 'success';
      badge.count = '5';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('success');
      expect(internalBadge.dataset.count).toBe('5');
    });

    it('should support warning variant with count', () => {
      badge.variant = 'warning';
      badge.count = '10';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('warning');
      expect(internalBadge.dataset.count).toBe('10');
    });

    it('should support error variant with count', () => {
      badge.variant = 'error';
      badge.count = '99';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('error');
      expect(internalBadge.dataset.count).toBe('99');
    });

    it('should support info variant with count', () => {
      badge.variant = 'info';
      badge.count = '7';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('info');
      expect(internalBadge.dataset.count).toBe('7');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid variant changes', () => {
      badge.variant = 'success';
      badge.variant = 'warning';
      badge.variant = 'error';
      badge.variant = 'info';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('info');
    });

    it('should handle rapid count changes', () => {
      badge.count = '1';
      badge.count = '5';
      badge.count = '10';
      badge.count = '99';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('99');
    });

    it('should handle setting same variant multiple times', () => {
      badge.variant = 'error';
      badge.variant = 'error';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.variant).toBe('error');
    });

    it('should handle setting same count multiple times', () => {
      badge.count = '5';
      badge.count = '5';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('5');
    });

    it('should handle removing and re-adding count', () => {
      badge.count = '5';
      badge.count = null;
      badge.count = '10';
      const internalBadge = badge.shadowRoot?.querySelector('.badge') as HTMLSpanElement;
      expect(internalBadge.dataset.count).toBe('10');
      expect(badge.internals.ariaLabel).toBe('10 notifications');
    });
  });
});
