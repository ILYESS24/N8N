import type { WorkflowActivated } from '@workflow-automation/api-types/push/workflow';
import { useWorkflowsStore } from '@/app/stores/workflows.store';

export async function workflowActivated({ data }: WorkflowActivated) {
	const workflowsStore = useWorkflowsStore();

	workflowsStore.setWorkflowActive(data.workflowId);
}
