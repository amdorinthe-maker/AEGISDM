'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

// Components
import CampaignHeader from '@/components/CampaignHeader';
import SessionNotes from '../components/SessionNotes';
import PartyTracker from '@/components/PartyTracker';
import CombatTracker from '@/components/CombatTracker';
import NPCManager from '@/components/NPCManager';
import RulesLookup from '@/components/RulesLookup';
import DiceRoller from '@/components/DiceRoller';
import GeneratorHub from '@/components/GeneratorHub';
import CampaignCodex from '@/components/CampaignCodex';
import SagaManager from '@/components/SagaManager';
import LoreLibrarian from '@/components/LoreLibrarian';
import CompendiumDrawer from '@/components/CompendiumDrawer';



export default function Home() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('npcs');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSagaModalOpen, setIsSagaModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('The Grand Archive'); 
  const [allLore, setAllLore] = useState<any[]>([]);
  const clearLibrary = () => {
  localStorage.removeItem(`aegis_lore_${campaignName}`);
  setAllLore([]);

};
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);


  // --- CAMPAIGN DATA STATE ---
  const [npcs, setNpcs] = useState<any[]>([]);
  const [npcToEdit, setNpcToEdit] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [locationToEdit, setLocationToEdit] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [notes, setNotes] = useState('');

const handleTextChange = (val: string) => {
  setNotes(val);
  // This ensures that as you type, it saves to the correct campaign slot
  const currentCampaign = localStorage.getItem('aegis_campaign_name') || "The Grand Archive";
  localStorage.setItem(`aegis_notes_${currentCampaign}`, val);
};
// --- THE MASTER CAMPAIGN SYNC ---
useEffect(() => {
  const syncEverything = () => {
    // 1. Get the current active campaign
    const currentCampaign = localStorage.getItem('aegis_campaign_name') || "The Grand Archive";
    setCampaignName(currentCampaign);

    // 2. Load World Data (NPCs & Locations)
    const savedNpcs = localStorage.getItem(`aegis_npcs_${currentCampaign}`);
    setNpcs(savedNpcs ? JSON.parse(savedNpcs) : []);

    const savedLocs = localStorage.getItem(`aegis_locations_${currentCampaign}`);
    setLocations(savedLocs ? JSON.parse(savedLocs) : []);

    // 3. Load the Party (The piece that was missing!)
    const savedParty = localStorage.getItem(`aegis_party_${currentCampaign}`);
    setParty(savedParty ? JSON.parse(savedParty) : []);
    const savedNotes = localStorage.getItem(`aegis_notes_${currentCampaign}`);
    setNotes(savedNotes || "");
    // 4. Load the Library Lore
    const savedLore = localStorage.getItem(`aegis_lore_${currentCampaign}`);
    if (savedLore && savedLore !== "undefined") {
      setAllLore(JSON.parse(savedLore));
    } else {
      setAllLore([]); 
    }

    setSelectedLocation(null);


  };
  

  // Run immediately on mount
  syncEverything();

  // Listen for external updates (like from the Import or Campaign Switcher)
  window.addEventListener('campaign-updated', syncEverything);
  window.addEventListener('party-updated', syncEverything);

  return () => {
    window.removeEventListener('campaign-updated', syncEverything);
    window.removeEventListener('party-updated', syncEverything);
  };
}, [campaignName]); // Runs whenever the campaign name changes

  // --- NPC HANDLERS ---
  const handleNpcChange = (updatedList: any[]) => {
    const currentCampaign = localStorage.getItem('aegis_campaign_name') || "New Saga";
    setNpcs(updatedList);
    localStorage.setItem(`aegis_npcs_${currentCampaign}`, JSON.stringify(updatedList));
  };

  const handleAddOrEditNPC = (npc: any) => {
    const exists = npcs.find(n => n.id === npc.id);
    let newList;
    if (exists) {
      newList = npcs.map(n => n.id === npc.id ? npc : n);
    } else {
      const npcWithId = { ...npc, id: npc.id || crypto.randomUUID() };
      newList = [...npcs, npcWithId];
    }
    handleNpcChange(newList);
    setNpcToEdit(null);
  };

  const handleNpcDelete = (id: string) => {
    handleNpcChange(npcs.filter(n => n.id !== id));
  };


  // --- LOCATION HANDLERS ---
  const handleLocationSave = (newLoc: any) => {
    const currentCampaign = localStorage.getItem('aegis_campaign_name') || "New Saga";
    let newList;

    if (locationToEdit) {
      newList = locations.map(l => l.id === newLoc.id ? newLoc : l);
    } else {
      newList = [...locations, newLoc];
    }

    setLocations(newList);
    localStorage.setItem(`aegis_locations_${currentCampaign}`, JSON.stringify(newList));
    setIsLocationModalOpen(false);
    setLocationToEdit(null);
  };

  const handleLocationDelete = (id: string) => {
    const currentCampaign = localStorage.getItem('aegis_campaign_name') || "New Saga";
    const newList = locations.filter(l => l.id !== id);
    setLocations(newList);
    localStorage.setItem(`aegis_locations_${currentCampaign}`, JSON.stringify(newList));
    if (selectedLocation?.id === id) setSelectedLocation(null);
  };

  const exportFullCampaign = () => {
  const fullData = {
    version: "2.0", // New version for full campaign exports
    campaignName: campaignName,
    npcs: npcs,
    locations: locations,
    lore: allLore,
    party: party,
    notes: notes,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AEGIS_FULL_${campaignName.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const [party, setParty] = useState<any[]>([]);



  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans">

      {/* GLOBAL HEADER */}
<header className="border-b border-amber-900/30 bg-stone-900/50 p-4 shadow-xl">
  {/* Added flex-wrap here to let items drop to a new line on small screens */}
  <div className="max-w-[1800px] mx-auto flex flex-wrap justify-between items-center gap-4">
    
    <h1 className="text-xl md:text-2xl font-bold text-amber-500 tracking-tighter flex items-center gap-2">
      <Shield className="text-amber-600 hidden md:block" /> AEGIS DM
    </h1>
    
    <div className="flex flex-wrap items-center gap-2 md:gap-6">
      
      <button 
        onClick={() => setIsCompendiumOpen(true)}
        className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-amber-900/40 rounded text-amber-600 transition-all text-[9px] md:text-[10px] uppercase font-bold tracking-widest hover:border-amber-600"
      >
        📜 <span className="hidden sm:inline">Compendium</span>
      </button>

      <button 
        onClick={exportFullCampaign} 
        className="flex items-center gap-2 px-3 py-1 bg-amber-900/20 border border-amber-900/40 rounded text-amber-600 transition-all text-[9px] md:text-[10px] uppercase font-bold tracking-widest hover:bg-amber-900/40"
      >
        Export
      </button>

      {/* Hide this status text on very small screens to save space */}
      <div className="hidden sm:block text-[9px] md:text-xs text-stone-500 uppercase tracking-widest font-bold">
        Vault Active
      </div>
    </div>
  </div> 
</header>

      {/* MAIN DASHBOARD */}
      <main className="max-w-[1800px] mx-auto p-6 space-y-6">
        
        
        {/* TOP SECTION: CAMPAIGN IDENTITY */}
        <div className="space-y-4">
      <CampaignHeader onOpenLibrary={() => setIsSagaModalOpen(true)} />
          <SessionNotes />
        </div>

        {/* 3-COLUMN MASTER GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* COLUMN 1: TACTICAL (LEFT) */}
          <div className="xl:col-span-3 space-y-6">
<PartyTracker 
  players={party} 
  campaignName={campaignName} // <--- This clears the red error!
  onUpdate={(newParty: any[]) => {
    setParty(newParty);
    localStorage.setItem(`aegis_party_${campaignName}`, JSON.stringify(newParty));
    // Trigger the sync for the Combat Tracker
    window.dispatchEvent(new Event('party-updated'));
  }} 
/>
            <CombatTracker npcs={npcs}
            party={party} // Pass the players
            onUpdateParty={(newList) => { // Pass the update function
            requestAnimationFrame(() => {
    setParty(newList);
    localStorage.setItem(`aegis_party_${campaignName}`, JSON.stringify(newList));
  });
}}/>
          </div>

          {/* COLUMN 2: UTILITY (CENTER) */}
          <div className="xl:col-span-5 space-y-6">
            <DiceRoller />
            <RulesLookup />
          </div>

          {/* COLUMN 3: WORLD BUILDING (RIGHT) */}
          
          <div className="xl:col-span-4 space-y-6">
            
            {/* TAB NAVIGATOR */}
            <div className="flex gap-4 border-b border-amber-900/20 pb-2 mb-4">
              {['npcs', 'locations', 'lore', 'generator', 'library'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`text-xs uppercase font-bold tracking-widest transition-all ${
                    activeTab === tab ? 'text-amber-500 border-b border-amber-500' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* DYNAMIC TAB CONTENT */}
            <div className="min-h-[500px]">
              {activeTab === 'npcs' && (
                <NPCManager 
                  npcs={npcs} 
                  npcToEdit={npcToEdit} 
                  onEdit={handleAddOrEditNPC}
                  onDelete={handleNpcDelete}
                  onStartEdit={(npc: any) => setNpcToEdit(npc)}
                />
              )}


{activeTab === 'library' && (
  <div className="h-full w-full">
<LoreLibrarian 
  key={campaignName} // Key is vital: it forces a total rebuild on name change
  data={allLore} 
  campaignName={campaignName}
  onCampaignChange={(name, newData) => {
    // 1. Update the master storage keys immediately
    // This ensures that even if the page refreshes right now, it has the new data
    localStorage.setItem('aegis_campaign_name', name);
    localStorage.setItem('aegis_current_lore', JSON.stringify(newData));

    // 2. Update the React state
    // We use the spread operator [...newData] to ensure React sees a 
    // brand new memory reference, which triggers a clean re-render.
    setCampaignName(name);
    setAllLore([...newData]);

    // 3. Trigger the custom event for other components (like NPC/Combat trackers)
    window.dispatchEvent(new Event('campaign-updated'));
  }} 
  onClearLibrary={clearLibrary}
/>
  </div>
)}
              {activeTab === 'locations' && (
                <CampaignCodex 
                  locations={locations} 
                  onAddClick={() => { setLocationToEdit(null); setIsLocationModalOpen(true); }} 
                  onViewLore={(loc: any) => { setSelectedLocation(loc); setActiveTab('lore'); }}
                  onDelete={handleLocationDelete}
                  onEdit={(loc: any) => { setLocationToEdit(loc); setIsLocationModalOpen(true); }}
                />
              )}

              {activeTab === 'lore' && (
                <div className="animate-in fade-in duration-300 p-6 bg-stone-900/40 rounded-xl border border-amber-900/10 font-serif min-h-[400px]">
                  {selectedLocation ? (
                    <>
                      <button onClick={() => setSelectedLocation(null)} className="text-[10px] text-amber-700 uppercase mb-4 hover:text-amber-500 transition-colors">
                        ← Back to Chronicles
                      </button>
                      <h2 className="text-3xl text-amber-500 uppercase tracking-tight mb-4 border-b border-amber-900/20 pb-2">
                        {selectedLocation.name}
                      </h2>
                      <p className="text-stone-300 leading-relaxed whitespace-pre-wrap italic">
                        {selectedLocation.loreBody}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-stone-600">
                      <p className="italic">Select a location from the Map to read its history.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'generator' && <GeneratorHub />}
            </div>
          </div>
        </div>
        <CompendiumDrawer 
  isOpen={isCompendiumOpen} 
  onClose={() => setIsCompendiumOpen(false)} 
/>
      </main>

      {/* MODALS */}
      <AddLocationModal 
        isOpen={isLocationModalOpen} 
        editData={locationToEdit}
        onClose={() => { setIsLocationModalOpen(false); setLocationToEdit(null); }} 
        onSave={handleLocationSave}
      />
      <SagaManager 
          isOpen={isSagaModalOpen} 
          onClose={() => setIsSagaModalOpen(false)} 
        />
    </div>
    
  );
  
}

// --- SUB-COMPONENT: LOCATION MODAL ---
function AddLocationModal({ isOpen, onClose, onSave, editData }: any) {
  const [name, setName] = useState('');
  const [pop, setPop] = useState('');
  const [lore, setLore] = useState('');

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
    if (!name) return;
    const locationData = {
      id: editData ? editData.id : name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-3),
      name,
      population: pop,
      shortDesc: lore.substring(0, 60) + "...",
      loreBody: lore
    };
    onSave(locationData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-serif">
      <div className="bg-stone-900 border-2 border-amber-900/50 w-full max-w-md rounded-lg p-6 shadow-2xl">
        <h2 className="text-amber-500 text-2xl mb-4 uppercase tracking-wider font-bold">
          {editData ? '📜 Rewrite History' : '📍 Map New Realm'}
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Location Name</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-950 border border-amber-900/20 p-3 rounded text-amber-100 outline-none focus:border-amber-600 transition-all" 
              placeholder="e.g. Ravenwatch"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Population / Type</label>
            <input 
              value={pop} onChange={(e) => setPop(e.target.value)}
              className="w-full bg-stone-950 border border-amber-900/20 p-3 rounded text-stone-200 outline-none focus:border-amber-600 transition-all" 
              placeholder="e.g. 2,000 Souls / Trading Hub"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-stone-500 font-bold tracking-widest">Chronicle & Lore</label>
            <textarea 
              value={lore} onChange={(e) => setLore(e.target.value)}
              className="w-full bg-stone-950 border border-amber-900/20 p-3 rounded text-stone-300 h-40 outline-none focus:border-amber-600 transition-all resize-none italic" 
              placeholder="Tell the story of this place..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded uppercase text-xs tracking-widest transition-all">
              {editData ? 'Update Record' : 'Commit to Map'}
            </button>
            <button onClick={onClose} className="flex-1 bg-stone-800 text-stone-400 py-3 rounded uppercase text-xs tracking-widest hover:bg-stone-700 transition-all">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
  
}
