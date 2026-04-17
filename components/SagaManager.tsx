'use client';

import React, { useState, useEffect } from 'react';
import { Book, Trash2, CheckCircle2, X, PlusCircle } from 'lucide-react';

const SagaManager = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [sagas, setSagas] = useState<string[]>([]);
  const [activeSaga, setActiveSaga] = useState("");
  const [newSagaName, setNewSagaName] = useState("");

  const refreshSagas = () => {
    const list = localStorage.getItem('aegis_campaign_list');
    const active = localStorage.getItem('aegis_campaign_name') || "New Saga";
    setSagas(list ? JSON.parse(list) : [active]);
    setActiveSaga(active);
  };

  useEffect(() => {
    if (isOpen) refreshSagas();
  }, [isOpen]);

  const loadSaga = (name: string) => {
    localStorage.setItem('aegis_campaign_name', name);
    window.dispatchEvent(new Event('campaign-updated'));
    setActiveSaga(name);
    onClose();
  };

  const createSaga = () => {
    if (!newSagaName.trim()) return;
    const updatedList = Array.from(new Set([...sagas, newSagaName.trim()]));
    localStorage.setItem('aegis_campaign_list', JSON.stringify(updatedList));
    setNewSagaName("");
    loadSaga(newSagaName.trim());
  };

  const deleteSaga = (name: string) => {
    if (name === activeSaga) return alert("Cannot delete the active saga!");
    if (window.confirm(`Are you sure you want to delete "${name}"? This will wipe all associated party and NPC data.`)) {
      const updatedList = sagas.filter(s => s !== name);
      localStorage.setItem('aegis_campaign_list', JSON.stringify(updatedList));
      
      // Clean up the actual data keys
      localStorage.removeItem(`aegis_party_${name}`);
      localStorage.removeItem(`aegis_npcs_${name}`);
      
      setSagas(updatedList);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border-2 border-amber-900/40 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-amber-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-600">
            <Book size={20} />
            <h2 className="font-serif text-lg tracking-tight">Saga Library</h2>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X size={20}/></button>
        </div>

        {/* Create New Section */}
        <div className="p-4 bg-amber-900/5 border-b border-amber-900/10">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Start a new saga..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded px-3 py-2 text-sm text-amber-100 focus:border-amber-600 outline-none"
              value={newSagaName}
              onChange={(e) => setNewSagaName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createSaga()}
            />
            <button onClick={createSaga} className="bg-amber-700 hover:bg-amber-600 text-white p-2 rounded transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>
        </div>

        {/* Saga List */}
        <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
          {sagas.map(name => (
            <div 
              key={name}
              className={`group flex justify-between items-center p-3 rounded-lg mb-1 transition-all ${
                activeSaga === name ? 'bg-amber-900/20 border border-amber-600/30' : 'hover:bg-stone-800'
              }`}
            >
              <button 
                onClick={() => loadSaga(name)}
                className="flex-1 text-left flex items-center gap-3"
              >
                {activeSaga === name ? (
                  <CheckCircle2 size={16} className="text-amber-500" />
                ) : (
                  <div className="w-4" />
                )}
                <span className={`font-serif ${activeSaga === name ? 'text-amber-100' : 'text-stone-400'}`}>
                  {name}
                </span>
              </button>
              
              <button 
                onClick={() => deleteSaga(name)}
                className={`p-1 text-stone-700 hover:text-rose-500 transition-opacity ${activeSaga === name ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-stone-950 text-center">
          <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">
            Select a saga to load its world and party
          </p>
        </div>
      </div>
    </div>
  );
};

export default SagaManager;