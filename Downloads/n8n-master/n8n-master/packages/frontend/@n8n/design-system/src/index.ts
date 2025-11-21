import * as locale from './locale';

export * from './components';
export * from './plugin';
export * from './types';
export * from './utils';
export * from './directives';
export { default as N8nSelect2 } from './v2/components/Select/Select.vue';
export { default as N8nSelect2Item } from './v2/components/Select/SelectItem.vue';
export type * from './v2/components/Select/Select.types';
export { locale };

// Export composables
export { useProvideTooltipAppendTo, useInjectTooltipAppendTo } from './composables/useTooltipAppendTo';

// Export IconPicker types and utilities
export { isIconOrEmoji, type IconOrEmoji } from './components/N8nIconPicker/types';

// Export Logo as default export alias
export { default as Logo } from './components/N8nLogo';
