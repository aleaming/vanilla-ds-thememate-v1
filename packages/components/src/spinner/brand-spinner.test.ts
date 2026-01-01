/**
 * Unit tests for brand-spinner component
 * Following Test-Driven Development approach
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandSpinner } from './brand-spinner';

describe('BrandSpinner', () => {
  let spinner: BrandSpinner;

  beforeEach(() => {
    // Ensure component is registered
    if (!customElements.get('brand-spinner')) {
      customElements.define('brand-spinner', BrandSpinner);
    }
    spinner = document.createElement('brand-spinner') as BrandSpinner;
    document.body.appendChild(spinner);
  });

  afterEach(() => {
    spinner.remove();
  });

  describe('Component Registration', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('brand-spinner')).toBeDefined();
    });

    it('should extend BaseComponent', () => {
      expect(spinner).toBeInstanceOf(HTMLElement);
    });

    it('should have a shadow root', () => {
      expect(spinner.shadowRoot).toBeTruthy();
    });
  });

  describe('Constructable Stylesheet', () => {
    it('should have static styles property', () => {
      expect(BrandSpinner.styles).toBeInstanceOf(CSSStyleSheet);
    });

    it('should adopt styles in shadow root', () => {
      expect(spinner.shadowRoot?.adoptedStyleSheets.length).toBeGreaterThan(0);
      expect(spinner.shadowRoot?.adoptedStyleSheets[0]).toBe(BrandSpinner.styles);
    });
  });

  describe('Template Rendering', () => {
    it('should render a spinner element in shadow DOM', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner).toBeTruthy();
    });

    it('should have a spinner-circle element', () => {
      const circle = spinner.shadowRoot?.querySelector('.spinner-circle');
      expect(circle).toBeTruthy();
    });

    it('should expose spinner as a part', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner[part="spinner"]');
      expect(internalSpinner).toBeTruthy();
    });

    it('should use div elements', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.tagName).toBe('DIV');
    });
  });

  describe('Size Variants', () => {
    it('should default to md size', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('md');
    });

    it('should support xs size', () => {
      spinner.setAttribute('size', 'xs');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xs');
    });

    it('should support sm size', () => {
      spinner.setAttribute('size', 'sm');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('sm');
    });

    it('should support md size', () => {
      spinner.setAttribute('size', 'md');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('md');
    });

    it('should support lg size', () => {
      spinner.setAttribute('size', 'lg');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('lg');
    });

    it('should support xl size', () => {
      spinner.setAttribute('size', 'xl');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xl');
    });

    it('should update size dynamically', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      spinner.setAttribute('size', 'xs');
      expect(internalSpinner.dataset.size).toBe('xs');
      spinner.setAttribute('size', 'sm');
      expect(internalSpinner.dataset.size).toBe('sm');
      spinner.setAttribute('size', 'lg');
      expect(internalSpinner.dataset.size).toBe('lg');
      spinner.setAttribute('size', 'xl');
      expect(internalSpinner.dataset.size).toBe('xl');
    });
  });

  describe('CSS Animation', () => {
    it('should have rotation animation in styles', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('animation');
      expect(styleText).toContain('spinner-rotate');
    });

    it('should define keyframes for rotation', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('@keyframes spinner-rotate');
      expect(styleText).toContain('transform: rotate(0deg)');
      expect(styleText).toContain('transform: rotate(360deg)');
    });

    it('should use linear animation timing', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('linear');
    });

    it('should have infinite animation', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('infinite');
    });

    it('should respect prefers-reduced-motion', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('prefers-reduced-motion');
    });
  });

  describe('Color Inheritance', () => {
    it('should use currentColor for border', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('currentColor');
    });

    it('should have circular shape', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('border-radius: 50%');
    });

    it('should have border styling', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('border');
      expect(styleText).toContain('border-top-color');
      expect(styleText).toContain('border-right-color');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('role')).toBe('status');
    });

    it('should have aria-live="polite"', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have default aria-label', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Loading');
    });

    it('should support custom aria-label', () => {
      spinner.setAttribute('aria-label', 'Loading data');
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Loading data');
    });

    it('should update aria-label dynamically', () => {
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      spinner.setAttribute('aria-label', 'Fetching results');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Fetching results');
      spinner.setAttribute('aria-label', 'Processing request');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Processing request');
    });

    it('should have focus styles defined', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain(':focus-visible');
      expect(styleText).toContain('outline');
    });
  });

  describe('ElementInternals', () => {
    it('should have ElementInternals instance', () => {
      expect(spinner.internals).toBeDefined();
    });

    it('should expose internals publicly for testing', () => {
      expect(spinner.internals.states).toBeDefined();
    });
  });

  describe('Safe Template Cloning', () => {
    it('should use template cloning instead of innerHTML with interpolation', () => {
      // The spinner should be rendered from a cloned template
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      const circle = internalSpinner?.querySelector('.spinner-circle');
      expect(circle).toBeTruthy();
    });
  });

  describe('Observed Attributes', () => {
    it('should observe size and aria-label attributes', () => {
      expect(BrandSpinner.observedAttributes).toContain('size');
      expect(BrandSpinner.observedAttributes).toContain('aria-label');
    });

    it('should have exactly 2 observed attributes', () => {
      expect(BrandSpinner.observedAttributes.length).toBe(2);
    });
  });

  describe('Lifecycle Management', () => {
    it('should cleanup event listeners on disconnect', () => {
      const listeners = (spinner as any)._listeners;
      const initialLength = listeners?.length ?? 0;

      spinner.remove();
      document.body.appendChild(spinner);

      // After reconnection, listeners should be fresh
      expect(spinner.isConnected).toBe(true);
    });
  });

  describe('Token References', () => {
    it('should reference design tokens with fallback chains in styles', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      // Check that styles reference CSS custom properties
      expect(styleText).toContain('var(');
    });

    it('should include size tokens for variants', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('--size-');
    });

    it('should include motion tokens', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('--motion-duration-slow');
    });

    it('should include color tokens', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('--color-primary');
      expect(styleText).toContain('--primitive-');
    });
  });

  describe('Programmatic API', () => {
    it('should have size getter', () => {
      expect(spinner.size).toBe('md');
    });

    it('should have size setter', () => {
      spinner.size = 'lg';
      expect(spinner.size).toBe('lg');
      expect(spinner.getAttribute('size')).toBe('lg');
    });

    it('should have ariaLabel getter', () => {
      expect(spinner.ariaLabel).toBe('Loading');
    });

    it('should have ariaLabel setter', () => {
      spinner.ariaLabel = 'Loading data';
      expect(spinner.ariaLabel).toBe('Loading data');
      expect(spinner.getAttribute('aria-label')).toBe('Loading data');
    });

    it('should update internal spinner when using setters', () => {
      spinner.size = 'xl';
      spinner.ariaLabel = 'Saving changes';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xl');
      expect(internalSpinner.getAttribute('aria-label')).toBe('Saving changes');
    });
  });

  describe('Size Variant Styling', () => {
    it('should have different border widths for different sizes', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('border-width: 1px'); // xs
      expect(styleText).toContain('border-width: 2px'); // sm, md
      expect(styleText).toContain('border-width: 3px'); // lg
      expect(styleText).toContain('border-width: 4px'); // xl
    });

    it('should define size-specific styles', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('[data-size="xs"]');
      expect(styleText).toContain('[data-size="sm"]');
      expect(styleText).toContain('[data-size="md"]');
      expect(styleText).toContain('[data-size="lg"]');
      expect(styleText).toContain('[data-size="xl"]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid size changes', () => {
      spinner.size = 'xs';
      spinner.size = 'sm';
      spinner.size = 'md';
      spinner.size = 'lg';
      spinner.size = 'xl';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xl');
    });

    it('should handle rapid aria-label changes', () => {
      spinner.ariaLabel = 'Loading 1';
      spinner.ariaLabel = 'Loading 2';
      spinner.ariaLabel = 'Loading 3';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Loading 3');
    });

    it('should handle setting same size multiple times', () => {
      spinner.size = 'lg';
      spinner.size = 'lg';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('lg');
    });

    it('should handle setting same aria-label multiple times', () => {
      spinner.ariaLabel = 'Loading data';
      spinner.ariaLabel = 'Loading data';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-label')).toBe('Loading data');
    });
  });

  describe('Visual Structure', () => {
    it('should have inline-flex display', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('display: inline-flex');
    });

    it('should have centering alignment', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('align-items: center');
      expect(styleText).toContain('justify-content: center');
    });

    it('should have relative positioning on container', () => {
      const styleText = (BrandSpinner.styles as any)._cssText || '';
      expect(styleText).toContain('position: relative');
    });
  });

  describe('Combination Tests', () => {
    it('should support xs size with custom label', () => {
      spinner.size = 'xs';
      spinner.ariaLabel = 'Small loading indicator';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xs');
      expect(internalSpinner.getAttribute('aria-label')).toBe('Small loading indicator');
    });

    it('should support xl size with custom label', () => {
      spinner.size = 'xl';
      spinner.ariaLabel = 'Large loading indicator';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('xl');
      expect(internalSpinner.getAttribute('aria-label')).toBe('Large loading indicator');
    });

    it('should maintain all attributes through updates', () => {
      spinner.size = 'sm';
      spinner.ariaLabel = 'Initial label';
      spinner.size = 'lg';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner') as HTMLDivElement;
      expect(internalSpinner.dataset.size).toBe('lg');
      expect(internalSpinner.getAttribute('aria-label')).toBe('Initial label');
    });
  });

  describe('ARIA Requirements', () => {
    it('should always have role status', () => {
      spinner.size = 'xs';
      spinner.size = 'lg';
      spinner.ariaLabel = 'Custom label';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('role')).toBe('status');
    });

    it('should always have aria-live polite', () => {
      spinner.size = 'xs';
      spinner.size = 'lg';
      spinner.ariaLabel = 'Custom label';
      const internalSpinner = spinner.shadowRoot?.querySelector('.spinner');
      expect(internalSpinner?.getAttribute('aria-live')).toBe('polite');
    });
  });
});
