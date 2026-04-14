'use client';

import PartyTracker from '@/components/PartyTracker';
import CombatTracker from '@/components/CombatTracker';
import NPCManager from '@/components/NPCManager';
import RulesLookup from '@/components/RulesLookup';
import GeneratorHub from '@/components/GeneratorHub';
import CampaignCodex from '@/components/CampaignCodex';
import { Shield } from 'lucide-react';
import DiceRoller from '@/components/DiceRoller';
import { useState, useEffect } from 'react';

export default function Home() {
      const [activeTab, setActiveTab] = useState('overview'); // or whichever default you prefer
const [locations, setLocations] = useState<any[]>([]);
const [selectedLocation, setSelectedLocation] = useState<any>(null);
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [npcs, setNpcs] = useState<any[]>([]);
const [npcToEdit, setNpcToEdit] = useState<any>(null);

const viewLocationLore = (location: any) => {
  setSelectedLocation(location);
  setActiveTab("lore"); 
 };
const deleteLocation = (id: string) => {
  setLocations(locations.filter(loc => loc.id !== id));
  if (selectedLocation?.id === id) setSelectedLocation(null);
};

// For modifying, we'll just open the modal with the existing data
const [locationToEdit, setLocationToEdit] = useState<any>(null);

const startEdit = (location: any) => {
  setLocationToEdit(location);
  setIsLocationModalOpen(true);
};
  return (

    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-stone-900/50 p-4 shadow-xl">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500 tracking-tighter flex items-center gap-2">
            <Shield className="text-amber-600" /> AEGIS DM ASSISTANT
          </h1>
          <div className="text-xs text-stone-500 uppercase tracking-widest">Archive Active</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto p-6 space-y-6">
        
        {/* Session Log at Top */}
        <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-3">
          <textarea 
            className="w-full h-20 bg-transparent text-stone-300 font-serif leading-relaxed focus:outline-none resize-none placeholder:text-stone-800 p-2 italic"
            placeholder="Quick session notes..."
            onChange={(e) => localStorage.setItem('aegis_notes', e.target.value)}
            defaultValue={typeof window !== 'undefined' ? localStorage.getItem('aegis_notes') || "" : ""}
          />
        </div>

        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* COLUMN 1: THE PARTY & COMBAT (LEFT) */}
          <div className="xl:col-span-3 space-y-6">
            <PartyTracker />
            <CombatTracker />
          </div>

          {/* COLUMN 2: THE KNOWLEDGE BASE (CENTER) */}
          <div className="xl:col-span-5 space-y-6">
            <DiceRoller />
            <RulesLookup />
            
          </div>

{/* COLUMN 3: THE WORLD BUILDER (RIGHT) */}
<div className="xl:col-span-4 space-y-6">
  
  {/* 1. THE SWITCHER BUTTONS */}
  <div className="flex gap-2 border-b border-amber-900/20 pb-2">
    <button 
      onClick={() => setActiveTab('locations')} 
      className={`text-xs uppercase font-bold transition-colors ${activeTab === 'locations' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
    >
      Map
    </button>
    <button 
      onClick={() => setActiveTab('lore')} 
      className={`text-xs uppercase font-bold transition-colors ${activeTab === 'lore' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
    >
      Lore
    </button>
    <button 
      onClick={() => setActiveTab('npcs')} 
      className={`text-xs uppercase font-bold transition-colors ${activeTab === 'npcs' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
    >
      NPCs
    </button>
        <button 
      onClick={() => setActiveTab('generator')} 
      className={`text-xs uppercase font-bold transition-colors ${activeTab === 'generator' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
    >
      Generator Hub
    </button>
  </div>

  {/* 2. THE DYNAMIC CONTENT AREA */}
  <div className="min-h-[400px]">
    {/* MAP TAB */}
    {activeTab === 'locations' && (
<CampaignCodex 
  locations={locations} 
  onAddClick={() => { setLocationToEdit(null); setIsLocationModalOpen(true); }} 
  onViewLore={viewLocationLore}
  onDelete={(id) => setLocations(locations.filter(l => l.id !== id))} // Passes the logic
  onEdit={(loc) => { setLocationToEdit(loc); setIsLocationModalOpen(true); }} // Passes the logic
/>
    )}

    {/* LORE TAB (This is the one that was showing the NPC gallery by mistake) */}
    {activeTab === 'lore' && (
      <div className="animate-in fade-in duration-300 p-4 bg-stone-900/40 rounded border border-amber-900/10 font-serif">
        {selectedLocation ? (
          <>
            <button onClick={() => setSelectedLocation(null)} className="text-[10px] text-amber-700 uppercase mb-2">← Clear Selection</button>
            <h2 className="text-2xl text-amber-500 uppercase">{selectedLocation.name}</h2>
            <p className="text-stone-300 mt-4 leading-relaxed whitespace-pre-wrap">{selectedLocation.loreBody}</p>
          </>
        ) : (
          <p className="text-stone-600 italic text-center mt-20">Select a location from the Map to view the chronicles.</p>
        )}
      </div>
    )}

{/* NPC TAB */}
{activeTab === 'npcs' && (
  <NPCManager 
    npcs={npcs} 
    npcToEdit={npcToEdit} // Add this line
    onDelete={(id: string) => setNpcs(npcs.filter(n => n.id !== id))}
    onEdit={(npc: any) => {
      // If the NPC already exists (has an ID in our list), we update it.
      // Otherwise, we add it as a new character.
      const exists = npcs.find(n => n.id === npc.id);
      if (exists) {
        setNpcs(npcs.map(n => n.id === npc.id ? npc : n));
        setNpcToEdit(null); // Clear the edit state after saving
      } else {
        setNpcs([...npcs, npc]);
      }
    }}
    // Add a way for the manager to trigger the "Editing" mode
    onStartEdit={(npc: any) => {
      setNpcToEdit(npc);
    }}
  />
)}

    {/* GENERATOR HUB TAB */}
    {activeTab === 'generator' && (
      <GeneratorHub />
    )}
  </div>
</div>
</div>
      </main>
      <AddLocationModal 
  isOpen={isLocationModalOpen} 
  editData={locationToEdit}
  onClose={() => setIsLocationModalOpen(false)} 
onSave={(newLoc: any) => {
    // Check if we are currently editing an existing location
    if (locationToEdit) {
      // Find the old one by ID and swap it for the new version
      setLocations(locations.map(l => l.id === newLoc.id ? newLoc : l));
    } else {
      // Otherwise, just add it to the list like normal
      setLocations([...locations, newLoc]);
    }
    setIsLocationModalOpen(false);
  }}
/>
    </div>
  );
}

function AddLocationModal({ isOpen, onClose, onSave, editData }: any) {
  const [name, setName] = useState('');
  const [pop, setPop] = useState('');
  const [lore, setLore] = useState('');

  // This fills the boxes if we are editing an existing location
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPop(editData.population);
      setLore(editData.loreBody);
    } else {
      setName(''); setPop(''); setLore('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const locationData = {
      // Keep the same ID if editing, otherwise make a new one
      id: editData ? editData.id : name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-3),
      name,
      population: pop,
      shortDesc: lore.substring(0, 60) + "...",
      loreBody: lore
    };
    onSave(locationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-serif">
      <div className="bg-stone-900 border-2 border-amber-900/50 w-full max-w-md rounded-lg p-6 shadow-2xl">
        <h2 className="text-amber-500 text-2xl mb-4 uppercase tracking-wider">
          {editData ? 'Edit Location' : 'Map New Location'}
        </h2>
        <div className="space-y-4">
          <input 
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 p-2 rounded text-stone-200 outline-none focus:border-amber-600" 
            placeholder="Location Name"
          />
          <input 
            value={pop} onChange={(e) => setPop(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 p-2 rounded text-stone-200 outline-none focus:border-amber-600" 
            placeholder="Population"
          />
          <textarea 
            value={lore} onChange={(e) => setLore(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 p-2 rounded text-stone-200 h-32 outline-none focus:border-amber-600" 
            placeholder="Lore & History..."
          />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold py-2 rounded">
              {editData ? 'Update' : 'Save'}
            </button>
            <button onClick={onClose} className="flex-1 bg-stone-800 text-stone-400 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
