# Security Considerations

## Shadow DOM Mode: Open vs Closed

### Decision: Open Shadow DOM
All components use `mode: 'open'` for shadow root attachment.

### Rationale
- **Theming:** CSS custom properties can pierce shadow boundaries, enabling design system theming
- **Testing:** Test frameworks need access to shadow DOM internals
- **Debugging:** Developer tools require shadow root access
- **Slot Inspection:** Framework integration needs to inspect slotted content

### Trade-offs
**Benefits:**
- Full CSS custom property support for theming
- Comprehensive testability with standard testing frameworks
- Better developer experience with DevTools
- Framework compatibility (React, Vue, Angular)

**Risks:**
- External JavaScript can access `element.shadowRoot` and manipulate internals
- Component encapsulation is reduced (though styles remain encapsulated)
- Malicious scripts on the page could modify component structure

### Mitigation Strategies
1. **Content Security Policy:** Implement strict CSP to prevent script injection
2. **Input Validation:** All user-provided attributes are validated (URLs, protocols)
3. **Safe Templating:** Template cloning with no innerHTML interpolation
4. **Trusted Content:** Components expect to run in trusted document contexts
5. **Slot Projection:** User content flows through slots (browser-sanitized)

## XSS Prevention

### Template Cloning Pattern
All components use `template.content.cloneNode(true)` for DOM construction:
- No `innerHTML` with user interpolation
- Static templates only
- Dynamic content via `textContent` or slots

### URL Validation
Components accepting URLs (brand-link, brand-avatar) validate protocols:
- **Allowed:** `http:`, `https:`, `mailto:`, `tel:`, relative paths
- **Blocked:** `javascript:`, `data:`, `vbscript:`, `file:`

### Form Data Handling
Form components delegate validation to native elements via ElementInternals:
- Browser's built-in validation
- No server-side validation bypass risk
- Native form submission patterns

## Dependency Security

### Minimal Dependencies
Runtime dependencies: `@brand/tokens` (first-party)
- No third-party runtime code
- Reduced supply chain attack surface

### Development Dependencies
- Regular `npm audit` for vulnerability scanning
- Automated Dependabot updates
- Pinned versions for production builds

## Content Security Policy Recommendations

Suggested CSP headers for apps using these components:

```
Content-Security-Policy:
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  font-src 'self';
  script-src 'self';
```

**Note:** `'unsafe-inline'` for styles is required for Shadow DOM CSS. Consider using `<style>` tags in declarative shadow roots instead of inline styles where possible.

<!-- FIXME(nitpick): Add nonce guidance for inline scripts to complement unsafe-inline style recommendation - security-reviewer, 2025-12-31, Severity: Cosmetic -->

## Reporting Security Issues

Please report security vulnerabilities to: security@yourcompany.com

Do not file public issues for security concerns.
