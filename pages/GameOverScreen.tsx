import React from 'react';
import { Button } from '../components/Button';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';

export const GameOverScreen: React.FC = () => {
  const { stats, gameOverReason } = useGameStore();
  const { handleRetcon, handleLegacy, handleReset } = useGameActions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center border-8 border-comic-red">
      <h1 className="text-8xl font-black text-comic-red mb-4 uppercase tracking-tighter font-display">GAME OVER</h1>
      <p className="text-2xl mb-2 font-bold uppercase">{gameOverReason}</p>
      <p className="text-sm font-mono text-gray-400 mb-8">The story ends here...</p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {stats.retconPoints > 0 && (
          <Button variant="hero" onClick={handleRetcon} className="animate-pulse">
            USE RETCON ({stats.retconPoints} LEFT)
          </Button>
        )}

        <Button variant="secondary" onClick={handleLegacy}>
          CONTINUE LEGACY (START AS SUCCESSOR)
        </Button>

        <Button variant="danger" onClick={() => handleReset(true, 'DEFEATED')}>
          REBOOT UNIVERSE (RESET)
        </Button>
      </div>
    </div>
  );
};
