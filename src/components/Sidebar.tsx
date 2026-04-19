import { Play, CheckSquare, UserCheck, Zap, Square, Download, Upload, Trash2, X } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { serializeWorkflow, deserializeWorkflow } from '../utils/graphUtils';
import { toast } from 'sonner';

const nodeTypes = [
  { type: 'start', label: 'Start', icon: Play, color: 'text-green-500', desc: 'Entry point of workflow' },
  { type: 'task', label: 'Task', icon: CheckSquare, color: 'text-blue-500', desc: 'Manual user action' },
  { type: 'approval', label: 'Approval', icon: UserCheck, color: 'text-amber-500', desc: 'Manager/HR approval' },
  { type: 'automated', label: 'Automated Step', icon: Zap, color: 'text-purple-500', desc: 'System action' },
  { type: 'end', label: 'End', icon: Square, color: 'text-red-500', desc: 'Workflow completion' },
];

const templates = {
  Onboarding: {
    nodes: [{ id: 'start-1', type: 'start', position: { x: 0, y: 50 }, data: { title: 'Start Onboarding' } }, { id: 'task-1', type: 'task', position: { x: 250, y: 50 }, data: { title: 'IT Setup' } }, { id: 'end-1', type: 'end', position: { x: 550, y: 50 }, data: { title: 'End' } }],
    edges: [{ id: 'e1-2', source: 'start-1', target: 'task-1' }, { id: 'e2-3', source: 'task-1', target: 'end-1' }]
  },
  'Leave Approval': {
    nodes: [{ id: 'start-1', type: 'start', position: { x: 0, y: 50 }, data: { title: 'Leave Request' } }, { id: 'app-1', type: 'approval', position: { x: 250, y: 50 }, data: { title: 'Manager Approval' } }, { id: 'end-1', type: 'end', position: { x: 550, y: 50 }, data: { title: 'End' } }],
    edges: [{ id: 'e1-2', source: 'start-1', target: 'app-1' }, { id: 'e2-3', source: 'app-1', target: 'end-1' }]
  },
  'Document Verification': {
    nodes: [{ id: 'start-1', type: 'start', position: { x: 0, y: 50 }, data: { title: 'Submit Docs' } }, { id: 'auto-1', type: 'automated', position: { x: 250, y: 50 }, data: { title: 'Verify ID' } }, { id: 'end-1', type: 'end', position: { x: 550, y: 50 }, data: { title: 'Done' } }],
    edges: [{ id: 'e1-2', source: 'start-1', target: 'auto-1' }, { id: 'e2-3', source: 'auto-1', target: 'end-1' }]
  }
};

export function Sidebar() {
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const clearCanvas = useWorkflowStore(state => state.clearCanvas);
  const importWorkflow = useWorkflowStore(state => state.importWorkflow);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const loadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof templates;
    if (key && templates[key]) {
      if (window.confirm('Load template? This will replace your current canvas.')) {
        importWorkflow(templates[key].nodes as any, templates[key].edges as any);
        toast.success(`Loaded ${key} template`);
      }
      e.target.value = '';
    }
  };

  const handleExport = () => {
    const json = serializeWorkflow(nodes, edges);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workflow exported successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            const { nodes, edges } = deserializeWorkflow(json);
            importWorkflow(nodes, edges);
            toast.success('Workflow imported successfully');
          } catch (error) {
            toast.error('Failed to import workflow. Invalid JSON.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      clearCanvas();
      toast.info('Canvas cleared');
    }
  };

  const invalidNodeIds = useWorkflowStore(state => state.invalidNodeIds);
  const isValid = nodes.length > 0 && invalidNodeIds.length === 0;

  return (
    <div className="w-[240px] bg-dark-panel border-r border-border h-full flex flex-col z-10">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-white tracking-tight">HR Workflow Designer</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Templates</h2>
          <select 
            onChange={loadTemplate}
            className="w-full bg-dark-bg border border-border rounded-md px-3 py-2 text-sm text-gray-300 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select a template...</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Leave Approval">Leave Approval</option>
            <option value="Document Verification">Document Verification</option>
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Node Types</h2>
          <div className="flex flex-col gap-3">
            {nodeTypes.map((item) => (
              <div
                key={item.type}
                className="bg-dark-bg p-3 rounded-md border border-border cursor-grab hover:border-indigo-500 hover:shadow-md transition-all flex flex-col gap-1"
                onDragStart={(e) => onDragStart(e, item.type)}
                draggable
              >
                <div className="flex items-center gap-2">
                  <item.icon size={16} className={item.color} />
                  <span className="text-sm font-medium text-gray-200">{item.label}</span>
                </div>
                <span className="text-xs text-gray-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Workflow Actions</h2>
          <div className="flex flex-col gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-dark-bg hover:bg-white/5 border border-border p-2 rounded-md transition-colors">
              <Download size={16} /> Export JSON
            </button>
            <button onClick={handleImport} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-dark-bg hover:bg-white/5 border border-border p-2 rounded-md transition-colors">
              <Upload size={16} /> Import JSON
            </button>
            <button onClick={handleClear} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 bg-dark-bg hover:bg-red-500/10 border border-border p-2 rounded-md transition-colors mt-2">
              <Trash2 size={16} /> Clear Canvas
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-dark-bg flex justify-between items-center text-xs text-gray-500">
        <div className="flex flex-col gap-1">
          <span>Nodes: {nodes.length}</span>
          <span>Edges: {edges.length}</span>
        </div>
        <div className="flex items-center gap-1" title={isValid ? "Workflow is valid" : "Workflow contains errors"}>
          {isValid ? (
            <CheckSquare size={16} className="text-green-500" />
          ) : (
            <X size={16} className="text-red-500" />
          )}
          <span>{isValid ? 'Valid' : 'Invalid'}</span>
        </div>
      </div>
    </div>
  );
}
