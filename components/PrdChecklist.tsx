import React from 'react';
import { Button } from './Button';

interface ChecklistItemProps {
  label: string;
  isDone: boolean;
  notes?: string;
}

const Item: React.FC<ChecklistItemProps> = ({ label, isDone, notes }) => (
  <div className="flex items-start space-x-3 mb-2">
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#0E0E0E] ${isDone ? 'bg-[#FFD21F]' : 'bg-[#3E3E3E]'}`}>
      {isDone && <span className="font-bold text-[#161616]">✓</span>}
    </div>
    <div>
      <p className={`font-bold text-sm ${isDone ? 'text-[#F4F4F0]' : 'text-[#B8B8B0]'}`}>{label}</p>
      {notes && <p className="text-xs text-[#B8B8B0] font-mono">{notes}</p>}
    </div>
  </div>
);

interface PrdChecklistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdChecklist: React.FC<PrdChecklistProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg w-full max-w-2xl max-h-[90dvh] overflow-y-auto flex flex-col text-[#F4F4F0] comic-scrollbar">
        <div className="bg-[#202020] text-[#F4F4F0] p-3 flex justify-between items-center border-b-2 border-[#0E0E0E]">
          <h2 className="font-black italic text-xl text-[#FFD21F]">MISSION CONTROL // PRD STATUS</h2>
          <button onClick={onClose} className="text-[#F4F4F0] font-bold hover:text-[#FFD21F]">CLOSE</button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm border-b-2 border-[#515151] pb-4 text-[#D8D8D2]">
            Current build status for the portfolio showcase build.
            <br/>
            <span className="font-bold text-[#2DD38F]">STATUS: PORTFOLIO SHOWCASE READY</span>
          </p>

          <div>
            <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 1: FOUNDATION</h3>
            <Item label="Project Architecture" isDone={true} notes="React 19, Tailwind, TypeScript setup complete." />
            <Item label="Comic Book UI System" isDone={true} notes="Custom fonts, colors, shadows, and layout engine." />
            <Item label="Data Models" isDone={true} notes="Character, Stats, GameEvent, and Action types defined." />
          </div>

          <div>
            <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 2: GAME MECHANICS</h3>
            <Item label="Stat System" isDone={true} notes="Wealth, Sanity, Justice, Glory, Suspicion logic implemented." />
            <Item label="Dual Life Loop" isDone={true} notes="Civilian vs. Hero action tabs and economy." />
            <Item label="Time Tracking" isDone={true} notes="Week/Age progression system." />
            <Item label="Win/Loss Conditions" isDone={true} notes="Game Over states for Insanity and Identity Exposure." />
          </div>

          <div>
            <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 3: AI INTELLIGENCE</h3>
            <Item label="Narrative Engine" isDone={true} notes="OpenRouter text model generating context-aware story panels." />
            <Item label="Origin Story Generator" isDone={true} notes="Custom prompt for initial character creation." />
            <Item label="Visual Engine" isDone={true} notes="OpenRouter image model generating panel art." />
            <Item label="Context Awareness" isDone={true} notes="History windowing injected into prompts." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 4: POLISH & PERSISTENCE</h3>
             <Item label="Local Storage Save/Load" isDone={true} notes="Game state persists across reloads." />
             <Item label="Async Image Loading" isDone={true} notes="Non-blocking UI while images generate." />
             <Item label="Responsive Design" isDone={true} notes="Mobile-ready layout." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 5: DYNAMIC AGENCY</h3>
             <Item label="Contextual Suggestions" isDone={true} notes="AI reads the story and suggests relevant next moves." />
             <Item label="JSON Structured Output" isDone={true} notes="Using JSON response formats for strict action typing." />
             <Item label="Immersive UI" isDone={true} notes="Dynamic buttons appearing inline with the story." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 6: THE ARCH-NEMESIS</h3>
             <Item label="Villain Generation" isDone={true} notes="Creates a thematic foil to the hero's origin." />
             <Item label="Persistent Threat" isDone={true} notes="Villain data injected into narrative context loop." />
             <Item label="Nemesis Dossier" isDone={true} notes="Readable antagonist summary with full details in a modal." />
          </div>
          
           <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 7: THE SHOWDOWN</h3>
             <Item label="Confrontation Logic" isDone={true} notes="RNG system weighted by Hero Stats vs Villain Power." />
             <Item label="Boss Battle UI" isDone={true} notes="Unlockable challenge action in the nemesis summary and dossier." />
             <Item label="Victory State" isDone={true} notes="End-game narrative generation and win screens." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 8: SENSORY IMMERSION</h3>
             <Item label="Audio Engine" isDone={true} notes="Web Audio API synthesizer for retro comic effects." />
             <Item label="Typewriter Effect" isDone={true} notes="Text renders character-by-character with sound." />
             <Item label="UI Polish" isDone={true} notes="High contrast inputs and bug fixes." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 9: THE LIVING CITY</h3>
             <Item label="Newspaper System" isDone={true} notes="Generates headlines based on player reputation." />
             <Item label="Dynamic Modal" isDone={true} notes="Periodic world-building events every 4 weeks." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 10: THE SECRET LAIR</h3>
             <Item label="Upgrade System" isDone={true} notes="Spend Justice/Wealth/Glory on mechanical benefits." />
             <Item label="Thematic Generation" isDone={true} notes="Items match the hero's archetype (Tech vs Magic)." />
             <Item label="Blueprint UI" isDone={true} notes="Immersive tech-styled shop interface." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 11: THE CRISIS ARC</h3>
             <Item label="Dynamic Dilemmas" isDone={true} notes="Random events interrupt gameplay with difficult choices." />
             <Item label="Moral Trades" isDone={true} notes="Altruistic vs Pragmatic paths affect Alignment stats." />
             <Item label="'MEANWHILE...' UI" isDone={true} notes="Dramatic comic transition for emergencies." />
          </div>
          
          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 12: THE SUPPORTING CAST</h3>
             <Item label="NPC Generation" isDone={true} notes="AI creates mentors, friends, and family based on origin." />
             <Item label="Smartphone UI" isDone={true} notes="Replaced generic 'Socialize' with detailed Contacts interaction." />
             <Item label="Relationship Mechanics" isDone={true} notes="Relationships decay weekly; grant specific bonuses." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 13: THE MASTER PLAN</h3>
             <Item label="Plot Generation" isDone={true} notes="Nemesis now has a specific Scheme Name & Description." />
             <Item label="Ticking Clock" isDone={true} notes="Scheme meter progresses passively every turn." />
             <Item label="Thwarting Mechanics" isDone={true} notes="'Investigate' actions reduce scheme progress to prevent catastrophe." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 14: THE SUPER SUIT</h3>
             <Item label="Visual Progression" isDone={true} notes="Added 'costume' field to character state." />
             <Item label="Suit Workshop" isDone={true} notes="New UI in Secret Lair to design upgraded gear." />
             <Item label="Persistent Appearance" isDone={true} notes="Image prompts now enforce the specific suit design." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 15: THE LONG BOX</h3>
             <Item label="Legacy System" isDone={true} notes="Completed heroes (Win/Loss) are now archived to LocalStorage." />
             <Item label="Collection UI" isDone={true} notes="New 'Long Box' screen to view cover art and stats of past runs." />
             <Item label="Storage Management" isDone={true} notes="FIFO limit of 5 heroes to prevent browser storage quotas." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 16: THE ROGUES GALLERY</h3>
             <Item label="Procedural Encounters" isDone={true} notes="Patrolling now triggers battles with D-list villains." />
             <Item label="Villain of the Week" isDone={true} notes="AI generates quirks, gimmicks, and names for minor foes." />
             <Item label="Trading Card UI" isDone={true} notes="Battle screen with stat checks and rewards." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 17: THE LEGACY</h3>
             <Item label="Generational Play" isDone={true} notes="New Game+ mode: Successors inherit parent's Wealth & Reputation (PRD 2.2.1)." />
             <Item label="Retcon System" isDone={true} notes="Consumable 'Retcon Point' allows reviving from Game Over (PRD 2.2.3)." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 18: TEAM DYNAMICS</h3>
             <Item label="Sidekick Recruitment" isDone={true} notes="Use Glory to recruit allies matching your archetype (PRD 2.2.2)." />
             <Item label="Team Missions" isDone={true} notes="Deploy allies on off-panel missions to farm resources passively." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 19: THE PULL LIST</h3>
             <Item label="Battle Pass UI" isDone={true} notes="Issue XP tracking and seasonal rewards track (PRD 2.2.4)." />
             <Item label="Variant Covers" isDone={true} notes="Collectible rewards without changing the main play theme." />
             <Item label="Monetization Sim" isDone={true} notes="Ethical 'Pay-to-Collect' framework implemented." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-[#FFD21F] text-[#161616] border border-[#0E0E0E] rounded-full inline-block px-3 py-1 mb-2">PHASE 20: SHOWCASE RELEASE</h3>
             <Item label="Feature Complete" isDone={true} notes="All core mechanics and content systems are online." />
             <Item label="Social Sharing" isDone={true} notes="Implemented copy-to-clipboard for Hero Summaries in Archives." />
             <Item label="Portfolio Ready" isDone={true} notes="Application ready to present as an interactive portfolio piece." />
          </div>

          <div className="mt-8 border-t-2 border-[#515151] pt-4 text-center">
             <Button onClick={onClose} fullWidth>RETURN TO GAME</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
