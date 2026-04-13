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
                  {selectedItem.size} {selectedItem.type}, {selectedItem.alignment}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-amber-900/10 mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-500 font-bold">Armor Class</span>
                  <div className="flex items-center gap-2 text-amber-200">
                    <Shield size={16} /> <span className="text-xl font-mono">{selectedItem.armor_class?.[0]?.value || '10'}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-500 font-bold">Hit Points</span>
                  <div className="flex items-center gap-2 text-rose-500">
                    <Heart size={16} /> <span className="text-xl font-mono">{selectedItem.hit_points}</span>
                  </div>
                </div>
              </div>
<button 
  onClick={() => {
    const event = new CustomEvent('add-to-combat', { detail: selectedItem });
    window.dispatchEvent(event);
  }}
  className="w-full mt-4 py-2 bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 rounded text-[10px] uppercase font-bold tracking-widest transition-all"
>
  Add to Initiative Tracker
</button>
              <div className="bg-amber-950/10 p-4 rounded border border-amber-900/20">
                <p className="text-sm text-stone-300 leading-relaxed italic">
                  {Array.isArray(selectedItem.desc) ? selectedItem.desc[0] : selectedItem.desc || "No additional description available."}
                </p>
              </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="mt-6 text-[10px] text-stone-600 hover:text-stone-400 underline uppercase tracking-widest"
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