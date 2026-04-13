'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles, Trash2, Edit3, User } from 'lucide-react';

const NPCManager = () => {
  const [npcs, setNpcs] = useState<any[]>([]);
  const [mode, setMode] = useState<'view' | 'manual'>('view');
  
  // Manual Form State
  const [manualNPC, setManualNPC] = useState({ name: '', race: '', secret: '' });

  useEffect(() => {
    const saved = localStorage.getItem('aegis_npcs');
    if (saved) setNpcs(JSON.parse(saved));
  }, []);

  const saveNpcs = (newList: any[]) => {
    setNpcs(newList);
    localStorage.setItem('aegis_npcs', JSON.stringify(newList));
  };

  const quickGen = () => {
    const names = ["Finnian", "Crom", "Elara", "Morgath", "Zinnia"];
    const races = ["Tiefling", "Elf", "Human", "Dwarf", "Halfling"];
    const secrets = ["Has a stolen map", "Is actually a spy", "Owes money to a dragon", "Is a disgraced noble"];
    
    const newNPC = {
      id: Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      race: races[Math.floor(Math.random() * races.length)],
      secret: secrets[Math.floor(Math.random() * secrets.length)],
    };
    saveNpcs([newNPC, ...npcs]);
  };

  const addManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNPC.name) return;
    
    const newNPC = { ...manualNPC, id: Date.now() };
    saveNpcs([newNPC, ...npcs]);
    setManualNPC({ name: '', race: '', secret: '' });
    setMode('view');
  };

  const deleteNpc = (id: number) => {
    saveNpcs(npcs.filter(n => n.id !== id));
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-6 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-amber-500 font-serif flex items-center gap-2">
          <User size={20} /> NPC Gallery
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setMode(mode === 'manual' ? 'view' : 'manual')}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg text-xs border border-stone-700 transition-all"
          >
            {mode === 'manual' ? 'Cancel' : <><Edit3 size={14} /> Manual Add</>}
          </button>
          <button 
            onClick={quickGen}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-amber-900/20"
          >
            <Sparkles size={14} /> Quick Gen
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={addManual} className="bg-stone-950/40 p-4 rounded-lg border border-amber-900/10 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Name</label>
              <input 
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 focus:border-amber-700 outline-none"
                value={manualNPC.name}
                onChange={e => setManualNPC({...manualNPC, name: e.target.value})}
                placeholder="e.g. Lord Strahd"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Race/Class</label>
              <input 
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 focus:border-amber-700 outline-none"
                value={manualNPC.race}
                onChange={e => setManualNPC({...manualNPC, race: e.target.value})}
                placeholder="e.g. Vampire"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold">Notes / Secrets</label>
            <textarea 
              className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 focus:border-amber-700 outline-none h-20 resize-none"
              value={manualNPC.secret}
              onChange={e => setManualNPC({...manualNPC, secret: e.target.value})}
              placeholder="What do they want? What are they hiding?"
            />
          </div>
          <button type="submit" className="w-full bg-amber-900/40 hover:bg-amber-900/60 text-amber-500 border border-amber-800/50 py-2 rounded text-xs uppercase tracking-widest font-bold transition-all">
            Save NPC to Gallery
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {npcs.length === 0 && (
            <p className="col-span-2 text-center text-stone-700 italic py-10">No NPCs in your gallery yet.</p>
          )}
          {npcs.map((npc) => (
            <div key={npc.id} className="bg-stone-950/40 border border-amber-900/10 p-3 rounded-lg flex justify-between group hover:border-amber-900/40 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-amber-200">{npc.name}</span>
                  <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-400 uppercase tracking-tighter">{npc.race}</span>
                </div>
                <p className="text-xs text-stone-500 italic mt-1">{npc.secret}</p>
              </div>
              <button 
                onClick={() => deleteNpc(npc.id)}
                className="text-stone-700 hover:text-rose-900 transition-colors self-start p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NPCManager;