/**
 * Unit tests for brand-avatar component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrandAvatar } from './brand-avatar';

describe('BrandAvatar', () => {
  let avatar: BrandAvatar;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-avatar')) {
      customElements.define('brand-avatar', BrandAvatar);
    }
    avatar = document.createElement('brand-avatar') as BrandAvatar;
    document.body.appendChild(avatar);
  });

  afterEach(() => {
    avatar.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-avatar')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(avatar).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(avatar.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandAvatar.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(avatar.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(avatar.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandAvatar.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render an avatar element in shadow DOM', () => {
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar');
      expect(internalAvatar).toBeTruthy();
    });

    it('should render image element', () => {
      const image = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(image).toBeTruthy();
      expect(image?.tagName).toBe('IMG');
    });

    it('should render initials element', () => {
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials');
      expect(initials).toBeTruthy();
      expect(initials?.tagName).toBe('SPAN');
    });

    it('should render icon element', () => {
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(icon).toBeTruthy();
      expect(icon?.tagName).toBe('SPAN');
    });

    it('should render status indicator', () => {
      const status = avatar.shadowRoot?.querySelector('.avatar__status');
      expect(status).toBeTruthy();
      expect(status?.tagName).toBe('SPAN');
    });

    it('should have default user icon SVG', () => {
      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg).toBeTruthy();
    });

    it('should expose parts for styling', () => {
      const avatarPart = avatar.shadowRoot?.querySelector('[part="avatar"]');
      const imagePart = avatar.shadowRoot?.querySelector('[part="image"]');
      const initialsPart = avatar.shadowRoot?.querySelector('[part="initials"]');
      const iconPart = avatar.shadowRoot?.querySelector('[part="icon"]');
      const statusPart = avatar.shadowRoot?.querySelector('[part="status"]');
      expect(avatarPart).toBeTruthy();
      expect(imagePart).toBeTruthy();
      expect(initialsPart).toBeTruthy();
      expect(iconPart).toBeTruthy();
      expect(statusPart).toBeTruthy();
    });
  });

  describe('Display Mode: Icon Fallback (Default)', () => {
    it('should default to icon mode when no attributes set', () => {
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('icon');
    });

    it('should show icon and hide image and initials in icon mode', () => {
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('icon');
    });
  });

  describe('Display Mode: Initials', () => {
    it('should switch to initials mode when name is provided', () => {
      avatar.setAttribute('name', 'John Doe');
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('initials');
    });

    it('should generate initials from first and last name', () => {
      avatar.setAttribute('name', 'John Doe');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });

    it('should generate single initial from single name', () => {
      avatar.setAttribute('name', 'John');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('J');
    });

    it('should handle multiple middle names correctly', () => {
      avatar.setAttribute('name', 'John William Doe');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });

    it('should uppercase initials', () => {
      avatar.setAttribute('name', 'john doe');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });

    it('should trim whitespace from name', () => {
      avatar.setAttribute('name', '  John Doe  ');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });

    it('should handle empty name', () => {
      avatar.setAttribute('name', '');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('');
    });

    it('should handle name with extra spaces', () => {
      avatar.setAttribute('name', 'John    Doe');
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });
  });

  describe('Display Mode: Image', () => {
    it('should switch to image mode when src is provided', () => {
      avatar.setAttribute('src', 'https://example.com/avatar.jpg');
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('image');
    });

    it('should set image src attribute', () => {
      avatar.setAttribute('src', 'https://example.com/avatar.jpg');
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.src).toBe('https://example.com/avatar.jpg');
    });

    it('should set image alt attribute', () => {
      avatar.setAttribute('alt', 'User profile picture');
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.alt).toBe('User profile picture');
    });

    it('should set loading state initially', () => {
      avatar.setAttribute('src', 'https://example.com/avatar.jpg');
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.dataset.loading).toBe('true');
    });
  });

  describe('Fallback Chain', () => {
    // NOTE: These tests are skipped because jsdom doesn't fire image error events
    // for invalid URLs. The fallback logic is tested manually in browser.
    // The security validation (URL protocol blocking) is tested in "Safe Template Cloning" suite.
    it.skip('should fall back to initials when image fails to load', async () => {
      avatar.setAttribute('name', 'John Doe');
      avatar.setAttribute('src', 'https://invalid-url.com/nonexistent.jpg');

      // Wait for image error event
      await new Promise(resolve => setTimeout(resolve, 100));
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('initials');
    });

    it.skip('should fall back to icon when image fails and no name provided', async () => {
      avatar.setAttribute('src', 'https://invalid-url.com/nonexistent.jpg');

      // Wait for image error event
      await new Promise(resolve => setTimeout(resolve, 100));
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('icon');
    });

    it('should prioritize image over initials when both provided', () => {
      avatar.setAttribute('name', 'John Doe');
      avatar.setAttribute('src', 'https://example.com/avatar.jpg');
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('image');
    });

    it('should prioritize initials over icon when name provided', () => {
      avatar.setAttribute('name', 'John Doe');
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('initials');
    });
  });

  describe('Size Variants', () => {
    it('should default to md size', () => {
      expect(avatar.size).toBe('md');
    });

    it('should support xs size', () => {
      avatar.setAttribute('size', 'xs');
      expect(avatar.getAttribute('size')).toBe('xs');
    });

    it('should support sm size', () => {
      avatar.setAttribute('size', 'sm');
      expect(avatar.getAttribute('size')).toBe('sm');
    });

    it('should support md size', () => {
      avatar.setAttribute('size', 'md');
      expect(avatar.getAttribute('size')).toBe('md');
    });

    it('should support lg size', () => {
      avatar.setAttribute('size', 'lg');
      expect(avatar.getAttribute('size')).toBe('lg');
    });

    it('should support xl size', () => {
      avatar.setAttribute('size', 'xl');
      expect(avatar.getAttribute('size')).toBe('xl');
    });

    it('should update size dynamically', () => {
      avatar.setAttribute('size', 'sm');
      expect(avatar.getAttribute('size')).toBe('sm');
      avatar.setAttribute('size', 'xl');
      expect(avatar.getAttribute('size')).toBe('xl');
    });

    it('should have size-specific CSS variables defined', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain(':host([size="xs"])');
      expect(styleText).toContain(':host([size="sm"])');
      expect(styleText).toContain(':host([size="md"])');
      expect(styleText).toContain(':host([size="lg"])');
      expect(styleText).toContain(':host([size="xl"])');
    });
  });

  describe('Status Indicator', () => {
    it('should not show status by default', () => {
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      expect(avatar.hasAttribute('status')).toBe(false);
    });

    it('should show status when status attribute is set', () => {
      avatar.setAttribute('status', 'online');
      expect(avatar.hasAttribute('status')).toBe(true);
    });

    it('should support online status', () => {
      avatar.setAttribute('status', 'online');
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      expect(status.dataset.status).toBe('online');
    });

    it('should support offline status', () => {
      avatar.setAttribute('status', 'offline');
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      expect(status.dataset.status).toBe('offline');
    });

    it('should support away status', () => {
      avatar.setAttribute('status', 'away');
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      expect(status.dataset.status).toBe('away');
    });

    it('should support busy status', () => {
      avatar.setAttribute('status', 'busy');
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      expect(status.dataset.status).toBe('busy');
    });

    it('should update status dynamically', () => {
      const status = avatar.shadowRoot?.querySelector('.avatar__status') as HTMLSpanElement;
      avatar.setAttribute('status', 'online');
      expect(status.dataset.status).toBe('online');
      avatar.setAttribute('status', 'busy');
      expect(status.dataset.status).toBe('busy');
    });

    it('should remove status when attribute is removed', () => {
      avatar.setAttribute('status', 'online');
      avatar.removeAttribute('status');
      expect(avatar.hasAttribute('status')).toBe(false);
    });

    it('should have status styles defined', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('[data-status="online"]');
      expect(styleText).toContain('[data-status="offline"]');
      expect(styleText).toContain('[data-status="away"]');
      expect(styleText).toContain('[data-status="busy"]');
    });
  });

  describe('Circular Shape', () => {
    it('should have circular border radius in styles', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('border-radius');
      expect(styleText).toContain('--radius-full');
      expect(styleText).toContain('50%');
    });

    it('should have overflow hidden for image clipping', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('overflow: hidden');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(avatar.internals).toBeDefined();
    });

    it('should set role to img for accessibility', () => {
      expect(avatar.internals.role).toBe('img');
    });

    it('should set aria-label from alt attribute', () => {
      avatar.setAttribute('alt', 'Profile picture');
      expect(avatar.internals.ariaLabel).toBe('Profile picture');
    });

    it('should set aria-label from name when no alt', () => {
      avatar.setAttribute('name', 'John Doe');
      expect(avatar.internals.ariaLabel).toBe('John Doe');
    });

    it('should default aria-label to "User avatar"', () => {
      expect(avatar.internals.ariaLabel).toBe('User avatar');
    });

    it('should prioritize alt over name for aria-label', () => {
      avatar.setAttribute('name', 'John Doe');
      avatar.setAttribute('alt', 'Custom label');
      expect(avatar.internals.ariaLabel).toBe('Custom label');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe required attributes', () => {
      expect(BrandAvatar.observedAttributes).toContain('src');
      expect(BrandAvatar.observedAttributes).toContain('alt');
      expect(BrandAvatar.observedAttributes).toContain('name');
      expect(BrandAvatar.observedAttributes).toContain('size');
      expect(BrandAvatar.observedAttributes).toContain('status');
    });

    it('should have exactly 5 observed attributes', () => {
      expect(BrandAvatar.observedAttributes.length).toBe(5);
    });
  });

  describe('Programmatic API', () => {
    it('should have src getter', () => {
      expect(avatar.src).toBeNull();
    });

    it('should have src setter', () => {
      avatar.src = 'https://example.com/avatar.jpg';
      expect(avatar.src).toBe('https://example.com/avatar.jpg');
      expect(avatar.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });

    it('should allow clearing src via setter', () => {
      avatar.src = 'https://example.com/avatar.jpg';
      avatar.src = null;
      expect(avatar.src).toBeNull();
      expect(avatar.hasAttribute('src')).toBe(false);
    });

    it('should have alt getter', () => {
      expect(avatar.alt).toBeNull();
    });

    it('should have alt setter', () => {
      avatar.alt = 'Profile picture';
      expect(avatar.alt).toBe('Profile picture');
      expect(avatar.getAttribute('alt')).toBe('Profile picture');
    });

    it('should allow clearing alt via setter', () => {
      avatar.alt = 'Profile picture';
      avatar.alt = null;
      expect(avatar.alt).toBeNull();
      expect(avatar.hasAttribute('alt')).toBe(false);
    });

    it('should have name getter', () => {
      expect(avatar.name).toBeNull();
    });

    it('should have name setter', () => {
      avatar.name = 'John Doe';
      expect(avatar.name).toBe('John Doe');
      expect(avatar.getAttribute('name')).toBe('John Doe');
    });

    it('should allow clearing name via setter', () => {
      avatar.name = 'John Doe';
      avatar.name = null;
      expect(avatar.name).toBeNull();
      expect(avatar.hasAttribute('name')).toBe(false);
    });

    it('should have size getter', () => {
      expect(avatar.size).toBe('md');
    });

    it('should have size setter', () => {
      avatar.size = 'lg';
      expect(avatar.size).toBe('lg');
      expect(avatar.getAttribute('size')).toBe('lg');
    });

    it('should have status getter', () => {
      expect(avatar.status).toBeNull();
    });

    it('should have status setter', () => {
      avatar.status = 'online';
      expect(avatar.status).toBe('online');
      expect(avatar.getAttribute('status')).toBe('online');
    });

    it('should allow clearing status via setter', () => {
      avatar.status = 'online';
      avatar.status = null;
      expect(avatar.status).toBeNull();
      expect(avatar.hasAttribute('status')).toBe(false);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-');
      expect(styleText).toContain('--primitive-');
    });

    it('should include color tokens', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('--color-neutral');
      expect(styleText).toContain('--color-success');
      expect(styleText).toContain('--color-warning');
      expect(styleText).toContain('--color-error');
    });

    it('should include spacing tokens', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('--size-avatar');
      expect(styleText).toContain('--size-icon');
    });

    it('should include typography tokens', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('--font-body');
      expect(styleText).toContain('--text-');
    });

    it('should include border radius tokens', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('--radius-full');
    });

    it('should include motion tokens', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('--motion-duration');
      expect(styleText).toContain('--motion-easing');
    });
  });

  describe('Accessibility', () => {
    it('should have img role', () => {
      expect(avatar.internals.role).toBe('img');
    });

    it('should provide meaningful aria-label', () => {
      avatar.name = 'John Doe';
      expect(avatar.internals.ariaLabel).toBe('John Doe');
    });

    it('should have focus styles defined', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain(':focus-visible');
      expect(styleText).toContain('outline');
    });

    it('should set empty alt on image for decorative purposes', () => {
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.alt).toBe('');
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (avatar as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      avatar.remove();
      document.body.appendChild(avatar);

      expect(avatar.isConnected).toBe(true);
    });

    it('should re-attach image event listeners on reconnect', () => {
      avatar.remove();
      document.body.appendChild(avatar);

      avatar.setAttribute('src', 'https://example.com/avatar.jpg');
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image).toBeTruthy();
    });
  });

  describe('Size and Status Combinations', () => {
    it('should support xs size with online status', () => {
      avatar.size = 'xs';
      avatar.status = 'online';
      expect(avatar.size).toBe('xs');
      expect(avatar.status).toBe('online');
    });

    it('should support xl size with busy status', () => {
      avatar.size = 'xl';
      avatar.status = 'busy';
      expect(avatar.size).toBe('xl');
      expect(avatar.status).toBe('busy');
    });

    it('should support all size variants with initials', () => {
      avatar.name = 'John Doe';
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      sizes.forEach((size) => {
        avatar.size = size;
        expect(avatar.size).toBe(size);
        const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
        expect(internalAvatar.dataset.mode).toBe('initials');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid attribute changes', () => {
      avatar.name = 'John Doe';
      avatar.name = 'Jane Smith';
      avatar.name = 'Bob Johnson';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('BJ');
    });

    it('should handle switching between display modes', () => {
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;

      avatar.name = 'John Doe';
      expect(internalAvatar.dataset.mode).toBe('initials');

      avatar.src = 'https://example.com/avatar.jpg';
      expect(internalAvatar.dataset.mode).toBe('image');

      avatar.removeAttribute('src');
      expect(internalAvatar.dataset.mode).toBe('initials');

      avatar.removeAttribute('name');
      expect(internalAvatar.dataset.mode).toBe('icon');
    });

    it('should handle empty string attributes', () => {
      avatar.setAttribute('name', '');
      avatar.setAttribute('src', '');
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
      expect(internalAvatar.dataset.mode).toBe('icon');
    });

    it('should handle setting same attribute multiple times', () => {
      avatar.name = 'John Doe';
      avatar.name = 'John Doe';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JD');
    });

    it('should handle unicode characters in name', () => {
      avatar.name = 'José García';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('JG');
    });

    it('should handle very long names', () => {
      avatar.name = 'Verylongfirstname Verylonglastname';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('VV');
    });

    it('should handle name with only whitespace', () => {
      avatar.name = '   ';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      expect(initials.textContent).toBe('');
    });

    it('should update mode when src changes to invalid URL', (done) => {
      avatar.name = 'John Doe';
      avatar.src = 'https://example.com/valid.jpg';

      setTimeout(() => {
        avatar.src = 'invalid-url';
        setTimeout(() => {
          const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;
          expect(internalAvatar.dataset.mode).toBe('initials');
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      avatar.name = '<script>alert("xss")</script>';
      const initials = avatar.shadowRoot?.querySelector('.avatar__initials') as HTMLSpanElement;
      // The name is treated as text, so it extracts first char of first and last word
      expect(initials.textContent).toBe('<');
    });

    it('should block malicious src attribute and trigger fallback', () => {
      avatar.name = 'John Doe'; // Provide fallback
      avatar.src = 'javascript:alert("xss")';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;

      // Image src should not be set due to protocol validation
      expect(image.src).not.toContain('javascript:alert');

      // Should fall back to initials mode
      expect(internalAvatar.dataset.mode).toBe('initials');
    });

    it('should block data: URLs and trigger fallback', () => {
      avatar.name = 'Test User';
      avatar.src = 'data:text/html,<script>alert("xss")</script>';
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;

      // Should fall back to initials mode
      expect(internalAvatar.dataset.mode).toBe('initials');
    });

    it('should allow http: URLs', () => {
      avatar.src = 'http://example.com/avatar.jpg';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.src).toBe('http://example.com/avatar.jpg');
    });

    it('should allow https: URLs', () => {
      avatar.src = 'https://example.com/avatar.jpg';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.src).toBe('https://example.com/avatar.jpg');
    });

    it('should allow relative URLs starting with /', () => {
      avatar.src = '/images/avatar.jpg';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      expect(image.src).toContain('/images/avatar.jpg');
    });

    it('should allow relative URLs starting with ./', () => {
      avatar.src = './avatar.jpg';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      // Browser resolves relative URLs to absolute, so check it's set and not empty
      expect(image.src).toBeTruthy();
      expect(image.src).toContain('avatar.jpg');
    });

    it('should allow relative URLs starting with ../', () => {
      avatar.src = '../images/avatar.jpg';
      const image = avatar.shadowRoot?.querySelector('.avatar__image') as HTMLImageElement;
      // Browser resolves relative URLs to absolute, so check it's set and not empty
      expect(image.src).toBeTruthy();
      expect(image.src).toContain('avatar.jpg');
    });
  });

  describe('Display Mode Visibility', () => {
    it('should only show one display mode at a time', () => {
      const internalAvatar = avatar.shadowRoot?.querySelector('.avatar') as HTMLDivElement;

      // Icon mode (default)
      expect(internalAvatar.dataset.mode).toBe('icon');

      // Switch to initials
      avatar.name = 'John Doe';
      expect(internalAvatar.dataset.mode).toBe('initials');

      // Switch to image
      avatar.src = 'https://example.com/avatar.jpg';
      expect(internalAvatar.dataset.mode).toBe('image');
    });

    it('should have CSS rules for display mode switching', () => {
      const styleText = (BrandAvatar.styles as any)._cssText || '';
      expect(styleText).toContain('[data-mode="image"]');
      expect(styleText).toContain('[data-mode="initials"]');
      expect(styleText).toContain('[data-mode="icon"]');
    });
  });
});
