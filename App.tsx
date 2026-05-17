import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { TitleScreen } from './pages/TitleScreen';
import { CreationScreen } from './pages/CreationScreen';
import { PlayingScreen } from './pages/PlayingScreen';
import { GameOverScreen } from './pages/GameOverScreen';
import { VictoryScreen } from './pages/VictoryScreen';
import { audio } from './services/audioService';

function App() {
  const { gamePhase, activeTheme } = useGameStore();

  useEffect(() => {
    const initAudio = () => {
      audio.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  useEffect(() => {
    document.body.className = '';
    if (activeTheme === 'NOIR') document.body.classList.add('theme-noir');
    if (activeTheme === 'RETRO') document.body.classList.add('theme-retro');
    if (activeTheme === 'NEON') document.body.classList.add('theme-neon');
  }, [activeTheme]);

  switch (gamePhase) {
    case 'TITLE': return <TitleScreen />;
    case 'CREATION': return <CreationScreen />;
    case 'GAMEOVER': return <GameOverScreen />;
    case 'VICTORY': return <VictoryScreen />;
    case 'PLAYING': return <PlayingScreen />;
    default: return <TitleScreen />;
  }
}

export default App;
