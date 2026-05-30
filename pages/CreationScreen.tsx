import React from 'react';
import { Button } from '../components/Button';
import { LongBox } from '../components/LongBox';
import { CharacterCreator } from '../components/CharacterCreator';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';
import { audio } from '../services/audioService';

export const CreationScreen: React.FC = () => {
  const { archives, activeModal, pendingLegacy, setActiveModal, setGamePhase, setArchives } = useGameStore();
  const { handleCharacterComplete } = useGameActions();

  return (
    <div className="min-h-dvh bg-[#242424] text-[#F4F4F0] border-x-2 border-[#0E0E0E] max-w-7xl mx-auto shadow-2xl flex flex-col">
      {activeModal === 'LONGBOX' && (
        <LongBox
          archives={archives}
          onClose={() => setActiveModal(null)}
          onClear={() => setArchives([])}
        />
      )}

      <header className="shrink-0 bg-[#202020] text-[#F4F4F0] border-b-2 border-[#0E0E0E] p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase font-black text-[#FFD21F] tracking-wide">Character Build</p>
          <h1 className="font-display text-4xl leading-none tracking-wide">New Issue Setup</h1>
        </div>
        <Button
          variant="secondary"
          onClick={() => { audio.playClick(); setGamePhase('TITLE'); }}
          className="text-xs"
        >
          Back To Title
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto comic-scrollbar">
        <CharacterCreator
          onComplete={handleCharacterComplete}
          onOpenArchives={archives.length > 0 ? () => setActiveModal('LONGBOX') : undefined}
          legacyData={pendingLegacy}
        />
      </main>
    </div>
  );
};
