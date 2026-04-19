import { useEffect, useState } from 'react';
import { useNodeForm } from '../../hooks/useNodeForm';
import { getAutomations } from '../../mocks/automations';

export function AutomatedStepNodeForm({ nodeId }: { nodeId: string }) {
  const [automationsList, setAutomationsList] = useState<any[]>([]);
  const { node, form, onSubmit } = useNodeForm(nodeId, { 
    title: 'Automated Step', 
    actionId: '', 
    actionParams: {} 
  });
  const { register, handleSubmit, reset, watch } = form;

  const selectedActionId = watch('actionId');

  useEffect(() => {
    getAutomations().then(data => setAutomationsList(data));
  }, []);

  const selectedActionInfo = automationsList.find(a => a.id === selectedActionId);

  useEffect(() => {
    if (selectedActionInfo) {
      const currentParams = (node?.data as any)?.actionParams || {};
      const newParams: Record<string, string> = {};
      selectedActionInfo.params.forEach((param: string) => {
        newParams[param] = currentParams[param] || '';
      });
      // Merge with form values to keep other fields intact
      reset(values => ({ ...values, actionParams: newParams }));
    }
  }, [selectedActionId, selectedActionInfo, reset, node]);

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
        <label className="block text-sm font-medium text-gray-400 mb-1">Action</label>
        <select 
          {...register('actionId')}
          className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select an action...</option>
          {automationsList.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      {selectedActionInfo && selectedActionInfo.params.length > 0 && (
        <div className="pt-2 border-t border-border">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Action Parameters</h4>
          <div className="space-y-3">
            {selectedActionInfo.params.map((param: string) => (
              <div key={param}>
                <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">{param}</label>
                <input 
                  {...register(`actionParams.${param}` as const)}
                  className="w-full bg-dark-bg border border-border rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
