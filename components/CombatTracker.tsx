'use client';

import React, { useState, useEffect } from 'react';
import { Swords, Shield, Heart, Trash2, Plus, UserPlus, Dices } from 'lucide-react';

const CombatTracker = ({ npcs = [] }: { npcs: any[] }) => {
  const [combatants, setCombatants] = useState<any[]>([]);
  const [turn, setTurn] = useState(0);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const syncLock = React.useRef(false);
  const CONDITIONS = [
  { name: 'Concentrating', color: 'bg-blue-500', icon: '✨' },
  { name: 'Prone', color: 'bg-stone-500', icon: '🏹' },
  { name: 'Stunned', color: 'bg-yellow-500', icon: '🌀' },
  { name: 'Poisoned', color: 'bg-emerald-500', icon: '🤢' },
  { name: 'Frightened', color: 'bg-purple-500', icon: '😨' },
  { name: 'Blessed', color: 'bg-amber-400', icon: '🙏' },
];
const toggleStatus = (id: any, conditionName: string) => {
  setCombatants(prev => prev.map(c => {
    if (c.id === id) {
      const currentStatuses = c.statuses || [];
      const hasStatus = currentStatuses.includes(conditionName);
      return {
        ...c,
        statuses: hasStatus 
          ? currentStatuses.filter((s:string) => s !== conditionName) 
          : [...currentStatuses, conditionName]
      };
    }
    return c;
  }));
};
  // --- SYNC LOGIC ---
  const syncFromVault = () => {
    if (syncLock.current) return;
    const campaignName = localStorage.getItem('aegis_campaign_name') || "New Saga";
    const savedParty = localStorage.getItem(`aegis_party_${campaignName}`);
    if (!savedParty) return;
    const party = JSON.parse(savedParty);

    setCombatants(prev => {
      if (prev.length === 0) {
        return party.map((p: any) => ({
          id: `pc-${p.id}`,
          name: p.name,
          init: 0,
          hp: p.currentHp || 0,
          ac: p.ac || 10,
          dex: p.dex || 10,
          type: 'Player'
        }));
      }
      return prev.map(c => {
        if (c.type === 'Player') {
          const playerId = c.id.replace('pc-', '');
          const masterData = party.find((p: any) => p.id.toString() === playerId);
          if (masterData && (masterData.currentHp !== c.hp || masterData.ac !== c.ac)) {
            return { ...c, hp: masterData.currentHp, ac: masterData.ac };
          }
        }
        return c;
      });
    });
  };

  useEffect(() => {
    syncFromVault();
    window.addEventListener('party-updated', syncFromVault);
    window.addEventListener('campaign-updated', () => { setCombatants([]); syncFromVault(); });
    return () => {
      window.removeEventListener('party-updated', syncFromVault);
      window.removeEventListener('campaign-updated', syncFromVault);
    };
  }, []);

  // --- ACTIONS ---
  const adjustHp = (id: any, amount: number) => {
    syncLock.current = true;
    setCombatants(prev => {
      const target = prev.find(c => c.id === id);
      if (!target) return prev;
      const newHp = (parseInt(target.hp) || 0) + amount;

      if (target.type === 'Player') {
        const campaignName = localStorage.getItem('aegis_campaign_name') || "New Saga";
        const savedParty = localStorage.getItem(`aegis_party_${campaignName}`);
        if (savedParty) {
          const partyData = JSON.parse(savedParty);
          const updatedMasterParty = partyData.map((p: any) => 
            p.id.toString() === id.replace('pc-', '') ? { ...p, currentHp: newHp } : p
          );
          localStorage.setItem(`aegis_party_${campaignName}`, JSON.stringify(updatedMasterParty));
          
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event('party-updated'));
          });
        }
      }
      return prev.map(c => c.id === id ? { ...c, hp: newHp } : c);
    });
    setTimeout(() => { syncLock.current = false; }, 100);
  };

  const rollAllInitiative = () => {
    setCombatants(prev => prev.map(c => {
      if (c.init !== 0) return c;
      const mod = Math.floor(((parseInt(c.dex) || 10) - 10) / 2);
      return { ...c, init: (Math.floor(Math.random() * 20) + 1) + mod };
    }));
  };

  const addNpcToCombat = (npc: any) => {
    setCombatants(prev => [...prev, {
      id: `npc-${Date.now()}`,
      name: npc.name,
      init: 0,
      hp: npc.hp || 10,
      ac: npc.ac || 10,
      dex: npc.dex || 10,
      type: 'NPC'
    }]);
    setIsVaultOpen(false);
  };

  const addEmptyEnemy = () => {
    setCombatants(prev => [...prev, { 
      id: `manual-${Date.now()}`, name: "New Monster", init: 0, hp: 10, ac: 10, dex: 10, type: 'Monster' 
    }]);
  };

  const clearCombat = () => {
    if (window.confirm("End encounter? This removes NPCs and Monsters but keeps Players.")) {
      setCombatants(prev => prev.filter(c => c.type === 'Player').map(p => ({...p, init: 0})));
      setTurn(0);
    }
  };
  useEffect(() => {
  const handleExternalAdd = (e: any) => {
    const monster = e.detail;
    
    // We format the API data to match your combatant structure
    const newMonster = {
      id: `api-${monster.index}-${Date.now()}`, // Unique ID
      name: monster.name,
      init: 0,
      // API uses 'hit_points', your tracker uses 'hp'
      hp: monster.hit_points || 10, 
      // API uses 'armor_class', usually an array or number
      ac: Array.isArray(monster.armor_class) ? monster.armor_class[0].value : (monster.armor_class || 10),
      dex: monster.dexterity || 10,
      type: 'Monster'
    };

    setCombatants(prev => [...prev, newMonster]);
  };

  // Listen for that specific "Add to Combat" button click
  window.addEventListener('add-to-combat', handleExternalAdd);
  
  return () => window.removeEventListener('add-to-combat', handleExternalAdd);
}, []);

  const sortedList = [...combatants].sort((a, b) => b.init - a.init || b.dex - a.dex);
  
  // Turn Logic Helpers
  const currentActor = sortedList[turn];
  const nextActor = sortedList[(turn + 1) % (sortedList.length || 1)];

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-4 flex flex-col relative min-h-[450px]">
      <div className="shrink-0 space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
            <Swords size={16} /> Combat Tracking
          </h2>
          <div className="flex gap-2">
            <button onClick={rollAllInitiative} className="p-1 bg-amber-900/20 hover:bg-amber-900/40 text-amber-500 rounded px-2 text-[10px] font-bold uppercase border border-amber-900/30">
              🎲 Roll New
            </button>
            <button onClick={() => setIsVaultOpen(!isVaultOpen)} className={`p-1 rounded transition-colors ${isVaultOpen ? 'bg-amber-600 text-stone-900' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>
              <UserPlus size={16} />
            </button>
            <button onClick={addEmptyEnemy} className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded">
              <Plus size={16} />
            </button>
            <button onClick={clearCombat} className="p-1 hover:text-rose-500 text-stone-600 transition-colors" title="Clear Combat">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isVaultOpen && (
          <div className="absolute top-14 right-4 w-52 bg-stone-900 border-2 border-amber-900/40 rounded shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
            <div className="p-2 text-[10px] text-amber-700 font-bold uppercase border-b border-amber-900/20 bg-stone-950 sticky top-0">Encounter Vault</div>
            {npcs.length > 0 ? npcs.map(npc => (
              <button key={npc.id} onClick={() => addNpcToCombat(npc)} className="w-full text-left p-3 text-xs text-stone-300 hover:bg-amber-900/20 border-b border-stone-800/50">
                {npc.name}
              </button>
            )) : <div className="p-4 text-[10px] text-stone-600 italic">No NPCs in this saga.</div>}
          </div>
        )}

        <button onClick={() => setTurn((turn + 1) % (sortedList.length || 1))} className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded shadow-lg transition-transform active:scale-[0.98]">
          Next Turn
        </button>

        {/* RESTORED: Acting/On Deck Callout */}
        {sortedList.length > 0 && (
          <div className="flex justify-between items-center px-3 py-2 bg-stone-950/60 border border-amber-900/10 rounded-lg shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-stone-500 font-bold tracking-tighter">Acting</span>
              <span className="text-xs font-serif text-amber-200 truncate max-w-[100px]">
                {currentActor?.name || "..."}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-stone-800 mx-2" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase text-amber-900 font-bold italic tracking-tighter">On Deck</span>
              <span className="text-xs font-serif text-stone-400 truncate max-w-[100px]">
                {sortedList.length > 1 ? nextActor?.name : "—"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
        {sortedList.map((c, idx) => (
          <div key={c.id} className={`p-3 rounded-lg border transition-all ${turn === idx ? 'bg-amber-950/30 border-amber-600 ring-1 ring-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.1)]' : 'bg-stone-950/40 border-stone-800'}`}>
            <div className="flex items-center gap-3">
              <input 
          type="number"
          value={c.init}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setCombatants(prev => prev.map(item => 
              item.id === c.id ? { ...item, init: val } : item
            ));
          }}
          className="w-10 bg-transparent text-center text-amber-500 font-mono text-xl font-bold outline-none focus:bg-amber-900/20 rounded transition-colors"
        />  
{/* 2. THE NAME & STATUS BLOCK */}
<div className="flex-1 min-w-0"> {/* min-w-0 prevents text overflow */}
  <div className="flex items-center gap-2 mb-1">
    <div className={`text-sm md:text-md font-serif truncate ${c.type === 'Player' ? 'text-amber-100' : 'text-rose-400'}`}>
      {c.name}
    </div>
    
    {/* Status Badges - Now with a bit of margin */}
    <div className="flex gap-1 flex-wrap">
      {c.statuses?.map(statusName => {
        const config = CONDITIONS.find(con => con.name === statusName);
        return (
          <span 
            key={statusName} 
            title={statusName} 
            className={`text-[9px] px-1.5 py-0.5 rounded-sm ${config?.color} text-white font-bold animate-in zoom-in-50`}
          >
            {config?.icon}
          </span>
        );
      })}
    </div>
  </div>

  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
    <div className="text-[10px] text-stone-500 font-bold uppercase flex gap-2">
      <span>AC {c.ac}</span> 
      <span>DEX {c.dex}</span>
    </div>

    {/* The Dropdown - Styled to look like a small "Tag" */}
    <select 
      className="bg-stone-800/50 text-amber-600/80 border border-amber-900/20 rounded px-1 h-5 text-[9px] uppercase font-bold cursor-pointer hover:bg-stone-800 hover:text-amber-500 transition-all outline-none"
      onChange={(e) => {
        if (e.target.value) toggleStatus(c.id, e.target.value);
        e.target.value = ""; 
      }}
    >
      <option value="" className="text-stone-500">+ Effect</option>
      {CONDITIONS.map(con => (
        <option key={con.name} value={con.name} className="bg-stone-900 text-amber-500">
          {con.icon} {con.name}
        </option>
      ))}
    </select>
  </div>
</div>
              <div className="flex items-center gap-2 bg-stone-900 rounded px-2 py-1 border border-stone-800 shadow-inner">
                <button onClick={() => adjustHp(c.id, -1)} className="text-stone-500 hover:text-rose-500 px-1 transition-colors">-</button>
                <span className="text-sm font-mono font-bold w-4 text-center text-stone-200">{c.hp}</span>
                <button onClick={() => adjustHp(c.id, 1)} className="text-stone-500 hover:text-emerald-500 px-1 transition-colors">+</button>
              </div>
              <button onClick={() => setCombatants(prev => prev.filter(item => item.id !== c.id))} className="text-stone-700 hover:text-rose-900 ml-1 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatTracker;