import React from 'react';
import { Button } from '../components/Button';
import { LongBox } from '../components/LongBox';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';
import { audio } from '../services/audioService';

export const TitleScreen: React.FC = () => {
  const { archives, activeModal, hydrated, setActiveModal, setGamePhase, setArchives } = useGameStore();
  const hasSave = hydrated && useGameStore.getState().character !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper relative overflow-hidden font-display border-x-4 border-black max-w-2xl mx-auto shadow-2xl">
      <div className="absolute inset-0 opacity-20 animate-float" style={{ backgroundImage: 'radial-gradient(circle, #4D96FF 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>

      <div className="relative z-10 text-center p-8 border-4 border-white bg-comic-red shadow-[0_0_50px_rgba(255,107,107,0.5)]">
        <h1 className="text-8xl md:text-9xl font-black text-white italic tracking-widest drop-shadow-[5px_5px_0px_#000]">
          ORIGIN<br />STORY
        </h1>
        <p className="text-black font-bold bg-yellow-400 inline-block px-4 py-1 text-2xl mt-4 border-2 border-black shadow-comic">
          CREATE YOUR LEGEND
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 w-72 relative z-10">
        <Button
          variant="primary"
          onClick={() => { audio.playClick(); setGamePhase('CREATION'); }}
          className="animate-fade-in-up text-xl py-4"
        >
          START NEW ISSUE
        </Button>

        {hasSave && (
          <Button
            variant="hero"
            onClick={() => { audio.playFanfare(); setGamePhase('PLAYING'); }}
            className="animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            CONTINUE STORY
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => { audio.playClick(); setActiveModal('LONGBOX'); }}
          className="animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          LONG BOX (ARCHIVES)
        </Button>
      </div>

      <div className="absolute bottom-4 text-gray-500 text-xs font-mono">
        v2.0.0
      </div>

      {activeModal === 'LONGBOX' && (
        <LongBox
          archives={archives}
          onClose={() => setActiveModal(null)}
          onClear={() => setArchives([])}
        />
      )}
    </div>
  );
};
