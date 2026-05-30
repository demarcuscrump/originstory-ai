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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] w-full max-w-md relative shadow-comic-lg text-[#F4F4F0] overflow-hidden">
        <header className="bg-[#202020] text-[#F4F4F0] p-3 border-b-2 border-[#0E0E0E] flex justify-between items-center">
          <h2 className="font-black text-xl uppercase tracking-wide text-[#FFD21F]">VS. Encounter</h2>
          <div className="bg-[#FFD21F] text-[#161616] text-xs font-bold px-3 py-1 rounded-full border border-[#0E0E0E]">
            POWER: {villain.powerLevel}
          </div>
        </header>

        <div className="bg-[#46505A] h-40 border-b-2 border-[#0E0E0E] flex items-center justify-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full border-2 border-[#0E0E0E] bg-[#FFD21F] flex items-center justify-center font-black text-[#161616] shadow-comic">
            VS
          </div>
          <div className="absolute bottom-2 left-2 bg-[#202020] text-[#F4F4F0] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {villain.loot} reward
          </div>
        </div>

        <div className="p-4 bg-[#343434]">
          <h3 className="font-black text-2xl uppercase mb-1 leading-none break-words">{villain.name}</h3>
          <p className="text-sm text-[#D8D8D2] italic border-l-4 border-[#D85A4F] pl-3 mb-4 break-words">
            "{villain.gimmick}"
          </p>

          <div className="space-y-2">
            <Button variant="hero" fullWidth onClick={() => onAction('CAPTURE')} disabled={!canCapture} className="text-xs">
              CAPTURE (JUSTICE {villain.powerLevel + 10}+)
            </Button>
            <Button variant="danger" fullWidth onClick={() => onAction('BRAWL')} disabled={!canBrawl} className="text-xs">
              BRAWL (RISK INJURY)
            </Button>
            <Button variant="secondary" fullWidth onClick={() => onAction('OUTSMART')} disabled={!canOutsmart} className="text-xs">
              OUTSMART (SPEND RESOURCES)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
