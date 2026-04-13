import React, { useState } from 'react';
import { Sparkles, Coins, Map, Dice6, Box, Sword } from 'lucide-react';

const GeneratorHub = () => {
  const [result, setResult] = useState<any>(null);
  const [type, setType] = useState('encounter'); // encounter or loot

  const environments = ["Forest", "Dungeon", "Urban", "Arctic", "Underdark"];
  const lootTiers = ["Low (CR 0-4)", "Mid (CR 5-10)", "High (CR 11+)"];

  const encounters = {
    Forest: ["2x Dire Wolves tracking the scent of the party", "A lonely Dryad offering a riddle for safe passage", "An Owlbear protecting its nest"],
    Dungeon: ["A Gelatinous Cube hidden in a 10ft hallway", "3x Skeleton archers behind a barricade", "A mysterious puzzle door that requires a blood sacrifice"],
    Urban: ["A group of pickpockets (Thieves) targeting the wealthiest player", "A frantic noble claiming they are being followed", "A street performance that is actually a distraction for a heist"],
    Arctic: ["A Winter Wolf howling in the blizzard", "A frozen explorer with a journal clutched in their hand", "An Ice Mephit playing pranks"],
    Underdark: ["A Grick hiding on the ceiling", "A colony of Myconids who are suspicious of light", "A Duergar scouting party"]
  };

  const lootItems = ["a glowing sapphire", "a rusted +1 Dagger", "a Potion of Healing", "a tattered map to a nearby ruin", "1d6 Silver spoons", "a Bag of Holding (cursed)"];

  const generateEncounter = (env: keyof typeof encounters) => {
    const list = encounters[env];
    const pick = list[Math.floor(Math.random() * list.length)];
    setResult({ type: 'Encounter', title: env, text: pick });
  };

  const generateLoot = (tier: string) => {
    const gp = Math.floor(Math.random() * 100) + 10;
    const item = lootItems[Math.floor(Math.random() * lootItems.length)];
    setResult({ 
      type: 'Loot', 
      title: tier, 
      text: `Gold: ${gp}gp | Item: ${item}` 
    });
  };

  return (
    <div className="flex flex-col gap-4 bg-stone-900/60 p-6 rounded-xl border border-amber-900/30 h-full">
      <h2 className="text-xl text-amber-500 font-serif flex items-center gap-2">
        <Dice6 size={20} className="text-amber-600" /> Generator Hub
      </h2>

      <div className="flex gap-2 mb-2">
        <button 
          onClick={() => setType('encounter')}
          className={`flex-1 py-2 text-xs rounded border transition-all ${type === 'encounter' ? 'bg-amber-900/40 border-amber-600 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
        >
          Encounters
        </button>
        <button 
          onClick={() => setType('loot')}
          className={`flex-1 py-2 text-xs rounded border transition-all ${type === 'loot' ? 'bg-amber-900/40 border-amber-600 text-amber-200' : 'bg-stone-800 border-stone-700 text-stone-500'}`}
        >
          Loot Table
        </button>
      </div>

      <div className="flex-1 space-y-2">
        {type === 'encounter' ? (
          <div className="grid grid-cols-2 gap-2">
            {environments.map(env => (
              <button 
                key={env} 
                onClick={() => generateEncounter(env as any)}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-700 flex items-center gap-2"
              >
                <Map size={12} /> {env}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {lootTiers.map(tier => (
              <button 
                key={tier} 
                onClick={() => generateLoot(tier)}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-700 flex items-center gap-2"
              >
                <Coins size={12} /> {tier}
              </button>
            ))}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">{result.type}: {result.title}</span>
              <Sparkles size={14} className="text-amber-500" />
            </div>
            <p className="text-sm text-stone-200 italic leading-relaxed">
              {result.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorHub;