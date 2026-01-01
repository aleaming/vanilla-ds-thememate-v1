# Phase 2 - Composed Components Specification

**Status:** Implementation Ready
**Date:** 2025-12-31
**Version:** 1.0.0

---

## Overview

Phase 2 builds on Phase 1's atomic components to create composed components that combine multiple atoms into higher-level patterns. All components follow WAI-ARIA Authoring Practices Guide 1.2 and maintain WCAG 2.1 AA compliance.

---

## Component 1: brand-card

### Purpose
Container component for grouping related content with optional header, body, footer, and media.

### WAI-ARIA Pattern
- Uses `<article>` or `<section>` for semantic structure
- Optional heading for screen reader navigation

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `elevated \| outlined \| filled` | `elevated` | Visual style variant |
| `padding` | `none \| sm \| md \| lg` | `md` | Internal padding |
| `interactive` | boolean | `false` | Whether card is clickable |

### Slots

| Slot | Description |
|------|-------------|
| `header` | Card header (typically brand-text as="h3") |
| `media` | Media content (image, icon, etc.) |
| `default` | Main card content |
| `footer` | Footer actions (typically brand-button) |

### Accessibility
- ARIA role: `article` or `region` based on content
- Optional `aria-labelledby` pointing to header
- Focus management if interactive
- Keyboard: Enter/Space to activate if interactive

### Composition
Uses Phase 1 components:
- brand-text (header)
- brand-divider (optional separator)
- brand-button (footer actions)

### Example
```html
<brand-card variant="elevated" interactive>
  <brand-text slot="header" as="h3" weight="semibold">Card Title</brand-text>
  <p>Card content goes here.</p>
  <div slot="footer">
    <brand-button variant="primary">Action</brand-button>
    <brand-button variant="ghost">Cancel</brand-button>
  </div>
</brand-card>
```

---

## Component 2: brand-modal

### Purpose
Dialog overlay for focused interactions, blocking background content.

### WAI-ARIA Pattern
Dialog (Modal) - https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Whether modal is visible |
| `size` | `sm \| md \| lg \| fullscreen` | `md` | Modal size |
| `close-on-backdrop` | boolean | `true` | Close when clicking backdrop |
| `close-on-escape` | boolean | `true` | Close on Escape key |

### Slots

| Slot | Description |
|------|-------------|
| `header` | Modal header/title |
| `default` | Main modal content |
| `footer` | Footer actions |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open-change` | `{ open: boolean }` | Fired when modal opens/closes |
| `close-attempt` | `{ source: 'backdrop' \| 'escape' \| 'button' }` | Before close (cancellable) |

### Accessibility
- ARIA role: `dialog`, `aria-modal="true"`
- `aria-labelledby` pointing to header
- Focus trap: Tab cycles within modal
- Restore focus to trigger element on close
- Escape key closes modal
- Backdrop click closes modal (unless prevented)
- Body scroll lock when open

### Keyboard
- Tab: Navigate within modal (trapped)
- Shift+Tab: Navigate backward (trapped)
- Escape: Close modal

### Composition
Uses Phase 1 components:
- brand-button (close button)
- brand-icon (close icon)
- brand-divider (header/footer separator)

### Example
```html
<brand-modal id="myModal" size="md" open>
  <brand-text slot="header" as="h2">Confirm Action</brand-text>
  <p>Are you sure you want to proceed?</p>
  <div slot="footer">
    <brand-button variant="primary">Confirm</brand-button>
    <brand-button variant="ghost" onclick="myModal.open = false">Cancel</brand-button>
  </div>
</brand-modal>
```

---

## Component 3: brand-tabs

### Purpose
Organize content into multiple panels, showing one at a time.

### WAI-ARIA Pattern
Tabs - https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active-tab` | string | (first tab id) | ID of active tab |
| `orientation` | `horizontal \| vertical` | `horizontal` | Tab layout |
| `variant` | `underline \| pills \| enclosed` | `underline` | Visual style |

### Structure
```html
<brand-tabs active-tab="tab1">
  <brand-tab-list>
    <brand-tab id="tab1" panel="panel1">Tab 1</brand-tab>
    <brand-tab id="tab2" panel="panel2">Tab 2</brand-tab>
    <brand-tab id="tab3" panel="panel3" disabled>Tab 3</brand-tab>
  </brand-tab-list>

  <brand-tab-panel id="panel1">Content 1</brand-tab-panel>
  <brand-tab-panel id="panel2">Content 2</brand-tab-panel>
  <brand-tab-panel id="panel3">Content 3</brand-tab-panel>
</brand-tabs>
```

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `tab-change` | `{ tabId: string, panelId: string }` | When active tab changes |

### Accessibility
- Tab list: role="tablist"
- Tab: role="tab", aria-selected, aria-controls
- Panel: role="tabpanel", aria-labelledby
- Automatic activation (panel changes on arrow key)
- Disabled tabs: aria-disabled="true"

### Keyboard
- Tab: Enter tab list, then to panel content
- Left/Up Arrow: Previous tab (horizontal/vertical)
- Right/Down Arrow: Next tab (horizontal/vertical)
- Home: First tab
- End: Last tab

### Composition
Uses Phase 1 components:
- brand-text (tab labels)
- brand-icon (optional tab icons)

---

## Component 4: brand-accordion

### Purpose
Vertically stacked collapsible sections.

### WAI-ARIA Pattern
Accordion - https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `allow-multiple` | boolean | `false` | Allow multiple panels open |
| `collapse-all` | boolean | `true` | Allow all panels closed |

### Structure
```html
<brand-accordion allow-multiple>
  <brand-accordion-item id="item1" open>
    <brand-accordion-header>Section 1</brand-accordion-header>
    <brand-accordion-panel>Content 1</brand-accordion-panel>
  </brand-accordion-item>

  <brand-accordion-item id="item2">
    <brand-accordion-header>Section 2</brand-accordion-header>
    <brand-accordion-panel>Content 2</brand-accordion-panel>
  </brand-accordion-item>
</brand-accordion>
```

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `item-toggle` | `{ itemId: string, open: boolean }` | When item opens/closes |

### Accessibility
- Header: role="button", aria-expanded, aria-controls
- Panel: role="region", aria-labelledby
- Focus indicator on headers
- Disabled state support

### Keyboard
- Tab: Navigate between headers
- Space/Enter: Toggle panel
- (Optional) Up/Down: Navigate headers
- Home: First header
- End: Last header

### Composition
Uses Phase 1 components:
- brand-icon (expand/collapse chevron)
- brand-divider (between items)

---

## Component 5: brand-dropdown

### Purpose
Button that reveals a menu of actions or options.

### WAI-ARIA Pattern
Menu Button - https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Whether menu is visible |
| `placement` | `bottom-start \| bottom-end \| top-start \| top-end` | `bottom-start` | Menu position |
| `trigger` | `click \| hover` | `click` | Activation method |
| `close-on-select` | boolean | `true` | Close menu after selection |

### Structure
```html
<brand-dropdown placement="bottom-start">
  <brand-button slot="trigger" variant="secondary">
    Actions
    <brand-icon slot="icon-end" name="chevron-down"></brand-icon>
  </brand-button>

  <brand-dropdown-menu>
    <brand-dropdown-item value="edit">
      <brand-icon name="edit"></brand-icon>
      Edit
    </brand-dropdown-item>
    <brand-dropdown-item value="delete" variant="destructive">
      <brand-icon name="trash"></brand-icon>
      Delete
    </brand-dropdown-item>
    <brand-dropdown-divider></brand-dropdown-divider>
    <brand-dropdown-item value="help">Help</brand-dropdown-item>
  </brand-dropdown-menu>
</brand-dropdown>
```

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open-change` | `{ open: boolean }` | When menu opens/closes |
| `select` | `{ value: string }` | When item selected |

### Accessibility
- Trigger: aria-haspopup="menu", aria-expanded
- Menu: role="menu"
- Items: role="menuitem"
- Focus trap within menu when open
- Close on Escape
- Typeahead: Jump to item by typing

### Keyboard
- Space/Enter: Open menu (on trigger)
- Escape: Close menu
- Up/Down Arrow: Navigate items
- Home: First item
- End: Last item
- Type character: Jump to matching item

### Composition
Uses Phase 1 components:
- brand-button (trigger)
- brand-icon (chevron, item icons)
- brand-divider (menu separators)

---

## Technical Architecture

### Shared Patterns from Phase 1

All Phase 2 components follow Phase 1 patterns:

1. **BaseComponent Extension**
   ```typescript
   export class BrandCard extends BaseComponent {
     static styles = styles;
     // ...
   }
   ```

2. **Shadow DOM Encapsulation**
   - mode: 'open'
   - Constructable Stylesheets
   - SSR support via Declarative Shadow DOM

3. **Template Cloning**
   ```typescript
   const content = template.content.cloneNode(true);
   this.root.appendChild(content);
   ```

4. **Event Cleanup**
   - Use `this.listen()` for automatic cleanup
   - Proper disconnectedCallback

5. **Form Integration** (where applicable)
   - ElementInternals API
   - Native form participation

### New Patterns for Phase 2

1. **Focus Management**
   ```typescript
   // Focus trap for modal
   private trapFocus(container: HTMLElement) {
     const focusable = container.querySelectorAll(
       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
     );
     const first = focusable[0] as HTMLElement;
     const last = focusable[focusable.length - 1] as HTMLElement;

     // Cycle focus between first and last
   }
   ```

2. **Positioning** (dropdown)
   ```typescript
   // Calculate position based on trigger and placement
   private updatePosition() {
     const trigger = this.querySelector('[slot="trigger"]');
     const menu = this.shadowRoot.querySelector('.menu');
     const triggerRect = trigger.getBoundingClientRect();

     // Position menu based on placement attribute
   }
   ```

3. **Body Scroll Lock** (modal)
   ```typescript
   private lockBodyScroll() {
     const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
     document.body.style.overflow = 'hidden';
     document.body.style.paddingRight = `${scrollbarWidth}px`;
   }
   ```

4. **Roving Tabindex** (tabs, accordion)
   ```typescript
   // Only one item tabbable at a time
   private updateTabindex() {
     this.tabs.forEach((tab, i) => {
       tab.tabIndex = i === this.activeIndex ? 0 : -1;
     });
   }
   ```

---

## Quality Requirements

All Phase 2 components must meet:

- ✅ **Accessibility:** WCAG 2.1 AA compliant
- ✅ **Keyboard:** Full keyboard navigation
- ✅ **Screen Readers:** Proper ARIA, announcements
- ✅ **Focus Management:** Visible indicators, logical flow
- ✅ **Tests:** >95% coverage (unit + integration)
- ✅ **Security:** XSS prevention, safe templating
- ✅ **Performance:** Minimal bundle impact (<10 kB per component)
- ✅ **Documentation:** JSDoc + usage examples

---

## Implementation Order

1. **brand-card** (simplest, no complex interactions)
2. **brand-accordion** (collapsed state, no positioning)
3. **brand-tabs** (roving tabindex, panel switching)
4. **brand-dropdown** (positioning, focus trap)
5. **brand-modal** (most complex: backdrop, focus trap, scroll lock)

Each component should follow the same workflow:
1. Implement component
2. Write comprehensive tests
3. 3-way parallel code review
4. Fix any blocking issues
5. Verify accessibility
6. Document usage

---

## Success Criteria

Phase 2 complete when:

- [  ] All 5 components implemented
- [  ] Tests passing (>95%)
- [  ] Code review passed (0 Critical/High issues)
- [  ] Accessibility audit passed (WCAG 2.1 AA)
- [  ] Security review passed
- [  ] Bundle size <50 kB total (Phase 1 + Phase 2)
- [  ] Documentation complete

---

**Ready to begin implementation.** 🚀
