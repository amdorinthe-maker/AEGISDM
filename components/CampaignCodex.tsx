'use client';

import React from 'react';
import { Map, Plus, BookOpen, Trash2, Edit3 } from 'lucide-react';

interface CampaignCodexProps {
  locations: any[];
  onAddClick: () => void;
  onViewLore: (location: any) => void;
  onDelete: (id: string) => void;
  onEdit: (location: any) => void;

}

export default function CampaignCodex({ locations, onAddClick, onViewLore, onDelete, onEdit }: CampaignCodexProps) {
  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl flex flex-col min-h-[400px]">
      {/* Header Area */}
      <div className="flex items-center justify-between p-4 border-b border-amber-900/20">
        <h2 className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-widest font-bold">
          <Map size={14} /> World Map & Locations
        </h2>
        <button 
          onClick={onAddClick}
          className="p-1 hover:bg-amber-900/20 rounded-full text-amber-600 transition-colors"
          title="Map New Location"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List Area */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
        {locations.map((loc) => (
          <div 
            key={loc.id} 
            className="group relative bg-stone-950/50 border border-amber-900/10 p-3 rounded-lg hover:border-amber-600/40 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-stone-200 font-serif text-sm font-bold group-hover:text-amber-500 transition-colors">
                  {loc.name}
                </h3>
                <span className="text-[12px] text-stone-300 uppercase tracking-tighter">
                  Population: {loc.population}
                </span>
              </div>
<div className="flex gap-1">
  <button 
    onClick={() => onEdit(loc)}
    className="p-1.5 bg-stone-800 text-stone-400 hover:text-amber-500 rounded transition-colors"
    title="Edit"
  >
    <Edit3 size={12} />
  </button>
  <button 
    onClick={() => { if(confirm('Delete this location?')) onDelete(loc.id) }}
    className="p-1.5 bg-stone-800 text-stone-400 hover:text-red-500 rounded transition-colors"
  >
    <Trash2 size={12} />
  </button></div>
              <button 
                onClick={() => onViewLore(loc)}
                className="flex items-center gap-1 text-[9px] bg-amber-900/20 text-amber-500 border border-amber-900/40 px-2 py-1 rounded hover:bg-amber-600 hover:text-stone-950 transition-all font-bold uppercase"
              >
                <BookOpen size={10} /> View Lore
              </button>
            </div>

            <p className="text-stone-400 text-[11px] italic leading-tight line-clamp-2">
              {loc.shortDesc}
            </p>
          </div>
        ))}

        {locations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-stone-700 text-xs italic">No locations mapped. Click the (+) to begin.</p>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="mt-auto px-4 py-2 border-t border-amber-900/10 text-[9px] text-stone-600 italic">
        Select a location to reveal its secrets in the Lore tab.
      </div>
    </div>
  );
}