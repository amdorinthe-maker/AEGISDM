'use client';

import React, { useState, useEffect } from 'react';
import { Swords, Shield, Heart, Trash2, ChevronRight, Plus } from 'lucide-react';

const CombatTracker = () => {
  const [combatants, setCombatants] = useState<any[]>([]);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    // 1. Sync Party
    const savedParty = localStorage.getItem('aegis_party');
    if (savedParty) {
      const party = JSON.parse(savedParty);
      setCombatants(prev => {
        const existingIds = prev.map(c => c.id);
        const newParty = party
          .filter((p: any) => !existingIds.includes(p.id))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            init: 0,
            hp: p.currentHp,
            ac: p.ac,
            type: 'player'
          }));
        return [...prev, ...newParty];
      });
    }

    // 2. Listen for "Send to Combat" from Encyclopedia
    const handleAddMonster = (e: any) => {
      const monster = e.detail;
      const newEnemy = {
        id: Date.now(),
        name: monster.name,
        init: 0,
        hp: monster.hit_points,
        ac: monster.armor_class?.[0]?.value || 10,
        type: 'enemy'
      };
      setCombatants(prev => [...prev, newEnemy]);
    };

    window.addEventListener('add-to-combat', handleAddMonster);
    return () => window.removeEventListener('add-to-combat', handleAddMonster);
  }, []);

  const addEmptyEnemy = () => {
    const newEnemy = {
      id: Date.now(),
      name: "New Enemy",
      init: 0,
      hp: 10,
      ac: 10,
      type: 'enemy'
    };
    setCombatants([...combatants, newEnemy]);
  };

  const updateStat = (id: number, field: string, val: any) => {
    setCombatants(combatants.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const adjustHp = (id: number, amount: number) => {
    setCombatants(combatants.map(c => c.id === id ? { ...c, hp: (parseInt(c.hp) || 0) + amount } : c));
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-4 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
          <Swords size={16} /> Combat Initiative
        </h2>
        <button onClick={addEmptyEnemy} className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
        {combatants.sort((a,b) => b.init - a.init).map((c, idx) => (
          <div key={c.id} className={`p-3 rounded-lg border transition-all ${turn === idx ? 'bg-amber-950/20 border-amber-600 ring-1 ring-amber-600' : 'bg-stone-950/40 border-stone-800'}`}>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                className="w-12 bg-stone-900 text-center text-amber-500 font-mono font-bold rounded border border-amber-900/20 p-1 text-lg"
                value={c.init}
                onChange={(e) => updateStat(c.id, 'init', parseInt(e.target.value) || 0)}
              />
              
              <div className="flex-1">
                <input 
                  className={`bg-transparent border-none focus:ring-0 p-0 font-serif text-lg w-full ${c.type === 'player' ? 'text-amber-100' : 'text-rose-400'}`}
                  value={c.name}
                  onChange={(e) => updateStat(c.id, 'name', e.target.value)}
                />
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1 text-[10px] text-stone-500 uppercase font-bold">
                    <Shield size={10} /> 
                    <input 
                      className="bg-transparent w-6 text-stone-300 focus:outline-none" 
                      value={c.ac} 
                      onChange={(e) => updateStat(c.id, 'ac', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-stone-900 rounded px-2 py-1 border border-stone-800">
                <button onClick={() => adjustHp(c.id, -1)} className="text-stone-500 hover:text-rose-500">-</button>
                <div className="flex items-center gap-1 min-w-[30px] justify-center">
                  <Heart size={12} className="text-rose-600" />
                  <span className="text-sm font-mono font-bold text-stone-200">{c.hp}</span>
                </div>
                <button onClick={() => adjustHp(c.id, 1)} className="text-stone-500 hover:text-emerald-500">+</button>
              </div>

              <button onClick={() => setCombatants(combatants.filter(item => item.id !== c.id))} className="text-stone-700 hover:text-rose-900 ml-2">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => setTurn((turn + 1) % combatants.length)}
        className="mt-4 w-full py-3 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded shadow-lg transition-all"
      >
        Next Turn
      </button>
    </div>
  );
};

export default CombatTracker;