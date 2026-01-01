/**
 * BrandAvatar - User representation component
 * Per PRD Requirements - Provides avatar with:
 * - Extends BaseComponent class
 * - Display modes: image, initials, icon fallback
 * - Size variants: xs, sm, md, lg, xl
 * - Optional status indicator (online, offline, away, busy)
 * - Circular shape
 * - Uses Constructable Stylesheet (shared CSSStyleSheet)
 * - Safe template cloning (NO innerHTML with interpolation)
 * - Consumes design tokens from @brand/tokens with fallback chains
 * - Fallback chain: image -> initials -> icon
 */

import { BaseComponent } from '../base-component';

/**
 * Create shared stylesheet once for all avatar instances
 * Memory efficient: one parsed stylesheet instead of N for N avatars
 */
const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full, 50%);
    overflow: hidden;
    background: var(--color-neutral-200, var(--primitive-gray-200, #e5e7eb));
    color: var(--color-neutral-700, var(--primitive-gray-700, #374151));
    font-family: var(--font-body, system-ui);
    font-weight: 500;
    user-select: none;
    position: relative;
    width: var(--avatar-size, 2.5rem);
    height: var(--avatar-size, 2.5rem);
  }

  /* Size variants using CSS custom properties */
  :host([size="xs"]) {
    --avatar-size: var(--size-avatar-xs, 1.5rem);
    --initials-size: var(--text-xs, 0.75rem);
    --icon-size: var(--size-icon-xs, 0.75rem);
    --status-size: 0.375rem;
  }

  :host([size="sm"]) {
    --avatar-size: var(--size-avatar-sm, 2rem);
    --initials-size: var(--text-sm, 0.875rem);
    --icon-size: var(--size-icon-sm, 1rem);
    --status-size: 0.5rem;
  }

  :host([size="md"]) {
    --avatar-size: var(--size-avatar-md, 2.5rem);
    --initials-size: var(--text-base, 1rem);
    --icon-size: var(--size-icon-md, 1.25rem);
    --status-size: 0.625rem;
  }

  :host([size="lg"]) {
    --avatar-size: var(--size-avatar-lg, 3rem);
    --initials-size: var(--text-lg, 1.125rem);
    --icon-size: var(--size-icon-lg, 1.5rem);
    --status-size: 0.75rem;
  }

  :host([size="xl"]) {
    --avatar-size: var(--size-avatar-xl, 4rem);
    --initials-size: var(--text-xl, 1.25rem);
    --icon-size: var(--size-icon-xl, 2rem);
    --status-size: 1rem;
  }

  /* Default size is md */
  :host(:not([size])) {
    --avatar-size: var(--size-avatar-md, 2.5rem);
    --initials-size: var(--text-base, 1rem);
    --icon-size: var(--size-icon-md, 1.25rem);
    --status-size: 0.625rem;
  }

  /* Image display mode */
  .avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
  }

  .avatar[data-mode="image"] .avatar__image {
    display: block;
  }

  .avatar[data-mode="image"] .avatar__initials,
  .avatar[data-mode="image"] .avatar__icon {
    display: none;
  }

  /* Initials display mode */
  .avatar__initials {
    font-size: var(--initials-size, 1rem);
    line-height: 1;
    text-transform: uppercase;
    display: none;
  }

  .avatar[data-mode="initials"] .avatar__initials {
    display: block;
  }

  .avatar[data-mode="initials"] .avatar__image,
  .avatar[data-mode="initials"] .avatar__icon {
    display: none;
  }

  /* Icon fallback display mode */
  .avatar__icon {
    display: none;
    width: var(--icon-size, 1.25rem);
    height: var(--icon-size, 1.25rem);
  }

  .avatar[data-mode="icon"] .avatar__icon {
    display: block;
  }

  .avatar[data-mode="icon"] .avatar__image,
  .avatar[data-mode="icon"] .avatar__initials {
    display: none;
  }

  /* Default user icon SVG */
  .avatar__icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  /* Status indicator */
  .avatar__status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: var(--status-size, 0.625rem);
    height: var(--status-size, 0.625rem);
    border-radius: var(--radius-full, 50%);
    border: 2px solid var(--color-surface, var(--primitive-white, #ffffff));
    display: none;
  }

  :host([status]) .avatar__status {
    display: block;
  }

  /* Status variants */
  .avatar__status[data-status="online"] {
    background: var(--color-success, var(--primitive-green-500, #22c55e));
  }

  .avatar__status[data-status="offline"] {
    background: var(--color-neutral-400, var(--primitive-gray-400, #9ca3af));
  }

  .avatar__status[data-status="away"] {
    background: var(--color-warning, var(--primitive-yellow-500, #eab308));
  }

  .avatar__status[data-status="busy"] {
    background: var(--color-error, var(--primitive-red-500, #ef4444));
  }

  /* Focus styles for accessibility (WCAG 2.1 AA) */
  :host(:focus-visible) .avatar {
    outline: 2px solid var(--color-primary, var(--primitive-blue-700, #1d4ed8));
    outline-offset: 2px;
  }

  /* Image loading state */
  .avatar__image[data-loading="true"] {
    opacity: 0;
  }

  .avatar__image[data-loading="false"] {
    opacity: 1;
    transition: opacity var(--motion-duration, 200ms) var(--motion-easing, ease-out);
  }
`);

/**
 * Static template for safe DOM construction
 * Per PRD 6.4: Use template.cloneNode() to prevent XSS
 * Includes all display modes: image, initials, icon fallback
 */
const template = document.createElement('template');
template.innerHTML = `
  <div class="avatar" part="avatar">
    <img class="avatar__image" part="image" alt="" />
    <span class="avatar__initials" part="initials"></span>
    <span class="avatar__icon" part="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </span>
    <span class="avatar__status" part="status"></span>
  </div>
`;

/**
 * BrandAvatar Web Component
 * Provides user representation with image, initials, or icon fallback
 */
export class BrandAvatar extends BaseComponent {
  /**
   * Static stylesheet shared across all instances
   * Adopted in BaseComponent constructor via adoptedStyleSheets
   */
  static styles = styles;

  /**
   * Observed attributes trigger attributeChangedCallback
   * Per PRD 6.5: Efficient re-rendering via targeted updates
   */
  static observedAttributes = ['src', 'alt', 'name', 'size', 'status'];

  /**
   * Internal element references
   */
  private avatar: HTMLDivElement | null = null;
  private image: HTMLImageElement | null = null;
  private initials: HTMLSpanElement | null = null;
  private icon: HTMLSpanElement | null = null;
  private statusIndicator: HTMLSpanElement | null = null;

  /**
   * Track image loading state
   */
  private imageLoaded = false;
  private imageError = false;

  /**
   * ElementInternals for ARIA
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

    // Get references to internal elements
    this.avatar = this.root.querySelector('.avatar');
    this.image = this.root.querySelector('.avatar__image');
    this.initials = this.root.querySelector('.avatar__initials');
    this.icon = this.root.querySelector('.avatar__icon');
    this.statusIndicator = this.root.querySelector('.avatar__status');

    // Set up image loading handlers
    if (this.image) {
      this.listen(this.image, 'load', () => this.handleImageLoad());
      this.listen(this.image, 'error', () => this.handleImageError());
    }

    // Initial attribute synchronization and mode determination
    this.syncAttributes();
    this.updateDisplayMode();
  }

  /**
   * Called when observed attributes change
   * Per PRD 6.5: Targeted updates based on what changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Skip if no change or not yet rendered
    if (oldValue === newValue || !this.avatar) return;

    this.syncAttributes();

    // Re-evaluate display mode if relevant attributes changed
    if (name === 'src' || name === 'name') {
      this.updateDisplayMode();
    }
  }

  /**
   * Validate image URL to prevent unsafe protocols
   * Blocks javascript: and data: URLs while allowing http:, https:, and relative URLs
   */
  private isValidImageUrl(url: string): boolean {
    if (!url) return true; // Empty is valid (triggers fallback)

    // Allow relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }

    // Check protocol for absolute URLs
    try {
      const parsed = new URL(url, window.location.href);
      const protocol = parsed.protocol;
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      // TODO(review): Consider rejecting invalid URLs instead of allowing them through - security-reviewer, 2025-12-31, Severity: Low
      // Invalid URL, allow it (browser will handle error naturally)
      return true;
    }
  }

  /**
   * Synchronize component attributes to internal elements
   */
  private syncAttributes(): void {
    if (!this.avatar) return;

    // Handle image source
    const src = this.getAttribute('src');
    if (src && this.isValidImageUrl(src) && this.image) {
      this.image.src = src;
      this.image.dataset.loading = 'true';
      this.imageLoaded = false;
      this.imageError = false;
    } else if (src && this.image) {
      // TODO(review): Consider configurable logger instead of console.warn for production - code-reviewer, 2025-12-31, Severity: Low
      console.warn(`brand-avatar: Blocked potentially unsafe URL protocol: ${src}`);
      // Don't set src, let fallback handle it
      this.imageError = true;
    }

    // Handle alt text for image
    const alt = this.getAttribute('alt');
    if (this.image) {
      this.image.alt = alt || '';
    }

    // Handle initials from name
    const name = this.getAttribute('name');
    if (name && this.initials) {
      this.initials.textContent = this.generateInitials(name);
    }

    // Handle status indicator
    const status = this.getAttribute('status');
    if (status && this.statusIndicator) {
      this.statusIndicator.dataset.status = status;
    }

    // Set ARIA label
    const ariaLabel = alt || name || 'User avatar';
    this.internals.ariaLabel = ariaLabel;
    this.internals.role = 'img';
  }

  /**
   * Generate initials from a name
   * Takes first letter of first and last name
   */
  private generateInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    // First letter of first name + first letter of last name
    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return (first + last).toUpperCase();
  }

  /**
   * Update display mode based on fallback chain: image -> initials -> icon
   */
  private updateDisplayMode(): void {
    if (!this.avatar) return;

    const src = this.getAttribute('src');
    const name = this.getAttribute('name');

    // Fallback chain priority:
    // 1. Image (if src provided and loaded successfully)
    // 2. Initials (if name provided)
    // 3. Icon (default fallback)

    if (src && !this.imageError) {
      // Try image mode
      this.avatar.dataset.mode = 'image';
    } else if (name) {
      // Fall back to initials
      this.avatar.dataset.mode = 'initials';
    } else {
      // Fall back to icon
      this.avatar.dataset.mode = 'icon';
    }
  }

  /**
   * Handle successful image load
   */
  private handleImageLoad(): void {
    this.imageLoaded = true;
    this.imageError = false;
    if (this.image) {
      this.image.dataset.loading = 'false';
    }
    this.updateDisplayMode();
  }

  /**
   * Handle image load error - fall back to next mode
   */
  private handleImageError(): void {
    this.imageLoaded = false;
    this.imageError = true;
    if (this.image) {
      this.image.dataset.loading = 'false';
    }
    this.updateDisplayMode();
  }

  /**
   * Public getter for src
   */
  get src(): string | null {
    return this.getAttribute('src');
  }

  /**
   * Public setter for src
   */
  set src(value: string | null) {
    if (value === null) {
      this.removeAttribute('src');
    } else {
      this.setAttribute('src', value);
    }
  }

  /**
   * Public getter for alt
   */
  get alt(): string | null {
    return this.getAttribute('alt');
  }

  /**
   * Public setter for alt
   */
  set alt(value: string | null) {
    if (value === null) {
      this.removeAttribute('alt');
    } else {
      this.setAttribute('alt', value);
    }
  }

  /**
   * Public getter for name
   */
  get name(): string | null {
    return this.getAttribute('name');
  }

  /**
   * Public setter for name
   */
  set name(value: string | null) {
    if (value === null) {
      this.removeAttribute('name');
    } else {
      this.setAttribute('name', value);
    }
  }

  /**
   * Public getter for size
   */
  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  /**
   * Public setter for size
   */
  set size(value: string) {
    this.setAttribute('size', value);
  }

  /**
   * Public getter for status
   */
  get status(): string | null {
    return this.getAttribute('status');
  }

  /**
   * Public setter for status
   */
  set status(value: string | null) {
    if (value === null) {
      this.removeAttribute('status');
    } else {
      this.setAttribute('status', value);
    }
  }
}

/**
 * Register the custom element
 * Component can be used as <brand-avatar> in HTML
 */
customElements.define('brand-avatar', BrandAvatar);
