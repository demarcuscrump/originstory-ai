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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-2xl h-[80vh] flex flex-col shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 border-b-4 border-black flex justify-between items-center">
            <div>
                 <h2 className="font-black italic text-2xl uppercase tracking-tighter">TEAM ROSTER</h2>
                 <p className="text-xs font-mono opacity-80">Manage Allies & Sidekicks</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-yellow-300 font-bold text-xl">[X]</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 relative">
             <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] bg-[length:16px_16px] opacity-10 pointer-events-none"></div>
             
             {sidekicks.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-50">
                     <div className="text-6xl mb-4">🦸</div>
                     <p className="font-comic text-xl">You fight alone.</p>
                     <p className="text-sm">Recruit allies to expand your influence.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                     {sidekicks.map(sk => (
                         <div key={sk.id} className="bg-white border-2 border-black shadow-comic p-3 flex flex-col">
                             <div className="flex justify-between items-start mb-2 border-b border-black pb-2">
                                 <div>
                                     <h3 className="font-black text-lg leading-none text-indigo-700">{sk.name}</h3>
                                     <p className="text-xs text-gray-500">{sk.archetype}</p>
                                 </div>
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${sk.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                     {sk.status}
                                 </span>
                             </div>
                             
                             <p className="text-xs italic text-gray-600 mb-3 line-clamp-2">
                                 "{sk.description}"
                             </p>

                             <div className="mt-auto space-y-2">
                                 <div className="flex justify-between text-xs font-mono font-bold text-gray-500">
                                     <span>LOYALTY: {sk.loyalty}%</span>
                                     <span>{sk.specialty}</span>
                                 </div>
                                 
                                 {sk.status === 'ACTIVE' ? (
                                    <div className="grid grid-cols-3 gap-1">
                                        <button 
                                            onClick={() => onMission(sk.id, 'COMBAT')}
                                            className="bg-red-100 hover:bg-red-200 border border-black text-[10px] font-bold py-1"
                                        >
                                            PATROL
                                        </button>
                                        <button 
                                            onClick={() => onMission(sk.id, 'INTEL')}
                                            className="bg-blue-100 hover:bg-blue-200 border border-black text-[10px] font-bold py-1"
                                        >
                                            SCOUT
                                        </button>
                                        <button 
                                            onClick={() => onMission(sk.id, 'SUPPORT')}
                                            className="bg-green-100 hover:bg-green-200 border border-black text-[10px] font-bold py-1"
                                        >
                                            PR
                                        </button>
                                    </div>
                                 ) : (
                                     <div className="bg-gray-200 text-center py-1 text-xs font-bold text-gray-500 border border-gray-300">
                                         UNAVAILABLE
                                     </div>
                                 )}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t-4 border-black p-4 flex flex-col md:flex-row justify-between items-center gap-4">
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
        </div>

      </div>
    </div>
  );
};