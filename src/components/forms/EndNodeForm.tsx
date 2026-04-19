import { useNodeForm } from '../../hooks/useNodeForm';

export function EndNodeForm({ nodeId }: { nodeId: string }) {
  const { form, onSubmit } = useNodeForm(nodeId, { title: 'Complete', endMessage: 'Workflow successfully finished.', showSummary: true });
  const { register, watch, handleSubmit, setValue } = form;

  const showSummary = watch('showSummary');

  return (
    <form id="node-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Node Title</label>
        <input 
          {...register('title', { required: true })}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Completion Message</label>
        <textarea 
          {...register('endMessage')}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] transition-all"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border">
        <div>
          <label className="block text-sm font-bold text-gray-700">Show Summary</label>
          <p className="text-[10px] text-gray-500">Display execution report to user</p>
        </div>
        <button
          type="button"
          onClick={() => setValue('showSummary', !showSummary)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showSummary ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSummary ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
    </form>
  );
}
