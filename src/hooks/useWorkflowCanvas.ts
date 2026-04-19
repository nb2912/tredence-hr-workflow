import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import type { BaseNode, NodeType } from '../types/workflow';
import { validateWorkflow } from '../utils/validation';
import { toast } from 'sonner';

export function useWorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const addNode = useWorkflowStore(state => state.addNode);
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const setSelectedNode = useWorkflowStore(state => state.setSelectedNode);
  const deleteNode = useWorkflowStore(state => state.deleteNode);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: BaseNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { title: `${type.charAt(0).toUpperCase() + type.slice(1)}` } as any,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleValidate = () => {
    const { valid, errors } = validateWorkflow(nodes, edges);
    if (valid) {
      toast.success('Workflow is valid!');
      return true;
    } else {
      errors.forEach(err => toast.error(err));
      return false;
    }
  };

  return {
    reactFlowWrapper,
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    handleValidate
  };
}
