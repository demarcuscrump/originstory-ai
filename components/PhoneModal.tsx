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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-800 border-8 border-gray-900 rounded-3xl w-full max-w-sm h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

        {/* Screen */}
        <div className="bg-white flex-1 w-full h-full flex flex-col pt-8 pb-4 px-4 overflow-hidden">
             
             <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                 <h2 className="font-bold text-2xl text-gray-800">Contacts</h2>
                 <button onClick={onClose} className="text-blue-500 font-bold">Done</button>
             </div>

             <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                 {npcs.map(npc => (
                     <div key={npc.id} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                         <div className="flex items-center gap-3 mb-2">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${npc.bonusType === 'SANITY' ? 'bg-pink-500' : (npc.bonusType === 'WEALTH' ? 'bg-green-500' : 'bg-blue-500')}`}>
                                 {npc.name.charAt(0)}
                             </div>
                             <div className="flex-1">
                                 <h3 className="font-bold text-gray-900 leading-none">{npc.name}</h3>
                                 <p className="text-xs text-gray-500">{npc.relation}</p>
                             </div>
                             <div className="text-right">
                                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${npc.relationship > 70 ? 'bg-green-100 text-green-700' : (npc.relationship < 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')}`}>
                                    {npc.relationship}%
                                 </span>
                             </div>
                         </div>
                         
                         {/* Relationship Bar */}
                         <div className="w-full bg-gray-200 h-2 rounded-full mb-3 overflow-hidden">
                             <div 
                                className={`h-full transition-all duration-500 ${npc.relationship > 70 ? 'bg-green-500' : (npc.relationship < 30 ? 'bg-red-500' : 'bg-blue-500')}`}
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
                         <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Bonus: +{npc.bonusType}
                         </p>
                     </div>
                 ))}
                 
                 {npcs.length === 0 && (
                     <div className="text-center text-gray-400 mt-10">
                         No Contacts Found...
                     </div>
                 )}
             </div>

        </div>

        {/* Home Bar */}
        <div className="bg-black p-4 flex justify-center">
            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};