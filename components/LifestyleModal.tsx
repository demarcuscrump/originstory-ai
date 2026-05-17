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
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-comic max-w-2xl w-full max-h-[90vh] flex flex-col relative animate-fade-in">
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
          <h2 className="font-display italic text-2xl tracking-wide text-comic-yellow drop-shadow-[2px_2px_0_#FFF]">
            REAL ESTATE & LIFESTYLE
          </h2>
          <button 
            onClick={() => { audio.playClick(); onClose(); }}
            className="text-white font-bold text-xl hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Wealth Display */}
        <div className="bg-comic-blue text-white p-2 text-center font-bold border-b-4 border-black flex justify-between px-4">
            <span>AVAILABLE WEALTH: ${stats.wealth.toLocaleString()}</span>
            <span className="text-xs">Passive Income/Bonuses Apply Per Turn</span>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-paper">
          {assets.map((asset) => (
            <div key={asset.id} className={`border-4 border-black p-4 flex flex-col md:flex-row justify-between gap-4 ${asset.purchased ? 'bg-gray-200 opacity-70' : 'bg-white'} hover:-translate-y-1 transition-transform shadow-comic`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                        {asset.type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-lg uppercase">{asset.name}</h3>
                </div>
                <p className="text-sm font-mono text-gray-700 mb-2">{asset.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-bold bg-comic-red text-white px-2 py-1 border border-black inline-block">
                        Upkeep: -${asset.upkeep}/wk
                    </span>
                    <span className="text-xs font-bold bg-comic-yellow text-black px-2 py-1 border border-black inline-block">
                        Bonus: +{asset.passiveBonus.amount} {asset.passiveBonus.stat.toUpperCase()}/wk
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-end md:w-32 shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-black pt-2 md:pt-0 pl-0 md:pl-4">
                {asset.purchased ? (
                  <div className="font-display italic text-comic-blue text-2xl rotate-[-10deg] drop-shadow-[1px_1px_0_#000]">
                    OWNED
                  </div>
                ) : (
                  <button
                    onClick={() => onPurchase(asset.id)}
                    disabled={stats.wealth < asset.cost}
                    className={`w-full py-2 font-bold border-2 border-black shadow-comic transition-transform active:translate-y-1 active:shadow-none ${
                        stats.wealth >= asset.cost 
                        ? 'bg-comic-yellow hover:bg-yellow-400 text-black' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
