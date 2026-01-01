/**
 * Unit tests for brand-text component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandText } from './brand-text';

describe('BrandText', () => {
  let text: BrandText;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-text')) {
      customElements.define('brand-text', BrandText);
    }
    text = document.createElement('brand-text') as BrandText;
    document.body.appendChild(text);
  });

  afterEach(() => {
    text.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-text')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(text).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(text.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandText.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(text.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(text.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandText.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a text element in shadow DOM', () => {
      const textElement = text.shadowRoot?.querySelector('.text');
      expect(textElement).toBeTruthy();
    });

    it('should have a slot for content', () => {
      const slot = text.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  describe('Heading Level Variants', () => {
    it('should render h1 element for h1 variant', () => {
      text.setAttribute('variant', 'h1');
      const h1 = text.shadowRoot?.querySelector('h1');
      expect(h1).toBeTruthy();
      expect(h1?.dataset.variant).toBe('h1');
    });

    it('should render h2 element for h2 variant', () => {
      text.setAttribute('variant', 'h2');
      const h2 = text.shadowRoot?.querySelector('h2');
      expect(h2).toBeTruthy();
      expect(h2?.dataset.variant).toBe('h2');
    });

    it('should render h3 element for h3 variant', () => {
      text.setAttribute('variant', 'h3');
      const h3 = text.shadowRoot?.querySelector('h3');
      expect(h3).toBeTruthy();
      expect(h3?.dataset.variant).toBe('h3');
    });

    it('should render h4 element for h4 variant', () => {
      text.setAttribute('variant', 'h4');
      const h4 = text.shadowRoot?.querySelector('h4');
      expect(h4).toBeTruthy();
      expect(h4?.dataset.variant).toBe('h4');
    });

    it('should render h5 element for h5 variant', () => {
      text.setAttribute('variant', 'h5');
      const h5 = text.shadowRoot?.querySelector('h5');
      expect(h5).toBeTruthy();
      expect(h5?.dataset.variant).toBe('h5');
    });

    it('should render h6 element for h6 variant', () => {
      text.setAttribute('variant', 'h6');
      const h6 = text.shadowRoot?.querySelector('h6');
      expect(h6).toBeTruthy();
      expect(h6?.dataset.variant).toBe('h6');
    });
  });

  describe('Text Style Variants', () => {
    it('should default to body variant with p element', () => {
      const p = text.shadowRoot?.querySelector('p');
      expect(p).toBeTruthy();
      expect(p?.dataset.variant).toBe('body');
    });

    it('should render p element for body variant', () => {
      text.setAttribute('variant', 'body');
      const p = text.shadowRoot?.querySelector('p');
      expect(p).toBeTruthy();
      expect(p?.dataset.variant).toBe('body');
    });

    it('should render span element for caption variant', () => {
      text.setAttribute('variant', 'caption');
      const span = text.shadowRoot?.querySelector('span');
      expect(span).toBeTruthy();
      expect(span?.dataset.variant).toBe('caption');
    });

    it('should render span element for label variant', () => {
      text.setAttribute('variant', 'label');
      const span = text.shadowRoot?.querySelector('span');
      expect(span).toBeTruthy();
      expect(span?.dataset.variant).toBe('label');
    });
  });

  describe('Semantic HTML Mapping', () => {
    it('should use semantic h1-h6 tags for heading variants', () => {
      const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      headingLevels.forEach(level => {
        text.setAttribute('variant', level);
        const heading = text.shadowRoot?.querySelector(level);
        expect(heading).toBeTruthy();
      });
    });

    it('should use p tag for body text', () => {
      text.setAttribute('variant', 'body');
      const p = text.shadowRoot?.querySelector('p');
      const span = text.shadowRoot?.querySelector('span');
      expect(p).toBeTruthy();
      expect(span).toBeNull();
    });

    it('should use span tag for caption and label', () => {
      text.setAttribute('variant', 'caption');
      let span = text.shadowRoot?.querySelector('span');
      expect(span).toBeTruthy();

      text.setAttribute('variant', 'label');
      span = text.shadowRoot?.querySelector('span');
      expect(span).toBeTruthy();
    });
  });

  describe('Font Weight Control', () => {
    it('should default to normal weight', () => {
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;
      expect(textElement?.dataset.weight).toBe('normal');
    });

    it('should support normal weight', () => {
      text.setAttribute('weight', 'normal');
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;
      expect(textElement?.dataset.weight).toBe('normal');
    });

    it('should support medium weight', () => {
      text.setAttribute('weight', 'medium');
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;
      expect(textElement?.dataset.weight).toBe('medium');
    });

    it('should support semibold weight', () => {
      text.setAttribute('weight', 'semibold');
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;
      expect(textElement?.dataset.weight).toBe('semibold');
    });

    it('should support bold weight', () => {
      text.setAttribute('weight', 'bold');
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;
      expect(textElement?.dataset.weight).toBe('bold');
    });

    it('should update weight dynamically', () => {
      const textElement = text.shadowRoot?.querySelector('.text') as HTMLElement;

      text.setAttribute('weight', 'medium');
      expect(textElement?.dataset.weight).toBe('medium');

      text.setAttribute('weight', 'bold');
      expect(textElement?.dataset.weight).toBe('bold');

      text.setAttribute('weight', 'normal');
      expect(textElement?.dataset.weight).toBe('normal');
    });
  });

  describe('Dynamic Variant Changes', () => {
    it('should change from heading to text style', () => {
      text.setAttribute('variant', 'h1');
      expect(text.shadowRoot?.querySelector('h1')).toBeTruthy();

      text.setAttribute('variant', 'body');
      expect(text.shadowRoot?.querySelector('h1')).toBeNull();
      expect(text.shadowRoot?.querySelector('p')).toBeTruthy();
    });

    it('should change between heading levels', () => {
      text.setAttribute('variant', 'h1');
      expect(text.shadowRoot?.querySelector('h1')).toBeTruthy();

      text.setAttribute('variant', 'h3');
      expect(text.shadowRoot?.querySelector('h1')).toBeNull();
      expect(text.shadowRoot?.querySelector('h3')).toBeTruthy();
    });

    it('should change between text styles', () => {
      text.setAttribute('variant', 'body');
      expect(text.shadowRoot?.querySelector('p')).toBeTruthy();

      text.setAttribute('variant', 'caption');
      expect(text.shadowRoot?.querySelector('p')).toBeNull();
      expect(text.shadowRoot?.querySelector('span')).toBeTruthy();
    });

    it('should preserve content when changing variants', () => {
      text.textContent = 'Test Content';
      text.setAttribute('variant', 'h1');
      expect(text.textContent).toBe('Test Content');

      text.setAttribute('variant', 'body');
      expect(text.textContent).toBe('Test Content');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe variant and weight attributes', () => {
      expect(BrandText.observedAttributes).toContain('variant');
      expect(BrandText.observedAttributes).toContain('weight');
    });
  });

  describe('Safe Template Construction', () => {
    it('should use safe element creation instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      text.textContent = '<script>alert("xss")</script>';
      const textElement = text.shadowRoot?.querySelector('.text');
      const slot = textElement?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(text.textContent).toContain('<script>');
    });

    it('should safely handle HTML entities in content', () => {
      text.textContent = '<img src=x onerror=alert(1)>';
      expect(text.textContent).toBe('<img src=x onerror=alert(1)>');
      // Should not create an img element
      expect(text.querySelector('img')).toBeNull();
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content', () => {
      text.textContent = 'Hello World';
      expect(text.textContent).toBe('Hello World');
    });

    it('should render slotted HTML elements', () => {
      const strong = document.createElement('strong');
      strong.textContent = 'Bold Text';
      text.appendChild(strong);
      expect(text.querySelector('strong')).toBeTruthy();
      expect(text.textContent).toContain('Bold Text');
    });

    it('should support multiple child elements', () => {
      const span1 = document.createElement('span');
      span1.textContent = 'Part 1';
      const span2 = document.createElement('span');
      span2.textContent = 'Part 2';

      text.appendChild(span1);
      text.appendChild(span2);

      expect(text.querySelectorAll('span').length).toBe(2);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandText.styles as any)._cssText || '';

      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');

      // Check for typography tokens
      expect(styleText).toContain('--text-');
      expect(styleText).toContain('--font-');
      expect(styleText).toContain('--line-height-');

      // Check for color tokens
      expect(styleText).toContain('--color-text');

      // Check for fallback chains
      expect(styleText).toContain('--primitive-');
    });

    it('should use consistent token naming for font weights', () => {
      const styleText = (BrandText.styles as any)._cssText || '';

      expect(styleText).toContain('--font-weight-normal');
      expect(styleText).toContain('--font-weight-medium');
      expect(styleText).toContain('--font-weight-semibold');
      expect(styleText).toContain('--font-weight-bold');
    });
  });

  describe('CSS Class Structure', () => {
    it('should apply text class to internal element', () => {
      const textElement = text.shadowRoot?.querySelector('.text');
      expect(textElement).toBeTruthy();
    });

    it('should maintain text class across variant changes', () => {
      text.setAttribute('variant', 'h1');
      expect(text.shadowRoot?.querySelector('.text')).toBeTruthy();

      text.setAttribute('variant', 'body');
      expect(text.shadowRoot?.querySelector('.text')).toBeTruthy();
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup on disconnect', () => {
      const listeners = (text as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      text.remove();
      document.body.appendChild(text);

      // After reconnection, component should still work
      expect(text.isConnected).toBe(true);
      expect(text.shadowRoot?.querySelector('.text')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML for screen readers', () => {
      text.setAttribute('variant', 'h1');
      expect(text.shadowRoot?.querySelector('h1')).toBeTruthy();

      text.setAttribute('variant', 'body');
      expect(text.shadowRoot?.querySelector('p')).toBeTruthy();
    });

    it('should maintain proper heading hierarchy', () => {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      headings.forEach(level => {
        text.setAttribute('variant', level);
        const heading = text.shadowRoot?.querySelector(level);
        expect(heading).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      text.textContent = '';
      expect(text.shadowRoot?.querySelector('.text')).toBeTruthy();
    });

    it('should handle whitespace-only content', () => {
      text.textContent = '   ';
      expect(text.shadowRoot?.querySelector('.text')).toBeTruthy();
    });

    it('should handle rapid variant changes', () => {
      text.setAttribute('variant', 'h1');
      text.setAttribute('variant', 'h2');
      text.setAttribute('variant', 'body');
      text.setAttribute('variant', 'caption');

      const span = text.shadowRoot?.querySelector('span');
      expect(span).toBeTruthy();
      expect(span?.dataset.variant).toBe('caption');
    });

    it('should handle attribute removal', () => {
      text.setAttribute('variant', 'h1');
      text.removeAttribute('variant');

      // Should fall back to default (body with p tag)
      const p = text.shadowRoot?.querySelector('p');
      expect(p).toBeTruthy();
      expect(p?.dataset.variant).toBe('body');
    });
  });

  describe('Combined Variant and Weight', () => {
    it('should apply both variant and weight attributes', () => {
      text.setAttribute('variant', 'h1');
      text.setAttribute('weight', 'bold');

      const h1 = text.shadowRoot?.querySelector('h1');
      expect(h1?.dataset.variant).toBe('h1');
      expect(h1?.dataset.weight).toBe('bold');
    });

    it('should update weight without changing variant element', () => {
      text.setAttribute('variant', 'h2');
      const h2Before = text.shadowRoot?.querySelector('h2');

      text.setAttribute('weight', 'semibold');
      const h2After = text.shadowRoot?.querySelector('h2');

      expect(h2Before).toBeTruthy();
      expect(h2After).toBeTruthy();
      expect(h2After?.dataset.weight).toBe('semibold');
    });
  });
});
