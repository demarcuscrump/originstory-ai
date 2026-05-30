import React from 'react';
import { Button } from '../components/Button';
import { AiSettingsModal } from '../components/AiSettingsModal';
import { PrdChecklist } from '../components/PrdChecklist';
import { NemesisDossierModal, NemesisSummaryCard } from '../components/NemesisDossier';
import { NewspaperModal } from '../components/NewspaperModal';
import { LairModal } from '../components/LairModal';
import { LifestyleModal } from '../components/LifestyleModal';
import { CrisisModal } from '../components/CrisisModal';
import { PhoneModal } from '../components/PhoneModal';
import { LongBox } from '../components/LongBox';
import { VillainModal } from '../components/VillainModal';
import { TeamModal } from '../components/TeamModal';
import { PullListModal } from '../components/PullListModal';
import { Onomatopoeia } from '../components/Onomatopoeia';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';
import { getActionsForAlignment, getJusticeLabel } from '../constants/gameData';
import { Alignment, GameEvent } from '../types';
import { audio } from '../services/audioService';
import { generatePanelImage } from '../services/aiService';

const statTone = (label: string, value: number) => {
  if (label === 'Suspicion' && value >= 80) return 'bg-[#3B2422] border-[#D85A4F] text-[#FFD7D2]';
  if (value >= 70) return 'bg-[#25382E] border-[#2DD38F] text-[#CFFFF0]';
  if (value <= 20) return 'bg-[#3F3720] border-[#FFD21F] text-[#FFECA0]';
  return 'bg-[#343434] border-[#0E0E0E] text-[#F4F4F0]';
};

const eventLabel: Record<GameEvent['type'], string> = {
  ACTION_RESULT: 'Turn Result',
  ARC_EVENT: 'Key Issue',
  CRISIS: 'Crisis',
  DIALOGUE: 'Dialogue',
  NARRATIVE: 'Story Beat',
  ORIGIN: 'Issue #1: Origin',
  RETCON: 'Retcon',
  TEAM_REPORT: 'Team Report',
};

const previewText = (value: string, maxLength = 150) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

const StatCard: React.FC<{ label: string; value: number; suffix?: string }> = ({ label, value, suffix = '%' }) => (
  <div className={`rounded-2xl border-2 p-3 shadow-[3px_3px_0px_#0E0E0E] ${statTone(label, value)}`}>
    <div className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</div>
    <div className="font-mono text-xl font-black leading-none">
      {value}<span className="text-xs ml-0.5">{suffix}</span>
    </div>
  </div>
);

const EmptyLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="text-[#B8B8B0] italic text-xs">{children}</li>
);

const CurrentPanel: React.FC<{ event?: GameEvent; panelNumber: number; onRetryImage?: (event: GameEvent) => void }> = ({ event, panelNumber, onRetryImage }) => {
  if (!event) {
    return (
      <article className="flex-1 min-h-0 bg-[#343434] border-2 border-[#0E0E0E] rounded-[28px] shadow-[5px_5px_0px_#0E0E0E] p-5 flex items-center justify-center text-center">
        <div>
          <p className="font-display text-3xl tracking-wide text-[#FFD21F]">No panels yet</p>
          <p className="text-sm text-[#B8B8B0] mt-2">Create a character to begin the first issue.</p>
        </div>
      </article>
    );
  }

  const expectsPanelArt = ['ORIGIN', 'CRISIS', 'RETCON', 'ARC_EVENT'].includes(event.type);
  const hasPanelArt = Boolean(event.imageUrl || event.isGeneratingImage || event.imageError || expectsPanelArt);
  const needsCaptionScroll = event.text.length > 700;

  return (
    <article className="flex-1 min-h-0 bg-[#343434] border-2 border-[#0E0E0E] rounded-[28px] shadow-[5px_5px_0px_#0E0E0E] flex flex-col overflow-hidden">
      <header className="shrink-0 border-b-2 border-[#0E0E0E] bg-[#3E3E3E] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#FFD21F]">Current Panel</p>
          <h3 className="font-display text-3xl italic tracking-wide leading-none text-[#F4F4F0]">{eventLabel[event.type]}</h3>
        </div>
        <div className="flex items-center gap-2">
          {event.type === 'ARC_EVENT' && (
            <span className="text-[10px] font-black uppercase rounded-full border-2 border-[#0E0E0E] bg-[#FFD21F] px-3 py-1 text-[#161616]">
              Key Issue
            </span>
          )}
          <span className="font-mono text-xs rounded-full bg-[#242424] border-2 border-[#0E0E0E] px-3 py-1 text-[#F4F4F0]">
            Panel {panelNumber}
          </span>
        </div>
      </header>

      <div className={`flex-1 min-h-0 p-3 md:p-4 grid gap-3 md:gap-4 ${hasPanelArt ? 'xl:grid-cols-[minmax(340px,1fr)_minmax(380px,1fr)]' : 'grid-cols-1'}`}>
        {hasPanelArt && (
          <figure className="relative order-2 xl:order-1 min-h-[220px] h-[32dvh] max-h-[440px] xl:min-h-[260px] xl:h-full xl:max-h-none bg-[#181818] border-2 border-[#0E0E0E] rounded-[22px] overflow-hidden flex items-center justify-center">
            {event.imageUrl ? (
              <>
                <img
                  src={event.imageUrl}
                  alt={`${eventLabel[event.type]} comic panel`}
                  className="w-full h-full object-cover object-center bg-[#181818]"
                  loading="eager"
                />
                {onRetryImage && (
                  <button
                    type="button"
                    onClick={() => onRetryImage(event)}
                    className="absolute bottom-3 right-3 rounded-full bg-[#FFD21F] text-[#161616] border-2 border-[#0E0E0E] px-3 py-1.5 text-[10px] font-black shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    REGEN ART
                  </button>
                )}
              </>
            ) : event.isGeneratingImage ? (
              <div className="text-center px-4">
                <div className="w-12 h-12 border-4 border-[#FFD21F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-black uppercase tracking-wide text-[#F4F4F0]">Artist drawing panel</p>
                <p className="text-sm text-[#C7C7BE] mt-1">Story is ready while the image renders.</p>
              </div>
            ) : (
              <div className="text-center px-5 max-w-sm">
                <p className="font-black uppercase tracking-wide text-[#FFD21F]">Panel art missing</p>
                <p className="text-sm text-[#C7C7BE] mt-2">{event.imageError || 'The story loaded, but the art did not come back from the image model.'}</p>
                {onRetryImage && (
                  <button
                    type="button"
                    onClick={() => onRetryImage(event)}
                    className="mt-4 rounded-full bg-[#FFD21F] text-[#161616] border-2 border-[#0E0E0E] px-4 py-2 text-xs font-black shadow-[2px_2px_0px_#0E0E0E] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    RETRY ART
                  </button>
                )}
              </div>
            )}
          </figure>
        )}

        <section className="order-1 xl:order-2 min-w-0 min-h-[220px] max-h-[40dvh] xl:max-h-none bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[22px] p-4 flex flex-col overflow-hidden">
          <div className="shrink-0 flex items-start justify-between gap-3 border-b border-[#4C4C4C] pb-2 mb-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#FFD21F]">Story Caption</p>
              <p className="mt-1 text-[10px] font-mono uppercase text-[#B8B8B0]">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} / Panel ID {event.id.slice(-4)}
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase text-[#B8B8B0]">{event.type.replace('_', ' ')}</span>
          </div>
          <div className={`min-h-0 flex-1 ${needsCaptionScroll ? 'overflow-y-auto pr-2 comic-scrollbar' : 'overflow-hidden'}`}>
            <p className="font-sans max-w-[76ch] text-[13px] md:text-sm leading-6 text-[#F4F4F0] whitespace-pre-wrap break-words">
              {event.text}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};

const RecentBeats: React.FC<{ events: GameEvent[] }> = ({ events }) => (
  <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-[3px_3px_0px_#0E0E0E] p-3">
    <div className="flex items-center justify-between gap-3 border-b border-[#515151] pb-2 mb-3">
      <h3 className="font-black text-sm uppercase text-[#F4F4F0]">Recent Beats</h3>
      <span className="text-[10px] font-mono text-[#B8B8B0]">{events.length} shown</span>
    </div>
    {events.length === 0 ? (
      <p className="text-xs italic text-[#B8B8B0]">Previous panels will collect here.</p>
    ) : (
      <ol className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="bg-[#2B2B2B] border border-[#515151] rounded-2xl p-2">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-[#FFD21F]">{eventLabel[event.type]}</span>
              <span className="text-[10px] font-mono text-[#B8B8B0]">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-xs leading-snug text-[#D8D8D2]">{previewText(event.text, 120)}</p>
          </li>
        ))}
      </ol>
    )}
  </section>
);

export const PlayingScreen: React.FC = () => {
  const {
    character, stats, history, nemesis, upgrades, npcs,
    sidekicks, assets, archives, activeModal, activeTab,
    isProcessing, suggestedActions, activeCrisis, activeVillain,
    newspaperHeadline, fxState, isMuted, battlePassXp, bpRewards,
    isPremium,
    setActiveModal, setActiveTab, setFxState, setIsMuted, setArchives,
    setIsPremium, setHistory,
  } = useGameStore();

  const {
    handleAction, handleShowdown, handlePurchaseUpgrade, handleSuitUpgrade,
    handleCrisisResolution, handleInteractNPC, handleVillainEncounter,
    handleRecruitSidekick, handleSidekickMission, handlePurchaseAsset,
    handleClaimReward,
  } = useGameActions();

  const handleToggleMute = () => setIsMuted(audio.toggleMute());

  if (!character) return null;

  const actions = getActionsForAlignment(character.alignment);
  const canConfront = stats.justice >= 30 && stats.glory >= 10 && !nemesis?.defeated;
  const justiceLabel = getJusticeLabel(character.alignment);
  const currentEvent = history[history.length - 1];
  const recentEvents = history.slice(Math.max(0, history.length - 4), Math.max(0, history.length - 1)).reverse();
  const handleRetryPanelImage = React.useCallback((event: GameEvent) => {
    setHistory(prev => prev.map(item => item.id === event.id ? {
      ...item,
      isGeneratingImage: true,
      imageError: undefined,
    } : item));

    generatePanelImage(event.text, character).then(imageUrl => {
      setHistory(prev => prev.map(item => item.id === event.id ? {
        ...item,
        imageUrl: imageUrl || item.imageUrl,
        isGeneratingImage: false,
        imageError: imageUrl ? undefined : 'Panel art could not be regenerated. Check your OpenRouter key, credits, or image model.',
      } : item));
    });
  }, [character, setHistory]);
  const purchasedAssets = assets.filter((asset) => asset.purchased);
  const statCards: Array<{ label: string; value: number; suffix?: string }> = [
    { label: 'Wealth', value: stats.wealth },
    { label: 'Sanity', value: stats.sanity },
    { label: justiceLabel, value: stats.justice },
    { label: 'Glory', value: stats.glory },
    { label: 'Suspicion', value: stats.suspicion },
    { label: 'Retcons', value: stats.retconPoints, suffix: '' },
  ];

  return (
    <div id="game-container" className="h-dvh max-h-dvh max-w-[1500px] mx-auto border-x-2 border-[#0E0E0E] bg-[#242424] shadow-2xl relative overflow-hidden flex flex-col text-[#F4F4F0]">
      <PrdChecklist isOpen={activeModal === 'PRD'} onClose={() => setActiveModal(null)} />

      {fxState && (
        <Onomatopoeia text={fxState.text} type={fxState.type} onComplete={() => setFxState(null)} />
      )}

      {activeModal === 'NEWSPAPER' && (
        <NewspaperModal headline={newspaperHeadline} onClose={() => { setActiveModal(null); audio.playClick(); }} />
      )}

      {activeModal === 'LAIR' && (
        <LairModal
          character={character} stats={stats} upgrades={upgrades}
          onPurchase={handlePurchaseUpgrade} onUpgradeSuit={handleSuitUpgrade}
          onClose={() => { setActiveModal(null); audio.playClick(); }}
        />
      )}

      {activeModal === 'LIFESTYLE' && (
        <LifestyleModal assets={assets} stats={stats} onPurchase={handlePurchaseAsset} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'TEAM' && (
        <TeamModal
          sidekicks={sidekicks} stats={stats}
          onRecruit={handleRecruitSidekick} onMission={handleSidekickMission}
          onClose={() => { setActiveModal(null); audio.playClick(); }} isLoading={isProcessing}
        />
      )}

      {activeModal === 'PULLLIST' && (
        <PullListModal
          currentXp={battlePassXp} rewards={bpRewards} isPremium={isPremium}
          onClaim={handleClaimReward} onPurchasePremium={() => { setIsPremium(true); audio.playFanfare(); }}
          onClose={() => { setActiveModal(null); audio.playClick(); }}
        />
      )}

      {activeCrisis && <CrisisModal crisis={activeCrisis} onResolve={handleCrisisResolution} />}

      {activeVillain && <VillainModal villain={activeVillain} currentStats={stats} onAction={handleVillainEncounter} />}

      {activeModal === 'PHONE' && (
        <PhoneModal npcs={npcs} onInteract={handleInteractNPC} onClose={() => { setActiveModal(null); audio.playClick(); }} />
      )}

      {activeModal === 'LONGBOX' && (
        <LongBox archives={archives} onClose={() => setActiveModal(null)} onClear={() => setArchives([])} />
      )}

      {activeModal === 'AI_SETTINGS' && (
        <AiSettingsModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'NEMESIS_DOSSIER' && nemesis && (
        <NemesisDossierModal
          nemesis={nemesis}
          canConfront={canConfront}
          onConfront={handleShowdown}
          onClose={() => setActiveModal(null)}
        />
      )}

      <header id="game-header" className="shrink-0 bg-[#202020] text-[#F4F4F0] border-b-2 border-[#0E0E0E] p-3">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-display italic text-[#FFD21F] text-3xl md:text-4xl tracking-wide leading-none truncate">
              {character.heroName}
              {character.legacy && (
                <span className="text-xs text-[#B8B8B0] ml-2 not-italic inline-block font-sans">
                  {character.legacy.generation > 1 ? `Gen ${character.legacy.generation}` : ''}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs font-mono rounded-full bg-[#343434] border border-[#515151] px-3 py-1">Week {character.week}</span>
              <span className="text-xs font-mono rounded-full bg-[#343434] border border-[#515151] px-3 py-1">Age {character.age}</span>
              {character.currentArc && (
                <span className="text-xs font-bold rounded-full bg-[#3E3E3E] text-[#FFD21F] px-3 py-1 border border-[#515151]">
                  ARC: {character.currentArc}
                </span>
              )}
              {nemesis && !nemesis.defeated && (
                <span className="text-xs font-black rounded-full bg-[#3B2422] text-[#FFD7D2] px-3 py-1 border border-[#D85A4F]">
                  DOOM {nemesis.schemeProgress || 0}%
                </span>
              )}
            </div>
          </div>

          <nav className="flex gap-2 flex-wrap xl:justify-center">
            <button onClick={() => { setActiveModal('LAIR'); audio.playClick(); }} className="rounded-full text-xs bg-[#3E3E3E] hover:bg-[#4A4A4A] text-[#F4F4F0] font-bold px-4 py-2 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">LAIR</button>
            <button onClick={() => { setActiveModal('TEAM'); audio.playClick(); }} className="rounded-full text-xs bg-[#3E3E3E] hover:bg-[#4A4A4A] text-[#F4F4F0] font-bold px-4 py-2 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">TEAM</button>
            <button onClick={() => { setActiveModal('PULLLIST'); audio.playClick(); }} className="rounded-full text-xs bg-[#FFD21F] hover:bg-[#FFE45A] text-[#161616] font-bold px-4 py-2 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">PULL LIST</button>
            <button onClick={() => { setActiveModal('LIFESTYLE'); audio.playClick(); }} className="rounded-full text-xs bg-[#3E3E3E] hover:bg-[#4A4A4A] text-[#F4F4F0] font-bold px-4 py-2 border-2 border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E]">LIFESTYLE</button>
          </nav>

          <div className="flex gap-2 flex-wrap xl:justify-end">
            <button onClick={handleToggleMute} className="rounded-full text-[10px] text-[#F4F4F0] bg-[#343434] px-3 py-1.5 hover:bg-[#4A4A4A] font-bold border border-[#515151] shadow-[2px_2px_0px_#0E0E0E] transition-transform active:translate-y-1 active:shadow-none">
              {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </button>
            <button onClick={() => { audio.playClick(); setActiveModal('AI_SETTINGS'); }} className="rounded-full text-[10px] text-[#F4F4F0] bg-[#343434] px-3 py-1.5 hover:bg-[#4A4A4A] font-bold border border-[#515151] shadow-[2px_2px_0px_#0E0E0E] transition-transform active:translate-y-1 active:shadow-none">AI KEY</button>
            <button onClick={() => { audio.playClick(); setActiveModal('PRD'); }} className="rounded-full text-[10px] text-[#161616] bg-[#FFD21F] px-3 py-1.5 hover:bg-[#FFE45A] font-bold border border-[#0E0E0E] shadow-[2px_2px_0px_#0E0E0E] transition-transform active:translate-y-1 active:shadow-none">MISSION CONTROL</button>
            <button onClick={() => { audio.playClick(); useGameStore.getState().setGamePhase('TITLE'); }} className="rounded-full text-[10px] text-[#F4F4F0] bg-[#343434] px-3 py-1.5 hover:bg-[#4A4A4A] font-bold border border-[#515151] shadow-[2px_2px_0px_#0E0E0E] transition-transform active:translate-y-1 active:shadow-none">TITLE</button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 bg-[#242424] p-3 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_330px] gap-3 overflow-y-auto lg:overflow-hidden comic-scrollbar">
        <aside className="order-2 lg:order-1 min-h-0 flex flex-col gap-3 lg:overflow-y-auto lg:pr-1 comic-scrollbar">
          <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-[4px_4px_0px_#0E0E0E] p-3 shrink-0">
            <div className="flex items-center justify-between border-b-2 border-[#515151] pb-2 mb-3">
              <h3 className="font-black text-sm uppercase">Hero Sheet</h3>
              <span className={`text-xs font-black rounded-full px-3 py-1 border-2 ${stats.suspicion > 80 ? 'bg-[#3B2422] text-[#FFD7D2] border-[#D85A4F]' : 'bg-[#2B2B2B] text-[#FFD21F] border-[#0E0E0E]'}`}>
                Suspicion {stats.suspicion}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          </section>

          <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-[4px_4px_0px_#0E0E0E] p-3 min-h-0 flex flex-col">
            <h3 className="font-black text-sm uppercase border-b-2 border-[#515151] pb-2 mb-3 text-[#FFD21F]">Gear & Safehouses</h3>
            <ul className="space-y-2 min-h-0 lg:max-h-[26dvh] overflow-y-auto pr-1 comic-scrollbar">
              {purchasedAssets.length === 0 && upgrades.length === 0 && (
                <EmptyLine>Living on the streets.</EmptyLine>
              )}
              {purchasedAssets.map((asset) => (
                <li key={asset.id} className="font-bold border-l-4 border-[#FFD21F] pl-3 py-2 bg-[#2B2B2B] rounded-r-xl text-xs leading-tight">
                  {asset.name}
                  <span className="block text-[10px] text-[#B8B8B0] font-normal">{asset.description}</span>
                </li>
              ))}
              {upgrades.map((upgrade, index) => (
                <li key={`${upgrade.id}-${index}`} className="font-bold border-l-4 border-[#D85A4F] pl-3 py-2 bg-[#2B2B2B] rounded-r-xl text-xs leading-tight">
                  {upgrade.name}
                  <span className="block text-[10px] text-[#B8B8B0] font-normal">{upgrade.type} Upgrade</span>
                </li>
              ))}
            </ul>
          </section>

          {nemesis && (
            <div className="xl:hidden">
              <NemesisSummaryCard
                nemesis={nemesis}
                canConfront={canConfront}
                onConfront={handleShowdown}
                onOpenDossier={() => { audio.playClick(); setActiveModal('NEMESIS_DOSSIER'); }}
              />
            </div>
          )}
        </aside>

        <section className="order-1 lg:order-2 min-h-[68vh] lg:min-h-0 flex flex-col border-2 border-[#0E0E0E] bg-[#2B2B2B] rounded-[28px] shadow-[5px_5px_0px_#0E0E0E] overflow-hidden">
          <div className="shrink-0 bg-[#3E3E3E] border-b-2 border-[#0E0E0E] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-3xl italic tracking-wide leading-none text-[#FFD21F]">Issue Desk</h3>
              <p className="text-xs font-bold uppercase text-[#B8B8B0]">{character.universe} / {character.alignment}</p>
            </div>
            <span className="font-mono text-xs rounded-full bg-[#242424] border-2 border-[#0E0E0E] px-3 py-1">
              {history.length} panels
            </span>
          </div>

          <div className="flex-1 min-h-0 p-3 flex flex-col">
            <CurrentPanel event={currentEvent} panelNumber={history.length || 1} onRetryImage={handleRetryPanelImage} />
          </div>

          {suggestedActions.length > 0 && !isProcessing && (
            <div className="shrink-0 border-t-2 border-[#0E0E0E] bg-[#343434] p-3">
              <p className="text-xs font-black uppercase text-[#FFD21F] mb-2">Narrative Choices</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {suggestedActions.map((action) => (
                  <button key={action.id} onClick={() => handleAction(action)} className="text-left bg-[#2B2B2B] border-2 border-[#0E0E0E] rounded-[22px] shadow-[3px_3px_0px_#0E0E0E] hover:bg-[#3E3E3E] p-4 min-h-[120px] flex flex-col transition-colors group">
                    <span className="font-black text-sm uppercase group-hover:underline decoration-2 text-[#F4F4F0] tracking-wide leading-tight">{action.label}</span>
                    <span className="text-sm text-[#C7C7BE] block mt-2 leading-snug">{previewText(action.description, 140)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="shrink-0 flex justify-center border-t-2 border-[#0E0E0E] bg-[#343434] p-4">
              <div className="rounded-full font-black animate-pulse bg-[#FFD21F] border-2 border-[#0E0E0E] px-6 py-3 shadow-[3px_3px_0px_#0E0E0E] text-[#161616] text-base">
                INKING NEXT PANEL...
              </div>
            </div>
          )}
        </section>

        <aside className="order-3 min-h-0 hidden xl:flex flex-col gap-3 overflow-y-auto pr-1 comic-scrollbar">
          {nemesis && (
            <NemesisSummaryCard
              nemesis={nemesis}
              canConfront={canConfront}
              onConfront={handleShowdown}
              onOpenDossier={() => { audio.playClick(); setActiveModal('NEMESIS_DOSSIER'); }}
            />
          )}

          <RecentBeats events={recentEvents} />

          <section className="bg-[#343434] border-2 border-[#0E0E0E] rounded-[24px] shadow-[4px_4px_0px_#0E0E0E] p-3 shrink-0">
            <h3 className="font-black text-sm uppercase border-b-2 border-[#515151] pb-2 mb-3 text-[#FFD21F]">Allies & Contacts</h3>
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 comic-scrollbar">
              {sidekicks.length === 0 && npcs.length === 0 && (
                <EmptyLine>Operating strictly solo.</EmptyLine>
              )}
              {sidekicks.map((sidekick, index) => (
                <li key={`${sidekick.id}-${index}`} className="font-bold border-l-4 border-[#FFD21F] pl-3 py-2 bg-[#2B2B2B] rounded-r-xl text-xs leading-tight">
                  {sidekick.name}
                  <span className="block text-[10px] text-[#B8B8B0] font-normal">{sidekick.specialty} Specialist</span>
                </li>
              ))}
              {npcs.map((npc, index) => (
                <li key={`${npc.id}-${index}`} className="font-bold border-l-4 border-[#8EA0AB] pl-3 py-2 bg-[#2B2B2B] rounded-r-xl text-xs leading-tight">
                  {npc.name}
                  <span className="block text-[10px] text-[#B8B8B0] font-normal">{npc.relation} (Trust: {npc.relationship}%)</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>

      <footer id="controls-panel" className="shrink-0 bg-[#202020] border-t-2 border-[#0E0E0E] z-20 p-3 shadow-[0_-8px_20px_rgba(0,0,0,0.35)]">
        <div className="flex mb-3">
          <button
            onClick={() => { setActiveTab('CIVILIAN'); audio.playClick(); }}
            className={`flex-1 py-2 font-black border-2 border-[#0E0E0E] rounded-l-full transition-transform ${activeTab === 'CIVILIAN' ? 'bg-[#FFD21F] -translate-y-1 shadow-[3px_3px_0px_#0E0E0E] text-[#161616]' : 'bg-[#343434] text-[#B8B8B0]'}`}
          >
            {character.alignment === Alignment.VILLAIN ? 'CRIMINAL LIFE' : 'CIVILIAN LIFE'}
          </button>
          <button
            onClick={() => { setActiveTab('HERO'); audio.playClick(); }}
            className={`flex-1 py-2 font-black border-2 border-[#0E0E0E] rounded-r-full transition-transform ${activeTab === 'HERO' ? 'bg-[#FFD21F] text-[#161616] -translate-y-1 shadow-[3px_3px_0px_#0E0E0E]' : 'bg-[#343434] text-[#B8B8B0]'}`}
          >
            {character.alignment === Alignment.VILLAIN ? 'VILLAINY' : 'HERO DUTIES'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {activeTab === 'CIVILIAN'
            ? actions.civilian.map((action) => (
                <Button key={action.id} variant="civilian" onClick={() => handleAction(action)} disabled={isProcessing} className="text-xs">{action.label}</Button>
              ))
            : actions.hero.map((action) => (
                <Button key={action.id} variant="hero" onClick={() => handleAction(action)} disabled={isProcessing} className="text-xs">{action.label}</Button>
              ))
          }
        </div>
      </footer>
    </div>
  );
};
