<script lang="ts" setup>
import { useI18n } from '@workflow-automation/i18n';
import { computed } from 'vue';

import { N8nIconButton } from '@workflow-automation/design-system';
const props = defineProps<{
	stopping?: boolean;
}>();

const i18n = useI18n();

const title = computed(() =>
	props.stopping
		? i18n.baseText('nodeView.stoppingCurrentExecution')
		: i18n.baseText('nodeView.stopCurrentExecution'),
);
</script>

<template>
	<N8nIconButton
		icon="square"
		size="large"
		class="stop-execution"
		type="secondary"
		:title="title"
		:loading="stopping"
		data-test-id="stop-execution-button"
	/>
</template>
