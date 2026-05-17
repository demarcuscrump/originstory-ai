import React from 'react';
import { GameEvent } from '../types';
import { TypewriterText } from './TypewriterText';

interface EventPanelProps {
  event: GameEvent;
  isNew?: boolean;
}

export const EventPanel: React.FC<EventPanelProps> = ({ event, isNew }) => {
  const isArcEvent = event.type === 'ARC_EVENT';

  return (
    <div className={`mb-8 flex flex-col ${isNew ? 'animate-fade-in-up' : ''}`}>
      <div 
        className={`
           relative overflow-hidden group p-0
           ${isArcEvent 
              ? 'bg-yellow-50 border-4 border-yellow-500 shadow-md' 
              : 'bg-white border-4 border-black shadow-comic'
           }
        `}
      >
        {/* Type/Header */}
        {event.type === 'ORIGIN' && (
           <div className="bg-comic-yellow border-b-2 border-r-2 border-black inline-block px-3 py-1 mb-0 shadow-sm relative z-20">
             <span className="font-display text-base uppercase tracking-widest text-black">ISSUE #1: ORIGIN</span>
           </div>
        )}

        {isArcEvent && (
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 border-b-2 border-black"></div>
        )}

        {/* Image Display */}
        {event.imageUrl ? (
          <div className="w-full aspect-square md:aspect-video border-b-4 border-black overflow-hidden bg-gray-100 relative">
             <img 
               src={event.imageUrl} 
               alt="Comic Panel" 
               className="w-full h-full object-cover animate-fade-in"
               loading="lazy"
             />
          </div>
        ) : event.isGeneratingImage ? (
          <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-50 border-b-4 border-black mb-0 p-4 text-center animate-pulse">
             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
             <span className="text-xs text-gray-500 font-bold font-display uppercase tracking-widest">Artist drawing panel...</span>
          </div>
        ) : null}

        {/* Text Area */}
        <div className={`p-4 relative min-w-0 ${isArcEvent ? "bg-yellow-50" : "bg-white"}`}>
           <p className={`font-comic text-lg md:text-xl leading-relaxed text-black break-words whitespace-pre-wrap min-w-0 ${isArcEvent ? 'font-bold' : ''}`}>
            <span className="float-left text-4xl md:text-5xl font-display text-comic-blue mr-2 leading-none mt-[-4px]">
                {event.text.charAt(0)}
            </span>
            {isNew ? (
                <TypewriterText text={event.text.slice(1)} />
            ) : (
                event.text.slice(1)
            )}
          </p>
        </div>

        <div className="px-4 pb-2 text-right">
             <div className="text-[10px] text-gray-400 font-mono inline-block mr-2">
                {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
                PANEL {event.id.slice(-4)}
                {isArcEvent && <span className="text-yellow-600 ml-2">★ KEY ISSUE</span>}
            </span>
        </div>
      </div>
    </div>
  );
};