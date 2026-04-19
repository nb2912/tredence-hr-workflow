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
  const simulationRunning = useWorkflowStore(state => state.simulationRunning);
  const nodes = useWorkflowStore(state => state.nodes);
  const setSelectedNode = useWorkflowStore(state => state.setSelectedNode);
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const restoreNodeData = useWorkflowStore(state => state.restoreNodeData);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode || simulationRunning) return null;

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
    <div className="w-[320px] bg-app-panel border-l border-border h-full flex flex-col absolute right-0 top-0 shadow-2xl z-10 transition-transform duration-200">
      <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/80">
        <h3 className={`font-semibold capitalize ${color} flex items-center gap-2`}>
          <Icon size={16} />
          {selectedNode.type} Node
        </h3>
        <button 
          onClick={() => setSelectedNode(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-border bg-gray-50/30">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <Settings size={14} /> Settings
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <History size={14} /> History ({history.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'settings' ? (
          renderForm()
        ) : (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Version History</h4>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No previous versions saved yet.</p>
            ) : (
              history.map((version, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md border border-border group hover:border-indigo-500 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(version.timestamp).toLocaleString()}
                    </span>
                    <button 
                      onClick={() => restoreNodeData(selectedNode.id, version.data)}
                      className="text-[10px] px-2 py-0.5 bg-indigo-600/10 text-indigo-600 rounded border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      Restore
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-600 line-clamp-2 italic">
                    {version.data.title || version.data.label || 'Untitled Version'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-gray-50/80 flex flex-col gap-2">
        {activeTab === 'settings' && (
          <button 
            form="node-config-form"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md font-bold transition-all shadow-md active:scale-95"
          >
            Save Changes
          </button>
        )}
        <button 
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full bg-transparent border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 py-2 rounded-md font-medium transition-all"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
