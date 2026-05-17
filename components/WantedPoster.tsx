import React from 'react';
import { Nemesis } from '../types';
import { Button } from './Button';

interface WantedPosterProps {
  nemesis: Nemesis;
  canConfront: boolean;
  onConfront: () => void;
}

export const WantedPoster: React.FC<WantedPosterProps> = ({ nemesis, canConfront, onConfront }) => {
  if (nemesis.defeated) {
    return (
      <div className="bg-green-100 border-4 border-green-800 p-2 shadow-sm mb-4 text-center">
        <h3 className="font-black text-green-800 uppercase tracking-widest text-lg">DEFEATED</h3>
        <p className="font-comic text-xs">{nemesis.name} is behind bars.</p>
      </div>
    );
  }

  const schemeProgress = nemesis.schemeProgress || 0;

  return (
    <div className="bg-paper border-4 border-black shadow-comic p-3 mb-4 relative overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="border-b-4 border-black pb-2 mb-2 text-center bg-comic-red -mx-3 -mt-3 pt-3">
            <h3 className="font-black text-2xl uppercase tracking-tighter text-white">WANTED</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">Dead or Alive</p>
        </div>

        <div className="bg-gray-200 h-32 md:h-40 flex items-center justify-center border-2 border-black mb-2 relative overflow-hidden shrink-0">
             {nemesis.imageUrl ? (
                 <img src={nemesis.imageUrl} alt={nemesis.name} className="w-full h-full object-cover grayscale contrast-125" />
             ) : nemesis.isGeneratingImage ? (
                 <div className="flex flex-col items-center justify-center animate-pulse">
                    <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mb-1"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Sketching Suspect...</span>
                 </div>
             ) : (
                 <span className="text-4xl text-gray-400">?</span>
             )}
             
             {canConfront && (
               <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center animate-pulse z-10">
                  <span className="text-red-600 font-black text-lg border-4 border-red-600 px-4 py-1 bg-white">FOUND</span>
               </div>
             )}
        </div>

        <div className="space-y-1 mb-3 min-w-0">
            <h4 className="font-black text-lg leading-tight break-words hyphens-auto">{nemesis.name}</h4>
            <p className="font-comic text-xs italic break-words">"{nemesis.epithet}"</p>
            <div className="text-xs font-mono border-t border-black pt-1 mt-2 space-y-1">
                <div className="flex justify-between">
                    <span className="font-bold">Threat:</span> 
                    <span className="truncate ml-1">{nemesis.archetype}</span>
                </div>
                <div><span className="font-bold">Power:</span> {nemesis.power}/100</div>
                <div>
                    <span className="font-bold text-red-600">Weakness:</span> 
                    <span className="break-words ml-1">{nemesis.weakness}</span>
                </div>
            </div>
        </div>
        
        {/* Scheme UI */}
        <div className="bg-gray-100 p-2 mb-3 border border-black mt-auto">
             <div className="flex justify-between items-center mb-1 min-w-0">
                 <h5 className="font-black text-[10px] uppercase text-red-800 truncate max-w-[70%]">
                    PLOT: {nemesis.schemeName || "UNKNOWN"}
                 </h5>
                 <span className="text-[10px] font-bold text-red-800">{schemeProgress}%</span>
             </div>
             
             <div className="w-full h-3 bg-white border border-black rounded-full overflow-hidden">
                 <div 
                    className={`h-full transition-all duration-700 ${schemeProgress > 80 ? 'bg-red-600 animate-pulse' : 'bg-red-400'}`}
                    style={{ width: `${schemeProgress}%` }}
                 ></div>
             </div>
        </div>

        {canConfront ? (
           <Button variant="danger" fullWidth onClick={onConfront} className="animate-bounce">
              CONFRONT!
           </Button>
        ) : (
           <div className="bg-gray-200 text-gray-500 text-xs font-bold text-center py-2 border-2 border-gray-300">
              GATHER INTEL TO FIGHT
              <div className="text-[10px] font-normal mt-1 text-gray-400">(Need 30 Justice / 10 Glory)</div>
           </div>
        )}
    </div>
  );
};