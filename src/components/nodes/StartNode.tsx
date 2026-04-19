import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { StartNodeData } from '../../types/workflow';

export function StartNode({ id, data, selected }: NodeProps<StartNodeData & Record<string, unknown>>) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative px-4 py-2 shadow-sm rounded-full border-2 bg-white flex items-center gap-2 transition-all ${selected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-500/10' : isInvalid ? 'border-red-500 ring-4 ring-red-500/20' : 'border-green-500'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-green-500 border-2 border-white" />
      <div className="bg-green-100 p-1 rounded-full">
        <Play size={14} className="text-green-600 fill-current" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-0.5">Start</span>
        <span className="text-sm font-bold text-gray-800 leading-none">{data.title || 'Start'}</span>
      </div>
    </div>
  );
}
