import { X, Play, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { useSimulation } from '../hooks/useSimulation';

export function SimulationPanel() {
  const simulationRunning = useWorkflowStore(state => state.simulationRunning);
  const setSimulationRunning = useWorkflowStore(state => state.setSimulationRunning);
  const { visibleSteps } = useSimulation();

  if (!simulationRunning) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'running': return <Clock size={18} className="text-indigo-500 animate-spin" />;
      case 'pending': return <Clock size={18} className="text-gray-300" />;
      default: return null;
    }
  };

  return (
    <div className="absolute right-0 top-0 w-[350px] bg-white border-l border-border h-full shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/80">
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-900">Simulation Test</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-indigo-100 text-indigo-600 animate-pulse">
              Live Execution
            </span>
          </div>
        </div>
        <button 
          onClick={() => setSimulationRunning(false)}
          className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
        {visibleSteps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <Play size={32} className="opacity-10" />
            <p className="text-xs text-center italic max-w-[200px]">
              Initializing graph traversal and validating node logic...
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
            {visibleSteps.map((step, index) => {
              const isRunning = step.status === 'running';
              return (
                <div key={index} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
                  <div className={`z-10 w-5 h-5 rounded-full flex items-center justify-center bg-white border-2 transition-all duration-300 ${isRunning ? 'border-indigo-500 scale-125 shadow-md shadow-indigo-100' : 'border-gray-200'}`}>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className={`flex-1 transition-all duration-300 ${isRunning ? 'translate-x-1' : ''}`}>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`text-xs font-bold uppercase tracking-tight transition-colors ${isRunning ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {step.nodeType}
                      </h4>
                      <span className="text-[9px] text-gray-400 font-mono">{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <p className={`text-sm leading-snug transition-colors ${isRunning ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {step.message}
                    </p>
                    
                    {step.status === 'completed' && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-green-600 uppercase">
                         Done
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-gray-50/80">
        <button 
          onClick={() => setSimulationRunning(false)}
          className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
        >
          Stop Simulation
        </button>
      </div>
    </div>
  );
}
