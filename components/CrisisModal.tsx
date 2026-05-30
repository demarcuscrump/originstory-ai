import React from 'react';
import { Crisis, CrisisOption } from '../types';

interface CrisisModalProps {
  crisis: Crisis;
  onResolve: (option: CrisisOption) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ crisis, onResolve }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#D85A4F] rounded-[32px] shadow-comic-lg w-full max-w-xl relative text-[#F4F4F0] overflow-hidden">
        <header className="bg-[#3B2422] text-white p-4 text-center border-b-2 border-[#0E0E0E]">
          <div className="font-black text-3xl uppercase tracking-wide italic">
            Meanwhile...
          </div>
          <div className="text-xs font-bold uppercase tracking-widest mt-1">
            Crisis Interrupt
          </div>
        </header>

        <div className="p-6 text-center">
          <h2 className="font-black text-2xl mb-2 uppercase text-[#FFD21F]">{crisis.title}</h2>
          <p className="text-lg mb-6 text-[#D8D8D2] leading-relaxed">{crisis.description}</p>

          <div className="space-y-3">
            {crisis.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onResolve(opt)}
                className={`w-full p-4 rounded-[24px] border-2 text-left transition-colors active:scale-[0.99] group ${opt.type === 'ALTRUISTIC' ? 'border-[#8EA0AB] hover:bg-[#3E3E3E]' : 'border-[#0E0E0E] hover:bg-[#3E3E3E]'}`}
              >
                <div className="flex justify-between items-center gap-3 mb-1">
                  <span className={`font-black text-xl uppercase ${opt.type === 'ALTRUISTIC' ? 'text-[#FFD21F]' : 'text-[#F4F4F0]'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] font-bold border border-[#515151] px-2 py-1 uppercase bg-[#2B2B2B] text-[#B8B8B0] rounded-full">
                    {opt.type}
                  </span>
                </div>
                <p className="text-sm text-[#D8D8D2]">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#FFD21F] p-2 text-center text-xs font-bold border-t-2 border-[#0E0E0E] text-[#161616]">
          DECISION REQUIRED IMMEDIATELY
        </div>
      </div>
    </div>
  );
};
