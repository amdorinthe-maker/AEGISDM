'use client';

import React, { useState } from 'react';
import { Dice6, RotateCcw, Hash } from 'lucide-react';

const DiceRoller = () => {
  const [history, setHistory] = useState<string[]>([]);
  const dice = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    const log = `d${sides}: ${result}`;
    setHistory([log, ...history].slice(0, 5)); // Keep last 5 rolls
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-4 shadow-xl">
      <h2 className="text-sm font-bold text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Dice6 size={16} /> Fate's Roll
      </h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {dice.map((d) => (
          <button
            key={d}
            onClick={() => rollDice(d)}
            className="bg-stone-950/60 border border-stone-800 hover:border-amber-600/50 hover:bg-amber-900/10 py-2 rounded font-mono text-amber-500 transition-all text-sm font-bold"
          >
            d{d}
          </button>
        ))}
        <button 
          onClick={() => setHistory([])}
          className="bg-stone-800 hover:bg-stone-700 text-stone-400 p-2 rounded flex items-center justify-center transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="bg-stone-950/80 rounded-lg p-3 min-h-[100px] border border-stone-800/50">
        <div className="text-[10px] uppercase text-stone-600 font-bold mb-2 flex items-center gap-1">
          <Hash size={10} /> Roll History
        </div>
        <div className="space-y-1">
          {history.map((entry, idx) => (
            <div 
              key={idx} 
              className={`text-sm font-mono flex justify-between items-center ${idx === 0 ? 'text-amber-400 font-bold' : 'text-stone-500 opacity-60'}`}
            >
              <span>{entry.split(': ')[0]}</span>
              <span className="text-lg">{entry.split(': ')[1]}</span>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-stone-800 italic text-[10px] text-center mt-4">Roll for initiative...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;