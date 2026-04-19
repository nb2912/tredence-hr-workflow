import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Zap, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { AutomatedNodeData } from '../../types/workflow';

export function AutomatedStepNode({ id, data, selected }: NodeProps<AutomatedNodeData & Record<string, unknown>>) {
  const deleteNode = useWorkflowStore(state => state.deleteNode);
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative group w-64 bg-white rounded-lg shadow-sm border-2 transition-all overflow-hidden ${isInvalid ? 'border-red-500 shadow-md ring-4 ring-red-500/10' : selected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-500/10' : 'border-border'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <X size={16} />
      </button>

      <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-border">
        <Zap size={16} className="text-purple-600" />
        <span className="font-bold text-purple-600 text-xs uppercase tracking-wider">{data.title || 'Automated Step'}</span>
      </div>
      
      <div className="p-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">Action ID:</span>
          <span className="font-bold text-gray-800 truncate max-w-[140px]">{data.actionId || 'None Selected'}</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500 border-2 border-white" />
    </div>
  );
}
