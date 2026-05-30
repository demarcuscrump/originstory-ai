import React from 'react';
import { Button } from './Button';

interface NewspaperModalProps {
  headline: string;
  onClose: () => void;
}

export const NewspaperModal: React.FC<NewspaperModalProps> = ({ headline, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#343434] w-full max-w-lg p-6 shadow-2xl border-2 border-[#0E0E0E] rounded-[32px] text-[#F4F4F0]">
        
        {/* Newspaper Header */}
        <div className="border-b-4 border-[#0E0E0E] border-double mb-6 pb-2 text-center">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-2 border-b border-[#515151] pb-1 text-[#B8B8B0]">
                 <span>Vol. 104</span>
                 <span>The Daily Chronicle</span>
                 <span>Price: $0.50</span>
             </div>
             <h1 className="font-serif font-black text-6xl tracking-tighter text-[#FFD21F]">THE CITY</h1>
        </div>

        {/* Headline */}
        <div className="py-8 text-center border-b-2 border-[#515151] mb-6">
             <h2 className="font-black text-5xl uppercase leading-none text-[#F4F4F0] break-words font-sans">
                {headline}
             </h2>
        </div>

        {/* Content Placeholder */}
        <div className="grid grid-cols-3 gap-4 mb-8">
             <div className="col-span-1 bg-[#46505A] grayscale contrast-110 flex items-center justify-center border border-[#0E0E0E] rounded-2xl h-32">
                <div className="w-12 h-12 rounded-full bg-[#FFD21F]"></div>
             </div>
             <div className="col-span-2 text-[10px] text-justify font-serif text-[#D8D8D2] leading-tight">
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                 <br/><br/>
                 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
             </div>
        </div>

        <div className="text-center">
            <Button onClick={onClose} fullWidth>CONTINUE</Button>
        </div>
      </div>
    </div>
  );
};
