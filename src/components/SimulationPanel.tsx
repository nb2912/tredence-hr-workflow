import { X, Download, Play, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';

export function SimulationPanel() {
  const {
    simulationRunning,
    setSimulationRunning,
    visibleSteps,
    status,
    errorMsg,
    clearLog
  } = useSimulation();

  if (!simulationRunning) return null;

  const exportLog = () => {
    const text = visibleSteps.map(s => `[${s.timestamp}] ${s.nodeType.toUpperCase()}: ${s.message} (${s.status})`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation-log.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'failed': return <AlertCircle size={16} className="text-red-500" />;
      case 'running': return <Play size={16} className="text-blue-500 animate-pulse" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="absolute bottom-6 right-1/2 translate-x-1/2 w-full max-w-2xl bg-dark-panel border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[60vh]">
      <div className="p-3 bg-dark-bg/80 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          {status === 'running' && <Play size={16} className="text-green-500 animate-pulse" />}
          Simulation Log
        </h3>
        <div className="flex items-center gap-2">
          {status === 'completed' && (
            <>
              <button onClick={clearLog} className="text-xs flex items-center gap-1 text-gray-300 hover:text-white bg-white/5 px-2 py-1 rounded transition-colors">
                <Trash2 size={12} /> Clear Log
              </button>
              <button onClick={exportLog} className="text-xs flex items-center gap-1 text-gray-300 hover:text-white bg-white/5 px-2 py-1 rounded transition-colors">
                <Download size={12} /> Export Log
              </button>
            </>
          )}
          <button onClick={() => setSimulationRunning(false)} className="text-gray-400 hover:text-white ml-2">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-3 bg-[#13131f]">
        {status === 'error' && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded flex gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {visibleSteps.map((step, idx) => (
          <div key={idx} className="flex gap-3 items-start animate-fade-in-up">
            <div className="mt-0.5">{getStatusIcon(step.status)}</div>
            <div className="flex-1 bg-dark-bg border border-border p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{step.nodeType}</span>
                <span className="text-[10px] text-gray-500">{new Date(step.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-gray-200">{step.message}</p>
            </div>
          </div>
        ))}
        
        {status === 'completed' && (
          <div className="text-center pt-4 pb-2 text-sm text-gray-500">
            Simulation finished.
          </div>
        )}
      </div>
    </div>
  );
}
