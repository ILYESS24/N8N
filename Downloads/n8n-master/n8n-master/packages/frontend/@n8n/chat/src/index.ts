import './main.scss';

import { createApp } from 'vue';

import { defaultMountingTarget, defaultOptions } from './constants';
import { ChatPlugin } from './plugins';
import type { ChatOptions } from './types';
import { createDefaultMountingTarget } from './utils';

import App from './App.vue';

// Export event bus
export { chatEventBus } from './event-buses';

// Export constants
export { ChatOptionsSymbol, ChatSymbol } from './constants';
export { defaultMountingTarget, defaultOptions } from './constants';

// Export plugins
export { ChatPlugin } from './plugins';

// Export utils
export { constructChatWebsocketUrl, createDefaultMountingTarget } from './utils';

// Export components
export { MessagesList, Input as ChatInput } from './components';
export { default as Chat } from './components/Chat.vue';
export { default } from './components/Chat.vue';

// Export composables
export { useChat, useI18n, useOptions } from './composables';

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
