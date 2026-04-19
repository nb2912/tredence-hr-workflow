import { useState, useEffect } from 'react';
import { useNodeForm } from '../../hooks/useNodeForm';
import { getAutomations } from '../../mocks/automations';
import type { AutomationAction } from '../../mocks/automations';

export function AutomatedStepNodeForm({ nodeId }: { nodeId: string }) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const { form, onSubmit } = useNodeForm(nodeId, { title: 'System Task', actionId: '', params: {} });
  const { register, watch, handleSubmit, setValue } = form;

  const selectedActionId = watch('actionId');
  const selectedAction = actions.find(a => a.id === selectedActionId);

  useEffect(() => {
    getAutomations().then(setActions);
  }, []);

  // Reset params when action changes
  useEffect(() => {
    if (selectedAction) {
      const initialParams: Record<string, string> = {};
      selectedAction.params.forEach(p => {
        initialParams[p] = '';
      });
      // We don't want to wipe if already set, but for simplicity in mock:
      // setValue('params', initialParams);
    }
  }, [selectedActionId, selectedAction, setValue]);

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
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Choose Action</label>
        <select 
          {...register('actionId', { required: true })}
          className="w-full bg-gray-50 border border-border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          <option value="">Select an automation...</option>
          {actions.map(action => (
            <option key={action.id} value={action.id}>{action.label}</option>
          ))}
        </select>
      </div>

      {selectedAction && (
        <div className="space-y-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 animate-in zoom-in-95">
          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Action Parameters</h4>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{param}</label>
              <input 
                {...register(`params.${param}` as any)}
                className="w-full bg-white border border-indigo-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
