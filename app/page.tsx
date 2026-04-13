'use client';

import PartyTracker from '@/components/PartyTracker';
import CombatTracker from '@/components/CombatTracker';
import NPCManager from '@/components/NPCManager';
import RulesLookup from '@/components/RulesLookup';
import GeneratorHub from '@/components/GeneratorHub';
import CampaignCodex from '@/components/CampaignCodex';
import { Shield } from 'lucide-react';
import DiceRoller from '@/components/DiceRoller';

export default function Home() {
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
            <CampaignCodex />
            <NPCManager />
            <GeneratorHub />
          </div>

        </div>
      </main>
    </div>
  );
}