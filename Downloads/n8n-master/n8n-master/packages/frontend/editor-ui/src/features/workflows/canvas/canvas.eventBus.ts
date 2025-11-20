import type { CanvasEventBusEvents } from './canvas.types';
import { createEventBus } from '@workflow-automation/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
