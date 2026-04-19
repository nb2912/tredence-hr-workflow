import { describe, it, expect } from '@jest/globals';
import { validateWorkflow } from '../utils/validation';
import type { BaseNode, WorkflowEdge } from '../types/workflow';

describe('validateWorkflow', () => {
  it('should invalidate if no start node exists', () => {
    const nodes: BaseNode[] = [
      { id: '1', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task 1' } as any }
    ];
    const { valid, errors } = validateWorkflow(nodes, []);
    expect(valid).toBe(false);
    expect(errors).toContain('Workflow must have exactly one Start node.');
  });

  it('should invalidate if no end node exists', () => {
    const nodes: BaseNode[] = [
      { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start' } as any }
    ];
    const { valid, errors } = validateWorkflow(nodes, []);
    expect(valid).toBe(false);
    expect(errors).toContain('Workflow must have exactly one End node.');
  });

  it('should invalidate if multiple start nodes exist', () => {
    const nodes: BaseNode[] = [
      { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start 1' } as any },
      { id: '2', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start 2' } as any },
      { id: '3', type: 'end', position: { x: 0, y: 0 }, data: { title: 'End' } as any }
    ];
    const { valid, errors } = validateWorkflow(nodes, []);
    expect(valid).toBe(false);
    expect(errors).toContain('Workflow cannot have more than one Start node.');
  });

  it('should invalidate disconnected nodes', () => {
    const nodes: BaseNode[] = [
      { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start' } as any },
      { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task' } as any },
      { id: '3', type: 'end', position: { x: 0, y: 0 }, data: { title: 'End' } as any }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1-3', source: '1', target: '3' }
    ];
    const { valid, errors } = validateWorkflow(nodes, edges);
    expect(valid).toBe(false);
    expect(errors).toContain('Node "Task" is disconnected from the workflow.');
  });

  it('should validate a correct workflow', () => {
    const nodes: BaseNode[] = [
      { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start' } as any },
      { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task' } as any },
      { id: '3', type: 'end', position: { x: 0, y: 0 }, data: { title: 'End' } as any }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' }
    ];
    const { valid, errors } = validateWorkflow(nodes, edges);
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });
});
