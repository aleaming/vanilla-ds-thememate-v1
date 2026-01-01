# Brand Design System

Framework-independent design system built with vanilla Web Components.

## Phase 1: Core Atoms

Pure vanilla Web Components with zero runtime dependencies.

### Packages

- `@brand/tokens` - CSS custom properties (primitives + brand touchpoints)
- `@brand/components` - 14 core atom-level Web Components
- `@brand/components-react` - React wrappers (coming soon)
- `@brand/components-vue` - Vue 3 wrappers (coming soon)
- `@brand/docs` - Documentation site

### Components (14 Atoms)

1. **brand-button** - Action trigger with variants
2. **brand-icon** - SVG icon system
3. **brand-badge** - Status indicators
4. **brand-text** - Typography component
5. **brand-checkbox** - Form checkbox
6. **brand-radio** - Form radio
7. **brand-input** - Form text input
8. **brand-textarea** - Form multiline input
9. **brand-select** - Form select dropdown
10. **brand-switch** - Form toggle switch
11. **brand-link** - Navigation link
12. **brand-spinner** - Loading indicator
13. **brand-divider** - Content separator
14. **brand-avatar** - User representation

### Tech Stack

- **Web Components:** Custom Elements, Shadow DOM, Constructable Stylesheets
- **Forms:** ElementInternals API for native form participation
- **SSR:** Declarative Shadow DOM
- **Build:** Vite 5.x
- **Language:** TypeScript 5.x
- **Testing:** Vitest + Playwright
- **Package Manager:** pnpm

### Quick Start

```bash
# Install dependencies
pnpm install

# Start docs dev server
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Architecture Principles

1. **Zero Runtime Dependencies** - Pure browser APIs only
2. **Framework Independent** - Works in React, Vue, vanilla HTML
3. **Multi-Brand Theming** - CSS custom properties with @layer
4. **Native Form Integration** - ElementInternals for full form participation
5. **SSR Support** - Declarative Shadow DOM
6. **WCAG 2.1 AA** - Accessibility built-in
7. **Permanent Stability** - Browser APIs don't break

### Browser Support

- Chrome/Edge 90+
- Safari 16.4+
- Firefox 123+

### Documentation

See full PRD: `./docs/requirements.md`

### License

MIT

---

**Built with Loki Mode v2.9.1** 🤖
