/**
 * BaseComponent - Foundation class for all web components
 * Per PRD Section 6.2 - Provides shared infrastructure for:
 * - Shadow DOM setup with Constructable Stylesheets
 * - Event listener management with automatic cleanup
 * - Safe XSS prevention patterns
 */

export abstract class BaseComponent extends HTMLElement {
  /**
   * Static stylesheet shared across all instances of this component
   * Each component class should define its own static styles property
   */
  static styles: CSSStyleSheet;

  /**
   * Event listener registry for automatic cleanup
   * Stores [target, type, listener] tuples
   */
  private _listeners: Array<[EventTarget, string, EventListener]> = [];

  /**
   * Shadow root reference
   * Protected so subclasses can access it
   */
  protected root: ShadowRoot;

  constructor() {
    super();

    // Check for existing declarative shadow root (SSR case)
    const existingRoot = this.shadowRoot;

    if (existingRoot) {
      // Adopt existing shadow root from SSR (Declarative Shadow DOM)
      this.root = existingRoot;
    } else {
      // Create new shadow root (client-only case)
      this.root = this.attachShadow({ mode: 'open' });
    }

    // Adopt shared stylesheet regardless of SSR or client-side creation
    const ctor = this.constructor as typeof BaseComponent;
    if (ctor.styles) {
      this.root.adoptedStyleSheets = [ctor.styles];
    }
  }

  /**
   * Safe event listener registration with automatic cleanup
   * Use this instead of addEventListener to prevent memory leaks
   *
   * @example
   * this.listen(button, 'click', () => this.handleClick());
   *
   * @param target - The element to attach the listener to
   * @param type - The event type (e.g., 'click', 'input')
   * @param listener - The event handler function
   * @param options - Optional event listener options
   */
  protected listen<K extends keyof HTMLElementEventMap>(
    target: EventTarget,
    type: K,
    listener: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener as EventListener, options);
    this._listeners.push([target, type, listener as EventListener]);
  }

  /**
   * Lifecycle callback: component removed from DOM
   * Automatically cleans up all registered event listeners
   * Subclasses can override but should call super.disconnectedCallback()
   */
  disconnectedCallback(): void {
    // Automatic cleanup prevents memory leaks
    for (const [target, type, listener] of this._listeners) {
      target.removeEventListener(type, listener);
    }
    this._listeners = [];
  }

  /**
   * Helper method to create elements safely (prevents XSS)
   * Use this instead of innerHTML with interpolated values
   *
   * @param tagName - The HTML tag name
   * @param props - Optional properties to set
   * @param children - Optional child elements or text
   * @returns The created element
   */
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    props?: Partial<HTMLElementTagNameMap[K]>,
    ...children: (Node | string)[]
  ): HTMLElementTagNameMap[K] {
    const el = document.createElement(tagName);

    if (props) {
      Object.assign(el, props);
    }

    for (const child of children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }

    return el;
  }
}
