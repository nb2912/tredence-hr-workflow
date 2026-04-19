import { Handle, Position } from '@xyflow/react';
import { Zap, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export function AutomatedStepNode({ id, data, selected }: any) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative group w-64 bg-dark-panel rounded-lg shadow-md hover:scale-[1.02] transition-transform overflow-hidden ${isInvalid ? 'ring-2 ring-red-500' : selected ? 'ring-2 ring-indigo-500' : 'ring-1 ring-border'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute top-2 right-2 text-white/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>

      <div className="bg-purple-500 px-4 py-2 flex items-center gap-2">
        <Zap size={16} className="text-white" />
        <span className="font-semibold text-white truncate pr-6">{data.title || 'Automated Step'}</span>
      </div>
      
      <div className="p-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Action:</span>
          <span className="font-medium text-purple-400 truncate max-w-[140px]">{data.actionId || 'None Selected'}</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-3 !h-3 !border-dark-panel" />
      <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-3 !h-3 !border-dark-panel" />
    </div>
  );
}
