import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useNodeForm } from '../../hooks/useNodeForm';

export function TaskNodeForm({ nodeId }: { nodeId: string }) {
  const { form, onSubmit } = useNodeForm(nodeId, { 
    title: 'Task', 
    description: '', 
    assignee: '', 
    dueDate: '', 
    customFields: [] 
  });
  const { register, control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields"
  });

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
        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
        <textarea 
          {...register('description')}
          className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
          <input 
            {...register('assignee')}
            className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
          <input 
            type="date"
            {...register('dueDate')}
            className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-400">Custom Fields</label>
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
                {...register(`customFields.${index}.key` as const, { required: true })}
                placeholder="Key"
                className="w-1/2 bg-dark-bg border border-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                {...register(`customFields.${index}.value` as const, { required: true })}
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
          {fields.length === 0 && <p className="text-xs text-gray-500 italic">No custom fields added.</p>}
        </div>
      </div>
    </form>
  );
}
