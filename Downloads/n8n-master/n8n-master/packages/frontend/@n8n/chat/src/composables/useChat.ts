import { inject } from 'vue';

import { ChatSymbol } from '@workflow-automation/chat/constants';
import type { Chat } from '@workflow-automation/chat/types';

export function useChat() {
	return inject(ChatSymbol) as Chat;
}
