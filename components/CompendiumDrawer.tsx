import React, { useState } from 'react';
import { COMPENDIUM_DATA } from './CompendiumData';

export default function CompendiumDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Track which card is expanded

  const tabs = ["All", "Action", "Condition", "Object", "Cover"];

  const filtered = COMPENDIUM_DATA.filter(item => 
    (activeTab === "All" || item.cat === activeTab) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || 
     item.effect.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-[550px] bg-stone-950 border-l border-amber-900/40 shadow-2xl z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          <div className="p-6 bg-stone-900/50 border-b border-amber-900/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-amber-600 font-serif text-2xl italic tracking-tighter uppercase">Saga Archive</h2>
              <button onClick={onClose} className="text-stone-500 hover:text-amber-500 transition-colors">✕</button>
            </div>

            <input 
              type="text"
              placeholder="Filter by keyword..."
              className="w-full bg-stone-950 border border-stone-800 p-3 rounded text-stone-300 focus:outline-none focus:border-amber-700 font-serif italic text-xl mb-4"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedItem(null); // Reset expansion on search
              }}
            />

            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedItem(null);
                  }}
                  className={`px-4 py-1.5 rounded text-[11px] uppercase font-bold tracking-widest border transition-all ${activeTab === tab ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'bg-stone-900 border-stone-800 text-stone-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((item, idx) => {
                const isExpanded = selectedItem === item.name;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItem(isExpanded ? null : item.name)}
                    className={`group relative p-4 bg-stone-900/40 border transition-all cursor-pointer select-none
                      ${isExpanded 
                        ? 'col-span-2 border-amber-600/50 bg-stone-900/80 shadow-lg' 
                        : 'border-stone-800 hover:border-sky-900/50 hover:bg-stone-900/60'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] text-amber-800 font-mono uppercase tracking-widest">{item.cat}</span>
                      {isExpanded && <span className="text-amber-600 text-[14px]">▼</span>}
                    </div>
                    <h4 className={`font-bold uppercase tracking-wide transition-colors
                      ${isExpanded ? 'text-amber-500 text-sm' : 'text-sky-600 text-[12px]'}`}>
                      {item.name}
                    </h4>
                    <p className={`mt-2 text-stone-400 font-serif italic leading-relaxed
                      ${isExpanded ? 'text-medium' : 'text-[12px] line-clamp-2'}`}>
                      {item.effect}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}