'use client';

import React, { useState, useEffect } from 'react';

const SessionNotes = () => {
  const [notes, setNotes] = useState("");
  const [campaignName, setCampaignName] = useState("New Saga");

  // --- 1. THE LOAD/SWITCH LOGIC ---
  useEffect(() => {
    const loadCurrentNotes = () => {
      const currentName = localStorage.getItem('aegis_campaign_name') || "New Saga";
      setCampaignName(currentName);
      
      // Look for notes specific to THIS campaign name
      const savedNotes = localStorage.getItem(`aegis_notes_${currentName}`);
      setNotes(savedNotes || "");
    };

    // Load on start
    loadCurrentNotes();

    // Listen for the header changing the campaign name
    window.addEventListener('campaign-updated', loadCurrentNotes);
    return () => window.removeEventListener('campaign-updated', loadCurrentNotes);
  }, []);

  // --- 2. THE SAVE LOGIC ---
  const handleTextChange = (val: string) => {
    setNotes(val);
    // Save to the specific campaign slot
    localStorage.setItem(`aegis_notes_${campaignName}`, val);
  };

  const exportCampaignNotes = () => {
    // Your existing export logic here
    console.log("Archiving:", notes);
  };

  return (
    <div className="bg-stone-900/40 border border-amber-900/20 rounded-xl p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase tracking-widest text-amber-700/70 font-bold">
          Session Log: {campaignName}
        </span>

      </div>

      <textarea 
        className="w-full h-32 bg-transparent text-stone-300 font-serif leading-relaxed focus:outline-none resize-none placeholder:text-stone-800 p-2 italic custom-scrollbar"
        placeholder="Quick session notes..."
        value={notes} // This makes it "Controlled"
        onChange={(e) => handleTextChange(e.target.value)}
      />
    </div>
  );
};

export default SessionNotes;