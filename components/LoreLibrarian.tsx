'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Upload, Edit3, Save, X } from 'lucide-react';

const processTrelloLore = (rawData: any) => {
  if (!rawData.lists || !rawData.cards) return [];
  const listMap: Record<string, string> = {};
  rawData.lists.forEach((list: any) => { listMap[list.id] = list.name; });

  return rawData.cards
    .map((card: any) => ({
      id: card.id, // Keep the Trello ID for unique keys
      name: card.name,
      category: listMap[card.idList],
      description: card.desc,
      labels: card.labels?.map((l: any) => l.name) || []
    }))
    .filter((entry: any) => entry.description.trim() !== "");
};


export default function LoreLibrarian({ 
  data, 
  campaignName, 
  onCampaignChange,
  onClearLibrary 
}: { 
  data: any[], 
  campaignName: string, 
  onCampaignChange: (name: string, newData: any[]) => void,
  onClearLibrary: () => void 
}) {
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState('');

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const rawJson = JSON.parse(e.target?.result as string);
      const cleaned = processTrelloLore(rawJson);

      // 1. SAVE TO THE CURRENT CAMPAIGN ONLY
      // Instead of using 'newName' from the JSON, we use the 'campaignName' 
      // already passed into this component as a prop.
      localStorage.setItem(`aegis_lore_${campaignName}`, JSON.stringify(cleaned));

      // 2. TRIGGER SYNC WITHOUT CHANGING THE NAME
      // We pass the SAME campaignName back up, so the header doesn't move.
      onCampaignChange(campaignName, cleaned);

      event.target.value = ""; 
    } catch (err) {
      alert("Invalid Trello JSON.");
    }
  };
  reader.readAsText(file);
};

  const filteredLore = data.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  // 1. Helper to start editing
  const startEditing = (entry: any) => {
    setEditingId(entry.id);
    setEditBuffer(entry.description);
  };

  // 2. Helper to save edits
  const saveEdit = (id: string) => {
    // Create a new array with the updated entry
    const updatedData = data.map(item => 
      item.id === id ? { ...item, description: editBuffer } : item
    );
const storageKey = `aegis_lore_${campaignName}`;
    // Update LocalStorage so the edit persists on refresh
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    // PUSH the update to the parent (page.tsx)
    // We pass the current campaignName and the brand new data array
    onCampaignChange(campaignName, updatedData);

    // Close the edit UI
    setEditingId(null);
  };

  
  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-6 font-serif h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-amber-900/10 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-amber-500 text-sm uppercase tracking-[0.3em] font-bold flex items-center gap-3">
            <BookOpen size={18} /> {campaignName}
          </h2>
          <label className="flex items-center gap-2 text-[10px] text-stone-500 hover:text-amber-600 cursor-pointer transition-colors">
            <Upload size={12} />
            <span>Switch Campaign JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
            {/* NEW CLEAR BUTTON */}
<button 
  onClick={onClearLibrary} // Call the prop directly
  className="flex items-center gap-1 text-[10px] text-red-900 hover:text-red-600 cursor-pointer transition-colors"
>
  <X size={12} />
  <span>Clear Library</span>
</button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-stone-600" size={14} />
          <input 
            type="text"
            placeholder="Search archive..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-stone-950 border border-amber-900/20 rounded-full py-2 pl-9 pr-4 text-xs text-amber-100 outline-none focus:border-amber-500 w-64 transition-all"
          />
        </div>
      </div>

      {/* LORE LIST */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {filteredLore.map((entry, index) => (
            <div 
            key={`${entry.id}-${index}`} 
            className="bg-stone-950/40 border border-amber-900/5 p-4 rounded-lg group relative"
    >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-amber-600 font-bold text-lg inline-block mr-3">{entry.name}</h3>
                <span className="text-[10px] text-stone-600 uppercase font-black bg-stone-900 px-2 py-0.5 rounded">
                  {entry.category}
                </span>
              </div>
              
              {editingId !== entry.id && (
                <button onClick={() => startEditing(entry)} className="text-stone-600 hover:text-amber-500 transition-colors">
                  <Edit3 size={14} />
                </button>
              )}
            </div>

            {editingId === entry.id ? (
              <div className="space-y-3">
                <textarea 
                  value={editBuffer}
                  onChange={(e) => setEditBuffer(e.target.value)}
                  className="w-full bg-stone-900 border border-amber-900/40 rounded p-3 text-sm text-stone-300 font-serif focus:outline-none focus:border-amber-500 min-h-[150px]"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-[10px] uppercase font-bold text-stone-500 hover:text-stone-300">
                    <X size={12} /> Cancel
                  </button>
                  <button onClick={() => saveEdit(entry.id)} className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 hover:text-amber-400">
                    <Save size={12} /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-stone-300 text-sm leading-relaxed font-serif whitespace-pre-wrap opacity-90">
                {entry.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}