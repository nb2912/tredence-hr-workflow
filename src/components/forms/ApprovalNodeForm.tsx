import { useNodeForm } from '../../hooks/useNodeForm';

export function ApprovalNodeForm({ nodeId }: { nodeId: string }) {
  const { form, onSubmit } = useNodeForm(nodeId, { 
    title: 'Review Step', 
    approverRole: 'Manager', 
    autoApproveThreshold: 80 
  });
  const { register, handleSubmit } = form;

  return (
    <form id="node-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
        <input 
          {...register('title', { required: true })}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Approver Role</label>
        <select 
          {...register('approverRole')}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="Compliance Officer">Compliance Officer</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Auto-Approve Threshold (%)</label>
        <div className="flex items-center gap-4">
          <input 
            type="range"
            min="0"
            max="100"
            {...register('autoApproveThreshold')}
            className="flex-1 accent-indigo-600"
          />
          <span className="text-sm font-bold text-indigo-600 w-8">
            {form.watch('autoApproveThreshold')}%
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 italic">Skip manual approval if internal score is above this value.</p>
      </div>
    </form>
  );
}
