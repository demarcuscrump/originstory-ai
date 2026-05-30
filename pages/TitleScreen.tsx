import React, { useState } from 'react';
import { Button } from '../components/Button';
import { AiSettingsModal } from '../components/AiSettingsModal';
import { LongBox } from '../components/LongBox';
import { useGameStore } from '../store/useGameStore';
import { audio } from '../services/audioService';
import { getResolvedAiSettings } from '../services/aiSettings';

export const TitleScreen: React.FC = () => {
  const { archives, activeModal, hydrated, setActiveModal, setGamePhase, setArchives } = useGameStore();
  const [aiStatus, setAiStatus] = useState(() => getResolvedAiSettings());
  const hasSave = hydrated && useGameStore.getState().character !== null;

  const closeAiSettings = () => {
    setAiStatus(getResolvedAiSettings());
    setActiveModal(null);
  };

  return (
    <div className="min-h-dvh bg-[#242424] text-[#F4F4F0] border-x-2 border-[#0E0E0E] max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #FFD21F 1px, transparent 1.5px)', backgroundSize: '22px 22px' }} />

      <main className="relative z-10 min-h-dvh grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 p-5 md:p-8 items-center">
        <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg p-5 md:p-8">
          <p className="font-black uppercase tracking-wide text-[#FFD21F] text-sm mb-3">Interactive comic RPG</p>
          <h1 className="font-display text-7xl md:text-9xl leading-none italic tracking-wide text-[#FFD21F]">
            Origin<br />Story
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl leading-relaxed font-bold text-[#D8D8D2]">
            Create a hero, anti-hero, or villain. Make choices, manage pressure, and watch the current panel become their comic history.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl border-2 border-[#0E0E0E] bg-[#FFD21F] p-3 text-[#161616] shadow-[2px_2px_0px_#0E0E0E]">
              <div className="text-[10px] font-black uppercase opacity-70">Loop</div>
              <div className="font-black">Choices</div>
            </div>
            <div className="rounded-2xl border-2 border-[#0E0E0E] bg-[#3E3E3E] p-3 shadow-[2px_2px_0px_#0E0E0E]">
              <div className="text-[10px] font-black uppercase text-[#B8B8B0]">Mode</div>
              <div className="font-black">{aiStatus.hasApiKey ? 'AI On' : 'Offline'}</div>
            </div>
            <div className="rounded-2xl border-2 border-[#0E0E0E] bg-[#3E3E3E] p-3 shadow-[2px_2px_0px_#0E0E0E]">
              <div className="text-[10px] font-black uppercase text-[#B8B8B0]">Archive</div>
              <div className="font-black">{archives.length} Runs</div>
            </div>
            <div className="rounded-2xl border-2 border-[#0E0E0E] bg-[#3E3E3E] p-3 shadow-[2px_2px_0px_#0E0E0E]">
              <div className="text-[10px] font-black uppercase text-[#B8B8B0]">Save</div>
              <div className="font-black">{hasSave ? 'Found' : 'Empty'}</div>
            </div>
          </div>
        </section>

        <aside className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg p-4 md:p-5">
          <h2 className="font-black uppercase text-lg border-b-2 border-[#515151] pb-3 mb-4 text-[#FFD21F]">Start</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="primary"
              onClick={() => { audio.playClick(); setGamePhase('CREATION'); }}
              fullWidth
            >
              Start New Issue
            </Button>

            {hasSave && (
              <Button
                variant="hero"
                onClick={() => { audio.playFanfare(); setGamePhase('PLAYING'); }}
                fullWidth
              >
                Continue Story
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => { audio.playClick(); setActiveModal('LONGBOX'); }}
              fullWidth
            >
              Long Box
            </Button>

            <Button
              variant="secondary"
              onClick={() => { audio.playClick(); setActiveModal('AI_SETTINGS'); }}
              fullWidth
            >
              AI Settings
            </Button>
          </div>

          <div className="mt-5 rounded-2xl border-2 border-[#0E0E0E] bg-[#2B2B2B] p-4 text-sm leading-relaxed text-[#D8D8D2]">
            Deterministic play works without a key. BYOK unlocks generated origins, panels, nemeses, and supporting cast.
          </div>
        </aside>
      </main>

      {activeModal === 'LONGBOX' && (
        <LongBox
          archives={archives}
          onClose={() => setActiveModal(null)}
          onClear={() => setArchives([])}
        />
      )}

      {activeModal === 'AI_SETTINGS' && (
        <AiSettingsModal onClose={closeAiSettings} />
      )}
    </div>
  );
};
