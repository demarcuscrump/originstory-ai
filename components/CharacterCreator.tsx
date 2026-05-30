import React, { useState, useEffect } from 'react';
import { Alignment, Character, OriginArchetype, UniverseTone, LegacyData, IncitingIncident } from '../types';
import { Button } from './Button';
import { generateOriginStory, analyzeCharacterConcept } from '../services/aiService';

interface CharacterCreatorProps {
  onComplete: (character: Character, originStory: string) => void;
  onOpenArchives?: () => void;
  legacyData?: LegacyData;
}

const TONE_DESCRIPTIONS = {
  [UniverseTone.GOLDEN_AGE]: 'Optimistic, classic, bright heroics.',
  [UniverseTone.SILVER_AGE]: 'Strange science, bold twists, colorful stakes.',
  [UniverseTone.BRONZE_AGE]: 'Grounded pressure, city issues, moral weight.',
  [UniverseTone.MODERN]: 'Cinematic pacing and contemporary action.',
  [UniverseTone.GRIM_DARK]: 'Gritty edges, personal cost, hard choices.',
  [UniverseTone.COSMIC]: 'Space opera scale and mythic spectacle.',
  [UniverseTone.STREET_NOIR]: 'Detective shadows, crime, and secrets.',
  [UniverseTone.HORROR]: 'Supernatural threat and fear-driven scenes.',
  [UniverseTone.CYBERPUNK]: 'Neon tech, corporate pressure, future streets.',
  [UniverseTone.POST_APOC]: 'Scarcity, survival, and ruined-world choices.',
};

const STEP_LABELS = ['Identity', 'World', 'Powers'];

const OptionButton: React.FC<{
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}> = ({ selected, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-2xl border-2 p-3 transition-colors min-h-[76px] ${
      selected
        ? 'bg-[#FFD21F] border-[#0E0E0E] text-[#161616] shadow-[3px_3px_0px_#0E0E0E]'
        : 'bg-[#3E3E3E] border-[#0E0E0E] text-[#F4F4F0] hover:bg-[#4A4A4A]'
    }`}
  >
    <div className="font-black text-sm leading-tight">{title}</div>
    {description && <div className={`text-xs leading-snug mt-1 ${selected ? 'text-[#161616]' : 'text-[#C7C7BE]'}`}>{description}</div>}
  </button>
);

const SummaryRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="border-b border-[#515151] py-2">
    <div className="text-[10px] uppercase font-black text-[#B8B8B0]">{label}</div>
    <div className="font-bold text-sm text-[#F4F4F0] break-words">{value || 'Not set'}</div>
  </div>
);

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
      setFormData((prev) => ({ ...prev, legacy: legacyData }));
    }
  }, [legacyData]);

  const canAdvance = step > 1 || Boolean(formData.name?.trim());
  const handleNext = () => setStep((current) => Math.min(3, current + 1));
  const handleBack = () => setStep((current) => Math.max(1, current - 1));

  const handleConceptAnalysis = async () => {
    if (!userConcept.trim()) return;
    setAnalyzing(true);
    const result = await analyzeCharacterConcept(userConcept);
    setAnalyzing(false);
    if (result) {
      setFormData((prev) => ({
        ...prev,
        origin: result.origin as OriginArchetype || prev.origin,
        incident: result.incident as IncitingIncident || prev.incident,
        universe: result.universe as UniverseTone || prev.universe,
        alignment: result.alignment as Alignment || prev.alignment,
        specificPower: result.specificPower || prev.specificPower,
      }));
      setAnalysisResult(`Matched ${result.origin || OriginArchetype.STREET}`);
    }
  };

  const handleSurpriseMe = () => {
    const archetypes = Object.values(OriginArchetype);
    const incidents = Object.values(IncitingIncident);
    const tones = Object.values(UniverseTone);
    const alignments = Object.values(Alignment);

    setFormData((prev) => ({
      ...prev,
      origin: archetypes[Math.floor(Math.random() * archetypes.length)],
      incident: incidents[Math.floor(Math.random() * incidents.length)],
      universe: tones[Math.floor(Math.random() * tones.length)],
      alignment: alignments[Math.floor(Math.random() * alignments.length)],
      specificPower: '',
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    setLoading(true);

    const finalChar = {
      ...formData,
      heroName: formData.heroName?.trim() || formData.name,
      specificPower: formData.specificPower || 'A mysterious power fitting their origin.',
    } as Character;

    try {
      const story = await generateOriginStory(finalChar);
      if (!story) throw new Error('Generation failed');
      onComplete(finalChar, story);
    } catch (error) {
      console.error('Creation Error', error);
      onComplete(finalChar, 'The origin is shrouded in mystery, but the legend begins regardless...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="character-creator" className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
      <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg p-4 md:p-6 min-w-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b-2 border-[#515151] pb-4 mb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#FFD21F]">
              {legacyData ? `Legacy Generation ${legacyData.generation + 1}` : 'Issue #1'}
            </p>
            <h2 className="font-display text-5xl leading-none tracking-wide">Create Your Lead</h2>
          </div>

          {onOpenArchives && step === 1 && !legacyData && (
            <Button type="button" variant="secondary" onClick={onOpenArchives} className="text-xs">
              Open Long Box
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {STEP_LABELS.map((label, index) => {
            const number = index + 1;
            return (
              <div key={label} className={`rounded-2xl border-2 p-2 ${step >= number ? 'bg-[#FFD21F] border-[#0E0E0E] text-[#161616]' : 'bg-[#3E3E3E] border-[#0E0E0E] text-[#F4F4F0]'}`}>
                <div className={`text-[10px] font-black uppercase ${step >= number ? 'text-[#161616]' : 'text-[#B8B8B0]'}`}>Step {number}</div>
                <div className="font-black text-sm">{label}</div>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 animate-fade-in">
            <div className="space-y-4">
              <label className="block">
                <span className="block font-black uppercase text-xs mb-1">Civilian Name</span>
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 text-base focus:bg-[#3E3E3E]"
                  placeholder="Alex Sterling"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="block font-black uppercase text-xs mb-1">Alter Ego</span>
                <input
                  type="text"
                  className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 text-base focus:bg-[#3E3E3E]"
                  placeholder="Dr. Entropy, The Wraith"
                  value={formData.heroName}
                  onChange={(event) => setFormData({ ...formData, heroName: event.target.value })}
                />
                <p className="text-xs text-[#B8B8B0] mt-1">Leave blank to use the civilian name.</p>
              </label>

              <label className="block">
                <span className="block font-black uppercase text-xs mb-1">Starting Age: {formData.age}</span>
                <input
                  type="range"
                  min="16"
                  max="60"
                  className="w-full accent-comic-yellow cursor-pointer"
                  value={formData.age}
                  onChange={(event) => setFormData({ ...formData, age: parseInt(event.target.value, 10) })}
                />
              </label>
            </div>

            <div className="bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[24px] p-4">
              <label className="block font-black uppercase text-xs mb-2 text-[#FFD21F]">
                AI Assist
              </label>
              <textarea
                className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 text-sm h-28 resize-none"
                placeholder="A rich ninja seeking revenge after a betrayal..."
                value={userConcept}
                onChange={(event) => setUserConcept(event.target.value)}
              />
              <Button
                type="button"
                variant="hero"
                fullWidth
                onClick={handleConceptAnalysis}
                disabled={analyzing || !userConcept}
                className="text-xs mt-3"
              >
                {analyzing ? 'Scanning Concept...' : 'Auto-Detect Build'}
              </Button>
              {analysisResult && (
                <div className="text-xs text-[#CFFFF0] font-bold mt-3 bg-[#25382E] p-3 rounded-2xl border-2 border-[#2DD38F]">
                  {analysisResult}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-black uppercase text-sm">Origin Archetype</h3>
                <button type="button" onClick={handleSurpriseMe} className="text-xs font-black underline text-[#FFD21F]">
                  Randomize
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Object.values(OriginArchetype).map((origin) => (
                  <OptionButton
                    key={origin}
                    selected={formData.origin === origin}
                    title={origin}
                    onClick={() => setFormData({ ...formData, origin })}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black uppercase text-sm mb-3">Universe Tone</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Object.values(UniverseTone).map((tone) => (
                  <OptionButton
                    key={tone}
                    selected={formData.universe === tone}
                    title={tone}
                    description={TONE_DESCRIPTIONS[tone]}
                    onClick={() => setFormData({ ...formData, universe: tone })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 animate-fade-in">
            <div className="space-y-4">
              <label className="block">
                <span className="block font-black uppercase text-xs mb-1">Inciting Incident</span>
                <select
                  className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 font-bold text-sm"
                  value={formData.incident}
                  onChange={(event) => setFormData({ ...formData, incident: event.target.value as IncitingIncident })}
                >
                  {Object.values(IncitingIncident).map((incident) => (
                    <option key={incident} value={incident}>{incident}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block font-black uppercase text-xs mb-1">Specific Powers</span>
                <textarea
                  className="w-full rounded-2xl border-2 border-[#0E0E0E] p-3 text-sm h-32 focus:bg-[#3E3E3E]"
                  placeholder="Leave blank to let AI invent powers..."
                  value={formData.specificPower || ''}
                  onChange={(event) => setFormData({ ...formData, specificPower: event.target.value })}
                />
              </label>
            </div>

            <div>
              <h3 className="font-black uppercase text-sm mb-3">Alignment</h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(Alignment).map((alignment) => (
                  <OptionButton
                    key={alignment}
                    selected={formData.alignment === alignment}
                    title={alignment}
                    description="Changes available actions and narrative tone."
                    onClick={() => setFormData({ ...formData, alignment })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-5 border-t-2 border-[#515151]">
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" variant="primary" onClick={handleNext} disabled={!canAdvance} className="flex-1">
              Next
            </Button>
          ) : (
            <Button type="button" variant="hero" onClick={handleSubmit} disabled={loading} className="flex-[2]">
              {loading ? 'Writing Issue #1...' : 'Start Career'}
            </Button>
          )}
        </div>
      </section>

      <aside className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[32px] shadow-comic-lg p-4 h-fit lg:sticky lg:top-4">
        <h3 className="font-black uppercase text-sm border-b-2 border-[#515151] pb-3 mb-2 text-[#FFD21F]">Build Summary</h3>
        <SummaryRow label="Civilian" value={formData.name} />
        <SummaryRow label="Alter Ego" value={formData.heroName || formData.name} />
        <SummaryRow label="Age" value={formData.age} />
        <SummaryRow label="Origin" value={formData.origin} />
        <SummaryRow label="Tone" value={formData.universe} />
        <SummaryRow label="Incident" value={formData.incident} />
        <SummaryRow label="Alignment" value={formData.alignment} />
        <SummaryRow label="Powers" value={formData.specificPower || 'AI/default'} />
        <div className="mt-4 rounded-2xl border-2 border-[#0E0E0E] bg-[#2B2B2B] p-3 text-xs leading-relaxed text-[#D8D8D2]">
          This setup becomes the first issue and drives action labels, tone, nemesis generation, and future arc events.
        </div>
      </aside>
    </div>
  );
};
