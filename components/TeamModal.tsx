import React from 'react';
import { Sidekick, Stats } from '../types';
import { Button } from './Button';

interface TeamModalProps {
  sidekicks: Sidekick[];
  stats: Stats;
  onRecruit: () => void;
  onMission: (sidekickId: string, type: 'COMBAT' | 'INTEL' | 'SUPPORT') => void;
  onClose: () => void;
  isLoading: boolean;
}

export const TeamModal: React.FC<TeamModalProps> = ({ sidekicks, stats, onRecruit, onMission, onClose, isLoading }) => {
  const recruitCost = 50;
  const canRecruit = stats.glory >= recruitCost && sidekicks.length < 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] w-full max-w-3xl h-[82dvh] flex flex-col shadow-comic-lg text-[#F4F4F0] overflow-hidden">
        <header className="bg-[#202020] text-[#F4F4F0] p-4 border-b-2 border-[#0E0E0E] flex justify-between items-center">
          <div>
            <h2 className="font-black text-2xl uppercase tracking-wide text-[#FFD21F]">Team Roster</h2>
            <p className="text-xs font-mono text-[#B8B8B0]">Manage allies, sidekicks, and off-panel missions</p>
          </div>
          <button onClick={onClose} className="rounded-full text-[#F4F4F0] hover:text-[#FFD21F] font-bold text-sm border border-[#515151] px-3 py-2">CLOSE</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 bg-[#242424] comic-scrollbar">
          {sidekicks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#B8B8B0] text-center">
              <div className="w-20 h-20 mb-4 border-2 border-[#0E0E0E] rounded-3xl bg-[#3E3E3E] flex items-center justify-center font-black text-[#FFD21F] shadow-comic">
                TEAM
              </div>
              <p className="font-black text-xl text-[#F4F4F0]">You fight alone.</p>
              <p className="text-sm mt-1">Recruit allies to expand your influence.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sidekicks.map((sk) => (
                <div key={sk.id} className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-comic p-3 flex flex-col">
                  <div className="flex justify-between items-start mb-2 border-b border-[#515151] pb-2">
                    <div>
                      <h3 className="font-black text-lg leading-none text-[#FFD21F]">{sk.name}</h3>
                      <p className="text-xs text-[#B8B8B0]">{sk.archetype}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${sk.status === 'ACTIVE' ? 'bg-[#25382E] text-[#CFFFF0]' : 'bg-[#3F3720] text-[#FFECA0]'}`}>
                      {sk.status}
                    </span>
                  </div>

                  <p className="text-xs italic text-[#D8D8D2] mb-3 max-h-16 overflow-hidden">
                    "{sk.description}"
                  </p>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-[#B8B8B0]">
                      <span>LOYALTY: {sk.loyalty}%</span>
                      <span>{sk.specialty}</span>
                    </div>

                    {sk.status === 'ACTIVE' ? (
                      <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => onMission(sk.id, 'COMBAT')} className="bg-[#3B2422] hover:bg-[#4A2B28] border border-[#D85A4F] rounded-full text-[10px] font-bold py-2">
                          PATROL
                        </button>
                        <button onClick={() => onMission(sk.id, 'INTEL')} className="bg-[#2B2B2B] hover:bg-[#3E3E3E] border border-[#515151] rounded-full text-[10px] font-bold py-2">
                          SCOUT
                        </button>
                        <button onClick={() => onMission(sk.id, 'SUPPORT')} className="bg-[#25382E] hover:bg-[#2E4639] border border-[#2DD38F] rounded-full text-[10px] font-bold py-2">
                          PR
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#2B2B2B] text-center py-2 text-xs font-bold text-[#B8B8B0] border border-[#515151] rounded-full">
                        UNAVAILABLE
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="bg-[#202020] border-t-2 border-[#0E0E0E] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono">
            <span className="font-bold">AVAILABLE GLORY:</span> {stats.glory}
          </div>
          <Button
            onClick={onRecruit}
            disabled={!canRecruit || isLoading}
            className={`text-xs ${!canRecruit ? 'opacity-50' : ''}`}
          >
            {isLoading ? 'SEARCHING...' : `RECRUIT SIDEKICK (${recruitCost} GLORY)`}
          </Button>
        </footer>
      </div>
    </div>
  );
};
