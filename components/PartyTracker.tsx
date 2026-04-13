'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Heart, Eye, Trash2, Plus, Minus } from 'lucide-react';

const PartyTracker = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newChar, setNewChar] = useState({ name: '', ac: '', hp: '', pp: '' });

  useEffect(() => {
    const saved = localStorage.getItem('aegis_party');
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  const saveParty = (list: any[]) => {
    setPlayers(list);
    localStorage.setItem('aegis_party', JSON.stringify(list));
  };

  const addPlayer = () => {
    if (!newChar.name) return;
    const player = { 
      ...newChar, 
      id: Date.now(), 
      currentHp: parseInt(newChar.hp) || 0 
    };
    saveParty([...players, player]);
    setNewChar({ name: '', ac: '', hp: '', pp: '' });
    setIsAdding(false);
  };

  const updateHp = (id: number, amount: number) => {
    const newList = players.map(p => {
      if (p.id === id) {
        return { ...p, currentHp: (parseInt(p.currentHp) || 0) + amount };
      }
      return p;
    });
    saveParty(newList);
  };

  const deletePlayer = (id: number) => {
    saveParty(players.filter(p => p.id !== id));
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
          <Users size={16} /> Party Status
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-amber-900/20 rounded text-amber-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {isAdding && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-stone-950/50 rounded-lg border border-amber-900/10 animate-in fade-in zoom-in duration-200">
          <input 
            placeholder="Character Name" 
            className="col-span-3 bg-stone-900 border border-stone-800 p-2 text-sm rounded outline-none focus:border-amber-700 text-stone-200"
            value={newChar.name}
            onChange={e => setNewChar({...newChar, name: e.target.value})}
          />
          <input 
            placeholder="AC" 
            className="bg-stone-900 border border-stone-800 p-2 text-sm rounded outline-none text-stone-200"
            value={newChar.ac}
            onChange={e => setNewChar({...newChar, ac: e.target.value})}
          />
          <input 
            placeholder="Max HP" 
            className="bg-stone-900 border border-stone-800 p-2 text-sm rounded outline-none text-stone-200"
            value={newChar.hp}
            onChange={e => setNewChar({...newChar, hp: e.target.value})}
          />
          <input 
            placeholder="PP" 
            className="bg-stone-900 border border-stone-800 p-2 text-sm rounded outline-none text-stone-200"
            value={newChar.pp}
            onChange={e => setNewChar({...newChar, pp: e.target.value})}
          />
          <button 
            onClick={addPlayer}
            className="col-span-3 bg-amber-700 hover:bg-amber-600 text-white text-[10px] py-2 rounded font-bold uppercase tracking-widest transition-colors mt-1"
          >
            Add to Party
          </button>
        </div>
      )}

      <div className="space-y-3">
        {players.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-stone-950/30 p-4 rounded border border-stone-800/50 group hover:border-amber-900/20 transition-all">
            <div className="flex flex-col">
              <span className="font-serif text-amber-200 text-xl leading-tight">{p.name}</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-amber-600/80">
                  <Shield size={14} /> <span className="font-mono font-bold">AC {p.ac || '10'}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-sky-600/80">
                  <Eye size={14} /> <span className="font-mono font-bold">PP {p.pp || '10'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-stone-900/80 rounded-lg px-3 py-2 border border-stone-800">
                <button 
                  onClick={() => updateHp(p.id, -1)}
                  className="text-stone-500 hover:text-rose-500 transition-colors"
                >
                  <Minus size={16} />
                </button>
                
                <div className="flex items-center gap-1 min-w-[45px] justify-center">
                  <Heart size={16} className="text-rose-600" />
                  <span className={`text-xl font-mono font-bold ${p.currentHp <= 5 ? 'text-rose-500 animate-pulse' : 'text-stone-300'}`}>
                    {p.currentHp}
                  </span>
                </div>

                <button 
                  onClick={() => updateHp(p.id, 1)}
                  className="text-stone-500 hover:text-emerald-500 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => deletePlayer(p.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-700 hover:text-rose-900 transition-all p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {players.length === 0 && !isAdding && (
          <div className="py-10 flex flex-col items-center justify-center opacity-20">
            <Users size={48} strokeWidth={1} />
            <p className="text-xs uppercase tracking-[0.2em] mt-2">Party is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyTracker;