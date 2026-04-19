import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Square } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { BaseNode, EndNodeData } from '../../types/workflow';

export function EndNode({ id, data, selected }: NodeProps<BaseNode>) {
  const nodeData = data as EndNodeData;
  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isInvalid = invalidNodeIds.includes(id);

  return (
    <div className={`relative px-4 py-2 shadow-sm rounded-full border-2 bg-white flex items-center gap-2 transition-all ${selected ? 'border-indigo-500 shadow-md ring-4 ring-indigo-500/10' : isInvalid ? 'border-red-500 ring-4 ring-red-500/20' : 'border-red-500'}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500 border-2 border-white" />
      <div className="bg-red-100 p-1 rounded-full">
        <Square size={14} className="text-red-600 fill-current" />
      </div>
      <div className="flex flex-col pr-2">
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider leading-none mb-0.5">End</span>
        <span className="text-sm font-bold text-gray-800 leading-none">{nodeData.title || 'End'}</span>
      </div>
    </div>
  );
}
