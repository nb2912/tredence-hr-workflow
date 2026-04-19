import type { BaseNode, WorkflowEdge } from '../types/workflow';

export const getConnectedNodes = (nodeId: string, edges: WorkflowEdge[]): string[] => {
  return edges
    .filter(edge => edge.source === nodeId)
    .map(edge => edge.target);
};

export const detectCycles = (nodes: BaseNode[], edges: WorkflowEdge[]): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const isCyclicUtil = (nodeId: string): boolean => {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const connected = getConnectedNodes(nodeId, edges);
      for (const targetId of connected) {
        if (!visited.has(targetId) && isCyclicUtil(targetId)) {
          return true;
        } else if (recursionStack.has(targetId)) {
          return true;
        }
      }
    }
    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (isCyclicUtil(node.id)) {
      return true;
    }
  }

  return false;
};

export const topologicalSort = (nodes: BaseNode[], edges: WorkflowEdge[]): BaseNode[] => {
  if (detectCycles(nodes, edges)) {
    throw new Error("Graph contains cycles, topological sort not possible.");
  }

  const visited = new Set<string>();
  const stack: BaseNode[] = [];

  const sortUtil = (node: BaseNode) => {
    visited.add(node.id);
    const connectedIds = getConnectedNodes(node.id, edges);
    
    for (const targetId of connectedIds) {
      if (!visited.has(targetId)) {
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode) sortUtil(targetNode);
      }
    }
    stack.push(node);
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      sortUtil(node);
    }
  }

  return stack.reverse();
};

export const serializeWorkflow = (nodes: BaseNode[], edges: WorkflowEdge[]): string => {
  return JSON.stringify({ nodes, edges }, null, 2);
};

export const deserializeWorkflow = (json: string): { nodes: BaseNode[], edges: WorkflowEdge[] } => {
  try {
    const data = JSON.parse(json);
    return {
      nodes: Array.isArray(data.nodes) ? data.nodes : [],
      edges: Array.isArray(data.edges) ? data.edges : []
    };
  } catch (error) {
    console.error("Failed to parse workflow JSON", error);
    return { nodes: [], edges: [] };
  }
};
