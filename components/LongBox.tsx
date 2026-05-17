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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-4xl h-[80vh] flex flex-col shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="bg-comic-blue text-white p-4 border-b-4 border-black flex justify-between items-center">
            <div>
                 <h2 className="font-black italic text-3xl uppercase tracking-tighter">THE LONG BOX</h2>
                 <p className="text-xs font-mono opacity-80">COLLECTION SIZE: {archives.length} ISSUES</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-yellow-300 font-bold text-xl">[X]</button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 relative">
             {/* Background Texture */}
             <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[length:16px_16px] opacity-10 pointer-events-none"></div>

             {archives.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-50">
                     <div className="text-6xl mb-4">🕸️</div>
                     <p className="font-comic text-xl">Your collection is empty.</p>
                     <p className="text-sm">Complete a story to archive it here.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {archives.map(hero => (
                         <div key={hero.id} className="bg-white border-4 border-black shadow-comic transition-transform hover:-translate-y-2 hover:shadow-comic-lg cursor-pointer group relative">
                             <div className="bg-black text-white px-2 py-1 flex justify-between items-center text-[10px] font-bold uppercase">
                                 <span>{new Date(hero.date).toLocaleDateString()}</span>
                                 <span className={hero.outcome === 'VICTORY' ? 'text-yellow-400' : 'text-red-400'}>{hero.outcome}</span>
                             </div>
                             
                             <div className="aspect-[2/3] w-full bg-gray-200 border-b-4 border-black relative overflow-hidden">
                                 {hero.coverImage ? (
                                     <img src={hero.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-black text-4xl opacity-20 rotate-45">
                                         NO COVER
                                     </div>
                                 )}
                                 
                                 {/* Price Badge */}
                                 <div className="absolute top-2 right-2 bg-yellow-400 text-black border-2 border-black rounded-full w-12 h-12 flex items-center justify-center transform rotate-12 shadow-sm">
                                     <div className="text-center leading-none">
                                         <span className="block text-[8px] font-bold">WEEK</span>
                                         <span className="block text-lg font-black">{hero.weeksActive}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="p-3">
                                 <div className="flex justify-between items-start">
                                    <h3 className="font-black text-xl leading-none mb-1 text-comic-blue truncate flex-1">{hero.heroName}</h3>
                                    <button 
                                        onClick={(e) => handleShare(hero, e)}
                                        className="text-[10px] border border-black px-1 hover:bg-yellow-300 ml-2"
                                    >
                                        {copiedId === hero.id ? 'COPIED!' : 'SHARE'}
                                    </button>
                                 </div>
                                 <p className="text-xs font-mono text-gray-500 mb-2 truncate">aka {hero.civilianName}</p>
                                 <div className="flex flex-wrap gap-1">
                                     <span className="text-[10px] border border-black px-1 bg-gray-100">{hero.origin}</span>
                                     <span className="text-[10px] border border-black px-1 bg-gray-100">{hero.universe}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t-4 border-black p-4 flex justify-between items-center">
            <p className="text-xs text-gray-500 font-mono">Archive storage is local.</p>
            {archives.length > 0 && (
                <Button variant="danger" onClick={onClear} className="text-xs py-2 px-4">BURN COLLECTION</Button>
            )}
        </div>

      </div>
    </div>
  );
};