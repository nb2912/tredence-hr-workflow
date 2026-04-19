import { X, Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from './forms/AutomatedStepNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';

export function NodeConfigPanel() {
  const selectedNodeId = useWorkflowStore(state => state.selectedNodeId);
  const nodes = useWorkflowStore(state => state.nodes);
  const setSelectedNode = useWorkflowStore(state => state.setSelectedNode);
  const deleteNode = useWorkflowStore(state => state.deleteNode);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start': return <StartNodeForm nodeId={selectedNode.id} />;
      case 'task': return <TaskNodeForm nodeId={selectedNode.id} />;
      case 'approval': return <ApprovalNodeForm nodeId={selectedNode.id} />;
      case 'automated': return <AutomatedStepNodeForm nodeId={selectedNode.id} />;
      case 'end': return <EndNodeForm nodeId={selectedNode.id} />;
      default: return null;
    }
  };

  const getHeaderInfo = () => {
    switch (selectedNode.type) {
      case 'start': return { color: 'text-green-500', Icon: Play };
      case 'task': return { color: 'text-blue-500', Icon: CheckSquare };
      case 'approval': return { color: 'text-amber-500', Icon: UserCheck };
      case 'automated': return { color: 'text-purple-500', Icon: Zap };
      case 'end': return { color: 'text-red-500', Icon: Square };
      default: return { color: 'text-white', Icon: Play };
    }
  };

  const { color, Icon } = getHeaderInfo();

  return (
    <div className="w-[320px] bg-dark-panel border-l border-border h-full flex flex-col absolute right-0 top-0 shadow-xl z-10 transition-transform duration-200">
      <div className="p-4 border-b border-border flex justify-between items-center bg-dark-bg/50">
        <h3 className={`font-semibold capitalize ${color} flex items-center gap-2`}>
          <Icon size={16} />
          {selectedNode.type} Node Settings
        </h3>
        <button 
          onClick={() => setSelectedNode(null)}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {renderForm()}
      </div>

      <div className="p-4 border-t border-border bg-dark-bg/50 flex flex-col gap-2">
        <button 
          form="node-config-form"
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition-colors"
        >
          Save Changes
        </button>
        <button 
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 py-2 rounded-md font-medium transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
