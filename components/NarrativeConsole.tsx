import React, { useEffect, useRef } from 'react';
import { DialogueOption, NarrativeNode, ProtectorType } from '../types';

interface NarrativeConsoleProps {
  logs: string[];
  currentNode: NarrativeNode | null;
  onOptionSelect: (option: DialogueOption) => void;
  systemWarnings: string[];
  exileActive: boolean;
}

export const NarrativeConsole: React.FC<NarrativeConsoleProps> = ({ 
  logs, 
  currentNode, 
  onOptionSelect, 
  systemWarnings,
  exileActive
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, currentNode]);

  return (
    <div className="flex-1 bg-black flex flex-col h-full overflow-hidden relative">
      
      {/* Red Theater Overlay (Exile Pressure) */}
      <div className={`absolute inset-0 bg-red-900/10 pointer-events-none transition-opacity duration-1000 ${exileActive ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://media.istockphoto.com/id/1363654037/vector/scan-lines-pattern-interlaced-tv-texture-seamless-overlay-background.jpg?s=612x612&w=0&k=20&c=1g5kRzT2Qv7n3vO1F-gB4c1qq-x1q-c1q-x1q-c1q-x1q-c1q-x1q-c')] opacity-5 mix-blend-overlay z-20"></div>

      {/* Log Area */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4 z-10" ref={scrollRef}>
        {logs.map((log, index) => (
          <div key={index} className="text-zinc-400 border-l-2 border-zinc-800 pl-3 py-1">
            {log}
          </div>
        ))}
        
        {/* Current Node Display */}
        {currentNode && (
          <div className="mt-8 animate-fade-in">
             <div className="text-amber-500 font-bold mb-1 uppercase text-xs tracking-wider">
               {currentNode.speaker}
             </div>
             <div className="text-zinc-100 text-lg leading-relaxed mb-6 font-serif tracking-wide">
               "{currentNode.text}"
             </div>

             {/* Exile Trigger Text */}
             {currentNode.exileTrigger && (
                <div className="my-4 p-3 border border-red-900/50 bg-red-950/20 text-red-400 text-xs tracking-widest uppercase animate-pulse">
                   ⚠ {currentNode.exileTrigger}
                </div>
             )}
          </div>
        )}

        {/* System Warnings */}
        {systemWarnings.length > 0 && (
          <div className="my-4 space-y-1">
            {systemWarnings.map((w, i) => (
              <div key={i} className="text-red-500 bg-red-950/30 px-2 py-1 text-xs font-mono inline-block border border-red-900">
                SYSTEM ALERT: {w}
              </div>
            ))}
          </div>
        )}
        
        <div className="h-8" /> {/* Spacer */}
      </div>

      {/* Controls Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 z-10 min-h-[30%] max-h-[40%] overflow-y-auto">
        {currentNode && !currentNode.isEndNode && (
          <div className="grid grid-cols-1 gap-3">
            {currentNode.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onOptionSelect(option)}
                className="group relative w-full text-left p-4 border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-amber-500 transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-zinc-200 font-medium group-hover:text-amber-100 font-sans">
                    {option.text}
                  </span>
                  {option.riskDelta && (
                    <span className="text-cyan-500 text-[10px] font-mono border border-cyan-900 px-1 bg-cyan-950/30">
                      RISK: {option.riskDelta}%
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                   <span className="text-zinc-500 text-xs italic font-mono">
                     {option.description}
                   </span>
                   {option.protector && (
                     <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold ${
                       option.protector === ProtectorType.GABLE ? 'text-cyan-600' :
                       option.protector === ProtectorType.CAMOUFLAGE ? 'text-zinc-400' :
                       'text-red-500'
                     }`}>
                       {option.protector} AUTHORIZED
                     </span>
                   )}
                </div>
              </button>
            ))}
          </div>
        )}

        {(!currentNode || currentNode.isEndNode) && (
             <div className="text-center p-8 text-zinc-500 text-sm font-mono animate-pulse">
                WAITING FOR INPUT... 
             </div>
        )}
      </div>
    </div>
  );
};
