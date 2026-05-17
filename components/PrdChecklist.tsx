import React from 'react';
import { Button } from './Button';

interface ChecklistItemProps {
  label: string;
  isDone: boolean;
  notes?: string;
}

const Item: React.FC<ChecklistItemProps> = ({ label, isDone, notes }) => (
  <div className="flex items-start space-x-3 mb-2">
    <div className={`w-6 h-6 flex items-center justify-center border-2 border-black ${isDone ? 'bg-green-400' : 'bg-white'}`}>
      {isDone && <span className="font-bold text-black">✓</span>}
    </div>
    <div>
      <p className={`font-bold text-sm ${isDone ? 'text-black' : 'text-gray-500'}`}>{label}</p>
      {notes && <p className="text-xs text-gray-600 font-mono">{notes}</p>}
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
      <div className="bg-paper border-4 border-black shadow-comic-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
          <h2 className="font-black italic text-xl text-comic-yellow">MISSION CONTROL // PRD STATUS</h2>
          <button onClick={onClose} className="text-comic-red font-bold hover:text-white">CLOSE [X]</button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="font-comic text-sm border-b-2 border-black pb-4">
            Current build status against the "Whole Platform" Product Requirements Document.
            <br/>
            <span className="font-bold text-green-600">STATUS: GOLD MASTER (COMPLETE)</span>
          </p>

          <div>
            <h3 className="text-lg font-black bg-comic-blue text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 1: FOUNDATION</h3>
            <Item label="Project Architecture" isDone={true} notes="React 19, Tailwind, TypeScript setup complete." />
            <Item label="Comic Book UI System" isDone={true} notes="Custom fonts, colors, shadows, and layout engine." />
            <Item label="Data Models" isDone={true} notes="Character, Stats, GameEvent, and Action types defined." />
          </div>

          <div>
            <h3 className="text-lg font-black bg-comic-yellow text-black inline-block px-2 mb-2 transform rotate-1">PHASE 2: GAME MECHANICS</h3>
            <Item label="Stat System" isDone={true} notes="Wealth, Sanity, Justice, Glory, Suspicion logic implemented." />
            <Item label="Dual Life Loop" isDone={true} notes="Civilian vs. Hero action tabs and economy." />
            <Item label="Time Tracking" isDone={true} notes="Week/Age progression system." />
            <Item label="Win/Loss Conditions" isDone={true} notes="Game Over states for Insanity and Identity Exposure." />
          </div>

          <div>
            <h3 className="text-lg font-black bg-comic-red text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 3: AI INTELLIGENCE</h3>
            <Item label="Narrative Engine" isDone={true} notes="Gemini 2.5 Flash generating context-aware text." />
            <Item label="Origin Story Generator" isDone={true} notes="Custom prompt for initial character creation." />
            <Item label="Visual Engine" isDone={true} notes="Gemini 2.5 Flash Image generating panel art." />
            <Item label="Context Awareness" isDone={true} notes="History windowing injected into prompts." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-gray-800 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 4: POLISH & PERSISTENCE</h3>
             <Item label="Local Storage Save/Load" isDone={true} notes="Game state persists across reloads." />
             <Item label="Async Image Loading" isDone={true} notes="Non-blocking UI while images generate." />
             <Item label="Responsive Design" isDone={true} notes="Mobile-ready layout." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-purple-600 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 5: DYNAMIC AGENCY</h3>
             <Item label="Contextual Suggestions" isDone={true} notes="AI reads the story and suggests relevant next moves." />
             <Item label="JSON Structured Output" isDone={true} notes="Using Gemini responseSchema for strict action typing." />
             <Item label="Immersive UI" isDone={true} notes="Dynamic buttons appearing inline with the story." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-green-600 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 6: THE ARCH-NEMESIS</h3>
             <Item label="Villain Generation" isDone={true} notes="Creates a thematic foil to the hero's origin." />
             <Item label="Persistent Threat" isDone={true} notes="Villain data injected into narrative context loop." />
             <Item label="'Wanted' UI" isDone={true} notes="Visual tracking of the main antagonist." />
          </div>
          
           <div>
             <h3 className="text-lg font-black bg-orange-600 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 7: THE SHOWDOWN</h3>
             <Item label="Confrontation Logic" isDone={true} notes="RNG system weighted by Hero Stats vs Villain Power." />
             <Item label="Boss Battle UI" isDone={true} notes="Unlockable challenge button in Wanted Poster." />
             <Item label="Victory State" isDone={true} notes="End-game narrative generation and win screens." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-pink-500 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 8: SENSORY IMMERSION</h3>
             <Item label="Audio Engine" isDone={true} notes="Web Audio API synthesizer for retro comic effects." />
             <Item label="Typewriter Effect" isDone={true} notes="Text renders character-by-character with sound." />
             <Item label="UI Polish" isDone={true} notes="High contrast inputs and bug fixes." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-blue-500 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 9: THE LIVING CITY</h3>
             <Item label="Newspaper System" isDone={true} notes="Generates headlines based on player reputation." />
             <Item label="Dynamic Modal" isDone={true} notes="Periodic world-building events every 4 weeks." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-indigo-600 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 10: THE SECRET LAIR</h3>
             <Item label="Upgrade System" isDone={true} notes="Spend Justice/Wealth/Glory on mechanical benefits." />
             <Item label="Thematic Generation" isDone={true} notes="Items match the hero's archetype (Tech vs Magic)." />
             <Item label="Blueprint UI" isDone={true} notes="Immersive tech-styled shop interface." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-red-600 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 11: THE CRISIS ARC</h3>
             <Item label="Dynamic Dilemmas" isDone={true} notes="Random events interrupt gameplay with difficult choices." />
             <Item label="Moral Trades" isDone={true} notes="Altruistic vs Pragmatic paths affect Alignment stats." />
             <Item label="'MEANWHILE...' UI" isDone={true} notes="Dramatic comic transition for emergencies." />
          </div>
          
          <div>
             <h3 className="text-lg font-black bg-teal-500 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 12: THE SUPPORTING CAST</h3>
             <Item label="NPC Generation" isDone={true} notes="AI creates mentors, friends, and family based on origin." />
             <Item label="Smartphone UI" isDone={true} notes="Replaced generic 'Socialize' with detailed Contacts interaction." />
             <Item label="Relationship Mechanics" isDone={true} notes="Relationships decay weekly; grant specific bonuses." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-rose-600 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 13: THE MASTER PLAN</h3>
             <Item label="Plot Generation" isDone={true} notes="Nemesis now has a specific Scheme Name & Description." />
             <Item label="Ticking Clock" isDone={true} notes="Scheme meter progresses passively every turn." />
             <Item label="Thwarting Mechanics" isDone={true} notes="'Investigate' actions reduce scheme progress to prevent catastrophe." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-amber-500 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 14: THE SUPER SUIT</h3>
             <Item label="Visual Progression" isDone={true} notes="Added 'costume' field to character state." />
             <Item label="Suit Workshop" isDone={true} notes="New UI in Secret Lair to design upgraded gear." />
             <Item label="Persistent Appearance" isDone={true} notes="Gemini image prompt now enforces the specific suit design." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-gray-500 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 15: THE LONG BOX</h3>
             <Item label="Legacy System" isDone={true} notes="Completed heroes (Win/Loss) are now archived to LocalStorage." />
             <Item label="Collection UI" isDone={true} notes="New 'Long Box' screen to view cover art and stats of past runs." />
             <Item label="Storage Management" isDone={true} notes="FIFO limit of 5 heroes to prevent browser storage quotas." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-purple-800 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 16: THE ROGUES GALLERY</h3>
             <Item label="Procedural Encounters" isDone={true} notes="Patrolling now triggers battles with D-list villains." />
             <Item label="Villain of the Week" isDone={true} notes="AI generates quirks, gimmicks, and names for minor foes." />
             <Item label="Trading Card UI" isDone={true} notes="Battle screen with stat checks and rewards." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-cyan-600 text-white inline-block px-2 mb-2 transform -rotate-1">PHASE 17: THE LEGACY</h3>
             <Item label="Generational Play" isDone={true} notes="New Game+ mode: Successors inherit parent's Wealth & Reputation (PRD 2.2.1)." />
             <Item label="Retcon System" isDone={true} notes="Consumable 'Retcon Point' allows reviving from Game Over (PRD 2.2.3)." />
          </div>

           <div>
             <h3 className="text-lg font-black bg-indigo-700 text-white inline-block px-2 mb-2 transform rotate-1">PHASE 18: TEAM DYNAMICS</h3>
             <Item label="Sidekick Recruitment" isDone={true} notes="Use Glory to recruit allies matching your archetype (PRD 2.2.2)." />
             <Item label="Team Missions" isDone={true} notes="Deploy allies on off-panel missions to farm resources passively." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-yellow-500 text-black inline-block px-2 mb-2 transform -rotate-1">PHASE 19: THE PULL LIST</h3>
             <Item label="Battle Pass UI" isDone={true} notes="Issue XP tracking and seasonal rewards track (PRD 2.2.4)." />
             <Item label="Visual Variants" isDone={true} notes="Unlockable Noir, Retro, and Neon CSS filters for the entire app." />
             <Item label="Monetization Sim" isDone={true} notes="Ethical 'Pay-to-Collect' framework implemented." />
          </div>

          <div>
             <h3 className="text-lg font-black bg-white text-black border-2 border-black inline-block px-2 mb-2 transform rotate-1">PHASE 20: GOLD MASTER</h3>
             <Item label="Feature Complete" isDone={true} notes="All core mechanics and content systems are online." />
             <Item label="Social Sharing" isDone={true} notes="Implemented copy-to-clipboard for Hero Summaries in Archives." />
             <Item label="Launch Ready" isDone={true} notes="Application ready for deployment." />
          </div>

          <div className="mt-8 border-t-4 border-black pt-4 text-center">
             <Button onClick={onClose} fullWidth>RETURN TO GAME</Button>
          </div>
        </div>
      </div>
    </div>
  );
};