/**
 * @brand/components - Vanilla Web Components Design System
 *
 * Phase 1: Core Atoms
 * Phase 2: Composed Components
 * Phase 3: Complex Components
 * Zero runtime dependencies - Pure browser APIs
 */

// Export BaseComponent for consumers who want to extend it
export { BaseComponent } from './base-component';

// Phase 1: Import all atomic components to register them
import './button/brand-button';
import './input/brand-input';
import './textarea/brand-textarea';
import './checkbox/brand-checkbox';
import './radio/brand-radio';
import './select/brand-select';
import './switch/brand-switch';
import './icon/brand-icon';
import './badge/brand-badge';
import './text/brand-text';
import './spinner/brand-spinner';
import './link/brand-link';
import './divider/brand-divider';
import './avatar/brand-avatar';

// Phase 2: Import composed components
import './card/brand-card';
import './accordion';
import './tabs';
import './dropdown';
import './modal';

// Phase 3: Import complex components
import './autocomplete';
import './datepicker';
import './table';

// Re-export component classes for programmatic usage
// Phase 1
export { BrandButton } from './button/brand-button';
export { BrandInput } from './input/brand-input';
export { BrandTextarea } from './textarea/brand-textarea';
export { BrandCheckbox } from './checkbox/brand-checkbox';
export { BrandRadio } from './radio/brand-radio';
export { BrandSelect } from './select/brand-select';
export { BrandSwitch } from './switch/brand-switch';
export { BrandIcon } from './icon/brand-icon';
export { BrandBadge } from './badge/brand-badge';
export { BrandText } from './text/brand-text';
export { BrandSpinner } from './spinner/brand-spinner';
export { BrandLink } from './link/brand-link';
export { BrandDivider } from './divider/brand-divider';
export { BrandAvatar } from './avatar/brand-avatar';

// Phase 2
export { BrandCard } from './card/brand-card';
export {
  BrandAccordion,
  BrandAccordionItem,
  BrandAccordionHeader,
  BrandAccordionPanel
} from './accordion';
export {
  BrandTabs,
  BrandTabList,
  BrandTab,
  BrandTabPanel
} from './tabs';
export {
  BrandDropdown,
  BrandMenu,
  BrandMenuItem,
  BrandMenuDivider
} from './dropdown';
export { BrandModal } from './modal';

// Phase 3
export {
  BrandAutocomplete,
  BrandAutocompleteOption,
  BrandAutocompleteGroup
} from './autocomplete';
export { BrandDatepicker } from './datepicker';
export { BrandTable } from './table';
