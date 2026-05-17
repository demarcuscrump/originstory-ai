import React from 'react';
import { Crisis, CrisisOption } from '../types';

interface CrisisModalProps {
  crisis: Crisis;
  onResolve: (option: CrisisOption) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ crisis, onResolve }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border-8 border-comic-red shadow-[0_0_50px_rgba(255,0,0,0.5)] w-full max-w-lg relative">
        
        {/* Header Alert */}
        <div className="bg-comic-red text-white p-4 text-center border-b-4 border-black">
           <div className="animate-pulse font-black text-3xl uppercase tracking-tighter italic">
              MEANWHILE...
           </div>
           <div className="text-xs font-bold uppercase tracking-widest mt-1">
              CRISIS INTERRUPT
           </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
            <h2 className="font-black text-2xl mb-2 uppercase text-black">{crisis.title}</h2>
            <p className="font-comic text-lg mb-6 text-black">{crisis.description}</p>

            <div className="space-y-3">
                {crisis.options.map((opt, idx) => (
                    <button 
                       key={idx}
                       onClick={() => onResolve(opt)}
                       className={`w-full p-4 border-4 text-left transition-transform hover:scale-[1.02] active:scale-95 group ${opt.type === 'ALTRUISTIC' ? 'border-blue-500 hover:bg-blue-50' : 'border-black hover:bg-gray-100'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`font-black text-xl uppercase ${opt.type === 'ALTRUISTIC' ? 'text-blue-600' : 'text-black'}`}>
                                {opt.label}
                            </span>
                            <span className="text-[10px] font-bold border border-black px-1 uppercase bg-white text-black">
                                {opt.type}
                            </span>
                        </div>
                        <p className="text-sm font-comic text-gray-700">{opt.description}</p>
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-yellow-300 p-2 text-center text-xs font-bold border-t-4 border-black text-black">
            DECISION REQUIRED IMMEDIATELY
        </div>
      </div>
    </div>
  );
};