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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-4xl h-[90vh] flex flex-col shadow-[10px_10px_0px_0px_#facc15]">
        
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-yellow-400">
            <div>
                 <h2 className="font-black italic text-3xl uppercase tracking-tighter text-yellow-400">THE PULL LIST</h2>
                 <p className="text-xs font-mono">SEASON 1: ORIGINS</p>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-gray-400">CURRENT ISSUE XP</div>
                <div className="text-2xl font-black">{currentXp}</div>
            </div>
            <button onClick={onClose} className="text-white hover:text-red-500 font-bold text-xl ml-4">[X]</button>
        </div>

        {/* Banner */}
        <div className="bg-yellow-400 p-2 text-center border-b-4 border-black">
             {!isPremium ? (
                 <div className="flex justify-between items-center px-4">
                     <span className="font-black text-black uppercase">UNLOCK PREMIUM REWARDS & EXCLUSIVE COVERS!</span>
                     <Button variant="danger" className="py-1 px-3 text-xs" onClick={onPurchasePremium}>
                         BUY PASS (SIMULATED)
                     </Button>
                 </div>
             ) : (
                 <span className="font-black text-black uppercase tracking-widest">PREMIUM PASS ACTIVE - COLLECTOR EDITION</span>
             )}
        </div>

        {/* Track */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6 relative">
             <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-300 z-0"></div>
             
             <div className="space-y-6 relative z-10">
                 {rewards.map((reward) => {
                     const isUnlocked = currentXp >= reward.xpRequired;
                     return (
                         <div key={reward.level} className={`flex items-stretch bg-white border-2 border-black shadow-comic transition-all ${isUnlocked ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                             {/* Level Indicator */}
                             <div className="w-16 bg-black text-white flex flex-col items-center justify-center p-2 text-center border-r-2 border-black">
                                 <span className="text-[10px] font-bold text-gray-400">ISSUE</span>
                                 <span className="text-3xl font-black">{reward.level}</span>
                                 <span className="text-[10px] text-yellow-400 mt-1">{reward.xpRequired} XP</span>
                             </div>

                             <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                                 {/* Free Reward */}
                                 <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200 flex justify-between items-center bg-gray-50">
                                     <div>
                                         <span className="text-[10px] font-bold bg-gray-200 px-1 rounded text-gray-600">FREE</span>
                                         <div className="font-bold text-lg">{reward.freeReward.label}</div>
                                     </div>
                                     {isUnlocked ? (
                                         reward.isClaimedFree ? (
                                             <span className="text-green-600 font-bold text-xs">CLAIMED</span>
                                         ) : (
                                             <Button variant="secondary" className="text-xs py-1" onClick={() => onClaim(reward.level, 'FREE')}>CLAIM</Button>
                                         )
                                     ) : (
                                         <span className="text-xs text-gray-400">LOCKED</span>
                                     )}
                                 </div>

                                 {/* Premium Reward */}
                                 <div className={`p-4 flex justify-between items-center ${isPremium ? 'bg-yellow-50' : 'bg-gray-200'}`}>
                                      <div>
                                         <span className="text-[10px] font-bold bg-yellow-400 px-1 rounded text-black border border-black">PREMIUM</span>
                                         <div className="font-bold text-lg">{reward.premiumReward.label}</div>
                                     </div>
                                     {isUnlocked ? (
                                         isPremium ? (
                                             reward.isClaimedPremium ? (
                                                 <span className="text-green-600 font-bold text-xs">COLLECTED</span>
                                             ) : (
                                                 <Button variant="primary" className="text-xs py-1" onClick={() => onClaim(reward.level, 'PREMIUM')}>COLLECT</Button>
                                             )
                                         ) : (
                                             <span className="text-xs text-gray-500 font-mono">REQ. PASS</span>
                                         )
                                     ) : (
                                         <span className="text-xs text-gray-400">LOCKED</span>
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