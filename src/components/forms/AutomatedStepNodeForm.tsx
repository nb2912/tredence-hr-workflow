import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';
import { getAutomations } from '../../mocks/automations';

export function AutomatedStepNodeForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(state => state.nodes.find(n => n.id === nodeId));
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  const [automationsList, setAutomationsList] = useState<any[]>([]);

  const { register, handleSubmit, reset, watch, unregister } = useForm({
    defaultValues: {
      title: node?.data?.title || 'Automated Step',
      actionId: (node?.data as any)?.actionId || '',
      actionParams: (node?.data as any)?.actionParams || {}
    }
  });

  const selectedActionId = watch('actionId');

  useEffect(() => {
    getAutomations().then(data => setAutomationsList(data));
  }, []);

  useEffect(() => {
    if (node) {
      reset({
        title: node.data.title || 'Automated Step',
        actionId: (node.data as any).actionId || '',
        actionParams: (node.data as any).actionParams || {}
      });
    }
  }, [node, reset]);

  const selectedActionInfo = automationsList.find(a => a.id === selectedActionId);

  // Clean up old params when action changes
  useEffect(() => {
    if (selectedActionInfo) {
      const currentParams = (node?.data as any)?.actionParams || {};
      const newParams: Record<string, string> = {};
      selectedActionInfo.params.forEach((param: string) => {
        newParams[param] = currentParams[param] || '';
      });
      reset(values => ({ ...values, actionParams: newParams }));
    }
  }, [selectedActionId, selectedActionInfo, reset, node]);


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
