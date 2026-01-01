import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrandDropdown, BrandMenu, BrandMenuItem, BrandMenuDivider } from './index.js';

describe('Dropdown Suite', () => {
  let dropdown: BrandDropdown;

  beforeEach(() => {
    dropdown = document.createElement('brand-dropdown') as BrandDropdown;
    dropdown.innerHTML = `
      <button slot="trigger">Open Menu</button>
      <brand-menu slot="menu">
        <brand-menu-item value="edit">Edit</brand-menu-item>
        <brand-menu-item value="duplicate">Duplicate</brand-menu-item>
        <brand-menu-divider></brand-menu-divider>
        <brand-menu-item value="delete" danger>Delete</brand-menu-item>
      </brand-menu>
    `;
    document.body.appendChild(dropdown);
  });

  afterEach(() => {
    document.body.removeChild(dropdown);
  });

  describe('Component Registration', () => {
    it('should register brand-dropdown', () => {
      expect(customElements.get('brand-dropdown')).toBe(BrandDropdown);
    });

    it('should register brand-menu', () => {
      expect(customElements.get('brand-menu')).toBe(BrandMenu);
    });

    it('should register brand-menu-item', () => {
      expect(customElements.get('brand-menu-item')).toBe(BrandMenuItem);
    });

    it('should register brand-menu-divider', () => {
      expect(customElements.get('brand-menu-divider')).toBe(BrandMenuDivider);
    });
  });

  describe('Initial State', () => {
    it('should be closed by default', () => {
      expect(dropdown.open).toBe(false);
    });

    it('should hide menu container when closed', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const menuContainer = dropdown.shadowRoot?.querySelector('.menu-container') as HTMLElement;
      expect(menuContainer?.hidden).toBe(true);
    });

    it('should have bottom placement by default', () => {
      expect(dropdown.placement).toBe('bottom');
    });
  });

  describe('Opening and Closing', () => {
    it('should open when trigger is clicked', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const trigger = dropdown.querySelector('button');
      trigger?.click();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(true);
    });

    it('should show menu container when opened', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menuContainer = dropdown.shadowRoot?.querySelector('.menu-container') as HTMLElement;
      expect(menuContainer?.hidden).toBe(false);
    });

    it('should close when trigger is clicked again', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const trigger = dropdown.querySelector('button');

      trigger?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(dropdown.open).toBe(true);

      trigger?.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(dropdown.open).toBe(false);
    });

    it('should close when clicking outside', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      document.body.click();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(false);
    });

    it('should close on Escape key', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(false);
    });

    it('should close when menu item is selected', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const item = dropdown.querySelector('brand-menu-item');
      item?.shadowRoot?.querySelector('.menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(false);
    });
  });

  describe('Events', () => {
    it('should fire dropdown-open event', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      let eventFired = false;
      dropdown.addEventListener('dropdown-open', () => {
        eventFired = true;
      });

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(true);
    });

    it('should fire dropdown-close event', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      let eventFired = false;
      dropdown.addEventListener('dropdown-close', () => {
        eventFired = true;
      });

      dropdown.hide();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(true);
    });
  });

  describe('Placement', () => {
    it('should support top placement', () => {
      dropdown.placement = 'top';
      expect(dropdown.getAttribute('placement')).toBe('top');
    });

    it('should support right placement', () => {
      dropdown.placement = 'right';
      expect(dropdown.getAttribute('placement')).toBe('right');
    });

    it('should support left placement', () => {
      dropdown.placement = 'left';
      expect(dropdown.getAttribute('placement')).toBe('left');
    });
  });

  describe('Menu Component', () => {
    it('should have role=menu', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const menu = dropdown.querySelector('brand-menu');
      const menuDiv = menu?.shadowRoot?.querySelector('.menu');

      expect(menuDiv?.getAttribute('role')).toBe('menu');
    });

    it('should support size variants', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const menu = dropdown.querySelector('brand-menu');
      menu?.setAttribute('size', 'sm');

      expect(menu?.getAttribute('size')).toBe('sm');
    });
  });

  describe('Menu Item Component', () => {
    it('should have role=menuitem', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item');
      const itemDiv = item?.shadowRoot?.querySelector('.menu-item');

      expect(itemDiv?.getAttribute('role')).toBe('menuitem');
    });

    it('should fire menu-item-select event with value', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      let eventDetail: any = null;
      dropdown.addEventListener('menu-item-select', (e: any) => {
        eventDetail = e.detail;
      });

      const item = dropdown.querySelector('brand-menu-item[value="edit"]') as BrandMenuItem;
      item?.shadowRoot?.querySelector('.menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventDetail?.value).toBe('edit');
    });

    it('should support disabled state', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 10));

      const itemDiv = item.shadowRoot?.querySelector('.menu-item');
      expect(itemDiv?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not fire event when disabled', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      let eventFired = false;
      dropdown.addEventListener('menu-item-select', () => {
        eventFired = true;
      });

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 10));

      item?.shadowRoot?.querySelector('.menu-item')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(false);
    });

    it('should support danger variant', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item[danger]');
      expect(item?.hasAttribute('danger')).toBe(true);
    });

    it('should activate on Enter key', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      let eventFired = false;
      dropdown.addEventListener('menu-item-select', () => {
        eventFired = true;
      });

      const item = dropdown.querySelector('brand-menu-item');
      const itemDiv = item?.shadowRoot?.querySelector('.menu-item');

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      itemDiv?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(true);
    });

    it('should activate on Space key', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      let eventFired = false;
      dropdown.addEventListener('menu-item-select', () => {
        eventFired = true;
      });

      const item = dropdown.querySelector('brand-menu-item');
      const itemDiv = item?.shadowRoot?.querySelector('.menu-item');

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      itemDiv?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(eventFired).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next item with ArrowDown', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[0] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[1]);
    });

    it('should navigate to previous item with ArrowUp', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[1] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[0]);
    });

    it('should jump to first item with Home', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[2] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[0]);
    });

    it('should jump to last item with End', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[0] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[items.length - 1]);
    });

    it('should wrap to first item when navigating down from last', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[items.length - 1] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[0]);
    });

    it('should wrap to last item when navigating up from first', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      (items[0] as any).focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[items.length - 1]);
    });
  });

  describe('Menu Divider', () => {
    it('should have role=separator', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const divider = dropdown.querySelector('brand-menu-divider');
      const dividerDiv = divider?.shadowRoot?.querySelector('.divider');

      expect(dividerDiv?.getAttribute('role')).toBe('separator');
    });

    it('should skip over dividers during keyboard navigation', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      const menu = dropdown.querySelector('brand-menu');
      const items = dropdown.querySelectorAll('brand-menu-item');

      // Focus second item (before divider)
      (items[1] as any).focus();

      // Press ArrowDown - should skip divider and go to third item
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      menu?.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(items[2]);
    });
  });

  describe('Properties', () => {
    it('should get/set open property', () => {
      dropdown.open = true;
      expect(dropdown.open).toBe(true);
      expect(dropdown.hasAttribute('open')).toBe(true);

      dropdown.open = false;
      expect(dropdown.open).toBe(false);
      expect(dropdown.hasAttribute('open')).toBe(false);
    });

    it('should get/set placement property', () => {
      dropdown.placement = 'top';
      expect(dropdown.placement).toBe('top');
      expect(dropdown.getAttribute('placement')).toBe('top');
    });

    it('should get/set menu item value', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.value = 'custom-value';

      expect(item.value).toBe('custom-value');
      expect(item.getAttribute('value')).toBe('custom-value');
    });

    it('should get/set menu item disabled', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.disabled = true;

      expect(item.disabled).toBe(true);
      expect(item.hasAttribute('disabled')).toBe(true);
    });

    it('should get/set menu item danger', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.danger = true;

      expect(item.danger).toBe(true);
      expect(item.hasAttribute('danger')).toBe(true);
    });
  });

  describe('Methods', () => {
    it('should open via show() method', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.show();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(true);
    });

    it('should close via hide() method', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.open = true;
      await new Promise(resolve => setTimeout(resolve, 10));

      dropdown.hide();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(dropdown.open).toBe(false);
    });

    it('should toggle via toggle() method', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      dropdown.toggle();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(dropdown.open).toBe(true);

      dropdown.toggle();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(dropdown.open).toBe(false);
    });

    it('should focus menu item via focus() method', async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));

      const item = dropdown.querySelector('brand-menu-item') as BrandMenuItem;
      item.focus();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(document.activeElement).toBe(item);
    });
  });
});
