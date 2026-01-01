import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandTabs, BrandTabList, BrandTab, BrandTabPanel } from './index.js';

describe('Tabs Suite', () => {
  let tabs: BrandTabs;

  beforeEach(() => {
    tabs = document.createElement('brand-tabs') as BrandTabs;
    tabs.innerHTML = `
      <brand-tab-list>
        <brand-tab id="tab1" panel="panel1">Tab 1</brand-tab>
        <brand-tab id="tab2" panel="panel2">Tab 2</brand-tab>
        <brand-tab id="tab3" panel="panel3">Tab 3</brand-tab>
      </brand-tab-list>
      <brand-tab-panel id="panel1" tab="tab1">Content 1</brand-tab-panel>
      <brand-tab-panel id="panel2" tab="tab2">Content 2</brand-tab-panel>
      <brand-tab-panel id="panel3" tab="tab3">Content 3</brand-tab-panel>
    `;
    document.body.appendChild(tabs);
  });

  afterEach(() => {
    document.body.removeChild(tabs);
  });

  describe('Component Registration', () => {
    it('should register brand-tabs', () => {
      expect(customElements.get('brand-tabs')).toBe(BrandTabs);
    });

    it('should register brand-tab-list', () => {
      expect(customElements.get('brand-tab-list')).toBe(BrandTabList);
    });

    it('should register brand-tab', () => {
      expect(customElements.get('brand-tab')).toBe(BrandTab);
    });

    it('should register brand-tab-panel', () => {
      expect(customElements.get('brand-tab-panel')).toBe(BrandTabPanel);
    });
  });

  describe('Initial State', () => {
    it('should activate first tab by default', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab1 = tabs.querySelector('#tab1') as any;
      expect(tab1?.active).toBe(true);
    });

    it('should show first panel by default', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const panel1 = tabs.querySelector('#panel1') as HTMLElement;
      expect(panel1?.hidden).toBe(false);
    });

    it('should hide other panels', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const panel2 = tabs.querySelector('#panel2') as HTMLElement;
      const panel3 = tabs.querySelector('#panel3') as HTMLElement;
      
      expect(panel2?.hidden).toBe(true);
      expect(panel3?.hidden).toBe(true);
    });
  });

  describe('Tab Switching', () => {
    it('should switch tabs on click', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect((tab2 as any).active).toBe(true);
    });

    it('should show correct panel when tab clicked', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const panel2 = tabs.querySelector('#panel2') as HTMLElement;
      expect(panel2?.hidden).toBe(false);
    });

    it('should hide previous panel', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const panel1 = tabs.querySelector('#panel1') as HTMLElement;
      expect(panel1?.hidden).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have role=tablist on tab-list', () => {
      const tabList = tabs.querySelector('brand-tab-list');
      const listDiv = tabList?.shadowRoot?.querySelector('.tab-list');
      expect(listDiv?.getAttribute('role')).toBe('tablist');
    });

    it('should have role=tab on tabs', () => {
      const tab = tabs.querySelector('brand-tab');
      const button = tab?.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('role')).toBe('tab');
    });

    it('should have role=tabpanel on panels', () => {
      const panel = tabs.querySelector('brand-tab-panel');
      const panelDiv = panel?.shadowRoot?.querySelector('.panel');
      expect(panelDiv?.getAttribute('role')).toBe('tabpanel');
    });

    it('should set aria-selected on active tab', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab1 = tabs.querySelector('#tab1');
      const button = tab1?.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('aria-selected')).toBe('true');
    });

    it('should set aria-controls on tab', () => {
      const tab1 = tabs.querySelector('#tab1');
      const button = tab1?.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('aria-controls')).toBe('panel1');
    });

    it('should set aria-labelledby on panel', () => {
      const panel1 = tabs.querySelector('#panel1');
      const panelDiv = panel1?.shadowRoot?.querySelector('.panel');
      expect(panelDiv?.getAttribute('aria-labelledby')).toBe('tab1');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next tab with ArrowRight', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tabList = tabs.querySelector('brand-tab-list');
      const tab1 = tabs.querySelector('#tab1') as any;
      
      tab1.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab2 = tabs.querySelector('#tab2') as any;
      expect(tab2.active).toBe(true);
    });

    it('should navigate to previous tab with ArrowLeft', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // First activate tab2
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tabList = tabs.querySelector('brand-tab-list');
      (tab2 as any).focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab1 = tabs.querySelector('#tab1') as any;
      expect(tab1.active).toBe(true);
    });

    it('should jump to first tab with Home', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Activate tab3
      const tab3 = tabs.querySelector('#tab3');
      tab3?.shadowRoot?.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tabList = tabs.querySelector('brand-tab-list');
      (tab3 as any).focus();
      
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab1 = tabs.querySelector('#tab1') as any;
      expect(tab1.active).toBe(true);
    });

    it('should jump to last tab with End', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tabList = tabs.querySelector('brand-tab-list');
      const tab1 = tabs.querySelector('#tab1') as any;
      tab1.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab3 = tabs.querySelector('#tab3') as any;
      expect(tab3.active).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('should not activate disabled tab', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tab2 = tabs.querySelector('#tab2') as any;
      tab2.disabled = true;
      
      tab2.shadowRoot?.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(tab2.active).toBe(false);
    });

    it('should have aria-disabled on disabled tab', () => {
      const tab2 = tabs.querySelector('#tab2') as any;
      tab2.disabled = true;
      
      const button = tab2.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Events', () => {
    it('should fire tab-change event', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      let eventFired = false;
      let eventDetail: any = null;
      
      tabs.addEventListener('tab-change', (e: any) => {
        eventFired = true;
        eventDetail = e.detail;
      });
      
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(eventFired).toBe(true);
      expect(eventDetail.tabId).toBe('tab2');
    });
  });

  describe('Properties', () => {
    it('should get/set activeTab', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      tabs.activeTab = 'tab2';
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(tabs.activeTab).toBe('tab2');
      
      const tab2 = tabs.querySelector('#tab2') as any;
      expect(tab2.active).toBe(true);
    });

    it('should get/set orientation', () => {
      tabs.orientation = 'vertical';
      expect(tabs.orientation).toBe('vertical');
      expect(tabs.getAttribute('orientation')).toBe('vertical');
    });
  });

  describe('Vertical Orientation', () => {
    beforeEach(() => {
      tabs.orientation = 'vertical';
    });

    it('should navigate with ArrowDown in vertical mode', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const tabList = tabs.querySelector('brand-tab-list');
      const tab1 = tabs.querySelector('#tab1') as any;
      tab1.focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab2 = tabs.querySelector('#tab2') as any;
      expect(tab2.active).toBe(true);
    });

    it('should navigate with ArrowUp in vertical mode', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Activate tab2
      const tab2 = tabs.querySelector('#tab2');
      tab2?.shadowRoot?.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tabList = tabs.querySelector('brand-tab-list');
      (tab2 as any).focus();
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      tabList?.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const tab1 = tabs.querySelector('#tab1') as any;
      expect(tab1.active).toBe(true);
    });
  });
});
