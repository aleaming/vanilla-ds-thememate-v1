import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  BrandAccordion,
  BrandAccordionItem,
  BrandAccordionHeader,
  BrandAccordionPanel
} from './index.js';

describe('Accordion Suite', () => {
  let accordion: BrandAccordion;

  beforeEach(() => {
    accordion = document.createElement('brand-accordion') as BrandAccordion;
    document.body.appendChild(accordion);
  });

  afterEach(() => {
    document.body.removeChild(accordion);
  });

  describe('Component Registration', () => {
    it('should register brand-accordion', () => {
      expect(customElements.get('brand-accordion')).toBe(BrandAccordion);
    });

    it('should register brand-accordion-item', () => {
      expect(customElements.get('brand-accordion-item')).toBe(BrandAccordionItem);
    });

    it('should register brand-accordion-header', () => {
      expect(customElements.get('brand-accordion-header')).toBe(BrandAccordionHeader);
    });

    it('should register brand-accordion-panel', () => {
      expect(customElements.get('brand-accordion-panel')).toBe(BrandAccordionPanel);
    });
  });

  describe('Basic Functionality', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item id="item1">
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
        <brand-accordion-item id="item2">
          <brand-accordion-header>Section 2</brand-accordion-header>
          <brand-accordion-panel>Content 2</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should create accordion structure', () => {
      const items = accordion.querySelectorAll('brand-accordion-item');
      expect(items.length).toBe(2);
    });

    it('should expand item when header clicked', async () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      const header = item.querySelector('brand-accordion-header');

      expect(item.open).toBe(false);

      header?.shadowRoot?.querySelector('button')?.click();

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(item.open).toBe(true);
    });

    it('should collapse item when clicked again', async () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      const header = item.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      // Open
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(item.open).toBe(true);

      // Close
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(item.open).toBe(false);
    });
  });

  describe('Single vs Multiple Open', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item id="item1">
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
        <brand-accordion-item id="item2">
          <brand-accordion-header>Section 2</brand-accordion-header>
          <brand-accordion-panel>Content 2</brand-accordion-panel>
        </brand-accordion-item>
        <brand-accordion-item id="item3">
          <brand-accordion-header>Section 3</brand-accordion-header>
          <brand-accordion-panel>Content 3</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should close other items when opening one (single mode)', async () => {
      const items = Array.from(accordion.querySelectorAll('brand-accordion-item')) as any[];

      // Open item 1
      items[0].open = true;
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(items[0].open).toBe(true);

      // Open item 2 - should close item 1
      items[1].open = true;
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(items[1].open).toBe(true);
      expect(items[0].open).toBe(false);
    });

    it('should allow multiple open when allow-multiple is set', async () => {
      accordion.allowMultiple = true;
      const items = Array.from(accordion.querySelectorAll('brand-accordion-item')) as any[];

      // Open item 1
      items[0].open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      // Open item 2 - item 1 should stay open
      items[1].open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item>
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
        <brand-accordion-item>
          <brand-accordion-header>Section 2</brand-accordion-header>
          <brand-accordion-panel>Content 2</brand-accordion-panel>
        </brand-accordion-item>
        <brand-accordion-item>
          <brand-accordion-header>Section 3</brand-accordion-header>
          <brand-accordion-panel>Content 3</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should navigate to next header with ArrowDown', () => {
      const headers = Array.from(accordion.querySelectorAll('brand-accordion-header'));

      // Focus first header
      (headers[0] as any).focus();

      // Press ArrowDown
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      headers[0].dispatchEvent(event);

      // Should focus second header
      expect(document.activeElement).toBe(headers[1]);
    });

    it('should navigate to previous header with ArrowUp', () => {
      const headers = Array.from(accordion.querySelectorAll('brand-accordion-header'));

      // Focus second header
      (headers[1] as any).focus();

      // Press ArrowUp
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      headers[1].dispatchEvent(event);

      // Should focus first header
      expect(document.activeElement).toBe(headers[0]);
    });

    it('should wrap to first header from last with ArrowDown', () => {
      const headers = Array.from(accordion.querySelectorAll('brand-accordion-header'));

      // Focus last header
      (headers[2] as any).focus();

      // Press ArrowDown
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      headers[2].dispatchEvent(event);

      // Should wrap to first
      expect(document.activeElement).toBe(headers[0]);
    });

    it('should jump to first header with Home', () => {
      const headers = Array.from(accordion.querySelectorAll('brand-accordion-header'));

      // Focus last header
      (headers[2] as any).focus();

      // Press Home
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      headers[2].dispatchEvent(event);

      // Should jump to first
      expect(document.activeElement).toBe(headers[0]);
    });

    it('should jump to last header with End', () => {
      const headers = Array.from(accordion.querySelectorAll('brand-accordion-header'));

      // Focus first header
      (headers[0] as any).focus();

      // Press End
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      headers[0].dispatchEvent(event);

      // Should jump to last
      expect(document.activeElement).toBe(headers[2]);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item id="item1">
          <brand-accordion-header id="header1">Section 1</brand-accordion-header>
          <brand-accordion-panel id="panel1">Content 1</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should have aria-expanded on header button', () => {
      const header = accordion.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      expect(button?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when item opens', async () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      const header = accordion.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      item.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-controls pointing to panel', () => {
      const header = accordion.querySelector('brand-accordion-header');
      const panel = accordion.querySelector('brand-accordion-panel');
      const button = header?.shadowRoot?.querySelector('button');

      const controls = button?.getAttribute('aria-controls');
      expect(controls).toBe(panel?.id);
    });

    it('should have aria-labelledby on panel', () => {
      const header = accordion.querySelector('brand-accordion-header');
      const panel = accordion.querySelector('brand-accordion-panel');
      const panelDiv = panel?.shadowRoot?.querySelector('.panel');

      const labelledBy = panelDiv?.getAttribute('aria-labelledby');
      expect(labelledBy).toBe(header?.id);
    });

    it('should have role=region on panel', () => {
      const panel = accordion.querySelector('brand-accordion-panel');
      const panelDiv = panel?.shadowRoot?.querySelector('.panel');

      expect(panelDiv?.getAttribute('role')).toBe('region');
    });

    it('should hide panel from accessibility when collapsed', () => {
      const panel = accordion.querySelector('brand-accordion-panel');
      const panelDiv = panel?.shadowRoot?.querySelector('.panel');

      expect(panelDiv?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should show panel to accessibility when expanded', async () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      const panel = accordion.querySelector('brand-accordion-panel');
      const panelDiv = panel?.shadowRoot?.querySelector('.panel');

      item.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(panelDiv?.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item id="item1" disabled>
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should not open when disabled', async () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      const header = accordion.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      button?.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(item.open).toBe(false);
    });

    it('should have aria-disabled on header button', () => {
      const header = accordion.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      expect(button?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have disabled styling on item', () => {
      const item = accordion.querySelector('brand-accordion-item');
      expect(item?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Initial Open State', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item open>
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should render initially open', () => {
      const item = accordion.querySelector('brand-accordion-item') as any;
      expect(item.open).toBe(true);
    });

    it('should have correct aria-expanded', () => {
      const header = accordion.querySelector('brand-accordion-header');
      const button = header?.shadowRoot?.querySelector('button');

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Events', () => {
    beforeEach(() => {
      accordion.innerHTML = `
        <brand-accordion-item id="item1">
          <brand-accordion-header>Section 1</brand-accordion-header>
          <brand-accordion-panel>Content 1</brand-accordion-panel>
        </brand-accordion-item>
      `;
    });

    it('should fire accordion-item-toggle event', async () => {
      let eventFired = false;
      let eventDetail: any = null;

      accordion.addEventListener('accordion-item-toggle', (e: any) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      const item = accordion.querySelector('brand-accordion-item') as any;
      item.open = true;

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(true);
      expect(eventDetail.itemId).toBe('item1');
      expect(eventDetail.open).toBe(true);
    });
  });

  describe('Properties', () => {
    it('should get/set allowMultiple', () => {
      expect(accordion.allowMultiple).toBe(false);

      accordion.allowMultiple = true;
      expect(accordion.allowMultiple).toBe(true);
      expect(accordion.hasAttribute('allow-multiple')).toBe(true);

      accordion.allowMultiple = false;
      expect(accordion.allowMultiple).toBe(false);
      expect(accordion.hasAttribute('allow-multiple')).toBe(false);
    });

    it('should get/set collapseAll', () => {
      expect(accordion.collapseAll).toBe(false);

      accordion.collapseAll = true;
      expect(accordion.collapseAll).toBe(true);
      expect(accordion.hasAttribute('collapse-all')).toBe(true);
    });
  });

  describe('CSS Parts', () => {
    it('should expose accordion part', () => {
      const part = accordion.shadowRoot?.querySelector('[part="accordion"]');
      expect(part).toBeTruthy();
    });

    it('should expose item part', () => {
      accordion.innerHTML = `
        <brand-accordion-item>
          <brand-accordion-header>Test</brand-accordion-header>
          <brand-accordion-panel>Test</brand-accordion-panel>
        </brand-accordion-item>
      `;

      const item = accordion.querySelector('brand-accordion-item');
      const part = item?.shadowRoot?.querySelector('[part="item"]');
      expect(part).toBeTruthy();
    });
  });
});
