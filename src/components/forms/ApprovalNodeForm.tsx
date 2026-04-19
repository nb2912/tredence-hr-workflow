import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';

export function ApprovalNodeForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(state => state.nodes.find(n => n.id === nodeId));
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: node?.data?.title || 'Approval',
      approverRole: (node?.data as any)?.approverRole || '',
      autoApproveThreshold: (node?.data as any)?.autoApproveThreshold || 100
    }
  });

  useEffect(() => {
    if (node) {
      reset({
        title: node.data.title || 'Approval',
        approverRole: (node.data as any).approverRole || '',
        autoApproveThreshold: (node.data as any).autoApproveThreshold || 100
      });
    }
  }, [node, reset]);

  const onSubmit = (data: any) => {
    updateNodeData(nodeId, data);
  };

  return (
    <form id="node-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Title <span className="text-red-500">*</span></label>
        <input 
          {...register('title', { required: true })}
          className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Approver Role</label>
        <select 
          {...register('approverRole')}
          className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a role...</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Auto-approve Threshold (%)</label>
        <div className="flex items-center gap-2">
          <input 
            type="number"
            min="1"
            max="100"
            {...register('autoApproveThreshold', { valueAsNumber: true })}
            className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">If condition matches, approve automatically.</p>
      </div>
    </form>
  );
}
