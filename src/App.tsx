import { useCallback, useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Toaster } from 'sonner';

import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { SimulationPanel } from './components/SimulationPanel';

import { StartNode } from './components/nodes/StartNode';
import { TaskNode } from './components/nodes/TaskNode';
import { ApprovalNode } from './components/nodes/ApprovalNode';
import { AutomatedStepNode } from './components/nodes/AutomatedStepNode';
import { EndNode } from './components/nodes/EndNode';

import { useWorkflowStore } from './store/workflowStore';
import { useWorkflowCanvas } from './hooks/useWorkflowCanvas';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

function WorkflowDesigner() {
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const onNodesChange = useWorkflowStore(state => state.onNodesChange);
  const onEdgesChange = useWorkflowStore(state => state.onEdgesChange);
  const onConnect = useWorkflowStore(state => state.onConnect);
  
  const { reactFlowWrapper, onDragOver, onDrop, onNodeClick, onPaneClick } = useWorkflowCanvas();

  // Keyboard shortcuts
  const undo = useWorkflowStore(state => state.undo);
  const redo = useWorkflowStore(state => state.redo);
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const deleteEdge = useWorkflowStore(state => state.deleteEdge);
  const selectedNodeId = useWorkflowStore(state => state.selectedNodeId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
        // Could also add edge deletion logic here if edges can be selected
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteNode, selectedNodeId]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-dark-bg text-gray-200">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#13131f]"
            minZoom={0.2}
            maxZoom={2}
          >
            <Background color="#2e2e3e" gap={16} size={1} />
            <Controls className="bg-dark-panel border-border fill-gray-300" />
            <MiniMap 
              nodeStrokeColor="#6366f1" 
              nodeColor="#1e1e2e" 
              maskColor="rgba(15, 15, 26, 0.7)"
              className="bg-dark-panel border border-border"
            />
          </ReactFlow>

          <NodeConfigPanel />
          <SimulationPanel />
        </div>
      </div>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  );
}

export default App;
