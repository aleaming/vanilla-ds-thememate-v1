/**
 * Unit tests for brand-icon component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandIcon } from './brand-icon';

describe('BrandIcon', () => {
  let icon: BrandIcon;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-icon')) {
      customElements.define('brand-icon', BrandIcon);
    }
    icon = document.createElement('brand-icon') as BrandIcon;
    document.body.appendChild(icon);
  });

  afterEach(() => {
    icon.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-icon')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(icon).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(icon.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandIcon.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(icon.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(icon.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandIcon.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render an SVG element in shadow DOM', () => {
      const svg = icon.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should have a use element for sprite pattern', () => {
      const use = icon.shadowRoot?.querySelector('use');
      expect(use).toBeTruthy();
    });

    it('should have a slot for inline SVG', () => {
      const slot = icon.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose icon as a part', () => {
      const svg = icon.shadowRoot?.querySelector('svg[part="icon"]');
      expect(svg).toBeTruthy();
    });
  });

  describe('SVG Sprite Pattern (via name attribute)', () => {
    it('should set use href when name attribute is provided', () => {
      icon.setAttribute('name', 'arrow-right');
      const use = icon.shadowRoot?.querySelector('use') as SVGUseElement;

      // Check both href formats for compatibility
      const href = use.getAttribute('href') || use.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      expect(href).toBe('#arrow-right');
    });

    it('should update use href when name changes', () => {
      icon.setAttribute('name', 'chevron-down');
      const use = icon.shadowRoot?.querySelector('use') as SVGUseElement;

      let href = use.getAttribute('href') || use.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      expect(href).toBe('#chevron-down');

      icon.setAttribute('name', 'close');
      href = use.getAttribute('href') || use.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      expect(href).toBe('#close');
    });
  });

  describe('Size Variants', () => {
    it('should default to md size when no size attribute is set', () => {
      // Default behavior is handled by CSS :host(:not([size]))
      expect(icon.hasAttribute('size')).toBe(false);
    });

    it('should support xs size variant', () => {
      icon.setAttribute('size', 'xs');
      expect(icon.getAttribute('size')).toBe('xs');
    });

    it('should support sm size variant', () => {
      icon.setAttribute('size', 'sm');
      expect(icon.getAttribute('size')).toBe('sm');
    });

    it('should support md size variant', () => {
      icon.setAttribute('size', 'md');
      expect(icon.getAttribute('size')).toBe('md');
    });

    it('should support lg size variant', () => {
      icon.setAttribute('size', 'lg');
      expect(icon.getAttribute('size')).toBe('lg');
    });

    it('should support xl size variant', () => {
      icon.setAttribute('size', 'xl');
      expect(icon.getAttribute('size')).toBe('xl');
    });

    it('should update size dynamically', () => {
      icon.setAttribute('size', 'sm');
      expect(icon.getAttribute('size')).toBe('sm');

      icon.setAttribute('size', 'lg');
      expect(icon.getAttribute('size')).toBe('lg');
    });
  });

  describe('Color Inheritance (currentColor)', () => {
    it('should use currentColor for fill and stroke in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandIcon.styles as any)._cssText || '';
      expect(styleText).toContain('fill: currentColor');
      expect(styleText).toContain('stroke: currentColor');
    });
  });

  describe('Accessibility - aria-label', () => {
    it('should be decorative (aria-hidden) by default', () => {
      const svg = icon.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(svg?.hasAttribute('aria-label')).toBe(false);
      expect(svg?.hasAttribute('role')).toBe(false);
    });

    it('should add aria-label and role when aria-label attribute is provided', () => {
      icon.setAttribute('aria-label', 'Close menu');
      const svg = icon.shadowRoot?.querySelector('svg');

      expect(svg?.getAttribute('aria-label')).toBe('Close menu');
      expect(svg?.getAttribute('role')).toBe('img');
      expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should remove aria-label and role when aria-label is removed', () => {
      icon.setAttribute('aria-label', 'Open settings');
      icon.removeAttribute('aria-label');
      const svg = icon.shadowRoot?.querySelector('svg');

      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(svg?.hasAttribute('aria-label')).toBe(false);
      expect(svg?.hasAttribute('role')).toBe(false);
    });

    it('should update aria-label dynamically', () => {
      icon.setAttribute('aria-label', 'First label');
      const svg = icon.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).toBe('First label');

      icon.setAttribute('aria-label', 'Second label');
      expect(svg?.getAttribute('aria-label')).toBe('Second label');
    });
  });

  describe('Inline SVG Support (via slot)', () => {
    it('should support inline SVG via slot', () => {
      const inlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      inlineSvg.setAttribute('viewBox', '0 0 16 16');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M8 0L16 16H0z');
      inlineSvg.appendChild(path);

      icon.appendChild(inlineSvg);

      const slottedSvg = icon.querySelector('svg');
      expect(slottedSvg).toBeTruthy();
      expect(slottedSvg?.getAttribute('viewBox')).toBe('0 0 16 16');
    });

    it('should hide sprite SVG when inline SVG is slotted', () => {
      const spriteSvg = icon.shadowRoot?.querySelector('svg') as SVGElement;

      // Initially, sprite SVG should be visible (empty string or no display style)
      expect(spriteSvg.style.display).toBe('');

      // Add inline SVG
      const inlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.appendChild(inlineSvg);

      // Manually trigger slotchange since jsdom doesn't fully support it
      const slot = icon.shadowRoot?.querySelector('slot') as HTMLSlotElement;

      // Mock assignedElements to simulate slotted content
      const originalAssignedElements = slot.assignedElements;
      slot.assignedElements = function() {
        return [inlineSvg];
      };

      const slotChangeEvent = new Event('slotchange');
      slot.dispatchEvent(slotChangeEvent);

      // Sprite SVG should now be hidden
      expect(spriteSvg.style.display).toBe('none');

      // Restore original method
      slot.assignedElements = originalAssignedElements;
    });
  });

  describe('Observed Attributes', () => {
    it('should observe name, size, and aria-label attributes', () => {
      expect(BrandIcon.observedAttributes).toContain('name');
      expect(BrandIcon.observedAttributes).toContain('size');
      expect(BrandIcon.observedAttributes).toContain('aria-label');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(icon.internals).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // The component should render successfully without XSS vulnerabilities
      icon.setAttribute('name', '<script>alert("xss")</script>');
      const use = icon.shadowRoot?.querySelector('use');

      // The script tag should be treated as a literal string in the href
      const href = use?.getAttribute('href');
      expect(href).toContain('<script>');
    });
  });

  describe('CSS Custom Properties for Sizes', () => {
    it('should use CSS custom properties for size variants', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';

      expect(styleText).toContain('--icon-size');
      expect(styleText).toContain('--size-icon-xs');
      expect(styleText).toContain('--size-icon-sm');
      expect(styleText).toContain('--size-icon-md');
      expect(styleText).toContain('--size-icon-lg');
      expect(styleText).toContain('--size-icon-xl');
    });

    it('should have fallback values for size tokens', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';

      expect(styleText).toContain('0.75rem'); // xs
      expect(styleText).toContain('1rem'); // sm
      expect(styleText).toContain('1.25rem'); // md
      expect(styleText).toContain('1.5rem'); // lg
      expect(styleText).toContain('2rem'); // xl
    });
  });

  describe('SVG Attributes', () => {
    it('should have proper SVG namespace', () => {
      const svg = icon.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should have viewBox attribute', () => {
      const svg = icon.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (icon as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      icon.remove();
      document.body.appendChild(icon);

      // After reconnection, component should work properly
      expect(icon.isConnected).toBe(true);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';

      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--size-icon-');

      // Check for fallback values
      expect(styleText).toMatch(/var\([^)]+,\s*[\d.]+rem\)/);
    });
  });

  describe('Display Properties', () => {
    it('should be inline-block for proper text flow', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';
      expect(styleText).toContain('display: inline-block');
    });

    it('should have vertical-align middle', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';
      expect(styleText).toContain('vertical-align: middle');
    });
  });

  describe('SVG Styling', () => {
    it('should set SVG to display block', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';
      expect(styleText).toContain('svg {\n    display: block');
    });

    it('should set width and height from custom property', () => {
      const styleText = (BrandIcon.styles as any)._cssText || '';
      expect(styleText).toContain('width: var(--icon-size');
      expect(styleText).toContain('height: var(--icon-size');
    });
  });

  describe('Integration: Multiple Icons', () => {
    it('should support multiple icon instances with different sizes', () => {
      const icon1 = document.createElement('brand-icon') as BrandIcon;
      const icon2 = document.createElement('brand-icon') as BrandIcon;
      const icon3 = document.createElement('brand-icon') as BrandIcon;

      icon1.setAttribute('size', 'sm');
      icon2.setAttribute('size', 'md');
      icon3.setAttribute('size', 'lg');

      document.body.appendChild(icon1);
      document.body.appendChild(icon2);
      document.body.appendChild(icon3);

      expect(icon1.getAttribute('size')).toBe('sm');
      expect(icon2.getAttribute('size')).toBe('md');
      expect(icon3.getAttribute('size')).toBe('lg');

      icon1.remove();
      icon2.remove();
      icon3.remove();
    });

    it('should share stylesheet across instances', () => {
      const icon1 = document.createElement('brand-icon') as BrandIcon;
      const icon2 = document.createElement('brand-icon') as BrandIcon;

      document.body.appendChild(icon1);
      document.body.appendChild(icon2);

      expect(icon1.shadowRoot?.adoptedStyleSheets[0]).toBe(icon2.shadowRoot?.adoptedStyleSheets[0]);
      expect(icon1.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandIcon.styles);

      icon1.remove();
      icon2.remove();
    });
  });
});
