'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Shield, Heart, Info } from 'lucide-react';

const RulesLookup = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("monsters");
  const [results, setResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`https://www.dnd5eapi.co/api/${category}?name=${query}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query, category]);

  const fetchDetails = async (url: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.dnd5eapi.co${url}`);
      const data = await response.json();
      setSelectedItem(data);
    } catch (err) {
      console.error("Detail Error:", err);
    } finally {
      setLoading(false);
    }
  };
// ADD THIS LINE
  return (
    <div className="flex flex-col gap-4 bg-stone-900/40 p-6 rounded-xl border border-amber-900/20 h-full min-h-[500px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl text-amber-500 font-serif flex items-center gap-2">
          <BookOpen size={20} /> Rules Encyclopedia
        </h2>
        <div className="flex bg-stone-800 rounded-lg p-1 border border-stone-700">
          <button 
            onClick={() => setCategory("monsters")}
            className={`px-3 py-1 rounded text-xs transition-all ${category === 'monsters' ? 'bg-amber-700 text-white' : 'text-stone-400'}`}
          >
            Monsters
          </button>
          <button 
            onClick={() => setCategory("spells")}
            className={`px-3 py-1 rounded text-xs transition-all ${category === 'spells' ? 'bg-amber-700 text-white' : 'text-stone-400'}`}
          >
            Spells
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-stone-500" size={16} />
        <input 
          type="text"
          placeholder={`Search ${category}...`}
          className="w-full bg-stone-800 border border-stone-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-600"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* RESULTS LIST */}
        <div className="w-1/3 overflow-y-auto space-y-2 pr-2 custom-scrollbar border-r border-amber-900/10">
          {loading && !selectedItem && <p className="text-xs text-amber-500 animate-pulse">Consulting scrolls...</p>}
          {results.map((item) => (
            <button
              key={item.index}
              onClick={() => fetchDetails(item.url)}
              className="w-full text-left p-2 rounded hover:bg-amber-900/20 text-stone-300 text-sm transition-all"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* DETAIL VIEW */}
        <div className="flex-1 bg-stone-900/60 rounded-lg p-6 overflow-y-auto custom-scrollbar">
          {selectedItem ? (
            <div className="max-w-md mx-auto">
              <div className="border-b-2 border-amber-700/50 pb-2 mb-4">
                <h3 className="text-3xl font-serif text-amber-500 uppercase">{selectedItem.name}</h3>
                <p className="text-sm text-stone-400 italic">
                  {selectedItem.size} {selectedItem.type}{selectedItem.alignment ? `, ${selectedItem.alignment}` : ''}
                </p>
              </div>
              
              {/* MONSTER STATS SECTION (Only shows if it's a creature) */}
              {selectedItem.image && (
  <div className="mb-6 rounded-lg overflow-hidden border-2 border-amber-900/20 shadow-xl bg-stone-950/50 relative group">
    <img 
    src={`https://www.dnd5eapi.co${selectedItem.image}`}
      alt={selectedItem.name}
      className="w-full h-56 object-contain p-2 filter sepia-[.4] grayscale-[.2] group-hover:sepia-0 group-hover:grayscale-0 transition-all duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
  </div>
)}
              {selectedItem.type && (
                <>
                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-amber-900/20 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-stone-500 font-bold">Armor Class</span>
                      <div className="flex items-center gap-2 text-amber-200">
                        <Shield size={16} /> <span className="text-xl font-mono">{selectedItem.armor_class?.[0]?.value || selectedItem.armor_class || '10'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-stone-500 font-bold">Hit Points</span>
                      <div className="flex items-center gap-2 text-rose-500">
                        <Heart size={16} /> <span className="text-xl font-mono">{selectedItem.hit_points}</span>
                        {selectedItem.hit_dice && <span className="text-[10px] text-stone-500 ml-1">({selectedItem.hit_dice})</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-1 text-center py-4 border-b border-amber-900/20 mb-6">
                    {[
                      { label: 'STR', val: selectedItem.strength },
                      { label: 'DEX', val: selectedItem.dexterity },
                      { label: 'CON', val: selectedItem.constitution },
                      { label: 'INT', val: selectedItem.intelligence },
                      { label: 'WIS', val: selectedItem.wisdom },
                      { label: 'CHA', val: selectedItem.charisma },
                    ].map((stat) => {
                      const mod = Math.floor(((stat.val || 10) - 10) / 2);
                      return (
                        <div key={stat.label}>
                          <div className="text-[9px] font-bold text-stone-500 uppercase">{stat.label}</div>
                          <div className="text-stone-100 font-bold">{stat.val || 10}</div>
                          <div className="text-amber-600 text-[10px]">({mod >= 0 ? `+${mod}` : mod})</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* SPELL STATS SECTION (Only shows if it's a spell) */}
              {!selectedItem.type && selectedItem.level !== undefined && (
                <div className="grid grid-cols-2 gap-y-2 text-[11px] mb-6 border-b border-amber-900/20 pb-4">
                  <div className="text-stone-400 uppercase font-bold">Level: <span className="text-amber-500">{selectedItem.level}</span></div>
                  <div className="text-stone-400 uppercase font-bold text-right">Range: <span className="text-amber-500">{selectedItem.range}</span></div>
                  <div className="text-stone-400 uppercase font-bold">Duration: <span className="text-amber-500">{selectedItem.duration}</span></div>
                  <div className="text-stone-400 uppercase font-bold text-right">Time: <span className="text-amber-500">{selectedItem.casting_time}</span></div>
                </div>
              )}

              {/* ACTIONS SECTION */}
              {selectedItem.actions && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-amber-700 font-serif border-b border-amber-900/30 uppercase text-sm tracking-widest font-bold">Actions</h4>
                  {selectedItem.actions.map((action: any, index: number) => (
                    <div key={index}>
                      <p className="text-stone-200 text-sm leading-relaxed">
                        <span className="font-bold italic text-amber-500 mr-2">{action.name}.</span>
                        <span className="text-stone-400">{action.desc}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* DESCRIPTION SECTION */}
              <div className="bg-amber-950/10 p-4 rounded border border-amber-900/20 mb-6">
                <p className="text-sm text-stone-300 leading-relaxed italic">
                  {Array.isArray(selectedItem.desc) ? selectedItem.desc[0] : selectedItem.desc || "No additional archive notes available."}
                </p>
              </div>

              {/* COMBAT BUTTON (Only shows for monsters) */}
              {selectedItem.type && (
                <button 
                  onClick={() => {
                    const event = new CustomEvent('add-to-combat', { detail: selectedItem });
                    window.dispatchEvent(event);
                  }}
                  className="w-full py-2 bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 rounded text-[10px] uppercase font-bold tracking-widest transition-all mb-4"
                >
                  Add to Initiative Tracker
                </button>
              )}

              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full text-[10px] text-stone-600 hover:text-stone-400 underline uppercase tracking-widest"
              >
                Clear lookup
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-700 opacity-40">
              <Info size={48} strokeWidth={1} />
              <p className="text-xs mt-2 font-serif italic">Select an entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesLookup;