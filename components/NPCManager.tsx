'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles, Trash2, Edit3, User, Loader2 } from 'lucide-react';
import { generateAIGent, generateNPCPortrait}from '@/app/actions';

const NPCManager = ({ npcs = [], onDelete, onEdit, npcToEdit, onStartEdit }: any) => {
  const [mode, setMode] = useState<'view' | 'manual'>('view');
  const [manualNPC, setManualNPC] = useState({ name: '', role: '', race: '', description: '', id: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (npcToEdit) {
      setManualNPC(npcToEdit);
      setMode('manual');
    }
  }, [npcToEdit]);

  // --- 1. THE INSTANT LIST GENERATOR (Original) ---
  const quickGen = () => {
    const names = ["Finnian", "Crom", "Elara", "Morgath", "Zinnia", "Kaelen", "Runa", "Varis"];
    const roles = ["Merchant", "Sellsword", "Scholar", "Pickpocket", "Innkeeper", "Acolyte"];
    const races = ["Human", "Elf", "Dwarf", "Halfling", "Tiefling", "Dragonborn", "Gnome"];
    const traits = ["Extremely twitchy", "Uses big words incorrectly", "Smells like expensive perfume", "Refuses to make eye contact"];
    const bonds = ["Has a stolen map", "Is a disgraced noble", "Searching for a lost sibling"];
    const flaws = ["Owes money to a dragon", "Is actually a spy", "Terrified of magic"];

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

    onEdit(newNPC);
  };

  // --- 2. THE AI AUTO-FILL (New) ---
const handleAiGen = async () => {
  setIsGenerating(true);
  try {
    const response = await generateAIGent('npc', 'Town DATA_ONLY');
    
    // 1. Define and parse 'data' clearly within the try block
    const data = JSON.parse(response.text);

    // 2. Now 'data' is defined and accessible for the next steps
    const visualPrompt = `${data.race} ${data.role}, ${data.appearance_tags || data.lore}`;
    
    // 3. Call the image generator
    const imgResponse = await generateNPCPortrait(visualPrompt);

    setManualNPC({
      ...manualNPC,
      name: data.name,
      race: data.race,
      role: data.role,
      description: data.lore,
      image: imgResponse.imageUrl
    });
  } catch (error) {
    console.error("Master AI Gen Error:", error);
    // Set a fallback NPC name so the user knows it failed
    setManualNPC({ ...manualNPC, name: "Failed to summon NPC..." });
  } finally {
    setIsGenerating(false);
  }
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

    onEdit(npcToSave);
    setManualNPC({ name: '', role: '', race: '', description: '', id: '' });
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
          {mode === 'view' && (
            <button 
              onClick={quickGen}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-amber-900/20"
            >
              <Sparkles size={14} /> Quick Gen
            </button>
          )}
        </div>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={addManual} className="bg-stone-950/40 p-4 rounded-lg border border-amber-900/10 space-y-4">
          <button
            type="button"
            onClick={handleAiGen}
            disabled={isGenerating}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <><Sparkles size={14} /> AI Auto-Fill Form</>}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Name</label>
              <input className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-base text-stone-200" value={manualNPC.name} onChange={e => setManualNPC({...manualNPC, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-stone-500 font-bold">Role</label>
              <input className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-base text-stone-200" value={manualNPC.role} onChange={e => setManualNPC({...manualNPC, role: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold">Description</label>
            <textarea className="w-full bg-stone-900 border border-stone-800 rounded p-2 text-base text-stone-200 h-24 resize-none" value={manualNPC.description} onChange={e => setManualNPC({...manualNPC, description: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-amber-900/40 text-amber-500 py-3 rounded text-xs font-bold tracking-widest">Save NPC</button>
        </form>
      ) : (
        /* ... gallery mapping code ... */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {npcs.map((npc: any) => (
             <div key={npc.id} className="bg-stone-900/80 border border-amber-900/30 rounded-lg p-4">
               <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded bg-stone-800 overflow-hidden"><img src={npc.image} alt={npc.name} className="w-full h-full object-cover" /></div>
                 <div className="flex-1 ml-3"><h3 className="text-amber-500 font-serif text-lg font-bold">{npc.name}</h3><p className="text-[10px] text-stone-400 uppercase">{npc.race} {npc.role}</p></div>
                 <div className="flex gap-1"><button onClick={() => onStartEdit(npc)}><Edit3 size={14}/></button><button onClick={() => onDelete(npc.id)}><Trash2 size={14}/></button></div>
               </div>
               <p className="text-stone-300 text-sm italic border-t border-amber-900/10 mt-2 pt-2">{npc.description}</p>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NPCManager;