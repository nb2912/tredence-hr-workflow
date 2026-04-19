import { useState, useEffect } from 'react';
import { Play, Undo, Redo, Download, ShieldCheck, History } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { validateWorkflow } from '../utils/validation';
import { toast } from 'sonner';

export function Toolbar() {
  const workflowName = useWorkflowStore(state => state.workflowName);
  const setWorkflowName = useWorkflowStore(state => state.setWorkflowName);
  const nodes = useWorkflowStore(state => state.nodes);
  const edges = useWorkflowStore(state => state.edges);
  const historyIndex = useWorkflowStore(state => state.historyIndex);
  const history = useWorkflowStore(state => state.history);
  const undo = useWorkflowStore(state => state.undo);
  const redo = useWorkflowStore(state => state.redo);
  const setSimulationRunning = useWorkflowStore(state => state.setSimulationRunning);
  const exportWorkflow = useWorkflowStore(state => state.exportWorkflow);
  const setInvalidNodeIds = useWorkflowStore(state => state.setInvalidNodeIds);

  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const { valid, invalidNodeIds } = validateWorkflow(nodes, edges);
    setIsValid(valid);
    setInvalidNodeIds(invalidNodeIds);
  }, [nodes, edges, setInvalidNodeIds]);

  const handleRunSimulation = () => {
    const { valid, errors, invalidNodeIds } = validateWorkflow(nodes, edges);
    setInvalidNodeIds(invalidNodeIds);
    if (!valid) {
      errors.forEach(err => toast.error(err));
      return;
    }
    setSimulationRunning(true);
  };

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported JSON');
  };

  const handleValidate = () => {
    const { valid, errors, invalidNodeIds } = validateWorkflow(nodes, edges);
    setInvalidNodeIds(invalidNodeIds);
    if (valid) {
      toast.success('Workflow is perfectly valid!');
    } else {
      errors.forEach(err => toast.error(err));
    }
  };

  return (
    <div className="h-14 bg-white border-b border-border flex items-center justify-between px-4 z-20 relative shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-md">
          <Play size={16} className="text-white ml-0.5" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <input 
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-gray-200 focus:border-indigo-500 text-sm font-bold text-gray-800 outline-none transition-all w-48"
          />
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">TalentFlow Designer</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 border border-border p-1 rounded-lg">
        <button 
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button 
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Redo (Ctrl+Y)"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleValidate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 border border-border transition-all"
        >
          <ShieldCheck size={14} className={isValid ? 'text-green-500' : 'text-gray-400'} />
          Validate
        </button>

        <button 
          onClick={() => useWorkflowStore.getState().autoLayout()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 border border-border transition-all"
          title="Auto Layout Nodes"
        >
          <History size={14} />
          Auto Layout
        </button>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 border border-border transition-all"
        >
          <Download size={14} />
          Export
        </button>
        
        <button 
          onClick={handleRunSimulation}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md active:scale-95 ml-2"
        >
          <Play size={14} fill="currentColor" />
          Simulate
        </button>
      </div>
    </div>
  );
}
