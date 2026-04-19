import { describe, it, expect } from '@jest/globals';
import { detectCycles, topologicalSort } from '../utils/graphUtils';
import type { BaseNode, WorkflowEdge } from '../types/workflow';

describe('graphUtils', () => {
  describe('detectCycles', () => {
    it('should return false for acyclic graph', () => {
      const nodes: BaseNode[] = [
        { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start' } as any },
        { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task' } as any },
        { id: '3', type: 'end', position: { x: 0, y: 0 }, data: { title: 'End' } as any }
      ];
      const edges: WorkflowEdge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' }
      ];
      expect(detectCycles(nodes, edges)).toBe(false);
    });

    it('should return true for cyclic graph', () => {
      const nodes: BaseNode[] = [
        { id: '1', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task 1' } as any },
        { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task 2' } as any },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-1', source: '2', target: '1' }
      ];
      expect(detectCycles(nodes, edges)).toBe(true);
    });
  });

  describe('topologicalSort', () => {
    it('should sort nodes in execution order', () => {
      const nodes: BaseNode[] = [
        { id: '3', type: 'end', position: { x: 0, y: 0 }, data: { title: 'End' } as any },
        { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { title: 'Start' } as any },
        { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task' } as any },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' }
      ];
      const sorted = topologicalSort(nodes, edges);
      expect(sorted.map(n => n.id)).toEqual(['1', '2', '3']);
    });

    it('should throw error if cycles exist', () => {
      const nodes: BaseNode[] = [
        { id: '1', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task 1' } as any },
        { id: '2', type: 'task', position: { x: 0, y: 0 }, data: { title: 'Task 2' } as any },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-1', source: '2', target: '1' }
      ];
      expect(() => topologicalSort(nodes, edges)).toThrow('Graph contains cycles');
    });
  });
});
