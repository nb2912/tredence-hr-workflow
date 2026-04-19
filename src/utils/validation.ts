import { BaseNode, WorkflowEdge } from '../types/workflow';
import { detectCycles } from './graphUtils';

export const validateWorkflow = (nodes: BaseNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push("Workflow must have exactly one Start node.");
  } else if (startNodes.length > 1) {
    errors.push("Workflow cannot have more than one Start node.");
  }

  const endNodes = nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push("Workflow must have exactly one End node.");
  } else if (endNodes.length > 1) {
    errors.push("Workflow cannot have more than one End node.");
  }

  // Check for orphan nodes (nodes with no incoming AND no outgoing edges, except single node graphs which aren't really allowed if we require start & end)
  // Actually, a node is orphan if it has no connections, BUT Start node has no incoming, End has no outgoing.
  nodes.forEach(node => {
    const hasIncoming = edges.some(e => e.target === node.id);
    const hasOutgoing = edges.some(e => e.source === node.id);

    if (node.type === 'start') {
      if (!hasOutgoing && nodes.length > 1) errors.push("Start node must have at least one outgoing connection.");
      if (hasIncoming) errors.push("Start node cannot have incoming connections.");
    } else if (node.type === 'end') {
      if (!hasIncoming && nodes.length > 1) errors.push("End node must have at least one incoming connection.");
      if (hasOutgoing) errors.push("End node cannot have outgoing connections.");
    } else {
      if (!hasIncoming && !hasOutgoing) {
        errors.push(`Node "${node.data.title}" is disconnected from the workflow.`);
      }
    }
  });

  if (detectCycles(nodes, edges)) {
    errors.push("Workflow contains cycles (infinite loops), which are not allowed.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
