import React, { useEffect, useState } from 'react';

interface OnomatopoeiaProps {
  text: string;
  type?: 'COMBAT' | 'DANGER' | 'VICTORY';
  onComplete: () => void;
}

export const Onomatopoeia: React.FC<OnomatopoeiaProps> = ({ text, type = 'COMBAT', onComplete }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
      setTimeout(onComplete, 300); // Wait for exit anim
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    COMBAT: 'text-[#161616] border-[#0E0E0E] bg-[#FFD21F] rotate-12 rounded-[28px]',
    DANGER: 'text-white border-[#0E0E0E] bg-[#D85A4F] -rotate-6 rounded-[28px]',
    VICTORY: 'text-[#161616] border-[#0E0E0E] bg-[#FFD21F] rotate-3 rounded-[28px]',
  };

  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`
          font-black italic text-6xl md:text-9xl border-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] 
          px-8 py-4 transform transition-transform duration-200 scale-0 
          ${active ? 'scale-100' : 'scale-0'}
          ${styles[type]}
        `}
        style={{
             textShadow: '4px 4px 0px #000'
        }}
      >
        {text}
      </div>
    </div>
  );
};
