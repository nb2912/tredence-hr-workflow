import { useState } from 'react';
import { X, Play, CheckSquare, UserCheck, Zap, Square, History, Settings } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from './forms/AutomatedStepNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';

export function NodeConfigPanel() {
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const selectedNodeId = useWorkflowStore(state => state.selectedNodeId);
  const nodes = useWorkflowStore(state => state.nodes);
  const setSelectedNode = useWorkflowStore(state => state.setSelectedNode);
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const restoreNodeData = useWorkflowStore(state => state.restoreNodeData);

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

  const history = selectedNode.data.versionHistory || [];

  return (
    <div className="w-[320px] bg-dark-panel border-l border-border h-full flex flex-col absolute right-0 top-0 shadow-xl z-10 transition-transform duration-200">
      <div className="p-4 border-b border-border flex justify-between items-center bg-dark-bg/50">
        <h3 className={`font-semibold capitalize ${color} flex items-center gap-2`}>
          <Icon size={16} />
          {selectedNode.type} Node
        </h3>
        <button 
          onClick={() => setSelectedNode(null)}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-border bg-dark-bg/30">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <Settings size={14} /> Settings
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <History size={14} /> History ({history.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'settings' ? (
          renderForm()
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Version History</h4>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No previous versions saved yet.</p>
            ) : (
              history.map((version, index) => (
                <div key={index} className="bg-dark-bg p-3 rounded-md border border-border group hover:border-indigo-500 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(version.timestamp).toLocaleString()}
                    </span>
                    <button 
                      onClick={() => restoreNodeData(selectedNode.id, version.data)}
                      className="text-[10px] px-2 py-0.5 bg-indigo-600/20 text-indigo-400 rounded border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      Restore
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 line-clamp-2 italic">
                    {version.data.title || version.data.label || 'Untitled Version'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-dark-bg/50 flex flex-col gap-2">
        {activeTab === 'settings' && (
          <button 
            form="node-config-form"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition-colors shadow-lg"
          >
            Save Changes
          </button>
        )}
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
