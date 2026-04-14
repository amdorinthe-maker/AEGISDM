'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles, Trash2, Edit3, User } from 'lucide-react';

const NPCManager = ({ npcs = [], onDelete, onEdit, npcToEdit, onStartEdit }: any) => {
  const [mode, setMode] = useState<'view' | 'manual'>('view');
  const [manualNPC, setManualNPC] = useState({ name: '', role: '', race: '', description: '', id: '' });

  // This "Effect" watches for when you click the edit button
  useEffect(() => {
    if (npcToEdit) {
      setManualNPC(npcToEdit);
      setMode('manual');
    }
  }, [npcToEdit]);

  const quickGen = () => {
    const names = ["Finnian", "Crom", "Elara", "Morgath", "Zinnia", "Kaelen", "Runa", "Varis"];
    const roles = ["Merchant", "Sellsword", "Scholar", "Pickpocket", "Innkeeper", "Acolyte"];
    const races = ["Human", "Elf", "Dwarf", "Halfling", "Tiefling", "Dragonborn", "Gnome"];
    const traits = ["Extremely twitchy", "Uses big words incorrectly", "Smells like expensive perfume", "Refuses to make eye contact", "Overly friendly"];
    const flaws = ["Owes money to a dragon", "Is actually a spy", "Terrified of magic", "Easily bribed with fine wine", "Has a fake identity"];
    const bonds = ["Has a stolen map", "Is a disgraced noble", "Searching for a lost sibling", "Protective of a small pet mouse", "Knows a secret about the Mayor"];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const generatedName = pick(names);
    const generatedRace = pick(races);
    const generatedDescription = `${pick(traits)}. ${pick(bonds)}, and ${pick(flaws).toLowerCase()}.`;

    const newNPC = {
      id: Date.now().toString(),
      name: generatedName,
      race: generatedRace,
      role: pick(roles),
      image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${generatedRace}${generatedName}`,
      status: "Alive",
      description: generatedDescription
    };

    // This sends the new NPC up to the parent list
    onEdit(newNPC);
  };

  const addManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNPC.name) return;
    
    const npcToSave = { 
      ...manualNPC, 
      id: manualNPC.id || Date.now().toString(),
      status: "Alive",
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${manualNPC.name}`
    };

    onEdit(npcToSave); // Send to parent
    setManualNPC({ name: '', role: '', race: '', description: '', id: '' }); // Clear form
    setMode('view');
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
        <form onSubmit={addManual} className="bg-stone-950/40 p-4 rounded-lg border border-amber-900/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Name</label>
              <input 
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 outline-none"
                value={manualNPC.name}
                onChange={e => setManualNPC({...manualNPC, name: e.target.value})}
                placeholder="e.g. Lord Strahd"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Role</label>
              <input 
                className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 outline-none"
                value={manualNPC.role}
                onChange={e => setManualNPC({...manualNPC, role: e.target.value})}
                placeholder="e.g. Vampire"
              />
            </div>
            <div className="space-y-1">
    <label className="text-[10px] uppercase text-stone-500 font-bold">Race / Ancestry</label>
    <input 
      className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 outline-none"
      value={manualNPC.race}
      onChange={e => setManualNPC({...manualNPC, race: e.target.value})}
      placeholder="e.g. High Elf"
    />
  </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold">Description</label>
            <textarea 
              className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-sm text-stone-200 h-20 resize-none outline-none"
              value={manualNPC.description}
              onChange={e => setManualNPC({...manualNPC, description: e.target.value})}
              placeholder="What do they want?"
            />
          </div>
          <button type="submit" className="w-full bg-amber-900/40 hover:bg-amber-900/60 text-amber-500 border border-amber-800/50 py-2 rounded text-xs uppercase font-bold tracking-widest transition-all">
            Save NPC
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {npcs.length === 0 ? (
            <p className="col-span-2 text-center text-stone-700 italic py-10">No NPCs in your gallery yet.</p>
          ) : (
            npcs.map((npc: any) => (
              <div key={npc.id} className="bg-stone-900/80 border border-amber-900/30 rounded-lg p-4 shadow-xl">
                <div className="flex justify-between items-start mb-2">
                  {/* 1. THE AVATAR IMAGE */}
  <div className="w-12 h-12 rounded-lg bg-stone-800 border border-amber-900/20 overflow-hidden flex-shrink-0">
    <img 
      src={npc.image} 
      alt={npc.name} 
      className="w-full h-full object-cover"
    />
  </div>

  {/* 2. THE TEXT INFO */}
                  <div>
                    <h3 className="text-amber-500 font-serif text-lg font-bold leading-none">{npc.name}</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{npc.race} {npc.role}</p>
                  </div>
                  <div className="flex gap-2 bg-stone-950/50 p-1 rounded border border-amber-900/10">
                    <button onClick={() => onStartEdit(npc)} className="text-stone-500 hover:text-amber-500 transition-colors p-1">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => onDelete(npc.id)} className="text-stone-500 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-900/10">
                  <p className="text-stone-300 text-xs italic leading-relaxed">{npc.description}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
<button 
  onClick={() => {
    // This flips the status and sends it back to the main page to save
    const updatedNPC = { 
      ...npc, 
      status: npc.status === 'Alive' ? 'Deceased' : 'Alive' 
    };
    onEdit(updatedNPC);
  }}
  className="mt-3 flex items-center gap-2 hover:bg-stone-950/50 p-1 rounded-md transition-all group"
  title="Toggle Status"
>
  {/* The LED Dot */}
  <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${
    npc.status === 'Alive' ? 'bg-green-500 shadow-green-900/50' : 'bg-red-600 shadow-red-900/50'
  }`} />
  
  {/* The Text Label */}
  <span className="text-[12px] text-stone-500 uppercase font-bold group-hover:text-stone-300 transition-colors">
    {npc.status}
  </span>
</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NPCManager;