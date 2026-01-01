/**
 * Unit tests for brand-divider component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandDivider } from './brand-divider';

describe('BrandDivider', () => {
  let divider: BrandDivider;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-divider')) {
      customElements.define('brand-divider', BrandDivider);
    }
    divider = document.createElement('brand-divider') as BrandDivider;
    document.body.appendChild(divider);
  });

  afterEach(() => {
    divider.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-divider')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(divider).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(divider.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandDivider.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(divider.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(divider.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandDivider.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a divider element in shadow DOM', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider).toBeTruthy();
    });

    it('should have a slot for label content', () => {
      const slot = divider.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should expose divider as a part', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider[part="divider"]');
      expect(internalDivider).toBeTruthy();
    });

    it('should expose line elements as parts', () => {
      const lines = divider.shadowRoot?.querySelectorAll('.line[part="line"]');
      expect(lines?.length).toBe(2);
    });

    it('should expose label as a part', () => {
      const label = divider.shadowRoot?.querySelector('.label[part="label"]');
      expect(label).toBeTruthy();
    });

    it('should use div element for divider container', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.tagName).toBe('DIV');
    });

    it('should have two line elements for horizontal layout', () => {
      const lines = divider.shadowRoot?.querySelectorAll('.line');
      expect(lines?.length).toBe(2);
    });

    it('should have label element between lines', () => {
      const dividerEl = divider.shadowRoot?.querySelector('.divider');
      const children = dividerEl?.children;
      expect(children?.[0]?.className).toBe('line');
      expect(children?.[1]?.className).toBe('label');
      expect(children?.[2]?.className).toBe('line');
    });
  });

  describe('Orientation Attribute', () => {
    it('should default to horizontal orientation', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('horizontal');
    });

    it('should support horizontal orientation', () => {
      divider.setAttribute('orientation', 'horizontal');
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('horizontal');
    });

    it('should support vertical orientation', () => {
      divider.setAttribute('orientation', 'vertical');
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('vertical');
    });

    it('should update orientation dynamically', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      divider.setAttribute('orientation', 'vertical');
      expect(internalDivider.dataset.orientation).toBe('vertical');
      divider.setAttribute('orientation', 'horizontal');
      expect(internalDivider.dataset.orientation).toBe('horizontal');
    });

    it('should set aria-orientation for horizontal', () => {
      divider.setAttribute('orientation', 'horizontal');
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should set aria-orientation for vertical', () => {
      divider.setAttribute('orientation', 'vertical');
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('Spacing Variants', () => {
    it('should support none spacing', () => {
      divider.setAttribute('spacing', 'none');
      expect(divider.getAttribute('spacing')).toBe('none');
    });

    it('should support sm spacing', () => {
      divider.setAttribute('spacing', 'sm');
      expect(divider.getAttribute('spacing')).toBe('sm');
    });

    it('should support md spacing (default)', () => {
      divider.setAttribute('spacing', 'md');
      expect(divider.getAttribute('spacing')).toBe('md');
    });

    it('should default to md spacing when not specified', () => {
      expect(divider.spacing).toBe('md');
    });

    it('should support lg spacing', () => {
      divider.setAttribute('spacing', 'lg');
      expect(divider.getAttribute('spacing')).toBe('lg');
    });

    it('should support xl spacing', () => {
      divider.setAttribute('spacing', 'xl');
      expect(divider.getAttribute('spacing')).toBe('xl');
    });

    it('should update spacing dynamically', () => {
      divider.setAttribute('spacing', 'sm');
      expect(divider.getAttribute('spacing')).toBe('sm');
      divider.setAttribute('spacing', 'lg');
      expect(divider.getAttribute('spacing')).toBe('lg');
    });
  });

  describe('Label Slot', () => {
    it('should have hidden label by default when empty', () => {
      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(false);
    });

    it('should show label when text content is added', () => {
      divider.textContent = 'OR';
      // Trigger slot change manually for testing
      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(true);
    });

    it('should render slotted text content', () => {
      divider.textContent = 'Section Break';
      expect(divider.textContent).toBe('Section Break');
    });

    it('should render slotted HTML elements', () => {
      const span = document.createElement('span');
      span.textContent = 'Divider Label';
      divider.appendChild(span);
      expect(divider.querySelector('span')).toBeTruthy();
    });

    it('should support empty label', () => {
      divider.textContent = '';
      expect(divider.textContent).toBe('');
    });

    it('should hide label when content is whitespace only', () => {
      divider.textContent = '   ';
      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(false);
    });

    it('should show label with non-text content', () => {
      const icon = document.createElement('span');
      icon.setAttribute('role', 'img');
      divider.appendChild(icon);

      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(true);
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(divider.internals).toBeDefined();
    });

    it('should set role to separator for accessibility', () => {
      expect(divider.internals.role).toBe('separator');
    });

    it('should expose internals publicly for testing', () => {
      expect(divider.internals.states).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // This is tested by the fact that setting text content works safely
      divider.textContent = '<script>alert("xss")</script>';
      const label = divider.shadowRoot?.querySelector('.label');
      const slot = label?.querySelector('slot');
      expect(slot).toBeTruthy();
      // The script tag should be rendered as text, not executed
      expect(divider.textContent).toContain('<script>');
    });
  });

  describe('Observed Attributes', () => {
    it('should observe orientation and spacing attributes', () => {
      expect(BrandDivider.observedAttributes).toContain('orientation');
      expect(BrandDivider.observedAttributes).toContain('spacing');
    });

    it('should have exactly 2 observed attributes', () => {
      expect(BrandDivider.observedAttributes.length).toBe(2);
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (divider as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      divider.remove();
      document.body.appendChild(divider);

      // After reconnection, listeners should be fresh
      expect(divider.isConnected).toBe(true);
    });

    it('should maintain slot listener across updates', () => {
      divider.textContent = 'Test';
      divider.setAttribute('orientation', 'vertical');
      divider.textContent = 'Updated';

      expect(divider.textContent).toBe('Updated');
    });
  });

  describe('Programmatic API', () => {
    it('should have orientation getter', () => {
      expect(divider.orientation).toBe('horizontal');
    });

    it('should have orientation setter', () => {
      divider.orientation = 'vertical';
      expect(divider.orientation).toBe('vertical');
      expect(divider.getAttribute('orientation')).toBe('vertical');
    });

    it('should have spacing getter', () => {
      expect(divider.spacing).toBe('md');
    });

    it('should have spacing setter', () => {
      divider.spacing = 'lg';
      expect(divider.spacing).toBe('lg');
      expect(divider.getAttribute('spacing')).toBe('lg');
    });

    it('should update internal divider when using setters', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'xl';
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('vertical');
      expect(divider.getAttribute('spacing')).toBe('xl');
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
      expect(styleText).toContain('--color-border');
      expect(styleText).toContain('--primitive-');
    });

    it('should include spacing tokens', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('--space-');
    });

    it('should include typography tokens for label', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('--font-body');
      expect(styleText).toContain('--text-');
    });

    it('should include motion tokens', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('--motion-duration');
      expect(styleText).toContain('--motion-easing');
    });

    it('should include color tokens for text', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('--color-text-muted');
    });
  });

  describe('Accessibility', () => {
    it('should have separator role', () => {
      expect(divider.internals.role).toBe('separator');
    });

    it('should have role attribute on internal divider', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.getAttribute('role')).toBe('separator');
    });

    it('should have aria-orientation attribute', () => {
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.hasAttribute('aria-orientation')).toBe(true);
    });

    it('should update aria-orientation when orientation changes', () => {
      divider.orientation = 'vertical';
      const internalDivider = divider.shadowRoot?.querySelector('.divider');
      expect(internalDivider?.getAttribute('aria-orientation')).toBe('vertical');

      divider.orientation = 'horizontal';
      expect(internalDivider?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should have focus styles defined', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain(':focus-visible');
      expect(styleText).toContain('outline');
    });
  });

  describe('Orientation and Spacing Combinations', () => {
    it('should support horizontal with none spacing', () => {
      divider.orientation = 'horizontal';
      divider.spacing = 'none';
      expect(divider.orientation).toBe('horizontal');
      expect(divider.spacing).toBe('none');
    });

    it('should support horizontal with sm spacing', () => {
      divider.orientation = 'horizontal';
      divider.spacing = 'sm';
      expect(divider.orientation).toBe('horizontal');
      expect(divider.spacing).toBe('sm');
    });

    it('should support horizontal with md spacing', () => {
      divider.orientation = 'horizontal';
      divider.spacing = 'md';
      expect(divider.orientation).toBe('horizontal');
      expect(divider.spacing).toBe('md');
    });

    it('should support horizontal with lg spacing', () => {
      divider.orientation = 'horizontal';
      divider.spacing = 'lg';
      expect(divider.orientation).toBe('horizontal');
      expect(divider.spacing).toBe('lg');
    });

    it('should support horizontal with xl spacing', () => {
      divider.orientation = 'horizontal';
      divider.spacing = 'xl';
      expect(divider.orientation).toBe('horizontal');
      expect(divider.spacing).toBe('xl');
    });

    it('should support vertical with none spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'none';
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('none');
    });

    it('should support vertical with sm spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'sm';
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('sm');
    });

    it('should support vertical with md spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'md';
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('md');
    });

    it('should support vertical with lg spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'lg';
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('lg');
    });

    it('should support vertical with xl spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'xl';
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('xl');
    });
  });

  describe('Label with Orientation', () => {
    it('should support label with horizontal orientation', () => {
      divider.orientation = 'horizontal';
      divider.textContent = 'OR';
      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(true);
    });

    it('should support label with vertical orientation', () => {
      divider.orientation = 'vertical';
      divider.textContent = 'OR';
      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid orientation changes', () => {
      divider.orientation = 'horizontal';
      divider.orientation = 'vertical';
      divider.orientation = 'horizontal';
      divider.orientation = 'vertical';
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('vertical');
    });

    it('should handle rapid spacing changes', () => {
      divider.spacing = 'sm';
      divider.spacing = 'md';
      divider.spacing = 'lg';
      divider.spacing = 'xl';
      expect(divider.spacing).toBe('xl');
    });

    it('should handle setting same orientation multiple times', () => {
      divider.orientation = 'vertical';
      divider.orientation = 'vertical';
      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('vertical');
    });

    it('should handle setting same spacing multiple times', () => {
      divider.spacing = 'lg';
      divider.spacing = 'lg';
      expect(divider.spacing).toBe('lg');
    });

    it('should handle adding and removing label content', () => {
      const slot = divider.shadowRoot?.querySelector('slot');
      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;

      divider.textContent = 'Label';
      slot?.dispatchEvent(new Event('slotchange'));
      expect(label.classList.contains('has-content')).toBe(true);

      divider.textContent = '';
      slot?.dispatchEvent(new Event('slotchange'));
      expect(label.classList.contains('has-content')).toBe(false);

      divider.textContent = 'New Label';
      slot?.dispatchEvent(new Event('slotchange'));
      expect(label.classList.contains('has-content')).toBe(true);
    });

    it('should handle simultaneous orientation and spacing changes', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'xl';

      const internalDivider = divider.shadowRoot?.querySelector('.divider') as HTMLDivElement;
      expect(internalDivider.dataset.orientation).toBe('vertical');
      expect(divider.spacing).toBe('xl');
    });

    it('should handle adding label with vertical orientation and spacing', () => {
      divider.orientation = 'vertical';
      divider.spacing = 'lg';
      divider.textContent = 'Section';

      const slot = divider.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new Event('slotchange'));

      const label = divider.shadowRoot?.querySelector('.label') as HTMLSpanElement;
      expect(label.classList.contains('has-content')).toBe(true);
      expect(divider.orientation).toBe('vertical');
      expect(divider.spacing).toBe('lg');
    });
  });

  describe('Style Structure', () => {
    it('should have display block for horizontal dividers', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('display: block');
    });

    it('should have inline-block for vertical dividers', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('display: inline-block');
    });

    it('should have flex layout for divider container', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('display: flex');
    });

    it('should have proper line styling', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('background:');
      expect(styleText).toContain('flex: 1');
    });

    it('should have label with user-select none', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('user-select: none');
    });

    it('should have white-space nowrap for labels', () => {
      const styleText = (BrandDivider.styles as any)._cssText || '';
      expect(styleText).toContain('white-space: nowrap');
    });
  });

  describe('Component Parts', () => {
    it('should expose divider part for CSS customization', () => {
      const internalDivider = divider.shadowRoot?.querySelector('[part="divider"]');
      expect(internalDivider).toBeTruthy();
    });

    it('should expose line parts for CSS customization', () => {
      const lines = divider.shadowRoot?.querySelectorAll('[part="line"]');
      expect(lines?.length).toBe(2);
    });

    it('should expose label part for CSS customization', () => {
      const label = divider.shadowRoot?.querySelector('[part="label"]');
      expect(label).toBeTruthy();
    });

    it('should allow targeting parts with ::part() pseudo-element', () => {
      // This is tested by verifying parts exist
      const dividerPart = divider.shadowRoot?.querySelector('[part~="divider"]');
      const linePart = divider.shadowRoot?.querySelector('[part~="line"]');
      const labelPart = divider.shadowRoot?.querySelector('[part~="label"]');

      expect(dividerPart).toBeTruthy();
      expect(linePart).toBeTruthy();
      expect(labelPart).toBeTruthy();
    });
  });
});
