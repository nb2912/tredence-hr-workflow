import { BaseNode, WorkflowEdge, SimulationStep } from '../types/workflow';
import { topologicalSort } from '../utils/graphUtils';
import { validateWorkflow } from '../utils/validation';

export const simulateWorkflow = async (workflowJson: string): Promise<SimulationStep[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { nodes, edges } = JSON.parse(workflowJson) as { nodes: BaseNode[], edges: WorkflowEdge[] };

  const { valid, errors } = validateWorkflow(nodes, edges);
  if (!valid) {
    throw new Error(`Workflow validation failed: ${errors.join(' ')}`);
  }

  let orderedNodes: BaseNode[];
  try {
    orderedNodes = topologicalSort(nodes, edges);
  } catch (error) {
    throw new Error("Cycle detected. Cannot simulate workflow.");
  }

  const steps: SimulationStep[] = orderedNodes.map((node, index) => {
    let message = '';
    
    switch (node.type) {
      case 'start':
        message = `Workflow started: ${node.data.title}`;
        break;
      case 'task':
        message = `Assigned task to ${(node.data as any).assignee || 'User'}`;
        break;
      case 'approval':
        message = `Sent for approval to ${(node.data as any).approverRole || 'Manager'}`;
        break;
      case 'automated':
        message = `Executed automated action: ${(node.data as any).actionId || 'System Action'}`;
        break;
      case 'end':
        message = `Workflow completed: ${(node.data as any).endMessage || 'Done'}`;
        break;
      default:
        message = `Processed node ${node.id}`;
    }

    return {
      nodeId: node.id,
      nodeType: node.type,
      // The last node might be 'completed' right away in the mock, but we'll return 'completed'
      // The front-end will manage transitioning them from pending -> running -> completed visually.
      status: 'completed', 
      message,
      timestamp: new Date(Date.now() + index * 500).toISOString()
    };
  });

  return steps;
};
