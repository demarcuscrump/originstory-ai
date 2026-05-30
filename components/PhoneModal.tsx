import React from 'react';
import { NPC } from '../types';
import { Button } from './Button';

interface PhoneModalProps {
  npcs: NPC[];
  onInteract: (npc: NPC) => void;
  onClose: () => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({ npcs, onInteract, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#202020] border-8 border-[#0E0E0E] rounded-3xl w-full max-w-sm h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

        {/* Screen */}
        <div className="bg-[#2B2B2B] flex-1 w-full h-full flex flex-col pt-8 pb-4 px-4 overflow-hidden text-[#F4F4F0]">
             
             <div className="flex justify-between items-center mb-6 border-b border-[#515151] pb-2">
                 <h2 className="font-bold text-2xl text-[#FFD21F]">Contacts</h2>
                 <button onClick={onClose} className="text-[#FFD21F] font-bold">Done</button>
             </div>

             <div className="space-y-4 overflow-y-auto flex-1 comic-scrollbar">
                 {npcs.map(npc => (
                     <div key={npc.id} className="flex flex-col p-3 bg-[#343434] rounded-2xl border border-[#515151] shadow-sm">
                         <div className="flex items-center gap-3 mb-2">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-[#0E0E0E] ${npc.bonusType === 'SANITY' ? 'bg-[#D85A4F] text-white' : (npc.bonusType === 'WEALTH' ? 'bg-[#FFD21F] text-[#161616]' : 'bg-[#8EA0AB] text-[#161616]')}`}>
                                 {npc.name.charAt(0)}
                             </div>
                             <div className="flex-1">
                                 <h3 className="font-bold text-[#F4F4F0] leading-none">{npc.name}</h3>
                                 <p className="text-xs text-[#B8B8B0]">{npc.relation}</p>
                             </div>
                             <div className="text-right">
                                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${npc.relationship > 70 ? 'bg-[#25382E] text-[#CFFFF0]' : (npc.relationship < 30 ? 'bg-[#3B2422] text-[#FFD7D2]' : 'bg-[#3E3E3E] text-[#B8B8B0]')}`}>
                                    {npc.relationship}%
                                 </span>
                             </div>
                         </div>
                         
                         {/* Relationship Bar */}
                         <div className="w-full bg-[#202020] h-2 rounded-full mb-3 overflow-hidden">
                             <div 
                                className={`h-full transition-all duration-500 ${npc.relationship > 70 ? 'bg-[#2DD38F]' : (npc.relationship < 30 ? 'bg-[#D85A4F]' : 'bg-[#FFD21F]')}`}
                                style={{ width: `${npc.relationship}%` }}
                             ></div>
                         </div>

                         <div className="flex gap-2">
                            <Button 
                                variant="secondary" 
                                className="flex-1 py-2 text-xs"
                                onClick={() => onInteract(npc)}
                                disabled={npc.relationship <= 0}
                            >
                                {npc.relationship <= 0 ? 'BLOCKED' : 'CALL / MEET'}
                            </Button>
                         </div>
                         <p className="text-[10px] text-[#B8B8B0] mt-2 text-center">
                            Bonus: +{npc.bonusType}
                         </p>
                     </div>
                 ))}
                 
                 {npcs.length === 0 && (
                     <div className="text-center text-[#B8B8B0] mt-10">
                         No Contacts Found...
                     </div>
                 )}
             </div>

        </div>

        {/* Home Bar */}
        <div className="bg-[#202020] p-4 flex justify-center">
            <div className="w-32 h-1 bg-[#515151] rounded-full"></div>
        </div>

      </div>
    </div>
  );
};
