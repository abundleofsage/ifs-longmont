import React from 'react';
import { GamePhase } from '../types';

interface TacticalMapProps {
  phase: GamePhase;
  drivingProgress: number; // 0-100 for the driving loop
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ phase, drivingProgress }) => {
  return (
    <div className="relative w-full h-64 md:h-full bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 overflow-hidden select-none">
      
      {/* Static Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* GABLE Overlay Elements (Math/Vectors) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-10">
        <svg className="w-full h-full">
           <line x1="0" y1="50%" x2="100%" y2="50%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
           <line x1="50%" y1="0" x2="50%" y2="100%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
           {phase === GamePhase.NEGOTIATION && (
             <circle cx="50%" cy="50%" r="100" stroke="cyan" fill="none" strokeWidth="0.5" />
           )}
        </svg>
      </div>

      {/* Scene: Driving Loop (Forced Perimeter Collapse) */}
      {phase === GamePhase.DRIVING_LOOP && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
            
            {/* Moving Road Effect */}
            <div className="absolute inset-0 opacity-30">
                 <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,#333_50px)] animate-road-move"></div>
            </div>

            {/* Status Text Overlay - The Repeated Rejection */}
            <div className="absolute top-16 w-full text-center z-40 space-y-2 pointer-events-none">
                {drivingProgress > 20 && drivingProgress < 30 && (
                    <div className="text-red-500 font-black text-2xl tracking-widest bg-black/60 backdrop-blur-sm py-2">YOU CAN'T STAY HERE</div>
                )}
                {drivingProgress > 50 && drivingProgress < 60 && (
                    <div className="text-red-500 font-black text-3xl tracking-widest bg-black/60 backdrop-blur-sm py-2 animate-pulse">YOU CAN'T STAY HERE</div>
                )}
                {drivingProgress > 75 && drivingProgress < 90 && (
                    <div className="text-red-600 font-black text-4xl tracking-widest bg-black/60 backdrop-blur-sm py-2 animate-bounce">GO</div>
                )}
            </div>

            {/* The Wagon */}
            <div className="relative z-20 transition-transform duration-1000" 
                 style={{ 
                     transform: drivingProgress > 75 ? 'scale(0.8) translateY(20px)' : 'scale(1)',
                     opacity: drivingProgress > 95 ? 0 : 1
                 }}>
                 <div className="w-12 h-20 bg-amber-800 rounded-sm shadow-2xl relative border border-zinc-700">
                    {/* Headlights */}
                    <div className="absolute -top-12 left-1 w-3 h-28 bg-yellow-100/10 blur-md rounded-full"></div>
                    <div className="absolute -top-12 right-1 w-3 h-28 bg-yellow-100/10 blur-md rounded-full"></div>
                    
                    {/* The Owl (Attached to car/shoulder) - Hallucination Layer */}
                    {drivingProgress > 60 && (
                        <div className="absolute -right-8 top-2 text-cyan-600 opacity-90 text-2xl font-serif animate-pulse font-bold" style={{ textShadow: '0 0 5px cyan' }}>
                            (o,o)
                        </div>
                    )}
                 </div>
            </div>

            {/* Flashlight Beam (The Police) - Sweeping cone */}
            {( (drivingProgress > 20 && drivingProgress < 35) || (drivingProgress > 50 && drivingProgress < 65) ) && (
                <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 z-30 pointer-events-none mix-blend-screen opacity-70 origin-bottom">
                     <div className="w-[100vh] h-[200vh] bg-[conic-gradient(from_170deg_at_50%_100%,transparent_0deg,rgba(200,220,255,0.8)_10deg,transparent_20deg)] animate-beam-sweep origin-bottom"></div>
                </div>
            )}
            
            {/* Blue/Red Police Ambient */}
            {drivingProgress < 80 && drivingProgress > 15 && (
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-red-900/20 animate-pulse z-10 mix-blend-color-dodge"></div>
            )}

            {/* Final Text - The Void */}
             {drivingProgress > 95 && (
                <div className="absolute inset-0 bg-black z-50 flex items-center justify-center animate-fade-in">
                    <div className="text-center">
                        <div className="text-zinc-600 text-xs tracking-[0.5em] mb-4 uppercase">System Collapse Imminent</div>
                        <p className="text-zinc-300 font-serif italic text-xl">"Knock, or the system collapses."</p>
                    </div>
                </div>
             )}
        </div>
      )}

      {/* Scene: Negotiation */}
      {phase === GamePhase.NEGOTIATION && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
            {/* The Farmhouse */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-24 border-2 border-zinc-600 bg-zinc-900 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="text-zinc-500 font-mono text-[10px]">HOUSE NODE</div>
                {/* Light from window */}
                <div className="absolute bottom-4 right-4 w-4 h-6 bg-yellow-900/60 animate-pulse box-shadow-[0_0_10px_orange]"></div>
            </div>

            {/* The Wheat Field */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-20 border-t border-zinc-700"></div>

            {/* The Wagon */}
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-8 w-8 h-12 bg-amber-700/80 border border-amber-500/50 shadow-lg"></div>

            {/* Connection Line */}
            <div className="absolute h-16 w-0.5 bg-red-500/30 top-[45%] left-1/2"></div>
        </div>
      )}

      {/* Status Indicators overlay */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 z-50">
        <div className="bg-zinc-900/90 px-2 py-1 text-[10px] text-cyan-500 font-mono border border-cyan-900 shadow-lg">
            GABLE: {phase === GamePhase.DRIVING_LOOP ? 'DESYNCHRONIZED' : 'MONITORING'}
        </div>
        <div className="bg-zinc-900/90 px-2 py-1 text-[10px] text-zinc-500 font-mono border border-zinc-800 shadow-lg">
            CAMOUFLAGE: {phase === GamePhase.DRIVING_LOOP ? 'FAILING' : 'ACTIVE'}
        </div>
      </div>

    </div>
  );
};
