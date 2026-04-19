import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface NodeVersion {
  timestamp: string;
  data: CustomNodeData;
}

export interface SharedNodeData {
  title?: string;
  versionHistory?: NodeVersion[];
  [key: string]: unknown;
}

export interface StartNodeData extends SharedNodeData {
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends SharedNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends SharedNodeData {
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'Compliance Officer' | '';
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends SharedNodeData {
  title: string;
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends SharedNodeData {
  title: string;
  endMessage: string;
  showSummary: boolean;
}

export type CustomNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;

export type BaseNode = Node<CustomNodeData, NodeType>;
export type WorkflowEdge = Edge;

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}
