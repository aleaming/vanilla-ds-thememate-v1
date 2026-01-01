/**
 * Test setup for Vitest
 * Provides polyfills for missing browser APIs in jsdom
 */

// Mock ElementInternals.states for jsdom compatibility
// jsdom doesn't fully support CustomStateSet yet
class MockCustomStateSet extends Set<string> {}

class MockElementInternals {
  states: MockCustomStateSet;
  ariaDisabled: string | null = null;
  ariaRequired: string | null = null;
  ariaChecked: string | null = null;
  ariaLabel: string | null = null;
  role: string | null = null;
  private _formValue: FormData | string | null = null;
  private _validityState: ValidityState | null = null;
  private _validationMessage: string = '';

  constructor() {
    this.states = new MockCustomStateSet();
  }

  // Form value methods
  setFormValue(value: FormData | string | null): void {
    this._formValue = value;
  }

  // Validation methods
  setValidity(
    flags?: Partial<ValidityState>,
    message?: string,
    anchor?: HTMLElement
  ): void {
    if (!flags || Object.keys(flags).length === 0) {
      // Clear validity
      this._validityState = {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      } as ValidityState;
      this._validationMessage = '';
    } else {
      // Set validity with flags
      this._validityState = {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: false,
        ...flags,
      } as ValidityState;
      this._validationMessage = message ?? '';
    }
  }

  get validity(): ValidityState {
    if (!this._validityState) {
      return {
        valueMissing: false,
        typeMismatch: false,
        patternMismatch: false,
        tooLong: false,
        tooShort: false,
        rangeUnderflow: false,
        rangeOverflow: false,
        stepMismatch: false,
        badInput: false,
        customError: false,
        valid: true,
      } as ValidityState;
    }
    return this._validityState;
  }

  get validationMessage(): string {
    return this._validationMessage;
  }

  checkValidity(): boolean {
    return this.validity.valid;
  }

  reportValidity(): boolean {
    return this.validity.valid;
  }
}

// Always set up the polyfill in test environment
if (typeof globalThis !== 'undefined') {
  (globalThis as any).ElementInternals = MockElementInternals;

  if (typeof HTMLElement !== 'undefined') {
    HTMLElement.prototype.attachInternals = function () {
      return new MockElementInternals() as any;
    };
  }
}

// Polyfill for CSSStyleSheet.replaceSync - always override to store CSS text
if (typeof CSSStyleSheet !== 'undefined') {
  const originalReplaceSync = CSSStyleSheet.prototype.replaceSync;
  CSSStyleSheet.prototype.replaceSync = function (text: string) {
    // Store the CSS text for testing purposes
    (this as any)._cssText = text;
    // Call original if it exists
    if (originalReplaceSync) {
      try {
        originalReplaceSync.call(this, text);
      } catch (e) {
        // Ignore errors in jsdom
      }
    }
  };
}

// Polyfill for adoptedStyleSheets if missing
if (typeof ShadowRoot !== 'undefined' && !('adoptedStyleSheets' in ShadowRoot.prototype)) {
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    get() {
      return (this as any)._adoptedStyleSheets || [];
    },
    set(sheets: CSSStyleSheet[]) {
      (this as any)._adoptedStyleSheets = sheets;
    },
  });
}
