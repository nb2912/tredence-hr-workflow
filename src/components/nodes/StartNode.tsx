import { Handle, Position } from '@xyflow/react';
import { Play, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export function StartNode({ id, data, selected }: any) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative group min-w-[150px] bg-green-500 text-white rounded-full px-6 py-3 shadow-md hover:scale-105 transition-transform ${isInvalid ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-dark-bg' : selected ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-bg' : ''}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
      
      <div className="flex items-center justify-center gap-2 font-medium">
        <Play size={16} fill="currentColor" />
        <span>{data.title || 'Start'}</span>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-3 !h-3 !border-dark-panel" />
    </div>
  );
}
