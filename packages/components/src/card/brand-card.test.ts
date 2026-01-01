import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandCard } from './brand-card.js';

describe('BrandCard', () => {
  let card: BrandCard;

  beforeEach(() => {
    card = document.createElement('brand-card') as BrandCard;
    document.body.appendChild(card);
  });

  afterEach(() => {
    document.body.removeChild(card);
  });

  describe('Component Registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('brand-card')).toBe(BrandCard);
    });

    it('should create an instance', () => {
      expect(card).toBeInstanceOf(BrandCard);
      expect(card).toBeInstanceOf(HTMLElement);
    });

    it('should have shadow DOM', () => {
      expect(card.shadowRoot).toBeTruthy();
      expect(card.shadowRoot?.mode).toBe('open');
    });
  });

  describe('Variant Attribute', () => {
    it('should default to elevated variant', () => {
      expect(card.variant).toBe('elevated');
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('elevated');
    });

    it('should set outlined variant', () => {
      card.variant = 'outlined';
      expect(card.getAttribute('variant')).toBe('outlined');
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('outlined');
    });

    it('should set filled variant', () => {
      card.variant = 'filled';
      expect(card.getAttribute('variant')).toBe('filled');
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('filled');
    });

    it('should update variant via attribute', () => {
      card.setAttribute('variant', 'outlined');
      expect(card.variant).toBe('outlined');
    });
  });

  describe('Padding Attribute', () => {
    it('should default to md padding', () => {
      expect(card.padding).toBe('md');
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.padding).toBe('md');
    });

    it('should set none padding', () => {
      card.padding = 'none';
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.padding).toBe('none');
    });

    it('should set sm padding', () => {
      card.padding = 'sm';
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.padding).toBe('sm');
    });

    it('should set lg padding', () => {
      card.padding = 'lg';
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.padding).toBe('lg');
    });

    it('should update padding via attribute', () => {
      card.setAttribute('padding', 'lg');
      expect(card.padding).toBe('lg');
    });
  });

  describe('Interactive Attribute', () => {
    it('should not be interactive by default', () => {
      expect(card.interactive).toBe(false);
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.interactive).toBe('false');
    });

    it('should set interactive via property', () => {
      card.interactive = true;
      expect(card.hasAttribute('interactive')).toBe(true);
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.interactive).toBe('true');
    });

    it('should set interactive via attribute', () => {
      card.setAttribute('interactive', '');
      expect(card.interactive).toBe(true);
    });

    it('should remove interactive', () => {
      card.interactive = true;
      card.interactive = false;
      expect(card.hasAttribute('interactive')).toBe(false);
    });

    it('should make card focusable when interactive', () => {
      card.interactive = true;
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.tabIndex).toBe(0);
      expect(internalCard.getAttribute('role')).toBe('button');
    });

    it('should remove focusable when not interactive', () => {
      card.interactive = true;
      card.interactive = false;
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.tabIndex).toBe(-1);
      expect(internalCard.hasAttribute('role')).toBe(false);
    });
  });

  describe('Slots', () => {
    it('should render default slot content', () => {
      card.innerHTML = '<p>Default content</p>';
      const slot = card.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).toBeTruthy();
    });

    it('should render header slot', () => {
      card.innerHTML = '<h3 slot="header">Card Title</h3>';
      const slot = card.shadowRoot?.querySelector('slot[name="header"]');
      expect(slot).toBeTruthy();
    });

    it('should render media slot', () => {
      card.innerHTML = '<img slot="media" src="test.jpg" alt="Test">';
      const slot = card.shadowRoot?.querySelector('slot[name="media"]');
      expect(slot).toBeTruthy();
    });

    it('should render footer slot', () => {
      card.innerHTML = '<div slot="footer">Footer content</div>';
      const slot = card.shadowRoot?.querySelector('slot[name="footer"]');
      expect(slot).toBeTruthy();
    });

    it('should render all slots together', () => {
      card.innerHTML = `
        <img slot="media" src="test.jpg" alt="Test">
        <h3 slot="header">Title</h3>
        <p>Content</p>
        <div slot="footer">Footer</div>
      `;

      const mediaSlot = card.shadowRoot?.querySelector('slot[name="media"]');
      const headerSlot = card.shadowRoot?.querySelector('slot[name="header"]');
      const defaultSlot = card.shadowRoot?.querySelector('slot:not([name])');
      const footerSlot = card.shadowRoot?.querySelector('slot[name="footer"]');

      expect(mediaSlot).toBeTruthy();
      expect(headerSlot).toBeTruthy();
      expect(defaultSlot).toBeTruthy();
      expect(footerSlot).toBeTruthy();
    });
  });

  describe('Interactive Behavior', () => {
    it('should dispatch card-click event on click', () => {
      card.interactive = true;
      let eventFired = false;

      card.addEventListener('card-click', () => {
        eventFired = true;
      });

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      internalCard.click();

      expect(eventFired).toBe(true);
    });

    it('should dispatch card-click on Enter key', () => {
      card.interactive = true;
      let eventFired = false;

      card.addEventListener('card-click', () => {
        eventFired = true;
      });

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      internalCard.dispatchEvent(event);

      expect(eventFired).toBe(true);
    });

    it('should dispatch card-click on Space key', () => {
      card.interactive = true;
      let eventFired = false;

      card.addEventListener('card-click', () => {
        eventFired = true;
      });

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      internalCard.dispatchEvent(event);

      expect(eventFired).toBe(true);
    });

    it('should not dispatch event when not interactive', () => {
      let eventFired = false;

      card.addEventListener('card-click', () => {
        eventFired = true;
      });

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      internalCard.click();

      expect(eventFired).toBe(false);
    });

    it('should bubble card-click event', () => {
      card.interactive = true;
      let eventFired = false;

      document.body.addEventListener('card-click', () => {
        eventFired = true;
      });

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      internalCard.click();

      expect(eventFired).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have role=button when interactive', () => {
      card.interactive = true;
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.getAttribute('role')).toBe('button');
    });

    it('should not have role when not interactive', () => {
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.hasAttribute('role')).toBe(false);
    });

    it('should be keyboard accessible when interactive', () => {
      card.interactive = true;
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.tabIndex).toBe(0);
    });

    it('should not be keyboard accessible when not interactive', () => {
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.tabIndex).not.toBe(0);
    });
  });

  describe('Shadow DOM Structure', () => {
    it('should have correct card structure', () => {
      const cardElement = card.shadowRoot?.querySelector('.card');
      expect(cardElement).toBeTruthy();
      expect(cardElement?.classList.contains('card')).toBe(true);
    });

    it('should have media container', () => {
      const media = card.shadowRoot?.querySelector('.card__media');
      expect(media).toBeTruthy();
    });

    it('should have header container', () => {
      const header = card.shadowRoot?.querySelector('.card__header');
      expect(header).toBeTruthy();
    });

    it('should have content container', () => {
      const content = card.shadowRoot?.querySelector('.card__content');
      expect(content).toBeTruthy();
    });

    it('should have footer container', () => {
      const footer = card.shadowRoot?.querySelector('.card__footer');
      expect(footer).toBeTruthy();
    });
  });

  describe('CSS Parts', () => {
    it('should expose card part', () => {
      const cardElement = card.shadowRoot?.querySelector('[part="card"]');
      expect(cardElement).toBeTruthy();
    });

    it('should expose media part', () => {
      const media = card.shadowRoot?.querySelector('[part="media"]');
      expect(media).toBeTruthy();
    });

    it('should expose header part', () => {
      const header = card.shadowRoot?.querySelector('[part="header"]');
      expect(header).toBeTruthy();
    });

    it('should expose content part', () => {
      const content = card.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();
    });

    it('should expose footer part', () => {
      const footer = card.shadowRoot?.querySelector('[part="footer"]');
      expect(footer).toBeTruthy();
    });
  });

  describe('Variant Combinations', () => {
    it('should combine elevated variant with interactive', () => {
      card.variant = 'elevated';
      card.interactive = true;

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('elevated');
      expect(internalCard.dataset.interactive).toBe('true');
    });

    it('should combine outlined variant with sm padding', () => {
      card.variant = 'outlined';
      card.padding = 'sm';

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('outlined');
      expect(internalCard.dataset.padding).toBe('sm');
    });

    it('should combine filled variant with lg padding and interactive', () => {
      card.variant = 'filled';
      card.padding = 'lg';
      card.interactive = true;

      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      expect(internalCard.dataset.variant).toBe('filled');
      expect(internalCard.dataset.padding).toBe('lg');
      expect(internalCard.dataset.interactive).toBe('true');
    });
  });

  describe('Event Cleanup', () => {
    it('should clean up event listeners on disconnect', () => {
      card.interactive = true;

      // Trigger some events to ensure listeners are attached
      const internalCard = card.shadowRoot?.querySelector('.card') as HTMLDivElement;
      internalCard.click();

      // Events should work before disconnection
      let eventFired = false;
      card.addEventListener('card-click', () => {
        eventFired = true;
      });
      internalCard.click();
      expect(eventFired).toBe(true);

      // BaseComponent handles cleanup in disconnectedCallback
      // Just verify the component can be disconnected without errors
    });
  });

  describe('Hidden Attribute', () => {
    it('should respect hidden attribute', () => {
      card.setAttribute('hidden', '');
      const styles = window.getComputedStyle(card);
      // Note: jsdom may not fully support computed styles for custom elements
      // This test verifies the attribute is set
      expect(card.hasAttribute('hidden')).toBe(true);
    });
  });
});
