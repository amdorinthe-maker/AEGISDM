'use client';

import React, { useState } from 'react';
import { ChevronDown, Scroll, ShieldAlert, User } from 'lucide-react';

interface NPC {
  id: number;
  name: string;
  race: string;
  role: string;
  lore: string;
  appearance_tags: string;
  image?: string; // Added this so the component recognizes the image
  status?: string;
}

const NPCCard = ({ npc, onDelete, onToggleStatus }: { npc: NPC, onDelete: (id: number) => void, onToggleStatus: (id:number) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`group bg-stone-950/40 border transition-all duration-300 rounded-xl overflow-hidden ${
        isExpanded ? 'border-amber-600/50 ring-1 ring-amber-900/20 shadow-2xl' : 'border-amber-900/20 hover:border-amber-700/40'
      }`}
    >
{/* HEADER SECTION */}
<div 
  onClick={() => setIsExpanded(!isExpanded)}
  className="p-4 cursor-pointer flex justify-between items-start gap-4"
>
  {/* THE IMAGE SLOT */}
  <div className="w-12 h-12 rounded bg-stone-900 overflow-hidden border border-amber-900/20 flex-shrink-0">
    {npc.image ? (
      <img src={npc.image} alt={npc.name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-amber-900">
        <User size={24} />
      </div>
    )}
  </div>

  {/* NAME, ROLE, AND STATUS */}
  <div className="flex-1">
    <div className="flex flex-wrap items-center gap-2">
      <h3 className="font-serif text-xl text-amber-100 leading-tight">
        {npc.name}
      </h3>
      
      {/* ALIVE/DEAD TOGGLE */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          // Assuming your parent has an onToggleStatus function
          onToggleStatus?.(npc.id); 
        }}
        className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter transition-colors ${
          npc.status === 'dead' 
            ? 'bg-rose-950/40 text-rose-500 border-rose-900/50' 
            : 'bg-emerald-950/40 text-emerald-500 border-emerald-900/50'
        }`}
      >
        {npc.status === 'dead' ? '💀 Deceased' : '🛡️ Alive'}
      </button>

      <span className="text-[10px] bg-amber-900/20 text-amber-500 px-2 py-0.5 rounded border border-amber-900/30 font-bold uppercase">
        {npc.race}
      </span>
    </div>
    <p className="text-stone-500 text-xs uppercase tracking-widest font-bold mt-1">
      {npc.role}
    </p>
  </div>

  <div className={`text-amber-900 group-hover:text-amber-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
    <ChevronDown size={20} />
  </div>
</div>

      {/* QUICK TAGS (Always Visible) */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {npc.appearance_tags?.split(',').map((tag: string, index: number) => (
          <span key={index} className="flex items-center gap-1 text-[9px] text-stone-400 bg-stone-900/50 px-2 py-1 rounded border border-stone-800">
            <div className="w-1 h-1 rounded-full bg-amber-700" />
            {tag.trim()}
          </span>
        ))}
      </div>

      {/* EXPANDABLE LORE SECTION */}
      {isExpanded && (
        <div className="px-4 pb-6 pt-2 border-t border-amber-900/10 bg-stone-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-700 font-bold mb-2 flex items-center gap-2">
                <Scroll size={12} /> The Legend
              </h4>
              <p className="text-stone-300 font-serif italic text-sm leading-relaxed border-l-2 border-amber-900/30 pl-4">
                {npc.lore}
              </p>
            </div>

            {/* BANISH BUTTON */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDelete(npc.id);
                }}
                className="text-[10px] uppercase tracking-widest text-rose-900 hover:text-rose-600 font-bold transition-colors flex items-center gap-1"
              >
                <ShieldAlert size={12} /> Banish from Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NPCCard;