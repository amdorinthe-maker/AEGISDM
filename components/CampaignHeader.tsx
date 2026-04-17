'use client';

import React, { useState, useEffect } from 'react';
import { Book, Save, Download } from 'lucide-react';

const CampaignHeader = ({ onOpenLibrary }: { onOpenLibrary: () => void }) => {
  const [title, setTitle] = useState("New Saga");

useEffect(() => {
    // 1. Initial load from storage
    const saved = localStorage.getItem('aegis_campaign_name');
    if (saved) setTitle(saved);

    // 2. The function to run when a new saga is selected
    const handleUpdate = () => {
      const updatedName = localStorage.getItem('aegis_campaign_name') || "New Saga";
      setTitle(updatedName);
    };

    // 3. Start listening for the signal from the SagaManager modal
    window.addEventListener('campaign-updated', handleUpdate);
    
    // 4. Clean up the listener if the component closes
    return () => window.removeEventListener('campaign-updated', handleUpdate);
  }, []);

const exportFullCampaign = () => {
  // 1. Get the current campaign identity
  const campaignName = localStorage.getItem('aegis_campaign_name') || "New Saga";

  // 2. Gather all the pieces of the puzzle
  const campaignData = {
    title: campaignName,
    exportDate: new Date().toISOString(),
    // Grab the party specific to this campaign
    party: JSON.parse(localStorage.getItem(`aegis_party_${campaignName}`) || "[]"),
    // Grab the notes specific to this campaign
    notes: localStorage.getItem(`aegis_notes_${campaignName}`) || "",
    // You can even add NPCs or World State here later!
  };

  // 3. Turn it into a "File" (JSON)
  const dataStr = JSON.stringify(campaignData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  // 4. Create a "Ghost Link" to trigger the download
  const exportFileDefaultName = `${campaignName.replace(/\s+/g, '_')}_backup.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

  return (
<div className="bg-stone-950/80 border-b border-amber-900/30 p-8 mb-6">
  <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative">
    
    {/* TOP BAR: Status on left, Actions on right */}
    <div className="absolute top-0 w-full flex justify-between items-center px-2">
      <div className="flex items-center gap-2 text-stone-600 text-[10px] uppercase tracking-[0.2em] font-bold">
        <Save size={12} />
        Auto-Saving
      </div>

      {/* NEW ACTION BUTTONS */}
      <div className="flex gap-4">
        <button 
          onClick={exportFullCampaign}
          className="flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors bg-amber-900/10 px-3 py-1 rounded border border-amber-900/20"
        >
          <Save size={12} />
          Archive Saga
        </button>
        <button 
          onClick={onOpenLibrary}
          className="flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors bg-amber-900/10 px-3 py-1 rounded border border-amber-900/20"
        >
          <Download size={12} />
          Load Saga
        </button>
      </div>
    </div>

    {/* CENTERED TITLE (Stays perfectly in the middle now) */}
<div className="flex items-center gap-4 w-full max-w-2xl justify-center mt-4">
  {/* The Book icon is now the button that opens your Saga Library modal */}
  <button 
    onClick={onOpenLibrary} 
    className="hover:scale-110 transition-transform active:scale-95 cursor-pointer"
    title="Open Saga Library"
  >
    <Book className="text-amber-700 shrink-0" size={32} />
  </button>

  {/* We use your existing 'title' variable here */}
  <h1 className="text-4xl md:text-5xl font-serif text-amber-100 text-center">
    {title}
  </h1>
</div>

<div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mt-2" />
  </div>
</div>
  );
};


export default CampaignHeader;