import { inject } from 'vue';

import { ChatOptionsSymbol } from '@workflow-automation/chat/constants';
import type { ChatOptions } from '@workflow-automation/chat/types';

export function useOptions() {
	const options = inject(ChatOptionsSymbol) as ChatOptions;

	return {
		options,
	};
}
