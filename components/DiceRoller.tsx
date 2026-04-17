'use client';

import React, { useState } from 'react';
import { Dices, RotateCcw, History } from 'lucide-react';

export default function DiceRoller() {
  const [history, setHistory] = useState<{ die: string, total: number, rolls: number[] }[]>([]);
  const [modifier, setModifier] = useState(0);
  const [rollMode, setRollMode] = useState<'norm' | 'adv' | 'dis'>('norm');

  const rollDie = (sides: number) => {
    const r1 = Math.floor(Math.random() * sides) + 1;
    const r2 = Math.floor(Math.random() * sides) + 1;
    
    let finalBase = r1;
    let rollArray = [r1];

    if (rollMode === 'adv') {
      finalBase = Math.max(r1, r2);
      rollArray = [r1, r2];
    } else if (rollMode === 'dis') {
      finalBase = Math.min(r1, r2);
      rollArray = [r1, r2];
    }

    const total = finalBase + modifier;
    setHistory(prev => [{ 
      die: `d${sides}${rollMode !== 'norm' ? ` (${rollMode})` : ''}`, 
      total, 
      rolls: rollArray 
    }, ...prev].slice(0, 5)); // Keep last 5 rolls
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-4 font-serif">
      {/* HEADER & MODES */}
      <div className="flex items-center justify-between mb-4 border-b border-amber-900/10 pb-2">
        <h2 className="text-amber-600 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
          <Dices size={14} /> Fate's Roll
        </h2>
        
        <div className="flex bg-stone-950 rounded border border-amber-900/20 p-0.5">
          {['norm', 'adv', 'dis'].map((m) => (
            <button
              key={m}
              onClick={() => setRollMode(m as any)}
              className={`px-2 py-1 text-[9px] uppercase font-bold rounded transition-all ${
                rollMode === m ? 'bg-amber-600 text-stone-950' : 'text-stone-500 hover:text-amber-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* DICE GRID */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[4, 6, 8, 10, 12, 20, 100].map(d => (
          <button
            key={d}
            onClick={() => rollDie(d)}
            className="py-3 bg-stone-950/60 border border-amber-900/10 rounded hover:border-amber-500/50 hover:bg-amber-900/10 text-amber-500 font-bold transition-all group"
          >
            <span className="text-small group-hover:scale-110 block transition-transform">d{d}</span>
          </button>
        ))}
        {/* MODIFIER INPUT */}
        <div className="flex flex-col items-center justify-center bg-stone-950/80 border border-amber-900/30 rounded px-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold">Mod</span>
          <input 
            type="number" 
            value={modifier} 
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="w-full bg-transparent text-center text-amber-500 text-small font-bold outline-none"
          />
        </div>
      </div>

      {/* ROLL HISTORY DISPLAY */}
      <div className="bg-stone-950/40 rounded-lg p-3 border border-inner border-black/40 min-h-[100px]">
        <div className="flex items-center justify-between mb-2 text-[9px] text-stone-600 uppercase font-bold tracking-widest">
          <span className="flex items-center gap-1"><History size={12}/> Roll History</span>
          <button onClick={() => setHistory([])} className="hover:text-amber-500 transition-colors">
            <RotateCcw size={14}/>
          </button>
        </div>
        
        <div className="space-y-2">
          {history.length > 0 ? history.map((h, i) => (
            <div key={i} className="flex justify-between items-center animate-in slide-in-from-left-2 duration-300">
              <span className="text-[10px] text-stone-400 italic">{h.die} {modifier !== 0 && `(+${modifier})`}</span>
              <div className="flex items-center gap-2">
                {h.rolls.length > 1 && (
                  <span className="text-[9px] text-stone-600">[{h.rolls.join(', ')}]</span>
                )}
                <span className={`text-lg font-mono font-bold ${h.total === 20 + modifier ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-amber-600'}`}>
                  {h.total}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-center text-stone-700 text-[10px] italic mt-4">The dice are silent...</p>
          )}
        </div>
      </div>
    </div>
  );
}