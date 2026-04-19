import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CheckSquare, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { TaskNodeData } from '../../types/workflow';

export function TaskNode({ id, data, selected }: NodeProps<TaskNodeData & Record<string, unknown>>) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative group min-w-[180px] bg-white shadow-sm rounded-lg border-2 transition-all overflow-hidden ${selected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-500/10' : isInvalid ? 'border-red-500 ring-4 ring-red-500/20' : 'border-border'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <X size={16} />
      </button>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      
      <div className="bg-blue-50 p-2 flex items-center gap-2 border-b border-border">
        <CheckSquare size={14} className="text-blue-600" />
        <span className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">Task</span>
      </div>
      
      <div className="p-3">
        <div className="text-sm font-bold text-gray-800 leading-tight mb-1">{data.title || 'Untitled Task'}</div>
        <div className="text-[11px] text-gray-500 line-clamp-1">{data.assignee || 'Unassigned'}</div>
      </div>
    </div>
  );
}
