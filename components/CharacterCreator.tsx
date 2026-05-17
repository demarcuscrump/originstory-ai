import React, { useState, useEffect } from 'react';
import { Alignment, Character, OriginArchetype, UniverseTone, LegacyData, IncitingIncident } from '../types';
import { Button } from './Button';
import { generateOriginStory, analyzeCharacterConcept } from '../services/aiService';

interface CharacterCreatorProps {
  onComplete: (character: Character, originStory: string) => void;
  onOpenArchives?: () => void;
  legacyData?: LegacyData;
}

// Compact descriptions for mobile
const TONE_DESCRIPTIONS = {
    [UniverseTone.GOLDEN_AGE]: "1940s. Optimistic, Simple.",
    [UniverseTone.SILVER_AGE]: "1960s. Wacky Sci-Fi.",
    [UniverseTone.BRONZE_AGE]: "1970s. Grounded Issues.",
    [UniverseTone.MODERN]: "2000s. Cinematic Action.",
    [UniverseTone.GRIM_DARK]: "1990s. Edgy, Gritty.",
    [UniverseTone.COSMIC]: "Trippy Space Opera.",
    [UniverseTone.STREET_NOIR]: "Dark Detective Noir.",
    [UniverseTone.HORROR]: "Supernatural Fear.",
    [UniverseTone.CYBERPUNK]: "Neon Future 2099.",
    [UniverseTone.POST_APOC]: "Wasteland Survival.",
};

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete, onOpenArchives, legacyData }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userConcept, setUserConcept] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    heroName: '',
    age: 18,
    week: 1,
    universe: UniverseTone.MODERN,
    origin: OriginArchetype.STREET,
    incident: IncitingIncident.ACCIDENT,
    alignment: Alignment.HERO,
    specificPower: '',
  });

  useEffect(() => {
    if (legacyData) {
        setFormData(prev => ({ ...prev, legacy: legacyData }));
    }
  }, [legacyData]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleConceptAnalysis = async () => {
      if (!userConcept.trim()) return;
      setAnalyzing(true);
      const result = await analyzeCharacterConcept(userConcept);
      setAnalyzing(false);
      if (result) {
          setFormData(prev => ({
              ...prev,
              origin: result.origin as OriginArchetype || prev.origin,
              incident: result.incident as IncitingIncident || prev.incident,
              universe: result.universe as UniverseTone || prev.universe,
              alignment: result.alignment as Alignment || prev.alignment,
              specificPower: result.specificPower || prev.specificPower
          }));
          setAnalysisResult(`Matched: ${result.origin}`);
      }
  };

  const handleSurpriseMe = () => {
      const archetypes = Object.values(OriginArchetype);
      const incidents = Object.values(IncitingIncident);
      const tones = Object.values(UniverseTone);
      const alignments = Object.values(Alignment);
      
      setFormData(prev => ({
          ...prev,
          origin: archetypes[Math.floor(Math.random() * archetypes.length)],
          incident: incidents[Math.floor(Math.random() * incidents.length)],
          universe: tones[Math.floor(Math.random() * tones.length)],
          alignment: alignments[Math.floor(Math.random() * alignments.length)],
          specificPower: "" // Let AI invent this
      }));
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    setLoading(true);
    
    // Fallback if specificPower is empty (AI handles it, but we need a valid string)
    const finalChar = {
        ...formData,
        heroName: formData.heroName?.trim() || formData.name,
        specificPower: formData.specificPower || "A mysterious power fitting their origin."
    } as Character;

    try {
        const story = await generateOriginStory(finalChar);
        if (!story) throw new Error("Generation failed");
        onComplete(finalChar, story);
    } catch (e) {
        console.error("Creation Error", e);
        // Fallback for safety - prevent crash
        onComplete(finalChar, "The origin is shrouded in mystery, but the legend begins regardless...");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div id="character-creator" className="w-full max-w-lg mx-auto p-4 md:p-6 bg-white border-4 border-black shadow-comic-lg relative flex flex-col min-h-[500px]">
      <h1 className="text-2xl md:text-3xl font-black italic mb-4 text-center underline decoration-4 decoration-comic-red text-black break-words">
        {legacyData ? `LEGACY: GEN ${legacyData.generation + 1}` : 'ORIGIN STORY'}
      </h1>
      
      {/* View Archives Button (Top Right) */}
      {onOpenArchives && step === 1 && !legacyData && (
          <div className="absolute top-2 right-2">
             <button 
                onClick={onOpenArchives}
                className="text-[10px] font-bold bg-comic-blue text-white px-2 py-1 border border-black shadow-sm"
             >
                ARCHIVES
             </button>
          </div>
      )}

      {/* Progress Bar */}
      <div className="flex gap-1 mb-6">
          {[1,2,3].map(i => (
              <div key={i} className={`h-2 flex-1 border border-black ${step >= i ? 'bg-comic-yellow' : 'bg-gray-200'}`}></div>
          ))}
      </div>

      <div className="flex-1 flex flex-col">
        {/* STEP 1: IDENTITY */}
        {step === 1 && (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <label className="block font-bold mb-1 text-black text-sm">REAL NAME (CIVILIAN)</label>
                    <input 
                    type="text" 
                    className="w-full border-2 border-black p-3 text-lg font-comic focus:bg-yellow-50"
                    placeholder="Alex Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block font-bold mb-1 text-black text-sm">ALTER EGO <span className="text-gray-400 font-normal">(Hero/Villain Name)</span></label>
                    <input 
                    type="text" 
                    className="w-full border-2 border-black p-3 text-lg font-comic focus:bg-yellow-50"
                    placeholder="e.g. Dr. Entropy, The Wraith"
                    value={formData.heroName}
                    onChange={(e) => setFormData({...formData, heroName: e.target.value})}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Leave blank to just use your real name.</p>
                </div>

                <div>
                    <label className="block font-bold mb-1 text-black text-sm">STARTING AGE: {formData.age}</label>
                    <input 
                        type="range" 
                        min="16" max="60" 
                        className="w-full accent-comic-red cursor-pointer"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded">
                    <label className="block font-bold mb-2 text-blue-900 text-xs uppercase">
                        AI Assist: Auto-Generate
                    </label>
                    <textarea
                        className="w-full border border-blue-300 p-2 text-sm bg-white mb-2 h-20 resize-none"
                        placeholder="e.g. A rich ninja seeking revenge..."
                        value={userConcept}
                        onChange={(e) => setUserConcept(e.target.value)}
                    />
                    <Button 
                        variant="hero" 
                        fullWidth 
                        onClick={handleConceptAnalysis} 
                        disabled={analyzing || !userConcept}
                        className="text-xs"
                    >
                        {analyzing ? 'SCANNING MULTIVERSE...' : 'AUTO-DETECT ARCHETYPE'}
                    </Button>
                    {analysisResult && (
                        <div className="text-xs text-green-700 font-bold mt-2 text-center bg-green-100 p-1 border border-green-300">
                            {analysisResult}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* STEP 2: ARCHETYPE & TONE */}
        {step === 2 && (
            <div className="space-y-4 animate-fade-in flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[50vh] border-2 border-black bg-gray-50 p-2">
                    <label className="block font-bold mb-2 text-black text-sm sticky top-0 bg-gray-50 z-10">ARCHETYPE</label>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.values(OriginArchetype).map((arch) => (
                            <button 
                                key={arch}
                                onClick={() => setFormData({...formData, origin: arch})}
                                className={`p-3 text-left border-2 text-sm font-bold transition-all ${
                                    formData.origin === arch 
                                    ? 'bg-comic-blue text-white border-black shadow-comic' 
                                    : 'bg-white border-gray-300 text-gray-600'
                                }`}
                            >
                                {arch}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-2 text-black text-sm">UNIVERSE TONE</label>
                    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hide">
                        {Object.values(UniverseTone).map(tone => (
                            <button
                                key={tone}
                                onClick={() => setFormData({...formData, universe: tone})}
                                className={`flex-none w-28 p-2 text-[10px] font-black border-2 border-black uppercase leading-tight snap-start ${
                                    formData.universe === tone 
                                    ? 'bg-comic-yellow shadow-comic transform -translate-y-1' 
                                    : 'bg-white text-gray-500'
                                }`}
                            >
                                {tone}
                                <div className="font-normal normal-case text-[9px] mt-1 opacity-70">
                                    {TONE_DESCRIPTIONS[tone].split('.')[0]}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 3 && (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <label className="block font-bold mb-2 text-black text-sm">INCITING INCIDENT</label>
                    <select 
                        className="w-full border-2 border-black p-3 bg-white font-bold text-sm"
                        value={formData.incident}
                        onChange={(e) => setFormData({...formData, incident: e.target.value as IncitingIncident})}
                    >
                        {Object.values(IncitingIncident).map(inc => (
                            <option key={inc} value={inc}>{inc}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="font-bold text-black text-sm">SPECIFIC POWERS</label>
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-300 font-bold">OPTIONAL</span>
                    </div>
                    <textarea
                        className="w-full border-2 border-black p-3 font-comic text-sm h-32 focus:bg-yellow-50"
                        placeholder="Leave blank to let the AI invent your powers..."
                        value={formData.specificPower || ''}
                        onChange={(e) => setFormData({...formData, specificPower: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block font-bold mb-2 text-black text-sm">ALIGNMENT</label>
                    <div className="flex rounded border-2 border-black overflow-hidden">
                        {Object.values(Alignment).map(align => (
                            <button
                                key={align}
                                onClick={() => setFormData({...formData, alignment: align})}
                                className={`flex-1 py-3 text-xs font-bold uppercase ${
                                    formData.alignment === align 
                                    ? 'bg-comic-red text-white' 
                                    : 'bg-white text-gray-500 hover:bg-gray-100 border-l border-black first:border-l-0'
                                }`}
                            >
                                {align}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">This determines your mission types and narrative tone.</p>
                </div>

                <div className="text-center pt-2">
                     <button 
                        onClick={handleSurpriseMe}
                        className="text-xs font-bold text-purple-600 underline decoration-dashed hover:text-purple-800"
                     >
                        🎲 I can't decide! Randomize choices.
                     </button>
                </div>
            </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex gap-3 pt-4 border-t-2 border-gray-100">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">BACK</Button>
          )}
          {step < 3 ? (
            <Button variant="primary" onClick={handleNext} disabled={!formData.name} className="flex-1">NEXT</Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={loading} className="flex-[2]">
                {loading ? 'WRITING ISSUE #1...' : 'START CAREER'}
            </Button>
          )}
      </div>
    </div>
  );
};