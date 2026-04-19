import { useNodeForm } from '../../hooks/useNodeForm';

export function ApprovalNodeForm({ nodeId }: { nodeId: string }) {
  const { form, onSubmit } = useNodeForm(nodeId, { 
    title: 'Approval', 
    approverRole: '', 
    autoApproveThreshold: 100 
  });
  const { register, handleSubmit } = form;

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
