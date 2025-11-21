import './main.scss';

import { createApp } from 'vue';

import { defaultMountingTarget, defaultOptions } from '@workflow-automation/chat/constants';
import { ChatPlugin } from '@workflow-automation/chat/plugins';
import type { ChatOptions } from '@workflow-automation/chat/types';
import { createDefaultMountingTarget } from '@workflow-automation/chat/utils';

import App from './App.vue';

// Export event bus
export { chatEventBus } from './event-buses';

// Export constants
export { ChatOptionsSymbol, ChatSymbol } from './constants';

// Export utils
export { constructChatWebsocketUrl } from './utils';

// Export components
export { MessagesList, Input as ChatInput } from './components';

// Export types
export type * from './types';
export type { ArrowKeyDownPayload } from './components/Input.vue';

export function createChat(options?: Partial<ChatOptions>) {
	const resolvedOptions: ChatOptions = {
		...defaultOptions,
		...options,
		webhookConfig: {
			...defaultOptions.webhookConfig,
			...options?.webhookConfig,
		},
		i18n: {
			...defaultOptions.i18n,
			...options?.i18n,
			en: {
				...defaultOptions.i18n?.en,
				...options?.i18n?.en,
			},
		},
		theme: {
			...defaultOptions.theme,
			...options?.theme,
		},
	};

	const mountingTarget = resolvedOptions.target ?? defaultMountingTarget;
	if (typeof mountingTarget === 'string') {
		createDefaultMountingTarget(mountingTarget);
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const app = createApp(App);
	app.use(ChatPlugin, resolvedOptions);
	app.mount(mountingTarget);
	return app;
}
