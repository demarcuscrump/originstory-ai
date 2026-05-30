import React, { useState } from 'react';
import { ArchivedHero } from '../types';
import { Button } from './Button';

interface LongBoxProps {
  archives: ArchivedHero[];
  onClose: () => void;
  onClear: () => void;
}

export const LongBox: React.FC<LongBoxProps> = ({ archives, onClose, onClear }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (hero: ArchivedHero, e: React.MouseEvent) => {
      e.stopPropagation();
      const summary = `ORIGIN STORY ARCHIVE
-------------------
Hero: ${hero.heroName}
Alias: ${hero.civilianName}
Tone: ${hero.universe}
Active: ${hero.weeksActive} Weeks
Outcome: ${hero.outcome}

STATS:
Wealth: ${hero.finalStats.wealth}
Glory: ${hero.finalStats.glory}
Justice: ${hero.finalStats.justice}

Play Origin Story today!`;
      
      navigator.clipboard.writeText(summary);
      setCopiedId(hero.id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] w-full max-w-4xl h-[82dvh] flex flex-col shadow-comic-lg text-[#F4F4F0] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#202020] text-[#F4F4F0] p-4 border-b-2 border-[#0E0E0E] flex justify-between items-center">
            <div>
                 <h2 className="font-black italic text-3xl uppercase tracking-tighter text-[#FFD21F]">THE LONG BOX</h2>
                 <p className="text-xs font-mono text-[#B8B8B0]">COLLECTION SIZE: {archives.length} ISSUES</p>
            </div>
            <button onClick={onClose} className="rounded-full text-[#F4F4F0] hover:text-[#FFD21F] font-bold text-sm border border-[#515151] px-3 py-2">CLOSE</button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#242424] relative comic-scrollbar">
             {/* Background Texture */}
             <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[length:16px_16px] opacity-10 pointer-events-none"></div>

             {archives.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-50">
                     <div className="w-20 h-20 mb-4 border-2 border-[#0E0E0E] rounded-3xl bg-[#3E3E3E] flex items-center justify-center font-black text-[#FFD21F]">
                       BOX
                     </div>
                     <p className="font-comic text-xl">Your collection is empty.</p>
                     <p className="text-sm">Complete a story to archive it here.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {archives.map(hero => (
                         <div key={hero.id} className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-comic transition-transform hover:-translate-y-2 hover:shadow-comic-lg cursor-pointer group relative overflow-hidden">
                             <div className="bg-[#202020] text-[#F4F4F0] px-3 py-2 flex justify-between items-center text-[10px] font-bold uppercase">
                                 <span>{new Date(hero.date).toLocaleDateString()}</span>
                                 <span className={hero.outcome === 'VICTORY' ? 'text-[#FFD21F]' : 'text-[#F2B6AA]'}>{hero.outcome}</span>
                             </div>
                             
                             <div className="aspect-[2/3] w-full bg-[#46505A] border-b-2 border-[#0E0E0E] relative overflow-hidden">
                                 {hero.coverImage ? (
                                     <img src={hero.coverImage} alt="Cover" className="w-full h-full object-contain" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-[#242424] text-[#F4F4F0] font-black text-4xl opacity-30 rotate-45">
                                         NO COVER
                                     </div>
                                 )}
                                 
                                 {/* Price Badge */}
                                 <div className="absolute top-2 right-2 bg-[#FFD21F] text-[#161616] border-2 border-[#0E0E0E] rounded-full w-12 h-12 flex items-center justify-center transform rotate-12 shadow-sm">
                                     <div className="text-center leading-none">
                                         <span className="block text-[8px] font-bold">WEEK</span>
                                         <span className="block text-lg font-black">{hero.weeksActive}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="p-3">
                                 <div className="flex justify-between items-start">
                                    <h3 className="font-black text-xl leading-none mb-1 text-[#FFD21F] truncate flex-1">{hero.heroName}</h3>
                                    <button 
                                        onClick={(e) => handleShare(hero, e)}
                                        className="text-[10px] rounded-full border border-[#515151] px-2 py-1 hover:bg-[#4A4A4A] ml-2"
                                    >
                                        {copiedId === hero.id ? 'COPIED!' : 'SHARE'}
                                    </button>
                                 </div>
                                 <p className="text-xs font-mono text-[#B8B8B0] mb-2 truncate">aka {hero.civilianName}</p>
                                 <div className="flex flex-wrap gap-1">
                                     <span className="text-[10px] border border-[#515151] px-2 py-0.5 rounded-full bg-[#2B2B2B]">{hero.origin}</span>
                                     <span className="text-[10px] border border-[#515151] px-2 py-0.5 rounded-full bg-[#2B2B2B]">{hero.universe}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="bg-[#202020] border-t-2 border-[#0E0E0E] p-4 flex justify-between items-center">
            <p className="text-xs text-[#B8B8B0] font-mono">Archive storage is local.</p>
            {archives.length > 0 && (
                <Button variant="danger" onClick={onClear} className="text-xs py-2 px-4">BURN COLLECTION</Button>
            )}
        </div>

      </div>
    </div>
  );
};
