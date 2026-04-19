import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export function StartNodeForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(state => state.nodes.find(n => n.id === nodeId));
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: node?.data?.title || 'Start',
      metadata: (node?.data as any)?.metadata || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata"
  });

  useEffect(() => {
    if (node) {
      reset({
        title: node.data.title || 'Start',
        metadata: (node.data as any).metadata || []
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
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-400">Metadata</label>
          <button 
            type="button" 
            onClick={() => append({ key: '', value: '' })}
            className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
          >
            <Plus size={14} /> Add Row
          </button>
        </div>
        
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`metadata.${index}.key` as const, { required: true })}
                placeholder="Key"
                className="w-1/2 bg-dark-bg border border-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                {...register(`metadata.${index}.value` as const, { required: true })}
                placeholder="Value"
                className="w-1/2 bg-dark-bg border border-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                type="button" 
                onClick={() => remove(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {fields.length === 0 && <p className="text-xs text-gray-500 italic">No metadata added.</p>}
        </div>
      </div>
    </form>
  );
}
