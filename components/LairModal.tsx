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

export const LairModal: React.FC<LairModalProps> = ({ character, stats, upgrades, onPurchase, onUpgradeSuit, onClose }) => {
  const [activeTab, setActiveTab] = useState<'UPGRADES' | 'SUIT'>('UPGRADES');
  const canAffordSuit = stats.wealth >= 50 && stats.glory >= 20;

  const justiceLabel = character.alignment === Alignment.VILLAIN ? 'INFAMY' : (character.alignment === Alignment.ANTI_HERO ? 'VENGEANCE' : 'JUSTICE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-blue-900 border-4 border-blue-400 w-full max-w-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-950 p-4 border-b-2 border-blue-400 flex justify-between items-center">
            <div>
                 <h2 className="text-blue-300 font-mono text-2xl font-bold tracking-widest uppercase">SECRET LAIR</h2>
                 <p className="text-blue-500 text-xs font-mono">AUTHORIZED PERSONNEL ONLY</p>
            </div>
            <button onClick={onClose} className="text-blue-400 hover:text-white font-mono font-bold">[EXIT SYSTEM]</button>
        </div>

        {/* Navigation */}
        <div className="flex border-b-2 border-blue-400">
            <button 
                onClick={() => setActiveTab('UPGRADES')}
                className={`flex-1 py-3 font-mono font-bold transition-colors ${activeTab === 'UPGRADES' ? 'bg-blue-800 text-white' : 'bg-blue-950 text-blue-500 hover:bg-blue-900'}`}
            >
                BASE UPGRADES
            </button>
            <button 
                onClick={() => setActiveTab('SUIT')}
                className={`flex-1 py-3 font-mono font-bold transition-colors ${activeTab === 'SUIT' ? 'bg-blue-800 text-white' : 'bg-blue-950 text-blue-500 hover:bg-blue-900'}`}
            >
                SUIT WORKSHOP
            </button>
        </div>

        {/* Resources */}
        <div className="bg-black/50 p-4 grid grid-cols-3 gap-2 border-b-2 border-blue-400 font-mono text-center">
             <div className="border border-blue-800 p-2">
                 <div className="text-blue-500 text-xs">WEALTH</div>
                 <div className="text-yellow-400 font-bold text-lg">${stats.wealth}</div>
             </div>
             <div className="border border-blue-800 p-2">
                 <div className="text-blue-500 text-xs">{justiceLabel}</div>
                 <div className="text-blue-300 font-bold text-lg">{stats.justice}</div>
             </div>
             <div className="border border-blue-800 p-2">
                 <div className="text-blue-500 text-xs">GLORY</div>
                 <div className="text-red-400 font-bold text-lg">{stats.glory}</div>
             </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
            
            {activeTab === 'UPGRADES' && (
                <div className="space-y-4">
                    {upgrades.map(upgrade => {
                        let canAfford = false;
                        if (upgrade.costType === 'wealth' && stats.wealth >= upgrade.costAmount) canAfford = true;
                        if (upgrade.costType === 'justice' && stats.justice >= upgrade.costAmount) canAfford = true;
                        if (upgrade.costType === 'glory' && stats.glory >= upgrade.costAmount) canAfford = true;

                        const costColor = upgrade.costType === 'wealth' ? 'text-yellow-400' : (upgrade.costType === 'justice' ? 'text-blue-300' : 'text-red-400');
                        const costLabel = upgrade.costType === 'justice' ? justiceLabel : upgrade.costType.toUpperCase();

                        return (
                            <div key={upgrade.id} className={`border-2 p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${upgrade.purchased ? 'border-green-500 bg-green-900/20' : 'border-blue-700 bg-blue-900/40'}`}>
                                <div className="flex-1">
                                    <h3 className={`font-black uppercase text-lg ${upgrade.purchased ? 'text-green-400' : 'text-white'}`}>
                                        {upgrade.name} 
                                        {upgrade.purchased && <span className="ml-2 text-xs bg-green-600 text-black px-1 rounded">ACTIVE</span>}
                                    </h3>
                                    <p className="text-blue-200 text-sm font-mono mb-1">{upgrade.description}</p>
                                    <p className="text-xs text-gray-400 font-mono">
                                        Effect: {upgrade.type === 'COMFORT' ? '+5 Sanity on Rest' : (upgrade.type === 'INTEL' ? `+5 ${justiceLabel} on Investigate` : '+20 Combat Power')}
                                    </p>
                                </div>
                                
                                <div className="text-center min-w-[120px]">
                                    {upgrade.purchased ? (
                                        <div className="text-green-500 font-bold border border-green-500 px-3 py-1 font-mono text-sm">INSTALLED</div>
                                    ) : (
                                        <Button 
                                            onClick={() => onPurchase(upgrade.id)} 
                                            disabled={!canAfford}
                                            className={`text-xs w-full ${!canAfford ? 'opacity-50' : ''}`}
                                            variant="secondary"
                                        >
                                            BUY <span className={costColor}>{upgrade.costAmount} {costLabel}</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                     {upgrades.length === 0 && (
                        <div className="text-center text-blue-500 font-mono animate-pulse">
                            ANALYZING BLUEPRINTS...
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'SUIT' && (
                <div className="flex flex-col items-center justify-center space-y-6 h-full">
                    <div className="w-full bg-black/40 border-2 border-blue-500 p-6 text-center">
                        <h3 className="text-blue-300 font-bold uppercase tracking-widest mb-2">Current Configuration</h3>
                        <p className="font-mono text-white text-lg">
                            "{character.costume || "Standard Issue Vigilante Gear"}"
                        </p>
                    </div>

                    <div className="text-center">
                         <div className="mb-4">
                             <div className="text-sm text-blue-400 font-mono">FABRICATION COST</div>
                             <div className="font-bold text-xl text-white">50 WEALTH + 20 GLORY</div>
                         </div>
                         <Button 
                            onClick={onUpgradeSuit} 
                            disabled={!canAffordSuit}
                            variant={canAffordSuit ? "primary" : "secondary"}
                            className={!canAffordSuit ? "opacity-50" : "animate-pulse"}
                         >
                            DESIGN NEW SUIT
                         </Button>
                         <p className="text-xs text-blue-500 mt-4 max-w-xs mx-auto font-mono">
                            WARNING: This will consume resources to generate a new suit design based on your current reputation and finances.
                         </p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};