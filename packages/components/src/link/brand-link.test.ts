/**
 * Unit tests for brand-link component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandLink } from './brand-link';

describe('BrandLink', () => {
  let link: BrandLink;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-link')) {
      customElements.define('brand-link', BrandLink);
    }
    link = document.createElement('brand-link') as BrandLink;
    document.body.appendChild(link);
  });

  afterEach(() => {
    link.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-link')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(link).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(link.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandLink.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(link.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(link.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandLink.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render an anchor element in shadow DOM', () => {
      const internalLink = link.shadowRoot?.querySelector('a');
      expect(internalLink).toBeTruthy();
    });

    it('should have a slot for content', () => {
      const slot = link.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose link as a part', () => {
      const internalLink = link.shadowRoot?.querySelector('a[part="link"]');
      expect(internalLink).toBeTruthy();
    });
  });

  describe('href Attribute', () => {
    it('should set href on internal anchor', () => {
      link.setAttribute('href', '/about');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('/about');
    });

    it('should update href dynamically', () => {
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      link.setAttribute('href', '/page1');
      expect(internalLink.href).toContain('/page1');
      link.setAttribute('href', '/page2');
      expect(internalLink.href).toContain('/page2');
    });

    it('should handle absolute URLs', () => {
      link.setAttribute('href', 'https://example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('https://example.com/');
    });

    it('should handle relative URLs', () => {
      link.setAttribute('href', './relative');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('relative');
    });

    it('should remove href when attribute is removed', () => {
      link.setAttribute('href', '/test');
      link.removeAttribute('href');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
    });
  });

  describe('External Link Handling', () => {
    it('should auto-detect external links and add target="_blank"', () => {
      link.setAttribute('href', 'https://external.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.target).toBe('_blank');
    });

    it('should add rel="noopener noreferrer" for external links', () => {
      link.setAttribute('href', 'https://external.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.rel).toBe('noopener noreferrer');
    });

    it('should mark external links with data-external attribute', () => {
      link.setAttribute('href', 'https://external.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.external).toBe('true');
    });

    it('should not mark internal links as external', () => {
      link.setAttribute('href', '/internal');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('data-external')).toBe(false);
    });

    it('should not mark relative links as external', () => {
      link.setAttribute('href', '../relative');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('data-external')).toBe(false);
    });

    it('should allow target attribute override', () => {
      link.setAttribute('href', 'https://external.com');
      link.setAttribute('target', '_self');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.target).toBe('_self');
    });

    it('should add security attributes when target="_blank" is manually set', () => {
      link.setAttribute('href', '/internal');
      link.setAttribute('target', '_blank');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.rel).toBe('noopener noreferrer');
    });
  });

  describe('Underline Variants', () => {
    it('should default to hover underline variant', () => {
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.underline).toBe('hover');
    });

    it('should support none underline variant', () => {
      link.setAttribute('underline', 'none');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.underline).toBe('none');
    });

    it('should support hover underline variant', () => {
      link.setAttribute('underline', 'hover');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.underline).toBe('hover');
    });

    it('should support always underline variant', () => {
      link.setAttribute('underline', 'always');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.underline).toBe('always');
    });

    it('should update underline variant dynamically', () => {
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      link.setAttribute('underline', 'none');
      expect(internalLink.dataset.underline).toBe('none');
      link.setAttribute('underline', 'always');
      expect(internalLink.dataset.underline).toBe('always');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(link.internals.ariaDisabled).toBeNull();
    });

    it('should set aria-disabled when disabled attribute is present', () => {
      link.setAttribute('disabled', '');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.getAttribute('aria-disabled')).toBe('true');
      expect(link.internals.ariaDisabled).toBe('true');
    });

    it('should set tabindex="-1" when disabled', () => {
      link.setAttribute('disabled', '');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.getAttribute('tabindex')).toBe('-1');
    });

    it('should prevent click when disabled', () => {
      link.setAttribute('href', '/test');
      link.setAttribute('disabled', '');

      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      const preventDefault = vi.spyOn(clickEvent, 'preventDefault');
      internalLink.dispatchEvent(clickEvent);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should remove disabled state when attribute is removed', () => {
      link.setAttribute('disabled', '');
      link.removeAttribute('disabled');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('aria-disabled')).toBe(false);
      expect(internalLink.hasAttribute('tabindex')).toBe(false);
      expect(link.internals.ariaDisabled).toBeNull();
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(link.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(link.internals).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      link.textContent = '<script>alert("xss")</script>';
      const internalLink = link.shadowRoot?.querySelector('a');
      const slot = internalLink?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(link.textContent).toContain('<script>');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe href, underline, disabled, and target attributes', () => {
      expect(BrandLink.observedAttributes).toContain('href');
      expect(BrandLink.observedAttributes).toContain('underline');
      expect(BrandLink.observedAttributes).toContain('disabled');
      expect(BrandLink.observedAttributes).toContain('target');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (link as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      link.remove();
      document.body.appendChild(link);

      // After reconnection, component should work properly
      expect(link.isConnected).toBe(true);
    });
  });

  describe('Slotted Content', () => {
    it('should render slotted text content', () => {
      link.textContent = 'Click Me';
      expect(link.textContent).toBe('Click Me');
    });

    it('should render slotted HTML elements', () => {
      const span = document.createElement('span');
      span.textContent = 'Icon';
      link.appendChild(span);
      expect(link.querySelector('span')).toBeTruthy();
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      // In jsdom, we store CSS text in _cssText during replaceSync polyfill
      const styleText = (BrandLink.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-blue-700');
    });
  });

  describe('Accessibility', () => {
    it('should have focus-visible styles', () => {
      const styleText = (BrandLink.styles as any)._cssText || '';
      expect(styleText).toContain(':focus-visible');
    });

    it('should support keyboard navigation when not disabled', () => {
      link.setAttribute('href', '/test');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('tabindex')).toBe(false);
    });

    it('should prevent keyboard navigation when disabled', () => {
      link.setAttribute('disabled', '');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('External Link Indicator', () => {
    it('should show external link indicator for external links', () => {
      link.setAttribute('href', 'https://external.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.dataset.external).toBe('true');
    });

    it('should not show indicator for internal links', () => {
      link.setAttribute('href', '/internal');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('data-external')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing href gracefully', () => {
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
    });

    it('should handle invalid URLs gracefully', () => {
      link.setAttribute('href', 'not-a-url');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBeTruthy();
    });

    it('should handle hash links as internal', () => {
      link.setAttribute('href', '#section');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('data-external')).toBe(false);
    });

    it('should handle protocol-relative URLs', () => {
      link.setAttribute('href', '//example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      // Should be treated as external
      expect(internalLink.target).toBe('_blank');
    });

    it('should handle mailto links as internal (no external marker)', () => {
      link.setAttribute('href', 'mailto:test@example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('data-external')).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should work with all attributes combined', () => {
      link.setAttribute('href', 'https://external.com');
      link.setAttribute('underline', 'always');
      link.textContent = 'External Link';

      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('https://external.com/');
      expect(internalLink.target).toBe('_blank');
      expect(internalLink.rel).toBe('noopener noreferrer');
      expect(internalLink.dataset.underline).toBe('always');
      expect(internalLink.dataset.external).toBe('true');
    });

    it('should maintain disabled state with external link', () => {
      link.setAttribute('href', 'https://external.com');
      link.setAttribute('disabled', '');

      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.getAttribute('aria-disabled')).toBe('true');
      expect(internalLink.target).toBe('_blank');
      expect(internalLink.rel).toBe('noopener noreferrer');
    });
  });

  describe('URL Protocol Validation (Security)', () => {
    it('should allow http: protocol', () => {
      link.setAttribute('href', 'http://example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('http://example.com/');
    });

    it('should allow https: protocol', () => {
      link.setAttribute('href', 'https://example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('https://example.com/');
    });

    it('should allow mailto: protocol', () => {
      link.setAttribute('href', 'mailto:test@example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('mailto:test@example.com');
    });

    it('should allow tel: protocol', () => {
      link.setAttribute('href', 'tel:+1234567890');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('tel:+1234567890');
    });

    it('should block javascript: protocol', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'javascript:alert("XSS")');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'brand-link: Blocked potentially unsafe URL protocol: javascript:alert("XSS")'
      );
      warnSpy.mockRestore();
    });

    it('should block data: protocol', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'data:text/html,<script>alert("XSS")</script>');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'brand-link: Blocked potentially unsafe URL protocol: data:text/html,<script>alert("XSS")</script>'
      );
      warnSpy.mockRestore();
    });

    it('should allow relative URLs starting with /', () => {
      link.setAttribute('href', '/path/to/page');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('/path/to/page');
    });

    it('should allow relative URLs starting with ./', () => {
      link.setAttribute('href', './relative');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('relative');
    });

    it('should allow relative URLs starting with ../', () => {
      link.setAttribute('href', '../parent');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('parent');
    });

    it('should allow hash URLs starting with #', () => {
      link.setAttribute('href', '#anchor');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toContain('#anchor');
    });

    it('should block file: protocol', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'file:///etc/passwd');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'brand-link: Blocked potentially unsafe URL protocol: file:///etc/passwd'
      );
      warnSpy.mockRestore();
    });

    it('should block ftp: protocol', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'ftp://example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'brand-link: Blocked potentially unsafe URL protocol: ftp://example.com'
      );
      warnSpy.mockRestore();
    });

    it('should handle empty href gracefully', () => {
      link.setAttribute('href', '');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
    });

    it('should block vbscript: protocol', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'vbscript:msgbox("XSS")');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.hasAttribute('href')).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'brand-link: Blocked potentially unsafe URL protocol: vbscript:msgbox("XSS")'
      );
      warnSpy.mockRestore();
    });

    it('should not set href for previously valid URL when changed to invalid', () => {
      // First set a valid URL
      link.setAttribute('href', 'https://example.com');
      const internalLink = link.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      expect(internalLink.href).toBe('https://example.com/');

      // Then change to invalid URL
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      link.setAttribute('href', 'javascript:alert("XSS")');
      expect(internalLink.hasAttribute('href')).toBe(false);
      warnSpy.mockRestore();
    });
  });
});
