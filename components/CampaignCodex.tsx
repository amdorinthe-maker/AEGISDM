'use client';

import React, { useState, useEffect } from 'react';
import { Scroll, Map, Users, Quote } from 'lucide-react';

const CampaignCodex = () => {
  const [activeTab, setActiveTab] = useState('lore');
  const [data, setData] = useState({
    lore: "",
    factions: "",
    locations: ""
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aegis_codex');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handleChange = (val: string) => {
    const newData = { ...data, [activeTab]: val };
    setData(newData);
    localStorage.setItem('aegis_codex', JSON.stringify(newData));
  };

  const tabs = [
    { id: 'lore', label: 'World Lore', icon: <Scroll size={14} /> },
    { id: 'factions', label: 'Factions', icon: <Users size={14} /> },
    { id: 'locations', label: 'Locations', icon: <Map size={14} /> }
  ];

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl flex flex-col h-[300px]">
      <div className="flex border-b border-amber-900/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-amber-900/20 text-amber-500 border-b border-amber-500' 
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1">
        <textarea
          className="w-full h-full bg-transparent text-stone-300 font-serif leading-relaxed focus:outline-none resize-none placeholder:text-stone-800 italic"
          placeholder={`Record your campaign's ${activeTab} here...`}
          value={data[activeTab as keyof typeof data]}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      
      <div className="px-4 py-2 border-t border-amber-900/10 flex justify-between items-center text-[9px] text-stone-600 italic">
        <span className="flex items-center gap-1"><Quote size={10} /> Knowledge is the best armor.</span>
        <span>Auto-saved to archives</span>
      </div>
    </div>
  );
};

export default CampaignCodex;