import { useState, useEffect } from 'react';
import { Play, Undo, Redo, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
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

  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const { valid } = validateWorkflow(nodes, edges);
    setIsValid(valid);
  }, [nodes, edges]);

  const handleRunSimulation = () => {
    const { valid, errors } = validateWorkflow(nodes, edges);
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
    const { valid, errors } = validateWorkflow(nodes, edges);
    if (valid) {
      toast.success('Workflow is perfectly valid!');
    } else {
      errors.forEach(err => toast.error(err));
    }
  };

  return (
    <div className="h-14 bg-dark-panel border-b border-border flex items-center justify-between px-4 z-20 relative">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-lg">
          <Play size={16} className="text-white ml-0.5" />
        </div>
        <input 
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="bg-transparent text-white font-medium text-lg border-b border-transparent hover:border-gray-500 focus:border-indigo-500 focus:outline-none px-1 py-0.5 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-dark-bg rounded-md border border-border overflow-hidden mr-2">
          <button 
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <div className="w-[1px] bg-border"></div>
          <button 
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>

        <button 
          onClick={handleValidate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-border transition-colors"
        >
          {isValid ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-red-500" />}
          Validate
        </button>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-border transition-colors"
        >
          <Download size={14} />
          Export JSON
        </button>

        <button 
          onClick={handleRunSimulation}
          disabled={!isValid && nodes.length > 0}
          className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Play size={14} />
          Run Simulation
        </button>
      </div>
    </div>
  );
}
