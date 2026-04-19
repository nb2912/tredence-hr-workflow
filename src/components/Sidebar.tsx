import { Play, CheckSquare, UserCheck, Zap, Square, Download, Upload, Trash2 } from 'lucide-react';
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

export function Sidebar() {
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const clearCanvas = useWorkflowStore(state => state.clearCanvas);
  const importWorkflow = useWorkflowStore(state => state.importWorkflow);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
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

  return (
    <div className="w-[240px] bg-dark-panel border-r border-border h-full flex flex-col z-10">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-white tracking-tight">HR Workflow Designer</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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

      <div className="p-4 border-t border-border bg-dark-bg flex justify-between text-xs text-gray-500">
        <span>Nodes: {nodes.length}</span>
        <span>Edges: {edges.length}</span>
      </div>
    </div>
  );
}
