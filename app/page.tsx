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
  const [activeTab, setActiveTab] = useState('overview');
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<any>(null);
  const [npcs, setNpcs] = useState<any[]>([]);
  const [npcToEdit, setNpcToEdit] = useState<any>(null);

function AddLocationModal({ isOpen, onClose, onSave, editData }: any) {
  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-stone-900 border border-amber-500/30 rounded-lg w-full max-w-md shadow-2xl shadow-amber-900/20 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900/20 to-stone-900 p-4 border-b border-amber-500/20">
          <h2 className="text-lg font-bold text-amber-500">{editData ? 'Edit Location' : 'Add New Location'}</h2>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSave({
            id: editData?.id || Date.now(),
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            description: formData.get('description') as string,
            dangers: formData.get('dangers') as string,
            hooks: formData.get('hooks') as string,
          });
        }} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-500 mb-1">Location Name</label>
            <input name="name" defaultValue={editData?.name} required className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-amber-500 mb-1">Type</label>
            <select name="type" defaultValue={editData?.type} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
              <option value="City">City</option>
              <option value="Wilderness">Wilderness</option>
              <option value="Dungeon">Dungeon</option>
              <option value="Planar">Planar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-amber-500 mb-1">Description</label>
            <textarea name="description" defaultValue={editData?.description} required rows={3} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-amber-500 mb-1">Dangers & Secrets</label>
            <textarea name="dangers" defaultValue={editData?.dangers} rows={2} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-amber-500 mb-1">Plot Hooks</label>
            <textarea name="hooks" defaultValue={editData?.hooks} rows={2} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded p-2 text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white rounded p-2 text-sm font-bold transition-colors">{editData ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
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
const exportCampaignNotes = () => {
  // Pull the text directly from the archive drawer
  const data = localStorage.getItem('aegis_notes') || "";
  
  if (!data) {
    alert("The archive is empty! Write some notes before exporting.");
    return;
  }

  const campaignName = prompt("Enter Campaign Name:", "My_Epic_Campaign");
  
  if (campaignName) {
    // Create the physical file
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${campaignName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
          /><div className="flex justify-between items-center mb-2">
  <span className="text-[10px] uppercase tracking-widest text-amber-700/70 font-bold">Session Log</span>
  <button 
    onClick={exportCampaignNotes}
    className="text-[9px] uppercase tracking-[0.2em] text-amber-500 hover:text-amber-400 transition-colors bg-amber-900/20 px-2 py-1 rounded border border-amber-900/30"
  >
    💾 Archive Campaign
  </button>
</div>
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
      <AddLocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onSave={(data: any) => { const exists = locations.find(l => l.id === data.id); if (exists) { setLocations(locations.map(l => l.id === data.id ? data : l)); } else { setLocations([...locations, data]); } }} editData={locationToEdit} />
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
