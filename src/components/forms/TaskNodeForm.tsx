import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useNodeForm } from '../../hooks/useNodeForm';
import type { TaskNodeData } from '../../types/workflow';

export function TaskNodeForm({ nodeId }: { nodeId: string }) {
  const { form, onSubmit } = useNodeForm<TaskNodeData>(nodeId, { 
    title: 'Task', 
    description: '', 
    assignee: '', 
    dueDate: '', 
    customFields: [] 
  });
  const { register, control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: "customFields"
  });

  return (
    <form id="node-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title <span className="text-red-500">*</span></label>
        <input 
          {...register('title', { required: true })}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
        <textarea 
          {...register('description')}
          placeholder="What needs to be done?"
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assignee</label>
          <input 
            {...register('assignee')}
            placeholder="Name or Role"
            className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
          <input 
            type="date"
            {...register('dueDate')}
            className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Fields</label>
          <button 
            type="button" 
            onClick={() => append({ key: '', value: '' })}
            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>
        
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center group animate-in slide-in-from-left-2">
              <input
                {...register(`customFields.${index}.key` as any, { required: true })}
                placeholder="Key"
                className="w-1/2 bg-gray-50 border border-border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <input
                {...register(`customFields.${index}.value` as any, { required: true })}
                placeholder="Value"
                className="w-1/2 bg-gray-50 border border-border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button 
                type="button" 
                onClick={() => remove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {fields.length === 0 && <p className="text-xs text-gray-400 italic">No custom fields added.</p>}
        </div>
      </div>
    </form>
  );
}
