import React from 'react';
import { MinorVillain, Stats } from '../types';
import { Button } from './Button';

interface VillainModalProps {
  villain: MinorVillain;
  currentStats: Stats;
  onAction: (actionType: 'CAPTURE' | 'BRAWL' | 'OUTSMART') => void;
}

export const VillainModal: React.FC<VillainModalProps> = ({ villain, currentStats, onAction }) => {
  
  const canCapture = currentStats.justice > villain.powerLevel + 10;
  const canBrawl = currentStats.sanity > 20; 
  const canOutsmart = currentStats.wealth > 20 || currentStats.glory > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-sm relative shadow-comic">
        
        {/* Header */}
        <div className="bg-purple-600 text-white p-3 border-b-4 border-black flex justify-between items-center">
            <h2 className="font-black italic text-xl uppercase tracking-tighter">VS. ENCOUNTER</h2>
            <div className="bg-white text-black text-xs font-bold px-2 py-1 border border-black">
                POWER: {villain.powerLevel}
            </div>
        </div>

        {/* Card Art Area */}
        <div className="bg-purple-200 h-40 border-b-4 border-black flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
                <span className="text-6xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">🦹</span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black text-white px-2 text-[10px] font-bold uppercase">
                {villain.loot} REWARD
            </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-white">
            <h3 className="font-black text-2xl uppercase mb-1 leading-none break-words">{villain.name}</h3>
            <p className="font-comic text-sm text-gray-700 italic border-l-4 border-purple-500 pl-2 mb-4 break-words line-clamp-3">
                "{villain.gimmick}"
            </p>

            <div className="space-y-2">
                <Button 
                    variant="hero" 
                    fullWidth 
                    onClick={() => onAction('CAPTURE')}
                    disabled={!canCapture}
                    className="text-xs"
                >
                    CAPTURE (JUSTICE {villain.powerLevel + 10}+)
                </Button>
                
                <Button 
                    variant="danger" 
                    fullWidth 
                    onClick={() => onAction('BRAWL')}
                    disabled={!canBrawl}
                    className="text-xs"
                >
                    BRAWL (RISK INJURY)
                </Button>

                <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={() => onAction('OUTSMART')}
                    disabled={!canOutsmart}
                    className="text-xs"
                >
                    OUTSMART (SPEND RESOURCES)
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};