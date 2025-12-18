import React from 'react';
import { ResourceState, ProtectorType } from '../types';

interface SystemMonitorProps {
  resources: ResourceState;
  activeProtectors: ProtectorType[];
}

const ProgressBar = ({ value, color, label }: { value: number; color: string; label: string }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs font-mono mb-1 uppercase tracking-wider">
      <span>{label}</span>
      <span>{value.toFixed(0)}%</span>
    </div>
    <div className="w-full h-2 bg-zinc-900 border border-zinc-800">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ resources, activeProtectors }) => {
  return (
    <div className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col h-full overflow-y-auto">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-amber-500 font-mono font-bold text-lg mb-1">MANUAL LOGISTICS</h1>
        <p className="text-zinc-500 text-xs font-mono">KERNEL VER. 2.0.1 (LONGMONT)</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-cyan-400 text-xs font-mono mb-3 uppercase border-l-2 border-cyan-400 pl-2">Core Metrics</h2>
          <ProgressBar value={resources.coherence} color="bg-amber-500" label="Coherence" />
          <ProgressBar value={resources.sleepDebt} color="bg-purple-500" label="Sleep Debt" />
          <ProgressBar value={resources.coldLoad} color="bg-blue-400" label="Cold Load" />
        </div>

        <div>
          <h2 className="text-zinc-400 text-xs font-mono mb-3 uppercase border-l-2 border-zinc-400 pl-2">Reality Alignment</h2>
          <ProgressBar value={resources.paperReality} color="bg-emerald-600" label="Paper Reality" />
          <ProgressBar value={resources.fleshReality} color="bg-rose-700" label="Flesh Reality" />
        </div>

        <div>
          <h2 className="text-red-500 text-xs font-mono mb-3 uppercase border-l-2 border-red-500 pl-2">Active Subsystems</h2>
          <div className="space-y-2">
            {activeProtectors.map(p => (
              <div key={p} className="bg-zinc-900 border border-zinc-700 p-2 text-xs font-mono text-zinc-300 flex items-center justify-between">
                <span>{p}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
            ))}
            {activeProtectors.length === 0 && <span className="text-zinc-600 text-xs">NO PROTECTORS ACTIVE</span>}
          </div>
        </div>

        <div className="mt-auto pt-6 text-[10px] text-zinc-600 font-mono leading-tight">
           SYSTEM NOTE: VICTORY IS DEFINED AS TRUTH WITHOUT COLLAPSE.
        </div>
      </div>
    </div>
  );
};
