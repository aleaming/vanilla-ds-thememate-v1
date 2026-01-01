# **PRODUCT REQUIREMENTS DOCUMENT**

Framework-Independent Design System

*Phase 1: Core Atoms*

Pure Vanilla Web Components — Zero Runtime Dependencies

Version 2.0 — December 2025

# **Table of Contents**

# **1\. Executive Summary**

This document defines the architecture and implementation plan for Phase 1 of a framework-independent design system built entirely with vanilla Web Components. No frameworks, no runtime dependencies—just native browser APIs and modern platform features.

## **1.1 The Challenge**

Our organization operates three distinct luxury brands, each requiring consistent yet differentiated digital experiences. Current development teams use React, Vue, and vanilla HTML, creating fragmentation that leads to duplicated effort, inconsistent brand expression, and framework lock-in.

## **1.2 The Solution**

We will build a native Web Component library using browser-native APIs—Custom Elements, Shadow DOM, CSS Custom Properties, Constructable Stylesheets, and Form-Associated Custom Elements. This approach provides:

* Zero Runtime Dependencies: Pure browser APIs, nothing to download or break  
* Framework Independence: Components work identically in React, Vue, Angular, or vanilla HTML  
* Multi-Brand Theming: Switch entire brand identity by changing \~30 CSS custom properties  
* Server-Side Rendering: Declarative Shadow DOM enables true SSR without hydration complexity  
* Native Form Integration: Full participation in HTML forms via ElementInternals API  
* Permanent Stability: Browser APIs don't have breaking changes—this code runs forever  
* WCAG AA Compliance: Accessibility built into the foundation

## **1.3 Phase 1 Scope**

This phase delivers 14 core atom-level components—the fundamental building blocks from which all higher-level patterns will be composed. These atoms establish the architectural patterns, token integration, security practices, and quality standards for all future development.

# **2\. Problem Statement & Business Case**

## **2.1 Current Pain Points**

* Fragmented Implementation: The same button exists in 3+ variations across codebases, each with subtle differences  
* Brand Inconsistency: Without a single source of truth, brand expression drifts as teams interpret guidelines differently  
* Framework Lock-in: Components built for React cannot be used by Vue teams without complete rewrites  
* Runtime Dependencies: Even lightweight frameworks add bundle size and potential breaking changes on updates  
* Form Integration Gaps: Custom form controls don't participate in native form submission or validation  
* SSR Limitations: Current approaches require complex hydration strategies or JavaScript for initial render  
* Documentation Tooling Churn: Third-party tools like Storybook introduce 700+ dependencies and constant migration effort

## **2.2 Business Justification**

Pure vanilla Web Components with modern browser APIs represent the most stable and capable foundation. Browser APIs are standardized and backwards-compatible—code written today will run unchanged in 10 years. This investment will:

* Reduce development time by 40-60% for new features requiring UI components  
* Ensure brand consistency across all three brands automatically  
* Eliminate framework migration costs permanently  
* Enable true server-side rendering for improved SEO and initial load performance  
* Provide native form integration without wrapper complexity  
* Create a foundation that never requires updating for breaking changes

# **3\. Goals & Success Metrics**

## **3.1 Phase 1 Goals**

* Build 14 core atom components using only native browser APIs  
* Establish the two-layer token system with CSS Layers for predictable specificity  
* Implement Form-Associated Custom Elements for native form participation  
* Ensure framework compatibility with React, Vue, and vanilla HTML  
* Meet WCAG 2.1 AA standards for all components  
* Enable server-side rendering via Declarative Shadow DOM  
* Create dogfooded documentation built with our own components

## **3.2 Success Metrics**

| Metric | Target |
| ----- | ----- |
| Component Count | 14 atom-level components |
| Runtime Dependencies | Zero (pure browser APIs only) |
| Framework Compatibility | 100% functional in React, Vue, vanilla HTML |
| Brand Theme Switching | Complete visual transformation via CSS only |
| Form Integration | Full native form participation via ElementInternals |
| SSR Support | Declarative Shadow DOM for all components |
| Accessibility | WCAG 2.1 AA compliance |
| Bundle Size (all 14 atoms) | \<20KB gzipped total |
| Documentation Dependencies | Zero external UI frameworks |

# **4\. Technical Architecture Overview**

## **4.1 Core Principle: Native APIs Only**

Every component is built using exclusively browser-native APIs. No abstractions, no runtime libraries, no framework dependencies:

* Custom Elements API: Define new HTML tags with customElements.define()  
* Shadow DOM API: Encapsulated styling via attachShadow()  
* Constructable Stylesheets: Shared styles across instances via adoptedStyleSheets  
* HTML Templates: Efficient DOM creation via \<template\> elements  
* CSS Custom Properties: Theming via native CSS variables with @layer precedence  
* ElementInternals API: Form participation, validation, and custom states  
* Declarative Shadow DOM: Server-side rendering via \<template shadowrootmode\>  
* ES Modules: Native JavaScript module system

## **4.2 Browser API Capabilities Reference**

| API | Purpose | Browser Support |
| ----- | ----- | ----- |
| Custom Elements v1 | Define custom HTML elements | All modern browsers |
| Shadow DOM v1 | Style encapsulation | All modern browsers |
| Constructable Stylesheets | Shared stylesheet instances | All modern browsers |
| ElementInternals | Form association, custom states | All modern browsers |
| Declarative Shadow DOM | SSR-compatible shadow roots | Chrome 90+, Safari 16.4+, Firefox 123+ |
| CSS Custom Properties | Design token system | All modern browsers |
| CSS @layer | Specificity management | All modern browsers |
| CSS ::part() | External style hooks | All modern browsers |
| CSS :state() | Custom state pseudo-classes | Chrome 125+, Safari 17.4+, Firefox 126+ |

## **4.3 System Layers**

The architecture consists of three distinct layers:

### **Layer 1: Design Tokens (CSS Custom Properties)**

The foundation of all visual styling, organized into two sub-layers with CSS @layer for predictable specificity:

* Primitives: Raw values (--primitive-blue-500, \--space-4)  
* Branded Touchpoints: Semantic mappings (--color-primary, \--radius-button)

### **Layer 2: Vanilla Web Components**

Native custom elements extending HTMLElement with modern capabilities:

* Consume only branded touchpoint tokens via CSS custom properties  
* Share styles via Constructable Stylesheets for memory efficiency  
* Participate in forms via ElementInternals API  
* Support SSR via Declarative Shadow DOM  
* Expose custom states via :state() pseudo-class

### **Layer 3: Framework Wrappers (Optional)**

Thin adapter layers for improved DX in React and Vue:

* Custom wrapper generation (no third-party libraries)  
* Property reflection and event forwarding for React  
* v-model support for Vue  
* Type-safe props and events via TypeScript

# **5\. Design Token System**

## **5.1 Two-Layer Philosophy**

The token system separates raw values from semantic meaning. Rebranding requires changing only \~30 branded touchpoint mappings—primitives stay constant.

## **5.2 CSS Layers for Token Precedence**

We use CSS @layer to guarantee predictable specificity regardless of source order:

@layer primitives, brand, component, overrides;

@layer primitives {

  :root {

    \--primitive-blue-500: \#3b82f6;

    \--primitive-blue-700: \#1d4ed8;

    \--space-4: 1rem;

  }

}

@layer brand {

  :root {

    \--color-primary: var(--primitive-blue-700);

    \--color-primary-hover: var(--primitive-blue-800);

  }

}

@layer component {

  /\* Component-specific token overrides \*/

}

@layer overrides {

  /\* Consumer overrides always win \*/

}

## **5.3 Layer 1: Primitives**

Raw, immutable values representing all available options:

/\* Colors \*/

\--primitive-blue-50 through \--primitive-blue-900

\--primitive-gray-50 through \--primitive-gray-950

/\* Spacing \*/

\--space-0: 0 | \--space-1: 0.25rem | \--space-2: 0.5rem | \--space-4: 1rem

/\* Typography \*/

\--font-sans | \--font-serif | \--font-mono | \--font-display

\--text-xs through \--text-5xl

/\* Shape & Motion \*/

\--radius-none through \--radius-full

\--duration-75 through \--duration-500

## **5.4 Layer 2: Branded Touchpoints**

Semantic mappings that change per brand:

/\* Colors \*/

\--color-primary: var(--primitive-blue-700);

\--color-primary-hover: var(--primitive-blue-800);

\--color-on-primary: var(--primitive-white);

/\* Typography \*/

\--font-heading: var(--font-display);

\--font-body: var(--font-sans);

/\* Shape \*/

\--radius-button: var(--radius-md);

\--radius-input: var(--radius-sm);

/\* Motion \*/

\--motion-duration: var(--duration-200);

\--motion-easing: ease-out;

## **5.5 Token Fallback Strategy**

All token references include fallback chains to prevent invisible failures:

/\* Fragile \- fails silently if undefined \*/

background: var(--color-primary);

/\* Robust \- graceful degradation \*/

background: var(--color-primary, var(--primitive-blue-700, \#1d4ed8));

Build-time validation ensures all tokens are defined, but runtime fallbacks provide defense in depth.

## **5.6 Theme Application**

\[data-theme="brand-a"\] {

  \--color-primary: var(--primitive-blue-800);

  \--radius-button: var(--radius-sm);

  \--font-heading: var(--font-serif);

}

\[data-theme="brand-b"\] {

  \--color-primary: var(--primitive-purple-600);

  \--radius-button: var(--radius-lg);

  \--font-heading: var(--font-display);

}

# **6\. Vanilla Web Component Architecture**

## **6.1 Why Pure Vanilla?**

| Aspect | With Framework (e.g., Lit) | Pure Vanilla |
| ----- | ----- | ----- |
| Runtime dependency | \~5KB minimum | 0KB |
| Breaking changes risk | On framework updates | Never (browser APIs stable) |
| Reactive properties | Automatic via decorators | Manual (explicit control) |
| Templating | Tagged template literals | Native DOM APIs / Constructable Stylesheets |
| Boilerplate | Less | More (but transparent) |
| Form integration | Requires manual setup | Native via ElementInternals |
| SSR support | Requires @lit-labs/ssr | Native via Declarative Shadow DOM |
| Longevity | Depends on maintainers | Forever (browser-native) |

## **6.2 Base Component Class**

All components extend a shared base class that handles common concerns: stylesheet sharing, event listener cleanup, and efficient updates.

// base-component.ts

export class BaseComponent extends HTMLElement {

  static styles: CSSStyleSheet;

  private \_listeners: Array\<\[EventTarget, string, EventListener\]\> \= \[\];

  protected root: ShadowRoot;

  constructor() {

    super();

    this.root \= this.attachShadow({ mode: 'open' });

    

    // Share stylesheet across all instances

    const ctor \= this.constructor as typeof BaseComponent;

    if (ctor.styles) {

      this.root.adoptedStyleSheets \= \[ctor.styles\];

    }

  }

  // Safe event listener registration with automatic cleanup

  protected listen\<K extends keyof HTMLElementEventMap\>(

    target: EventTarget,

    type: K,

    listener: (e: HTMLElementEventMap\[K\]) \=\> void,

    options?: AddEventListenerOptions

  ): void {

    target.addEventListener(type, listener as EventListener, options);

    this.\_listeners.push(\[target, type, listener as EventListener\]);

  }

  disconnectedCallback(): void {

    // Automatic cleanup prevents memory leaks

    for (const \[target, type, listener\] of this.\_listeners) {

      target.removeEventListener(type, listener);

    }

    this.\_listeners \= \[\];

  }

}

## **6.3 Constructable Stylesheets**

Instead of duplicating \<style\> tags in every component instance, we create a single shared stylesheet:

// Create shared stylesheet once

const buttonStyles \= new CSSStyleSheet();

buttonStyles.replaceSync(\`

  button {

    background: var(--color-primary, var(--primitive-blue-700, \#1d4ed8));

    color: var(--color-on-primary, white);

    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);

    border-radius: var(--radius-button, 0.375rem);

    border: none;

    cursor: pointer;

    transition: background var(--motion-duration, 200ms) var(--motion-easing, ease-out);

  }

  button:hover:not(:disabled) {

    background: var(--color-primary-hover, var(--primitive-blue-800, \#1e40af));

  }

  button:disabled {

    opacity: 0.5;

    cursor: not-allowed;

  }

\`);

// Adopt in component

this.shadowRoot.adoptedStyleSheets \= \[buttonStyles\];

For 50 buttons on a page, this creates one parsed stylesheet instead of 50—significant memory and performance savings.

## **6.4 Safe Templating Strategy**

The innerHTML approach with string interpolation creates XSS vulnerabilities. We use DOM construction for safety:

// UNSAFE \- vulnerable to XSS if attributes contain user input

this.shadowRoot.innerHTML \= \`\<button\>${this.label}\</button\>\`;

// SAFE \- DOM construction

private template: HTMLTemplateElement;

static {

  const tpl \= document.createElement('template');

  tpl.innerHTML \= '\<button part="button"\>\<slot\>\</slot\>\</button\>';

  BrandButton.template \= tpl;

}

connectedCallback() {

  // Clone template (safe \- no interpolation)

  const content \= BrandButton.template.content.cloneNode(true);

  this.root.appendChild(content);


  // Set dynamic values safely via DOM APIs

  this.button \= this.root.querySelector('button');

  this.updateDisabled();

}

## **6.5 Efficient Re-rendering**

Instead of replacing innerHTML on every attribute change, we make targeted DOM updates:

static observedAttributes \= \['variant', 'disabled', 'loading'\];

attributeChangedCallback(name: string, oldValue: string, newValue: string) {

  if (oldValue \=== newValue) return;


  // Targeted updates based on what changed

  switch (name) {

    case 'variant':

      this.button?.setAttribute('data-variant', newValue ?? 'primary');

      break;

    case 'disabled':

      this.updateDisabled();

      break;

    case 'loading':

      this.updateLoading();

      break;

  }

}

private updateDisabled() {

  const disabled \= this.hasAttribute('disabled') || this.hasAttribute('loading');

  this.button?.toggleAttribute('disabled', disabled);

  this.internals.ariaDisabled \= disabled ? 'true' : null;

}

## **6.6 Component Lifecycle**

Native Web Component lifecycle methods and their usage:

| Method | When Called | Our Usage |
| ----- | ----- | ----- |
| constructor() | Element created | Attach shadow DOM, adopt stylesheets, set up internals |
| connectedCallback() | Added to DOM | Clone template, initial render, add event listeners |
| disconnectedCallback() | Removed from DOM | Cleanup event listeners (automatic via base class) |
| attributeChangedCallback() | Attribute modified | Targeted DOM updates for changed attribute |
| adoptedCallback() | Moved to new document | Rare \- re-attach to new document context |
| formAssociatedCallback() | Associated with form | Store form reference for validation |
| formDisabledCallback() | Form disabled state changes | Update component disabled state |
| formResetCallback() | Form reset | Reset to default value |

## **6.7 Theming Integration**

Components consume branded touchpoints only. Theme changes cascade automatically through Shadow DOM:

/\* Component styles reference touchpoints with fallbacks \*/

background: var(--color-primary, var(--primitive-blue-700, \#1d4ed8));

border-radius: var(--radius-button, 0.375rem);

/\* Theme changes at root cascade through Shadow DOM \*/

document.documentElement.dataset.theme \= 'brand-b';

## **6.8 External Customization**

Components expose ::part() selectors for instance-level overrides:

/\* Override a specific button instance \*/

brand-button.hero::part(button) {

  \--color-primary: var(--primitive-gold-500);

  font-size: var(--text-xl);

}

# **7\. Form-Associated Custom Elements**

Form inputs (brand-input, brand-select, brand-checkbox, brand-radio, brand-switch, brand-textarea) must participate in native HTML forms. The ElementInternals API provides this capability.

## **7.1 ElementInternals API**

ElementInternals enables custom elements to participate fully in HTML forms:

class BrandInput extends BaseComponent {

  static formAssociated \= true; // Required flag

  private internals: ElementInternals;

  constructor() {

    super();

    this.internals \= this.attachInternals();

  }

  // Form value integration

  get value(): string { return this.\_value; }

  set value(v: string) {

    this.\_value \= v;

    this.internals.setFormValue(v);

  }

  // Native validation integration

  get validity(): ValidityState { return this.internals.validity; }

  get validationMessage(): string { return this.internals.validationMessage; }

  checkValidity(): boolean { return this.internals.checkValidity(); }

  reportValidity(): boolean { return this.internals.reportValidity(); }

  // Custom validation

  setCustomValidity(message: string) {

    if (message) {

      this.internals.setValidity({ customError: true }, message, this.input);

    } else {

      this.internals.setValidity({});

    }

  }

}

## **7.2 Form Lifecycle Callbacks**

Form-associated elements receive special lifecycle callbacks:

// Called when element is associated with a form

formAssociatedCallback(form: HTMLFormElement) {

  this.\_form \= form;

}

// Called when form's disabled state changes

formDisabledCallback(disabled: boolean) {

  this.updateDisabledState(disabled);

}

// Called when form is reset

formResetCallback() {

  this.value \= this.getAttribute('value') ?? '';

  this.internals.setValidity({});

}

// Called when form state is restored (back/forward nav)

formStateRestoreCallback(state: string, mode: string) {

  this.value \= state;

}

## **7.3 Custom States**

ElementInternals also provides custom states that work with CSS pseudo-classes:

// Set custom states

this.internals.states.add('loading');

this.internals.states.add('invalid');

// Remove states

this.internals.states.delete('loading');

// CSS usage

brand-button:state(loading) {

  pointer-events: none;

}

brand-input:state(invalid)::part(input) {

  border-color: var(--color-error);

}

Custom states are cleaner than data attributes and provide a more CSS-native API.

## **7.4 Label Association**

Form elements must work with \<label for="..."\>. ElementInternals handles this automatically when IDs match:

\<label for="email"\>Email Address\</label\>

\<brand-input id="email" type="email" name="email"\>\</brand-input\>

// Clicking the label focuses the input automatically

// Screen readers announce the label correctly

# **8\. Server-Side Rendering**

For luxury brands, SEO and initial paint time are critical. Declarative Shadow DOM enables true server-side rendering without JavaScript-dependent hydration.

## **8.1 Declarative Shadow DOM**

Shadow roots can be declared in static HTML:

\<\!-- Server-rendered HTML \--\>

\<brand-button variant="primary"\>

  \<template shadowrootmode="open"\>

    \<style\>

      button { background: var(--color-primary); }

    \</style\>

    \<button part="button"\>\<slot\>\</slot\>\</button\>

  \</template\>

  Click Me

\</brand-button\>

The browser parses this immediately—no JavaScript required for initial render. This eliminates Flash of Unstyled Content (FOUC).

## **8.2 Hydration Strategy**

Components detect existing declarative shadow roots and adopt them rather than recreating:

constructor() {

  super();


  // Check for existing declarative shadow root

  const existingRoot \= this.shadowRoot;


  if (existingRoot) {

    // Adopt existing shadow root (SSR case)

    this.root \= existingRoot;

  } else {

    // Create new shadow root (client-only case)

    this.root \= this.attachShadow({ mode: 'open' });

  }


  // Adopt shared stylesheet regardless

  this.root.adoptedStyleSheets \= \[buttonStyles\];

}

## **8.3 SSR Template Generation**

Build tooling generates SSR templates from component definitions:

// Component exports SSR template

export function renderBrandButton(props: ButtonProps, slotContent: string): string {

  return \`

\<brand-button variant="${escapeHtml(props.variant ?? 'primary')}"\>

  \<template shadowrootmode="open"\>

    \<style\>${buttonStyles.cssText}\</style\>

    \<button part="button" data-variant="${escapeHtml(props.variant ?? 'primary')}"\>

      \<slot\>\</slot\>

    \</button\>

  \</template\>

  ${slotContent}

\</brand-button\>

  \`;

}

## **8.4 Browser Support Consideration**

Declarative Shadow DOM support:

| Browser | Support | Notes |
| ----- | ----- | ----- |
| Chrome/Edge | 90+ (March 2021\) | Full support |
| Safari | 16.4+ (March 2023\) | Full support |
| Firefox | 123+ (Feb 2024\) | Full support |
| Fallback | Polyfill available | @webcomponents/template-shadowroot |

For browsers without support, a small polyfill upgrades \<template shadowrootmode\> elements on DOMContentLoaded.

# **9\. Component Inventory (14 Atoms)**

Phase 1 delivers these foundational components:

| Component | Description | Key Features |
| ----- | ----- | ----- |
| brand-button | Primary action trigger | Variants: primary, secondary, ghost, destructive. States: loading, disabled. Icon slots. |
| brand-icon | SVG icon system | Size variants, color inheritance, sprite support, accessible labels. |
| brand-badge | Status indicators | Color variants: success, warning, error, info. Notification counts. |
| brand-text | Typography component | Heading levels h1-h6, body, caption, label. Weight control. |
| brand-checkbox | Toggle selection | States: checked, unchecked, indeterminate. Form-associated. |
| brand-radio | Single selection | Radio group controller, keyboard navigation. Form-associated. |
| brand-input | Text entry | Types: text, email, password, number, search. Validation states. Form-associated. |
| brand-textarea | Multi-line text | Auto-resize, character count, validation. Form-associated. |
| brand-select | Option selection | Custom styling, placeholder, disabled. Form-associated. |
| brand-switch | Binary toggle | Label positioning, size variants. Form-associated. |
| brand-link | Navigation element | External link handling, underline variants, disabled state. |
| brand-spinner | Loading indicator | Size variants, color inheritance, accessible label. |
| brand-divider | Content separator | Horizontal/vertical, optional label slot, spacing variants. |
| brand-avatar | User representation | Image, initials, icon fallback. Size variants, status indicator. |

# **10\. Accessibility Requirements**

## **10.1 WCAG 2.1 AA Standards**

Every component must meet:

* Color contrast ratios of 4.5:1 for normal text, 3:1 for large text  
* Full keyboard accessibility with visible focus indicators  
* Proper ARIA attributes per WAI-ARIA Authoring Practices  
* Touch targets minimum 44x44 CSS pixels  
* Information not conveyed by color alone

## **10.2 ARIA Across Shadow Boundaries**

ARIA ID references (aria-describedby, aria-labelledby) have challenges across shadow boundaries. Our strategy:

// PROBLEM: Cross-boundary ID references may not resolve

\<brand-input aria-describedby="hint"\>\</brand-input\>

\<span id="hint"\>Enter your email\</span\>

// SOLUTION 1: Accept description as slot

\<brand-input\>

  \<span slot="description"\>Enter your email\</span\>

\</brand-input\>

// SOLUTION 2: Use aria-description attribute (newer, simpler)

\<brand-input aria-description="Enter your email"\>\</brand-input\>

// Component implementation

attributeChangedCallback(name) {

  if (name \=== 'aria-description') {

    const desc \= this.getAttribute('aria-description');

    this.input.setAttribute('aria-description', desc);

  }

}

## **10.3 Slotted Content Styling**

Content passed to \<slot\> lives in light DOM and has styling limitations:

/\* Can style slotted elements (limited) \*/

::slotted(span) {

  color: inherit;

}

/\* CANNOT use descendant selectors \*/

::slotted(span strong) { /\* Does NOT work \*/ }

/\* CANNOT use pseudo-elements \*/

::slotted(span)::before { /\* Does NOT work \*/ }

For complex slotted content, provide CSS custom properties that consumers can apply in light DOM styles.

## **10.4 Testing Strategy**

* Automated: axe-core in Playwright tests with shadow DOM piercing  
* Manual: Keyboard-only navigation testing for all interactive components  
* Screen Reader: VoiceOver (macOS/iOS), NVDA (Windows) testing  
* High Contrast: Windows High Contrast Mode verification

### **Shadow DOM Testing Patterns**

// Playwright shadow DOM queries

// Pierce shadow boundary

await page.locator('brand-button \>\>\> button').click();

// Or chain locators

await page.locator('brand-button').locator('button').click();

// axe-core with shadow DOM

const results \= await new AxeBuilder({ page })

  .include('brand-button')

  .analyze();

# **11\. Framework Integration**

## **11.1 Vanilla HTML (Native)**

Components work directly as custom HTML elements:

\<script type="module" src="@brand/components"\>\</script\>

\<brand-button variant="primary"\>Click Me\</brand-button\>

\<brand-input type="email" placeholder="Enter email"\>\</brand-input\>

## **11.2 React Integration**

React has specific quirks with custom elements that wrappers must address:

| Issue | Cause | Solution |
| ----- | ----- | ----- |
| Props as strings | React sets all props as attributes | Wrapper reflects properties explicitly |
| No custom events | React only handles synthetic events | Wrapper adds addEventListener calls |
| Boolean attributes | React passes disabled="false" | Wrapper normalizes boolean handling |
| Ref forwarding | Refs don't pierce wrapper | Wrapper uses forwardRef |

// @brand/components-react wrapper

import { forwardRef, useEffect, useRef } from 'react';

export const BrandButton \= forwardRef\<HTMLElement, BrandButtonProps\>(

  ({ variant, disabled, loading, onClick, children, ...props }, ref) \=\> {

    const innerRef \= useRef\<HTMLElement\>(null);

    const resolvedRef \= ref || innerRef;

    useEffect(() \=\> {

      const el \= resolvedRef.current;

      if (el && onClick) {

        el.addEventListener('click', onClick);

        return () \=\> el.removeEventListener('click', onClick);

      }

    }, \[onClick\]);

    return (

      \<brand-button

        ref={resolvedRef}

        variant={variant}

        disabled={disabled || undefined}  // Normalize boolean

        loading={loading || undefined}

        {...props}

      \>

        {children}

      \</brand-button\>

    );

  }

);

## **11.3 Vue Integration**

Vue 3 has better custom element support but benefits from typed wrappers:

// @brand/components-vue

\<script setup lang="ts"\>

import { BrandButton, BrandInput } from '@brand/components-vue';

const email \= ref('');

\</script\>

\<template\>

  \<BrandInput v-model="email" type="email" /\>

  \<BrandButton variant="primary" @click="handleSubmit"\>

    Submit

  \</BrandButton\>

\</template\>

Vue wrappers provide v-model support via custom modelValue prop handling.

## **11.4 Wrapper Generation Strategy**

Wrappers are auto-generated from component metadata, not hand-written:

// component-metadata.json (generated from TypeScript)

{

  "tagName": "brand-button",

  "attributes": \[

    { "name": "variant", "type": "string", "default": "primary" },

    { "name": "disabled", "type": "boolean" },

    { "name": "loading", "type": "boolean" }

  \],

  "events": \[

    { "name": "click", "detail": null }

  \],

  "slots": \[

    { "name": "", "description": "Button content" }

  \],

  "cssProperties": \[

    { "name": "--color-primary", "description": "Button background" }

  \],

  "parts": \[

    { "name": "button", "description": "The button element" }

  \]

}

# **12\. Distribution Strategy**

## **12.1 Package Structure**

| Package | Contents |
| ----- | ----- |
| @brand/tokens | CSS files: primitives.css, theme-a.css, theme-b.css, theme-internal.css |
| @brand/components | Core vanilla Web Components (ES modules), SSR templates |
| @brand/components-react | React wrappers with TypeScript definitions |
| @brand/components-vue | Vue 3 wrappers with TypeScript definitions |

## **12.2 Monorepo Structure**

brand-design-system/

├── packages/

│   ├── tokens/              \# CSS custom properties

│   │   ├── src/

│   │   │   ├── primitives.css

│   │   │   ├── layers.css     \# @layer definitions

│   │   │   └── themes/

│   │   └── TOKENS.md

│   ├── components/          \# Vanilla Web Components

│   │   ├── src/

│   │   │   ├── base-component.ts

│   │   │   ├── button/

│   │   │   │   ├── brand-button.ts

│   │   │   │   ├── brand-button.styles.ts

│   │   │   │   ├── brand-button.test.ts

│   │   │   │   └── brand-button.ssr.ts

│   │   │   └── ...

│   │   └── metadata.json    \# Generated component metadata

│   ├── components-react/    \# React wrappers (generated)

│   └── components-vue/      \# Vue wrappers (generated)

├── apps/

│   └── docs/                \# Dogfooded documentation

├── tools/

│   ├── generate-wrappers/   \# Wrapper generation scripts

│   └── generate-ssr/        \# SSR template generation

└── pnpm-workspace.yaml

# **13\. Documentation (Dogfooded)**

## **13.1 Approach**

The documentation site is built entirely with our own components—proving the system works for real applications. No Storybook, no external UI frameworks.

## **13.2 Required Documentation Tooling**

While avoiding Storybook's complexity, we still need essential features:

| Feature | Implementation | Dependencies Added |
| ----- | ----- | ----- |
| Syntax highlighting | Prism.js or Shiki | \+1 package |
| Live previews | Custom \<docs-preview\> component | 0 (our components) |
| Prop documentation | Generated from metadata.json | 0 |
| Search | Pagefind (static search) | \+1 package |
| Markdown rendering | markdown-it | \+1 package |
| Build | Vite | Already in stack |

## **13.3 Documentation Components**

apps/docs/

├── src/

│   ├── pages/              \# Static HTML pages

│   │   ├── components/     \# Component documentation

│   │   └── tokens/         \# Token reference

│   └── components/         \# Docs-specific components

│       ├── docs-preview.ts      \# Live component preview

│       ├── docs-props-table.ts  \# Auto-generated props

│       ├── docs-code-block.ts   \# Syntax highlighted code

│       ├── docs-theme-switcher.ts

│       └── docs-search.ts

└── build/                  \# Static output

## **13.4 Dependency Comparison**

| Approach | Total Dependencies | Security Risk | Maintenance Burden |
| ----- | ----- | ----- | ----- |
| Storybook 8.x | 700+ | High (large attack surface) | High (frequent updates) |
| Our Dogfooded Approach | \~30 | Low (minimal surface) | Low (stable core) |

# **14\. Implementation Timeline**

## **14.1 Phase 1 Schedule (14 Weeks)**

Extended from 12 to 14 weeks to account for Form-Associated elements and SSR support:

| Weeks | Deliverables |
| ----- | ----- |
| 1-2 | Monorepo setup, base component class, Constructable Stylesheets infrastructure, token system with CSS Layers |
| 3-4 | brand-button, brand-icon, brand-badge, brand-text, brand-spinner (non-form atoms) |
| 5-6 | brand-input, brand-textarea with full ElementInternals integration |
| 7-8 | brand-select, brand-checkbox, brand-radio, brand-switch (form atoms) |
| 9-10 | brand-link, brand-divider, brand-avatar. SSR template generation tooling |
| 11-12 | React and Vue wrapper generation. Documentation site shell with dogfooded components |
| 13-14 | Complete documentation, accessibility audit, security review, v1.0 release |

## **14.2 Future Phases (Not in Scope)**

* Phase 2: Composed components (card, modal, tabs, accordion, dropdown)  
* Phase 3: Complex components (data table, date picker, autocomplete)

# **15\. Technology Stack**

| Category | Technology | Justification |
| ----- | ----- | ----- |
| Component Architecture | Vanilla Web Components | Zero runtime, browser-native, permanent stability |
| Form Integration | ElementInternals API | Native form participation, validation, custom states |
| Style Sharing | Constructable Stylesheets | Memory-efficient style sharing across instances |
| SSR | Declarative Shadow DOM | Native SSR without hydration complexity |
| Language | TypeScript 5.x | Type safety, self-documenting APIs |
| Build Tool | Vite 5.x | Fast builds, library mode, ES modules |
| Package Manager | pnpm | Efficient disk usage, workspaces |
| Testing | Vitest \+ Playwright | Unit \+ visual \+ a11y testing with shadow DOM support |
| Documentation | Custom (Dogfooded) | Zero external UI dependencies, proves system |
| CI/CD | GitHub Actions | Native GitHub integration |
| Versioning | Changesets | Monorepo-aware versioning |

# **16\. Security Considerations**

## **16.1 XSS Prevention**

All user-provided content must be sanitized before DOM insertion:

* Never use innerHTML with interpolated values  
* Use textContent for text-only content  
* Use DOM APIs (createElement, setAttribute) for dynamic content  
* Template cloning for static structure, DOM APIs for dynamic values

## **16.2 Content Security Policy**

Components are designed to work with strict CSP:

Content-Security-Policy:

  default-src 'self';

  style-src 'self';  /\* No 'unsafe-inline' needed with adoptedStyleSheets \*/

  script-src 'self';

Constructable Stylesheets avoid inline \<style\> tags, enabling stricter CSP.

## **16.3 Dependency Auditing**

Automated security scanning in CI:

* pnpm audit on every PR  
* Dependabot alerts enabled  
* SLSA level 2 build provenance for published packages

# **17\. Governance**

## **17.1 Contribution Process**

* All changes via pull request with review  
* New components require RFC approval  
* Accessibility review mandatory for all components  
* Security review for any DOM manipulation changes

## **17.2 Versioning**

* Major: Breaking API changes (attribute removals, behavior changes)  
* Minor: New components, new features, new CSS custom properties  
* Patch: Bug fixes, accessibility improvements, documentation

## **17.3 Browser Support Policy**

Components support browsers with \>1% global usage. Current baseline:

* Chrome/Edge 90+ (Declarative Shadow DOM baseline)  
* Safari 16.4+  
* Firefox 123+

# **Appendix A: Component Usage Quick Reference**

## **A.1 Basic Setup**

\<\!-- Include tokens and components \--\>

\<link rel="stylesheet" href="@brand/tokens/dist/primitives.css"\>

\<link rel="stylesheet" href="@brand/tokens/dist/theme-a.css"\>

\<script type="module" src="@brand/components"\>\</script\>

\<\!-- Use components \--\>

\<brand-button variant="primary"\>Submit\</brand-button\>

\<brand-input type="email" placeholder="Email"\>\</brand-input\>

## **A.2 Theme Switching**

\<\!-- Set theme via data attribute \--\>

\<html data-theme="brand-a"\>

\<\!-- Switch dynamically \--\>

\<script\>

  document.documentElement.dataset.theme \= 'brand-b';

\</script\>

## **A.3 Form Integration**

\<\!-- Components participate in native forms \--\>

\<form id="contact" action="/submit" method="POST"\>

  \<brand-input name="email" type="email" required\>\</brand-input\>

  \<brand-textarea name="message" required\>\</brand-textarea\>

  \<brand-checkbox name="subscribe" value="yes"\>Subscribe\</brand-checkbox\>

  \<brand-button type="submit"\>Send\</brand-button\>

\</form\>

\<\!-- Form data includes custom elements \--\>

\<script\>

  const form \= document.getElementById('contact');

  form.addEventListener('submit', (e) \=\> {

    const data \= new FormData(form);

    console.log(data.get('email')); // Works\!

  });

\</script\>

## **A.4 Custom Styling**

/\* Override via CSS custom properties \*/

brand-button.hero {

  \--color-primary: var(--primitive-gold-500);

  \--color-primary-hover: var(--primitive-gold-600);

}

/\* Override via ::part() \*/

brand-button.large::part(button) {

  padding: var(--space-4) var(--space-8);

  font-size: var(--text-xl);

}

# **Appendix B: Complete Component Example**

Reference implementation of brand-button showing all patterns:

// brand-button.ts

import { BaseComponent } from '../base-component';

const styles \= new CSSStyleSheet();

styles.replaceSync(\`

  :host { display: inline-block; }


  button {

    display: inline-flex;

    align-items: center;

    gap: var(--space-2, 0.5rem);

    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);

    background: var(--color-primary, \#1d4ed8);

    color: var(--color-on-primary, white);

    border: none;

    border-radius: var(--radius-button, 0.375rem);

    font-family: var(--font-body, system-ui);

    font-size: var(--text-base, 1rem);

    cursor: pointer;

    transition: background var(--motion-duration, 200ms);

  }


  button:hover:not(:disabled) {

    background: var(--color-primary-hover, \#1e40af);

  }


  button:disabled {

    opacity: 0.5;

    cursor: not-allowed;

  }


  :host(:state(loading)) button {

    pointer-events: none;

  }

\`);

const template \= document.createElement('template');

template.innerHTML \= \`\<button part="button"\>\<slot\>\</slot\>\</button\>\`;

export class BrandButton extends BaseComponent {

  static styles \= styles;

  static observedAttributes \= \['variant', 'disabled', 'loading'\];


  private button: HTMLButtonElement | null \= null;

  private internals: ElementInternals;


  constructor() {

    super();

    this.internals \= this.attachInternals();

  }


  connectedCallback() {

    const content \= template.content.cloneNode(true);

    this.root.appendChild(content);

    this.button \= this.root.querySelector('button');

    this.syncAttributes();

  }


  attributeChangedCallback(name: string, oldVal: string, newVal: string) {

    if (oldVal \=== newVal || \!this.button) return;

    this.syncAttributes();

  }


  private syncAttributes() {

    if (\!this.button) return;

    

    const variant \= this.getAttribute('variant') ?? 'primary';

    this.button.dataset.variant \= variant;

    

    const disabled \= this.hasAttribute('disabled');

    const loading \= this.hasAttribute('loading');

    

    this.button.disabled \= disabled || loading;

    this.internals.ariaDisabled \= (disabled || loading) ? 'true' : null;

    

    if (loading) {

      this.internals.states.add('loading');

    } else {

      this.internals.states.delete('loading');

    }

  }

}

customElements.define('brand-button', BrandButton);

— End of Document —