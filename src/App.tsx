import { useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap } from '@xyflow/react';
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteNode, selectedNodeId]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-app-bg text-gray-800">
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
            className="bg-white"
            minZoom={0.2}
            maxZoom={2}
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls className="bg-white border-border fill-gray-500" />
            <MiniMap 
              nodeStrokeColor="#6366f1" 
              nodeColor="#f1f5f9" 
              maskColor="rgba(248, 250, 252, 0.7)"
              className="bg-white border border-border"
            />
          </ReactFlow>

          <NodeConfigPanel />
          <SimulationPanel />
        </div>
      </div>
      <Toaster position="bottom-right" theme="light" />
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
