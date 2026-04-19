import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { UserCheck, X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { BaseNode, ApprovalNodeData } from '../../types/workflow';

export function ApprovalNode({ id, data, selected }: NodeProps<BaseNode>) {
  const nodeData = data as ApprovalNodeData;
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

      <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 border-b border-border">
        <UserCheck size={16} className="text-amber-600" />
        <span className="font-bold text-amber-600 text-xs uppercase tracking-wider">{nodeData.title || 'Approval'}</span>
      </div>
      
      <div className="p-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">Approver Role:</span>
          <span className="font-bold text-gray-800">{nodeData.approverRole || 'Unassigned'}</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-amber-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-amber-500 border-2 border-white" />
    </div>
  );
}
