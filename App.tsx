import React, { useState, useEffect, useCallback } from 'react';
import { SystemMonitor } from './components/SystemMonitor';
import { TacticalMap } from './components/TacticalMap';
import { NarrativeConsole } from './components/NarrativeConsole';
import { INITIAL_RESOURCES, NARRATIVE_NODES } from './constants';
import { GamePhase, GameState, ProtectorType, DialogueOption } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.BOOT_SEQUENCE,
    resources: { ...INITIAL_RESOURCES },
    activeProtectors: [ProtectorType.GABLE, ProtectorType.CAMOUFLAGE],
    currentNodeId: 'start',
    flags: {},
    log: [],
    systemWarnings: []
  });

  const [drivingProgress, setDrivingProgress] = useState(0);

  // Boot Sequence Effect
  useEffect(() => {
    if (gameState.phase === GamePhase.BOOT_SEQUENCE) {
      setTimeout(() => {
        setGameState(prev => ({
           ...prev,
           phase: GamePhase.DRIVING_LOOP,
           log: ['> BOOT_SEQUENCE_COMPLETE', '> LOAD_DISTRIBUTION: NOMINAL', '> EXILE_CONTAINMENT: 94%', '> STARTING ENGINE...']
        }));
      }, 1500);
    }
  }, [gameState.phase]);

  // Driving Loop Logic (Forced Perimeter Collapse Cutscene)
  useEffect(() => {
    if (gameState.phase === GamePhase.DRIVING_LOOP) {
      const interval = setInterval(() => {
        setDrivingProgress(prev => {
          const next = prev + 0.3; // Slightly slower pacing to allow reading
          
          // Helper to check if we just crossed a threshold
          const crossed = (threshold: number) => prev < threshold && next >= threshold;

          // --- INITIAL CONDITIONS ---
          if (crossed(5)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SENSORS: CURRENT TEMP -4°F'] }));
          }
          if (crossed(10)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SNOW ACCUMULATION: LIGHT'] }));
          }
          if (crossed(15)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SCANNING FOR NEW LOCATION...'] }));
          }

          // --- FIRST STOP: KING SOOPERS ---
          if (crossed(20)) {
             setGameState(curr => ({
                 ...curr,
                 log: [...curr.log, 
                    '',
                    '> LOCATION FOUND: [KING SOOPERS].', 
                    '> ROUTING...'
                 ]
             }));
          }
          if (crossed(25)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SENSORS: FLASHLIGHT BEAM DETECTED.'] }));
          }
          if (crossed(30)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> OFFICER: "You can\'t stay here."'] }));
          }
          if (crossed(35)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SYSTEM: REROUTING...'] }));
          }

          // --- SECOND STOP: SIDE STREET ---
          if (crossed(45)) {
             setGameState(curr => ({
                 ...curr,
                 resources: { ...curr.resources, coldLoad: 55 },
                 log: [...curr.log, '> UPDATE: TEMP -6°F. COLD LOAD INCREASING.']
             }));
          }
          if (crossed(50)) {
             setGameState(curr => ({
                 ...curr,
                 log: [...curr.log, 
                    '',
                    '> LOCATION FOUND: [SIDE STREET].',
                    '> ENGINE: IDLE.'
                 ]
             }));
          }
          if (crossed(55)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> AUDIO: KNUCKLES ON GLASS.'] }));
          }
          if (crossed(60)) {
             setGameState(curr => ({
                 ...curr,
                 resources: { ...curr.resources, sleepDebt: 85 },
                 log: [...curr.log, '> OFFICER: "You can\'t stay here."', '> WARNING: SLEEP DEBT CRITICAL.']
             }));
          }

          // --- THIRD STOP: INDUSTRIAL EDGE ---
          if (crossed(68)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SCANNING...'] }));
          }
          if (crossed(75)) {
             setGameState(curr => ({
                 ...curr,
                 resources: { ...curr.resources, coherence: 25 },
                 log: [...curr.log, 
                    '',
                    '> LOCATION FOUND: [INDUSTRIAL EDGE].',
                    '> VISUALS: FABRIC TEARING.'
                 ]
             }));
          }
          if (crossed(80)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> ENTITY DETECTED: THE OWL [PASSIVE].'] }));
          }
          if (crossed(85)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> OFFICER: "You can\'t..."'] }));
          }

          // --- COLLAPSE ---
          if (crossed(92)) {
             setGameState(curr => ({ ...curr, log: [...curr.log, '> SYSTEM ALERT: NO VALID PARKING NODES REMAINING.'] }));
          }
          if (crossed(95)) {
             setGameState(curr => ({
                 ...curr,
                 log: [...curr.log, 
                    '',
                    '> "Knock, or the system collapses."'
                 ]
             }));
          }

          if (next >= 100) {
            clearInterval(interval);
            // Transition to Negotiation Phase
            setGameState(curr => ({
              ...curr,
              phase: GamePhase.NEGOTIATION,
              systemWarnings: ['COHERENCE CRITICAL', 'SLEEP DEBT CRITICAL', 'HALLUCINATION ACTIVE'],
              resources: {
                ...curr.resources,
                sleepDebt: 95,
                coherence: 15,
                coldLoad: 80
              },
              log: [...curr.log, '', '> ARRIVAL: UNLABELED FARMHOUSE', '> STATUS: DESPERATE']
            }));
            return 100;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState.phase]);

  const handleOptionSelect = useCallback((option: DialogueOption) => {
    setGameState(prev => {
      // 1. Calculate new resources
      const newResources = { ...prev.resources };
      if (option.loadImpact.coherence) newResources.coherence = Math.min(100, Math.max(0, newResources.coherence + option.loadImpact.coherence));
      if (option.loadImpact.coldLoad) newResources.coldLoad = Math.min(100, Math.max(0, newResources.coldLoad + option.loadImpact.coldLoad));
      if (option.loadImpact.paperReality) newResources.paperReality = Math.min(100, Math.max(0, newResources.paperReality + option.loadImpact.paperReality));
      if (option.loadImpact.sleepDebt) newResources.sleepDebt = Math.min(100, Math.max(0, newResources.sleepDebt + option.loadImpact.sleepDebt));

      // 2. Add logs
      const newLog = [...prev.log];
      newLog.push(`> SELF: ${option.text}`);
      
      const currentNode = NARRATIVE_NODES[prev.currentNodeId];
      if (currentNode) {
          newLog.push(`> ${currentNode.speaker}: ${currentNode.text}`);
      }
      newLog.push(`> SYSTEM: ROUTING LOAD [${option.description?.toUpperCase()}]`);

      // 3. Update Protectors
      return {
        ...prev,
        resources: newResources,
        currentNodeId: option.nextNodeId,
        log: newLog
      };
    });
  }, []);

  const getCurrentNode = () => {
    if (gameState.phase === GamePhase.NEGOTIATION) {
      return NARRATIVE_NODES[gameState.currentNodeId] || null;
    }
    return null;
  };

  const isExileActive = () => {
    const node = getCurrentNode();
    return !!node?.exileTrigger;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-300 font-sans overflow-hidden">
      
      {/* Mobile/Tablet Layout: Flex col. Desktop: Flex row */}
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Left Panel: Monitor */}
        <SystemMonitor 
          resources={gameState.resources} 
          activeProtectors={gameState.activeProtectors} 
        />

        {/* Center/Right Area */}
        <div className="flex-1 flex flex-col h-full relative">
            
            {/* Top Half: Tactical Map */}
            <div className="h-1/3 md:h-1/2 border-b border-zinc-800 relative bg-zinc-950">
               <TacticalMap phase={gameState.phase} drivingProgress={drivingProgress} />
               
               {/* Phase Title Overlay */}
               <div className="absolute top-4 left-4 pointer-events-none z-50">
                  <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">Current Operation</h3>
                  <h2 className="text-amber-500 font-bold text-xl uppercase shadow-black drop-shadow-md">
                    {gameState.phase.replace('_', ' ')}
                  </h2>
               </div>
            </div>

            {/* Bottom Half: Console */}
            <div className="h-2/3 md:h-1/2 flex flex-col">
               {gameState.phase === GamePhase.BOOT_SEQUENCE && (
                 <div className="flex-1 flex items-center justify-center bg-black font-mono text-green-500 animate-pulse">
                    INITIALIZING KERNEL...
                 </div>
               )}
               
               {gameState.phase === GamePhase.DRIVING_LOOP && (
                 <div className="flex-1 bg-black p-8 font-mono text-zinc-400 space-y-2 overflow-hidden">
                    {/* Auto-scroll logs */}
                    {gameState.log.slice(-8).map((l, i) => (
                        <div key={i} className={`animate-fade-in ${l.includes('OFFICER') ? 'text-red-400' : l.includes('LOCATION') ? 'text-cyan-500 pt-2 border-t border-zinc-900 mt-2' : ''}`}>
                            {l}
                        </div>
                    ))}
                 </div>
               )}

               {gameState.phase === GamePhase.NEGOTIATION && (
                 <NarrativeConsole 
                    logs={gameState.log}
                    currentNode={getCurrentNode()}
                    onOptionSelect={handleOptionSelect}
                    systemWarnings={gameState.systemWarnings}
                    exileActive={isExileActive()}
                 />
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;