<script lang="ts" setup>
import { useI18n } from '@workflow-automation/i18n';
import { computed } from 'vue';

import { N8nRadioButtons } from '@workflow-automation/design-system';
defineProps<{
	isBuildMode: boolean;
}>();

const emit = defineEmits<{
	toggle: [value: boolean];
}>();

const i18n = useI18n();

const options = computed(() => [
	{ label: i18n.baseText('aiAssistant.tabs.ask'), value: false },
	{ label: i18n.baseText('aiAssistant.tabs.build'), value: true },
]);

function toggle(value: boolean) {
	emit('toggle', value);
}
</script>

<template>
	<N8nRadioButtons
		size="small"
		:model-value="isBuildMode"
		:options="options"
		@update:model-value="toggle"
	/>
</template>
