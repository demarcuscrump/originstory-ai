import React from 'react';
import { Button } from '../components/Button';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';

export const VictoryScreen: React.FC = () => {
  const { nemesis, setGamePhase } = useGameStore();
  const { handleLegacy, handleReset } = useGameActions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#242424] text-[#F4F4F0] border-8 border-[#0E0E0E] p-8 text-center">
      <h1 className="text-8xl font-black text-[#FFD21F] mb-4 uppercase tracking-wide font-display">VICTORY!</h1>
      <p className="text-2xl mb-4 font-bold">{nemesis?.name} has been defeated.</p>
      <p className="max-w-md mb-8 text-xl">The city is safe... for now. Your legend has only just begun.</p>
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <Button variant="secondary" onClick={() => setGamePhase('PLAYING')}>Continue Patrol</Button>
        <Button variant="hero" onClick={handleLegacy}>Retire & Pass Mantle</Button>
        <Button variant="danger" onClick={() => handleReset(true, 'VICTORY')}>End Story</Button>
      </div>
    </div>
  );
};
