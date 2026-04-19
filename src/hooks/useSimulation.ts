import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { simulateWorkflow } from '../mocks/simulate';
import type { SimulationStep } from '../types/workflow';

export function useSimulation() {
  const simulationRunning = useWorkflowStore(state => state.simulationRunning);
  const setSimulationRunning = useWorkflowStore(state => state.setSimulationRunning);
  const exportWorkflow = useWorkflowStore(state => state.exportWorkflow);
  
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<SimulationStep[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const clearLog = () => {
    setVisibleSteps([]);
    setSteps([]);
    setStatus('idle');
    setErrorMsg('');
  };

  useEffect(() => {
    if (simulationRunning) {
      clearLog();
      setStatus('running');
      
      const json = exportWorkflow();
      
      simulateWorkflow(json)
        .then(data => {
          setSteps(data);
        })
        .catch(err => {
          setStatus('error');
          setErrorMsg(err.message);
        });
    } else if (status !== 'idle' && !visibleSteps.length && !steps.length) {
      setStatus('idle');
    }
  }, [simulationRunning, exportWorkflow]);

  useEffect(() => {
    if (status === 'running' && steps.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < steps.length) {
          setVisibleSteps(prev => [...prev, steps[index]]);
          index++;
        } else {
          clearInterval(interval);
          setStatus('completed');
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [steps, status]);

  return {
    simulationRunning,
    setSimulationRunning,
    steps,
    visibleSteps,
    status,
    errorMsg,
    clearLog
  };
}
