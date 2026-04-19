import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import { useWorkflowStore } from '../store/workflowStore';

export function useNodeForm<TFieldValues extends FieldValues>(
  nodeId: string, 
  defaultValues: DefaultValues<TFieldValues>
) {
  const node = useWorkflowStore(state => state.nodes.find(n => n.id === nodeId));
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  const form = useForm<TFieldValues>({
    defaultValues: {
      ...defaultValues,
      ...(node?.data || {})
    } as DefaultValues<TFieldValues>
  });

  useEffect(() => {
    if (node) {
      // Create a new object merging default values with actual node data
      // to ensure all form fields have a value
      const resetValues = {} as any;
      Object.keys(defaultValues as any).forEach(key => {
        resetValues[key] = (node.data as any)[key] ?? (defaultValues as any)[key];
      });
      form.reset(resetValues);
    }
  }, [node, form.reset]);

  const onSubmit = (data: TFieldValues) => {
    updateNodeData(nodeId, data);
  };

  return { node, form, onSubmit };
}
