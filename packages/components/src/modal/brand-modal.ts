/**
 * @component brand-modal
 * @description Modal dialog with backdrop, focus trap, and body scroll lock
 */

import { BaseComponent } from '../base-component.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="backdrop" part="backdrop" hidden>
    <div class="modal" part="modal" role="dialog" aria-modal="true" tabindex="-1">
      <div class="modal__header" part="header">
        <slot name="header"></slot>
        <button class="close-button" part="close-button" type="button" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="modal__content" part="content">
        <slot></slot>
      </div>
      <div class="modal__footer" part="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: contents;
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal, 9999);
    padding: var(--space-4, 1rem);
  }

  .backdrop[hidden] {
    display: none;
  }

  .modal {
    background: var(--color-surface, #fff);
    border-radius: var(--radius-3, 0.75rem);
    box-shadow: var(--shadow-4, 0 8px 32px rgba(0, 0, 0, 0.2));
    max-width: 32rem;
    max-height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    outline: none;
  }

  :host([size="sm"]) .modal {
    max-width: 24rem;
  }

  :host([size="lg"]) .modal {
    max-width: 48rem;
  }

  :host([size="full"]) .modal {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
    border-bottom: 1px solid var(--color-border, #e0e0e0);
  }

  .modal__header:empty {
    display: none;
  }

  .close-button {
    background: transparent;
    border: none;
    padding: var(--space-2, 0.5rem);
    margin-left: var(--space-2, 0.5rem);
    cursor: pointer;
    color: var(--color-text-secondary, #666);
    border-radius: var(--radius-1, 0.25rem);
    transition: all 150ms var(--ease-out, ease-out);
  }

  .close-button:hover {
    background: var(--color-surface-variant, #f5f5f5);
    color: var(--color-text, #000);
  }

  .close-button:focus-visible {
    outline: 2px solid var(--color-focus, #4f46e5);
    outline-offset: 2px;
  }

  .modal__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-5, 1.25rem);
  }

  .modal__footer {
    padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
    border-top: 1px solid var(--color-border, #e0e0e0);
  }

  .modal__footer:empty {
    display: none;
  }
`);

export class BrandModal extends BaseComponent {
  static styles = styles;

  static get observedAttributes() {
    return ['open', 'size'];
  }

  private backdrop: HTMLElement | null = null;
  private modal: HTMLElement | null = null;
  private closeButton: HTMLButtonElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  connectedCallback(): void {
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    this.backdrop = this.root.querySelector('.backdrop');
    this.modal = this.root.querySelector('.modal');
    this.closeButton = this.root.querySelector('.close-button');

    // Close button click
    this.listen(this.closeButton!, 'click', () => this.hide());

    // Backdrop click (close if clicking outside modal)
    this.listen(this.backdrop!, 'click', (e: MouseEvent) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });

    // Escape key
    this.listen(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.open) {
        this.hide();
      }
    });

    // Focus trap
    this.listen(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab' && this.open) {
        this.handleTab(e);
      }
    });

    this.updateAttributes();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'open') {
      this.updateAttributes();
    }
  }

  private updateAttributes(): void {
    if (!this.backdrop || !this.modal) return;

    if (this.open) {
      this.backdrop.hidden = false;

      // Save previously focused element
      this.previouslyFocused = document.activeElement as HTMLElement;

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Set ARIA label if provided
      const labelledBy = this.getAttribute('aria-labelledby');
      if (labelledBy) {
        this.modal.setAttribute('aria-labelledby', labelledBy);
      }

      const describedBy = this.getAttribute('aria-describedby');
      if (describedBy) {
        this.modal.setAttribute('aria-describedby', describedBy);
      }

      // Focus modal after a short delay to ensure content is rendered
      requestAnimationFrame(() => {
        this.updateFocusableElements();
        this.modal?.focus();
      });
    } else {
      this.backdrop.hidden = true;

      // Unlock body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (this.previouslyFocused) {
        requestAnimationFrame(() => {
          this.previouslyFocused?.focus();
          this.previouslyFocused = null;
        });
      }
    }
  }

  private updateFocusableElements(): void {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    // Get focusable elements from light DOM slots
    this.focusableElements = Array.from(
      this.querySelectorAll(selectors.join(','))
    ) as HTMLElement[];

    // Add close button
    if (this.closeButton) {
      this.focusableElements.push(this.closeButton);
    }
  }

  private handleTab(e: KeyboardEvent): void {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement || !this.modal?.contains(document.activeElement)) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }

  toggle(): void {
    this.open = !this.open;
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    const wasOpen = this.open;

    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }

    // Fire events on state change
    if (value && !wasOpen) {
      this.dispatchEvent(new CustomEvent('modal-open', {
        bubbles: true,
        composed: true
      }));
    } else if (!value && wasOpen) {
      this.dispatchEvent(new CustomEvent('modal-close', {
        bubbles: true,
        composed: true
      }));
    }
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }

  set size(value: string) {
    this.setAttribute('size', value);
  }
}

if (!customElements.get('brand-modal')) {
  customElements.define('brand-modal', BrandModal);
}
