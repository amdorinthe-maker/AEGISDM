'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles, Trash2, Edit3, User, Loader2 } from 'lucide-react';
import { generateAIGent, generateNPCPortrait } from '@/app/actions';
import NPCCard from './NPCCard';

const NPCManager = ({ npcs = [], onDelete, onEdit, npcToEdit, onStartEdit, onToggleStatus }: any) => {
  const [mode, setMode] = useState<'view' | 'manual'>('view');
  const [manualNPC, setManualNPC] = useState({ name: '', role: '', race: '', description: '', id: '', image: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  // Listen for campaign changes just to update the UI labels
  useEffect(() => {
    const updateLabel = () => {
      setCampaignName(localStorage.getItem('aegis_campaign_name') || "New Saga");
    };
    updateLabel();
    window.addEventListener('campaign-updated', updateLabel);
    return () => window.removeEventListener('campaign-updated', updateLabel);
  }, []);

  useEffect(() => {
    if (npcToEdit) {
      setManualNPC(npcToEdit);
      setMode('manual');
    }
  }, [npcToEdit]);

  // --- 1. THE INSTANT LIST GENERATOR ---
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

  // --- 2. THE AI AUTO-FILL ---
  const handleAiGen = async () => {
    setIsGenerating(true);
    try {
      const response = await generateAIGent('npc', 'Town DATA_ONLY');
      const data = JSON.parse(response.text);
      const visualPrompt = `${data.race} ${data.role}, ${data.appearance_tags || data.lore}`;
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
      image: manualNPC.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${manualNPC.name}`
    };

    onEdit(npcToSave);
    setManualNPC({ name: '', role: '', race: '', description: '', id: '', image: '' });
    setMode('view');
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-6 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-xl text-amber-500 font-serif flex items-center gap-2">
            <User size={20} /> NPC Vault
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-stone-500 font-bold ml-7">
                Saga: {campaignName}
            </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
                setMode(mode === 'manual' ? 'view' : 'manual');
                if (mode === 'manual') setManualNPC({ name: '', role: '', race: '', description: '', id: '', image: '' });
            }}
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
          <button type="submit" className="w-full bg-amber-900/40 text-amber-500 py-3 rounded text-xs font-bold tracking-widest hover:bg-amber-900/60 transition-colors">
            {manualNPC.id ? 'Update NPC' : 'Save NPC'}
          </button>
        </form>
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
  {npcs.length > 0 ? (
    npcs.map((npc: any) => (
      <NPCCard 
        key={npc.id} 
        npc={{
          ...npc,
          // Mapping your existing 'description' to the 'lore' field the card expects
          lore: npc.description, 
          image: npc.image,
          // If your AI generated tags aren't a string yet, we default to an empty string
          appearance_tags: npc.appearance_tags || "" 
        }} 
        onDelete={onDelete} 
        onToggleStatus={onToggleStatus}
      />
    ))
    
  ) : (
    <div className="col-span-2 py-10 text-center text-stone-600 italic text-sm border-2 border-dashed border-stone-800 rounded-xl">
      No NPCs found in {campaignName}. Use Quick Gen to populate the town.
    </div>
  )}
</div>
      )}
    </div>
  );
};

export default NPCManager;