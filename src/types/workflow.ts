export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface NodeVersion {
  timestamp: string;
  data: any;
}

export type CustomNodeData = (StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData) & { versionHistory?: NodeVersion[] };

export interface BaseNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: CustomNodeData
}

export interface StartNodeData {
  title: string
  metadata: { key: string; value: string }[]
}

export interface TaskNodeData {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: { key: string; value: string }[]
}

export interface ApprovalNodeData {
  title: string
  approverRole: 'Manager' | 'HRBP' | 'Director' | ''
  autoApproveThreshold: number
}

export interface AutomatedNodeData {
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData {
  endMessage: string
  summaryFlag: boolean
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

export interface SimulationStep {
  nodeId: string
  nodeType: NodeType
  status: 'pending' | 'running' | 'completed' | 'failed'
  message: string
  timestamp: string
}
