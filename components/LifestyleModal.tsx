import React from 'react';
import { Asset, Stats } from '../types';
import { audio } from '../services/audioService';

interface LifestyleModalProps {
  assets: Asset[];
  stats: Stats;
  onPurchase: (assetId: string) => void;
  onClose: () => void;
}

export const LifestyleModal: React.FC<LifestyleModalProps> = ({ assets, stats, onPurchase, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg max-w-2xl w-full max-h-[90dvh] flex flex-col relative animate-fade-in text-[#F4F4F0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#202020] text-[#F4F4F0] p-4 flex justify-between items-center border-b-2 border-[#0E0E0E]">
          <h2 className="font-black text-2xl tracking-wide uppercase text-[#FFD21F]">
            REAL ESTATE & LIFESTYLE
          </h2>
          <button 
            onClick={() => { audio.playClick(); onClose(); }}
            className="rounded-full text-[#F4F4F0] font-bold text-sm hover:text-[#FFD21F] transition-colors border border-[#515151] px-3 py-2"
          >
            CLOSE
          </button>
        </div>

        {/* Wealth Display */}
        <div className="bg-[#2B2B2B] text-[#F4F4F0] p-2 text-center font-bold border-b-2 border-[#0E0E0E] flex justify-between px-4">
            <span>AVAILABLE WEALTH: ${stats.wealth.toLocaleString()}</span>
            <span className="text-xs text-[#B8B8B0]">Passive Income/Bonuses Apply Per Turn</span>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-[#242424] comic-scrollbar">
          {assets.map((asset) => (
            <div key={asset.id} className={`rounded-[24px] border-2 border-[#0E0E0E] p-4 flex flex-col md:flex-row justify-between gap-4 ${asset.purchased ? 'bg-[#25382E]' : 'bg-[#343434]'} hover:-translate-y-1 transition-transform shadow-comic`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#2B2B2B] text-[#FFD21F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {asset.type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-lg uppercase">{asset.name}</h3>
                </div>
                <p className="text-sm font-mono text-[#D8D8D2] mb-2">{asset.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-bold bg-[#3B2422] text-[#FFD7D2] px-2 py-1 border border-[#D85A4F] rounded-full inline-block">
                        Upkeep: -${asset.upkeep}/wk
                    </span>
                    <span className="text-xs font-bold bg-[#FFD21F] text-[#161616] px-2 py-1 border border-[#0E0E0E] rounded-full inline-block">
                        Bonus: +{asset.passiveBonus.amount} {asset.passiveBonus.stat.toUpperCase()}/wk
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-end md:w-32 shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-[#515151] pt-2 md:pt-0 pl-0 md:pl-4">
                {asset.purchased ? (
                  <div className="font-black text-[#2DD38F] text-xl">
                    OWNED
                  </div>
                ) : (
                  <button
                    onClick={() => onPurchase(asset.id)}
                    disabled={stats.wealth < asset.cost}
                    className={`w-full py-2 font-bold rounded-full border-2 border-[#0E0E0E] shadow-comic transition-transform active:translate-y-1 active:shadow-none ${
                        stats.wealth >= asset.cost 
                        ? 'bg-[#FFD21F] hover:bg-[#FFE45A] text-[#161616]'
                        : 'bg-[#3E3E3E] text-[#B8B8B0] cursor-not-allowed'
                    }`}
                  >
                    BUY<br/>${asset.cost}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};
