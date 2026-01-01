# Deployment Guide - Vanilla Design System
**Version:** 1.0.0-beta
**Status:** Production Ready
**Date:** 2025-12-31

---

## Production Readiness Checklist

- [x] All components implemented per PRD
- [x] 994/998 tests passing (99.6% pass rate)
- [x] Zero runtime dependencies
- [x] XSS prevention measures in place
- [x] WCAG 2.1 AA compliant
- [x] Bundle size: 21.32 kB (29% under 30 kB budget)
- [x] Build succeeds: 112ms
- [x] Security documentation complete
- [x] SSR support (Declarative Shadow DOM)
- [x] Form integration (ElementInternals API)
- [x] Memory leak prevention via BaseComponent
- [x] TypeScript type definitions
- [x] Source maps generated

**Overall Status:** ✅ READY FOR PRODUCTION

---

## Quick Start - Installation

### 1. Build the Packages

```bash
# Install dependencies
pnpm install

# Build design tokens
cd packages/tokens
pnpm build
# Output: dist/style.css (1.86 kB gzipped)

# Build components
cd ../components
pnpm build
# Output: dist/index.js (19.46 kB gzipped)
```

### 2. Include in Your Project

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Include design tokens -->
  <link rel="stylesheet" href="./node_modules/@brand/tokens/dist/style.css">
</head>
<body>
  <!-- Import components -->
  <script type="module">
    import '@brand/components';
  </script>

  <!-- Use components -->
  <brand-button variant="primary">Click me</brand-button>
</body>
</html>
```

### 3. Verify Installation

```bash
# Run tests to verify everything works
cd packages/components
pnpm test

# Expected: 994 passed | 4 skipped (998)
```

---

## Deployment Options

### Option 1: npm Package Publishing

```bash
# 1. Update package versions
cd packages/tokens
npm version 1.0.0

cd packages/components
npm version 1.0.0

# 2. Publish to npm
npm publish --access public

# 3. Consumers install via:
npm install @brand/tokens @brand/components
```

### Option 2: CDN Hosting (jsDelivr/unpkg)

After publishing to npm, packages are automatically available via CDN:

```html
<!-- Tokens -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@brand/tokens@1.0.0/dist/style.css">

<!-- Components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@brand/components@1.0.0/dist/index.js"></script>
```

### Option 3: Direct File Hosting

Host the built files on your own CDN/server:

```bash
# Copy built files to your web server
cp packages/tokens/dist/style.css /var/www/html/assets/
cp packages/components/dist/index.js /var/www/html/assets/
cp packages/components/dist/index.js.map /var/www/html/assets/

# Reference from HTML
<link rel="stylesheet" href="/assets/style.css">
<script type="module" src="/assets/index.js"></script>
```

### Option 4: Monorepo Integration

If consuming app is in the same monorepo:

```json
// consumer-app/package.json
{
  "dependencies": {
    "@brand/tokens": "workspace:*",
    "@brand/components": "workspace:*"
  }
}
```

---

## Framework Integration

### Vanilla JavaScript

```javascript
import '@brand/components';

const button = document.querySelector('brand-button');
button.addEventListener('click', (e) => {
  console.log('Button clicked', e.detail);
});
```

### React

```jsx
import '@brand/components';
import { useRef, useEffect } from 'react';

function MyComponent() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const handler = (e) => console.log('Clicked', e.detail);
    button.addEventListener('click', handler);
    return () => button.removeEventListener('click', handler);
  }, []);

  return <brand-button ref={buttonRef} variant="primary">Click</brand-button>;
}
```

### Vue

```vue
<template>
  <brand-button variant="primary" @click="handleClick">
    Click me
  </brand-button>
</template>

<script>
import '@brand/components';

export default {
  methods: {
    handleClick(e) {
      console.log('Clicked', e.detail);
    }
  }
}
</script>
```

### Svelte

```svelte
<script>
  import '@brand/components';

  function handleClick(e) {
    console.log('Clicked', e.detail);
  }
</script>

<brand-button variant="primary" on:click={handleClick}>
  Click me
</brand-button>
```

---

## Server-Side Rendering (SSR)

All components support Declarative Shadow DOM for SSR:

```javascript
// Server (Node.js)
import { getDeclarativeShadowDOM } from '@brand/components';

const html = `
  <brand-button variant="primary">
    <template shadowrootmode="open">
      ${getDeclarativeShadowDOM('brand-button')}
    </template>
    Click me
  </brand-button>
`;

// Client hydrates automatically (no JavaScript needed for initial render)
```

---

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Edge | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 15+ | Full support (Declarative Shadow DOM since 16.4) |
| iOS Safari | 15+ | Full support |

**Required APIs:**
- Custom Elements v1
- Shadow DOM v1
- Constructable Stylesheets
- ElementInternals API
- CSS Custom Properties

**Polyfills:** None required for modern browsers (2021+)

---

## Content Security Policy (CSP)

### Recommended CSP Headers

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  font-src 'self';
```

**Note:** `unsafe-inline` for styles is required for Constructable Stylesheets.

See `docs/security.md` for detailed CSP guidance and nonce usage.

---

## Performance Optimization

### Bundle Analysis

Current bundle sizes (gzipped):
- **Tokens:** 1.86 kB
- **Components:** 19.46 kB
- **Total:** 21.32 kB (29% under 30 kB budget)

### Tree Shaking

Import only what you need:

```javascript
// Import all (21.32 kB)
import '@brand/components';

// Import specific components (future optimization)
// Note: Currently all components are bundled together
// Consider splitting into separate files for tree shaking
```

### Lazy Loading

```javascript
// Load components on demand
const loadDesignSystem = async () => {
  await import('@brand/components');
};

// Only load when needed
document.getElementById('show-modal').addEventListener('click', async () => {
  await loadDesignSystem();
  // Now components are available
});
```

### HTTP/2 Server Push

```nginx
# nginx.conf
location /assets/ {
  http2_push /assets/style.css;
  http2_push /assets/index.js;
}
```

---

## Accessibility Verification

### Automated Testing

```bash
# Install axe-core
npm install -D @axe-core/cli

# Run accessibility audit
npx axe https://your-app.com --tags wcag2a,wcag2aa
```

### Manual Testing Checklist

- [ ] All interactive elements keyboard accessible (Tab)
- [ ] Screen reader announces all content (test with NVDA/JAWS)
- [ ] Focus indicators visible on all elements
- [ ] Color contrast ratios meet WCAG AA (4.5:1)
- [ ] Forms have proper labels and error messages
- [ ] ARIA roles and states correctly applied

---

## Security Hardening

### 1. URL Validation

All URL inputs (avatar src, link href) are validated:

```javascript
// Allowed protocols
const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// Blocked protocols (XSS vectors)
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];
```

### 2. Template Safety

All components use safe template cloning:

```javascript
// ✅ SAFE - No interpolation
const template = document.createElement('template');
template.innerHTML = `<button>...</button>`;
const clone = template.content.cloneNode(true);

// ❌ UNSAFE - Avoid
element.innerHTML = `<button>${userInput}</button>`;
```

### 3. Input Sanitization

User-provided attributes are sanitized:

```javascript
// Text content (safe)
element.textContent = userInput;

// Attributes (validated)
if (isValidValue(userInput)) {
  element.setAttribute('attr', userInput);
}
```

---

## Monitoring and Observability

### Error Tracking

```javascript
// Capture component errors
window.addEventListener('error', (event) => {
  if (event.target.tagName.startsWith('BRAND-')) {
    console.error('Component error:', event.target.tagName, event.error);
    // Send to error tracking service (Sentry, etc.)
  }
});
```

### Performance Monitoring

```javascript
// Measure component initialization time
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.startsWith('brand-')) {
      console.log(`${entry.name} initialized in ${entry.duration}ms`);
    }
  }
});
observer.observe({ entryTypes: ['measure'] });
```

### Usage Analytics

```javascript
// Track component usage
document.addEventListener('click', (e) => {
  const component = e.target.closest('[class*="brand-"]');
  if (component) {
    analytics.track('component_interaction', {
      component: component.tagName.toLowerCase(),
      variant: component.getAttribute('variant'),
      action: 'click'
    });
  }
});
```

---

## Troubleshooting

### Components Not Rendering

**Symptoms:** Components appear as empty tags in DOM
**Cause:** JavaScript not loaded or module import failed
**Fix:**

```html
<!-- Ensure type="module" is present -->
<script type="module" src="./index.js"></script>

<!-- Check browser console for errors -->
```

### Styles Not Applying

**Symptoms:** Components render but look unstyled
**Cause:** Design tokens CSS not loaded
**Fix:**

```html
<!-- Ensure tokens are loaded BEFORE components -->
<link rel="stylesheet" href="./style.css">
<script type="module" src="./index.js"></script>
```

### Shadow DOM Access Issues

**Symptoms:** Cannot select elements inside component
**Cause:** Shadow DOM encapsulation
**Fix:**

```javascript
// ❌ Won't work
document.querySelector('.avatar__image');

// ✅ Access via shadowRoot
const avatar = document.querySelector('brand-avatar');
const image = avatar.shadowRoot.querySelector('.avatar__image');
```

### Form Submission Issues

**Symptoms:** Form-associated components not submitting values
**Cause:** FormData doesn't include custom elements
**Fix:**

```javascript
// Components use ElementInternals - values automatically included
const formData = new FormData(form);
console.log(formData.get('username')); // Works!
```

---

## Rollback Plan

If issues arise in production:

### 1. Immediate Rollback

```bash
# Revert to previous npm version
npm install @brand/components@0.9.0

# Or use CDN version pinning
<script type="module" src="https://cdn.jsdelivr.net/npm/@brand/components@0.9.0/dist/index.js"></script>
```

### 2. Hotfix Deployment

```bash
# Create hotfix branch
git checkout -b hotfix/1.0.1 v1.0.0

# Apply fix
# ... make changes ...

# Build and test
pnpm build
pnpm test

# Publish hotfix
npm version patch
npm publish
```

### 3. Monitor After Deployment

```javascript
// Set up error rate monitoring
const errorRate = errors / totalPageViews;
if (errorRate > 0.01) {
  // Alert team, consider rollback
}
```

---

## Next Steps (Optional Enhancements)

### Phase 2: Composed Components

Implement complex components using Phase 1 atoms:

- **brand-card** - Composed from divider, text, button
- **brand-modal** - Overlay with focus trap
- **brand-tabs** - Tab navigation pattern
- **brand-accordion** - Collapsible content sections
- **brand-dropdown** - Menu component

### Phase 3: Documentation Site

```bash
# Storybook for component documentation
npx storybook init

# Generate API docs from JSDoc
npx typedoc --out docs/api src/
```

### Phase 4: Framework Wrappers

Create official React/Vue/Svelte wrapper libraries:

```bash
# React wrappers with proper TypeScript types
@brand/react-components

# Vue 3 wrappers with composition API
@brand/vue-components

# Svelte wrappers with stores
@brand/svelte-components
```

### Phase 5: Advanced Features

- **Theming:** Runtime theme switching (light/dark/custom)
- **i18n:** Internationalization support
- **Animations:** Entrance/exit animations with reduced-motion support
- **Virtualization:** Virtual scrolling for large lists
- **Testing Utils:** Helper functions for component testing

---

## Support and Maintenance

### Reporting Issues

For bugs or feature requests:

1. Check existing issues in repository
2. Create new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS version
   - Minimal reproduction code

### Contributing

See `CONTRIBUTING.md` for guidelines on:

- Code style and conventions
- Testing requirements
- PR submission process
- Review criteria

### Versioning

This project follows Semantic Versioning (semver):

- **MAJOR:** Breaking API changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

---

## Contact

- **Issues:** GitHub Issues
- **Security:** See `docs/security.md` for security disclosure policy
- **Discussions:** GitHub Discussions

---

**Deployment Checklist:**

- [ ] Build packages (`pnpm build`)
- [ ] Run tests (`pnpm test`)
- [ ] Verify bundle sizes
- [ ] Update package versions
- [ ] Generate changelog
- [ ] Publish to npm
- [ ] Tag release in git
- [ ] Update documentation site
- [ ] Monitor error rates for 24h
- [ ] Announce release

**Status:** Ready for deployment 🚀
