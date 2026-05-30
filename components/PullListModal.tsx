import React from 'react';
import { BattlePassReward } from '../types';
import { Button } from './Button';

interface PullListModalProps {
  currentXp: number;
  rewards: BattlePassReward[];
  isPremium: boolean;
  onClaim: (level: number, type: 'FREE' | 'PREMIUM') => void;
  onPurchasePremium: () => void;
  onClose: () => void;
}

export const PullListModal: React.FC<PullListModalProps> = ({ currentXp, rewards, isPremium, onClaim, onPurchasePremium, onClose }) => {
  const progressPercent = Math.min(100, (currentXp / (rewards[rewards.length - 1].xpRequired)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] w-full max-w-4xl h-[90dvh] flex flex-col shadow-comic-lg text-[#F4F4F0] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#202020] text-[#F4F4F0] p-4 flex justify-between items-center border-b-2 border-[#0E0E0E]">
            <div>
                 <h2 className="font-black italic text-3xl uppercase tracking-wide text-[#FFD21F]">THE PULL LIST</h2>
                 <p className="text-xs font-mono text-[#B8B8B0]">SEASON 1: ORIGINS</p>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-[#B8B8B0]">CURRENT ISSUE XP</div>
                <div className="text-2xl font-black">{currentXp}</div>
            </div>
            <button onClick={onClose} className="rounded-full text-[#F4F4F0] hover:text-[#FFD21F] font-bold text-sm border border-[#515151] px-3 py-2 ml-4">CLOSE</button>
        </div>

        {/* Banner */}
        <div className="bg-[#FFD21F] p-2 text-center border-b-2 border-[#0E0E0E]">
             {!isPremium ? (
                 <div className="flex justify-between items-center px-4">
                     <span className="font-black text-[#161616] uppercase">UNLOCK PREMIUM REWARDS & EXCLUSIVE COVERS!</span>
                     <Button variant="danger" className="py-1 px-3 text-xs" onClick={onPurchasePremium}>
                         BUY PASS (SIMULATED)
                     </Button>
                 </div>
             ) : (
                 <span className="font-black text-[#161616] uppercase tracking-widest">PREMIUM PASS ACTIVE - COLLECTOR EDITION</span>
             )}
        </div>

        {/* Track */}
        <div className="flex-1 overflow-y-auto bg-[#242424] p-6 relative comic-scrollbar">
             <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#515151] z-0"></div>
             
             <div className="space-y-6 relative z-10">
                 {rewards.map((reward) => {
                     const isUnlocked = currentXp >= reward.xpRequired;
                     return (
                         <div key={reward.level} className={`flex items-stretch bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-comic transition-all overflow-hidden ${isUnlocked ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                             {/* Level Indicator */}
                             <div className="w-16 bg-[#202020] text-[#F4F4F0] flex flex-col items-center justify-center p-2 text-center border-r-2 border-[#0E0E0E]">
                                 <span className="text-[10px] font-bold text-[#B8B8B0]">ISSUE</span>
                                 <span className="text-3xl font-black">{reward.level}</span>
                                 <span className="text-[10px] text-[#FFD21F] mt-1">{reward.xpRequired} XP</span>
                             </div>

                             <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                                 {/* Free Reward */}
                                 <div className="p-4 border-b md:border-b-0 md:border-r border-[#515151] flex justify-between items-center bg-[#343434]">
                                     <div>
                                         <span className="text-[10px] font-bold bg-[#2B2B2B] px-2 py-0.5 rounded-full text-[#B8B8B0]">FREE</span>
                                         <div className="font-bold text-lg">{reward.freeReward.label}</div>
                                     </div>
                                     {isUnlocked ? (
                                         reward.isClaimedFree ? (
                                             <span className="text-[#2DD38F] font-bold text-xs">CLAIMED</span>
                                         ) : (
                                             <Button variant="secondary" className="text-xs py-1" onClick={() => onClaim(reward.level, 'FREE')}>CLAIM</Button>
                                         )
                                     ) : (
                                         <span className="text-xs text-[#B8B8B0]">LOCKED</span>
                                     )}
                                 </div>

                                 {/* Premium Reward */}
                                 <div className={`p-4 flex justify-between items-center ${isPremium ? 'bg-[#3F3720]' : 'bg-[#2B2B2B]'}`}>
                                      <div>
                                         <span className="text-[10px] font-bold bg-[#FFD21F] px-2 py-0.5 rounded-full text-[#161616] border border-[#0E0E0E]">PREMIUM</span>
                                         <div className="font-bold text-lg">{reward.premiumReward.label}</div>
                                     </div>
                                     {isUnlocked ? (
                                         isPremium ? (
                                             reward.isClaimedPremium ? (
                                                 <span className="text-[#2DD38F] font-bold text-xs">COLLECTED</span>
                                             ) : (
                                                 <Button variant="primary" className="text-xs py-1" onClick={() => onClaim(reward.level, 'PREMIUM')}>COLLECT</Button>
                                             )
                                         ) : (
                                             <span className="text-xs text-[#B8B8B0] font-mono">REQ. PASS</span>
                                         )
                                     ) : (
                                         <span className="text-xs text-[#B8B8B0]">LOCKED</span>
                                     )}
                                 </div>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>

      </div>
    </div>
  );
};
