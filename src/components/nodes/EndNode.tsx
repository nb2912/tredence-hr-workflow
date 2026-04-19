import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Square, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { EndNodeData } from '../../types/workflow';

export function EndNode({ id, data, selected }: NodeProps<EndNodeData & Record<string, unknown>>) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative group min-w-[150px] bg-red-500 text-white rounded-full px-6 py-3 shadow-md hover:scale-105 transition-transform ${isInvalid ? 'ring-2 ring-red-300 ring-offset-2 ring-offset-dark-bg' : selected ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-bg' : ''}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute -top-2 -right-2 bg-dark-panel text-white border border-border rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
      >
        <X size={12} />
      </button>
      
      <div className="flex items-center justify-center gap-2 font-medium">
        <Square size={14} fill="currentColor" />
        <span>{data.title || 'End'}</span>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-3 !h-3 !border-dark-panel" />
    </div>
  );
}
