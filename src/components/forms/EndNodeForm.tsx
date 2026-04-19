import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';

export function EndNodeForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(state => state.nodes.find(n => n.id === nodeId));
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      endMessage: (node?.data as any)?.endMessage || '',
      summaryFlag: (node?.data as any)?.summaryFlag || false
    }
  });

  useEffect(() => {
    if (node) {
      reset({
        endMessage: (node.data as any).endMessage || '',
        summaryFlag: (node.data as any).summaryFlag || false
      });
    }
  }, [node, reset]);

  const onSubmit = (data: any) => {
    updateNodeData(nodeId, data);
  };

  return (
    <form id="node-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">End Message</label>
        <textarea 
          {...register('endMessage')}
          className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
          placeholder="Message to display when workflow finishes"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center cursor-pointer relative">
          <input 
            type="checkbox" 
            {...register('summaryFlag')}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          <span className="ml-3 text-sm font-medium text-gray-300">Generate Summary Report</span>
        </label>
      </div>
    </form>
  );
}
