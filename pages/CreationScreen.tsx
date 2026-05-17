import React from 'react';
import { Button } from '../components/Button';
import { LongBox } from '../components/LongBox';
import { CharacterCreator } from '../components/CharacterCreator';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';

export const CreationScreen: React.FC = () => {
  const { archives, activeModal, pendingLegacy, setActiveModal, setGamePhase, setArchives } = useGameStore();
  const { handleCharacterComplete } = useGameActions();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      {activeModal === 'LONGBOX' && (
        <LongBox
          archives={archives}
          onClose={() => setActiveModal(null)}
          onClear={() => setArchives([])}
        />
      )}
      <div className="absolute top-4 left-4 z-50">
        <Button variant="secondary" onClick={() => setGamePhase('TITLE')} className="text-xs py-1 px-2">← BACK TO TITLE</Button>
      </div>
      <CharacterCreator
        onComplete={handleCharacterComplete}
        onOpenArchives={archives.length > 0 ? () => setActiveModal('LONGBOX') : undefined}
        legacyData={pendingLegacy}
      />
    </div>
  );
};
