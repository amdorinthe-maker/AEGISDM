'use client';

import React, { useState, useEffect } from 'react';
import { Book, Save, Download, Edit3 } from 'lucide-react';

const CampaignHeader = ({ onOpenLibrary }: { onOpenLibrary: () => void }) => {
  const [title, setTitle] = useState("New Saga");
  const [isEditing, setIsEditing] = useState(false);

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
    
    // 4. Clean up the listener
    return () => window.removeEventListener('campaign-updated', handleUpdate);
  }, []);

  const exportFullCampaign = () => {
    const campaignName = localStorage.getItem('aegis_campaign_name') || "New Saga";
    const campaignData = {
      title: campaignName,
      exportDate: new Date().toISOString(),
      party: JSON.parse(localStorage.getItem(`aegis_party_${campaignName}`) || "[]"),
      notes: localStorage.getItem(`aegis_notes_${campaignName}`) || "",
    };

    const dataStr = JSON.stringify(campaignData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${campaignName.replace(/\s+/g, '_')}_backup.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="bg-stone-950/80 border-b border-amber-900/30 p-4 md:p-8 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative pt-8 md:pt-4">
        
        {/* TOP BAR: Responsive layout to prevent bleeding */}
        <div className="md:absolute md:top-0 w-full flex flex-col md:flex-row justify-between items-center gap-4 px-2 mb-6 md:mb-0">
          <div className="flex items-center gap-2 text-stone-600 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
            <Save size={12} className="animate-pulse" />
            Auto-Saving
          </div>

          <div className="flex gap-2 md:gap-4">
            <button 
              onClick={exportFullCampaign}
              className="flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors bg-amber-900/10 px-3 py-1.5 rounded border border-amber-900/20"
            >
              <Save size={12} />
              <span className="hidden sm:inline">Archive Saga</span>
              <span className="sm:hidden">Archive</span>
            </button>
            <button 
              onClick={onOpenLibrary}
              className="flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors bg-amber-900/10 px-3 py-1.5 rounded border border-amber-900/20"
            >
              <Download size={12} />
              <span className="hidden sm:inline">Load Saga</span>
              <span className="sm:hidden">Load</span>
            </button>
          </div>
        </div>

        {/* CENTERED TITLE SECTION */}
        <div className="flex flex-col items-center w-full px-2 md:px-4">
          <div className="flex items-center gap-3 md:gap-6 w-full max-w-3xl justify-center group">
            
            <button 
              onClick={onOpenLibrary} 
              className="hover:scale-110 transition-transform active:scale-95 shrink-0"
              title="Open Saga Library"
            >
              <Book className="text-amber-800 w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="relative flex-1 min-w-0 max-w-2xl flex justify-center items-center gap-2">
              {isEditing ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  className="bg-stone-900/50 border-b-2 border-amber-600 text-amber-100 font-serif text-2xl md:text-5xl text-center w-full focus:outline-none px-2 py-1 rounded-t min-w-0"
                />
              ) : (
                <h1 
                  onClick={() => setIsEditing(true)}
                  className="text-2xl sm:text-3xl md:text-5xl font-serif text-amber-100 text-center break-words leading-tight cursor-pointer hover:text-amber-400 transition-colors"
                >
                  {title || "Unnamed Saga"}
                </h1>
              )}

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-amber-900 hover:text-amber-500 shrink-0"
                >
                  <Edit3 size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="w-24 md:w-48 h-1 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mt-4" />
        </div>
      </div>
    </div>
  );
};

export default CampaignHeader;