import React, { useState } from 'react';
import { Stats, Upgrade, Character, Alignment } from '../types';
import { Button } from './Button';

interface LairModalProps {
  character: Character;
  stats: Stats;
  upgrades: Upgrade[];
  onPurchase: (upgradeId: string) => void;
  onUpgradeSuit: () => void;
  onClose: () => void;
}

const costTextColor = (costType: Upgrade['costType']) => {
  if (costType === 'wealth') return 'text-[#FFD21F]';
  if (costType === 'justice') return 'text-[#8EA0AB]';
  return 'text-[#D85A4F]';
};

export const LairModal: React.FC<LairModalProps> = ({ character, stats, upgrades, onPurchase, onUpgradeSuit, onClose }) => {
  const [activeTab, setActiveTab] = useState<'UPGRADES' | 'SUIT'>('UPGRADES');
  const canAffordSuit = stats.wealth >= 50 && stats.glory >= 20;
  const justiceLabel = character.alignment === Alignment.VILLAIN ? 'INFAMY' : (character.alignment === Alignment.ANTI_HERO ? 'VENGEANCE' : 'JUSTICE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] w-full max-w-3xl shadow-comic-lg flex flex-col max-h-[90dvh] text-[#F4F4F0] overflow-hidden">
        <header className="bg-[#202020] p-4 border-b-2 border-[#0E0E0E] flex justify-between items-center text-[#F4F4F0]">
          <div>
            <h2 className="font-black text-2xl tracking-wide uppercase text-[#FFD21F]">Secret Lair</h2>
            <p className="text-xs font-mono text-[#B8B8B0]">Upgrades, suit work, and operational prep</p>
          </div>
          <button onClick={onClose} className="rounded-full text-[#F4F4F0] hover:text-[#FFD21F] font-bold text-sm border border-[#515151] px-3 py-2">CLOSE</button>
        </header>

        <div className="flex border-b-2 border-[#0E0E0E] bg-[#2B2B2B]">
          <button
            onClick={() => setActiveTab('UPGRADES')}
            className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'UPGRADES' ? 'bg-[#FFD21F] text-[#161616]' : 'text-[#B8B8B0] hover:bg-[#3E3E3E]'}`}
          >
            Base Upgrades
          </button>
          <button
            onClick={() => setActiveTab('SUIT')}
            className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'SUIT' ? 'bg-[#FFD21F] text-[#161616]' : 'text-[#B8B8B0] hover:bg-[#3E3E3E]'}`}
          >
            Suit Workshop
          </button>
        </div>

        <div className="bg-[#2B2B2B] p-3 grid grid-cols-3 gap-2 border-b-2 border-[#0E0E0E] font-mono text-center">
          <div className="rounded-2xl border border-[#515151] bg-[#3E3E3E] p-2">
            <div className="text-[#B8B8B0] text-xs">WEALTH</div>
            <div className="text-[#FFD21F] font-bold text-lg">${stats.wealth}</div>
          </div>
          <div className="rounded-2xl border border-[#515151] bg-[#3E3E3E] p-2">
            <div className="text-[#B8B8B0] text-xs">{justiceLabel}</div>
            <div className="text-[#8EA0AB] font-bold text-lg">{stats.justice}</div>
          </div>
          <div className="rounded-2xl border border-[#515151] bg-[#3E3E3E] p-2">
            <div className="text-[#B8B8B0] text-xs">GLORY</div>
            <div className="text-[#D85A4F] font-bold text-lg">{stats.glory}</div>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-[#242424] comic-scrollbar">
          {activeTab === 'UPGRADES' && (
            <div className="space-y-3">
              {upgrades.map((upgrade) => {
                const canAfford =
                  (upgrade.costType === 'wealth' && stats.wealth >= upgrade.costAmount) ||
                  (upgrade.costType === 'justice' && stats.justice >= upgrade.costAmount) ||
                  (upgrade.costType === 'glory' && stats.glory >= upgrade.costAmount);
                const costLabel = upgrade.costType === 'justice' ? justiceLabel : upgrade.costType.toUpperCase();

                return (
                  <div key={upgrade.id} className={`rounded-[24px] border-2 p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${upgrade.purchased ? 'border-[#2DD38F] bg-[#25382E]' : 'border-[#0E0E0E] bg-[#343434]'}`}>
                    <div className="flex-1">
                      <h3 className="font-black uppercase text-lg text-[#F4F4F0]">
                        {upgrade.name}
                        {upgrade.purchased && <span className="ml-2 text-xs bg-[#2DD38F] text-[#161616] px-2 py-1 rounded-full">ACTIVE</span>}
                      </h3>
                      <p className="text-sm text-[#D8D8D2] mb-1">{upgrade.description}</p>
                      <p className="text-xs text-[#B8B8B0] font-mono">
                        Effect: {upgrade.type === 'COMFORT' ? '+5 Sanity on Rest' : (upgrade.type === 'INTEL' ? `+5 ${justiceLabel} on Investigate` : '+20 Combat Power')}
                      </p>
                    </div>

                    <div className="text-center min-w-[130px]">
                      {upgrade.purchased ? (
                        <div className="text-[#CFFFF0] font-bold border border-[#2DD38F] rounded-full px-3 py-2 font-mono text-sm">INSTALLED</div>
                      ) : (
                        <Button
                          onClick={() => onPurchase(upgrade.id)}
                          disabled={!canAfford}
                          className={`text-xs w-full ${!canAfford ? 'opacity-50' : ''}`}
                          variant="secondary"
                        >
                          BUY <span className={costTextColor(upgrade.costType)}>{upgrade.costAmount} {costLabel}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {upgrades.length === 0 && (
                <div className="text-center text-[#B8B8B0] font-mono animate-pulse">
                  ANALYZING BLUEPRINTS...
                </div>
              )}
            </div>
          )}

          {activeTab === 'SUIT' && (
            <div className="flex flex-col items-center justify-center space-y-6 min-h-[360px]">
              <div className="w-full bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] p-6 text-center">
                <h3 className="text-[#B8B8B0] font-bold uppercase tracking-widest mb-2">Current Configuration</h3>
                <p className="font-mono text-[#F4F4F0] text-lg">
                  "{character.costume || 'Standard Issue Vigilante Gear'}"
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <div className="text-sm text-[#B8B8B0] font-mono">FABRICATION COST</div>
                  <div className="font-bold text-xl text-[#F4F4F0]">50 WEALTH + 20 GLORY</div>
                </div>
                <Button
                  onClick={onUpgradeSuit}
                  disabled={!canAffordSuit}
                  variant={canAffordSuit ? 'primary' : 'secondary'}
                  className={!canAffordSuit ? 'opacity-50' : ''}
                >
                  DESIGN NEW SUIT
                </Button>
                <p className="text-xs text-[#B8B8B0] mt-4 max-w-xs mx-auto">
                  This consumes resources to generate a new suit design based on your current reputation and finances.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
