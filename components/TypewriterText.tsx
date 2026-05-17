import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../services/audioService';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  const timer = useRef<number | null>(null);
  
  // If the text prop changes completely, reset (useful if reusing component, though we mostly key it)
  useEffect(() => {
    setDisplayedText('');
    index.current = 0;
  }, [text]);

  useEffect(() => {
    // If we've already finished this text, don't restart
    if (index.current >= text.length) return;

    timer.current = window.setInterval(() => {
      if (index.current < text.length) {
        const char = text.charAt(index.current);
        setDisplayedText((prev) => prev + char);
        index.current++;
        
        // Play sound occasionally to avoid spamming
        if (index.current % 3 === 0 && char !== ' ') {
            audio.playType();
        }
      } else {
        if (timer.current) clearInterval(timer.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, speed, onComplete]);

  // Fallback: If text is empty or very short, just show it
  if (!text) return null;

  return <span>{displayedText}</span>;
};