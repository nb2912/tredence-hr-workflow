import { create } from 'zustand';
import { BaseNode, WorkflowEdge, SimulationStep } from '../types/workflow';
import { addEdge as rfAddEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from '@xyflow/react';

interface WorkflowState {
  nodes: BaseNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  simulationSteps: SimulationStep[];
  simulationRunning: boolean;
  workflowName: string;
  
  history: { nodes: BaseNode[]; edges: WorkflowEdge[] }[];
  historyIndex: number;

  // Actions
  addNode: (node: BaseNode) => void;
  updateNode: (id: string, node: Partial<BaseNode>) => void;
  updateNodeData: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  deleteEdge: (id: string) => void;
  
  setSelectedNode: (id: string | null) => void;
  setSimulationSteps: (steps: SimulationStep[]) => void;
  setSimulationRunning: (running: boolean) => void;
  setWorkflowName: (name: string) => void;
  
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  importWorkflow: (nodes: BaseNode[], edges: WorkflowEdge[]) => void;
  exportWorkflow: () => string;
  clearCanvas: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationSteps: [],
  simulationRunning: false,
  workflowName: 'Untitled Workflow',
  
  history: [{ nodes: [], edges: [] }],
  historyIndex: 0,

  saveHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ 
      nodes: JSON.parse(JSON.stringify(nodes)), 
      edges: JSON.parse(JSON.stringify(edges)) 
    });
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    get().saveHistory();
  },

  updateNode: (id, updatedNode) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, ...updatedNode } : n)),
    });
    get().saveHistory();
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
    });
    get().saveHistory();
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
    get().saveHistory();
  },

  onNodesChange: (changes) => {
    const currentNodes = get().nodes as any;
    set({
      nodes: applyNodeChanges(changes, currentNodes) as BaseNode[],
    });
    // Only save history on certain events to avoid spamming undo with position updates
    if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
      get().saveHistory();
    }
  },

  onEdgesChange: (changes) => {
    const currentEdges = get().edges as any;
    set({
      edges: applyEdgeChanges(changes, currentEdges) as WorkflowEdge[],
    });
    if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
      get().saveHistory();
    }
  },

  onConnect: (connection) => {
    set({ edges: rfAddEdge(connection, get().edges as any) as WorkflowEdge[] });
    get().saveHistory();
  },

  deleteEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
    get().saveHistory();
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setSimulationSteps: (steps) => set({ simulationSteps: steps }),
  setSimulationRunning: (running) => set({ simulationRunning: running }),
  setWorkflowName: (name) => set({ workflowName: name }),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const pastState = history[newIndex];
      set({
        nodes: JSON.parse(JSON.stringify(pastState.nodes)),
        edges: JSON.parse(JSON.stringify(pastState.edges)),
        historyIndex: newIndex,
        selectedNodeId: null
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const futureState = history[newIndex];
      set({
        nodes: JSON.parse(JSON.stringify(futureState.nodes)),
        edges: JSON.parse(JSON.stringify(futureState.edges)),
        historyIndex: newIndex,
        selectedNodeId: null
      });
    }
  },

  importWorkflow: (nodes, edges) => {
    set({ nodes, edges, selectedNodeId: null });
    get().saveHistory();
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
    get().saveHistory();
  },
}));
