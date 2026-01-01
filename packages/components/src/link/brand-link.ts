/**
 * BrandLink - Navigation link component
 * Per PRD Section 6 - Web Component Implementation Standards:
 * - Extends BaseComponent class
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Implements underline variants: none, hover, always
 * - Implements disabled state
 * - External link handling (target="_blank", rel="noopener noreferrer")
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all link instances
 * Memory efficient: one parsed stylesheet instead of N for N links
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline;
  }

  a {
    display: inline;
    color: var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    font-family: var(--font-body, system-ui);
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: color var(--motion-duration, 200ms) var(--motion-easing, ease-out),
                text-decoration var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }

  /* Underline variant: none */
  a[data-underline="none"] {
    text-decoration: none;
  }

  a[data-underline="none"]:hover:not([aria-disabled="true"]) {
    text-decoration: none;
  }

  /* Underline variant: hover (default) */
  a[data-underline="hover"] {
    text-decoration: none;
  }

  a[data-underline="hover"]:hover:not([aria-disabled="true"]) {
    text-decoration: underline;
  }

  /* Underline variant: always */
  a[data-underline="always"] {
    text-decoration: underline;
  }

  a[data-underline="always"]:hover:not([aria-disabled="true"]) {
    text-decoration: underline;
  }

  /* Hover state */
  a:hover:not([aria-disabled="true"]) {
    color: var(--color-primary-hover, var(--primitive-blue-800, #1e40af));
  }

  /* Disabled state */
  a[aria-disabled="true"] {
    color: var(--color-disabled, var(--primitive-gray-400, #9ca3af));
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  a:focus-visible {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* External link indicator (optional visual enhancement) */
  a[data-external="true"]::after {
    content: '';
    display: inline-block;
    width: 0.75em;
    height: 0.75em;
    margin-left: 0.25em;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72z"/><path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.7;
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * NO innerHTML with interpolation
 */
const template = document.createElement('template');
template.innerHTML = `<a part="link"><slot></slot></a>`;

/**
 * BrandLink Web Component
 * Provides navigation link with underline variants and external link handling
 */
export class BrandLink extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['href', 'underline', 'disabled', 'target'];

  /**
   * Internal anchor element reference
   * Used for targeted DOM updates
   */
  private link: HTMLAnchorElement | null = null;

  /**
   * ElementInternals for ARIA attributes
   */
  public internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  /**
   * Called when element is added to DOM
   * Per PRD 6.4: Clone template (safe - no interpolation)
   */
  connectedCallback(): void {
    // Clone template for safe DOM construction
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    // Get reference to internal link
    this.link = this.root.querySelector('a');

    // Add click handler for disabled state
    if (this.link) {
      this.listen(this.link, 'click', this.handleClick.bind(this));
    }

    // Initial attribute synchronization
    this.syncAttributes();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or link not yet rendered
    if (oldValue === newValue || !this.link) return;

    this.syncAttributes();
  }

  /**
   * Handle click events for disabled state
   */
  private handleClick(e: MouseEvent): void {
    // Prevent navigation if disabled
    if (this.hasAttribute('disabled')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Validate URL protocol for security
   * Blocks javascript: and data: URLs to prevent XSS attacks
   */
  private isValidLinkUrl(url: string): boolean {
    if (!url) return false;

    // Allow relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
      return true;
    }

    // Check protocol for absolute URLs
    try {
      const parsed = new URL(url, window.location.href);
      const protocol = parsed.protocol;
      // Allow safe protocols
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol);
    } catch {
      // Invalid URL
      return false;
    }
  }

  /**
   * Synchronize component attributes to internal link
   * Per PRD Section 6: Variants controlled via data attributes
   */
  private syncAttributes(): void {
    if (!this.link) return;

    // href attribute with URL protocol validation
    const href = this.getAttribute('href');
    if (href && this.isValidLinkUrl(href)) {
      this.link.href = href;

      // Auto-detect external links
      const isExternal = this.isExternalLink(href);
      if (isExternal) {
        this.link.setAttribute('data-external', 'true');

        // Set security attributes for external links
        // Per security best practices: prevent tabnabbing
        if (!this.hasAttribute('target')) {
          this.link.target = '_blank';
        }
        this.link.rel = 'noopener noreferrer';
      } else {
        this.link.removeAttribute('data-external');
      }
    } else if (href) {
      // TODO(review): Consider configurable logger instead of console.warn for production - code-reviewer, 2025-12-31, Severity: Low
      console.warn(`brand-link: Blocked potentially unsafe URL protocol: ${href}`);
      this.link.removeAttribute('href');
    } else {
      this.link.removeAttribute('href');
    }

    // target attribute (can override auto-detection)
    const target = this.getAttribute('target');
    if (target) {
      this.link.target = target;

      // Always add security for _blank targets
      if (target === '_blank') {
        this.link.rel = 'noopener noreferrer';
      }
    }

    // Underline variant: Set via data attribute for CSS targeting
    const underline = this.getAttribute('underline') ?? 'hover';
    this.link.dataset.underline = underline;

    // Disabled state
    const disabled = this.hasAttribute('disabled');

    // Update ARIA for accessibility
    this.internals.ariaDisabled = disabled ? 'true' : null;
    if (disabled) {
      this.link.setAttribute('aria-disabled', 'true');
      this.link.setAttribute('tabindex', '-1');
    } else {
      this.link.removeAttribute('aria-disabled');
      this.link.removeAttribute('tabindex');
    }
  }

  /**
   * Determine if a URL is external
   * External links are those that:
   * 1. Use different protocol (http vs https)
   * 2. Point to different domain
   * 3. Are absolute URLs to external domains
   */
  private isExternalLink(href: string): boolean {
    try {
      // Handle relative URLs - these are always internal
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        return false;
      }

      // Parse the URL
      const url = new URL(href, window.location.href);

      // Compare hostname
      return url.hostname !== window.location.hostname;
    } catch {
      // If URL parsing fails, treat as internal (safer default)
      return false;
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-link> in HTML
 */
customElements.define('brand-link', BrandLink);
