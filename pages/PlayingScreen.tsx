import React, { useRef, useEffect, useCallback } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Button } from '../components/Button';
import { EventPanel } from '../components/EventPanel';
import { PrdChecklist } from '../components/PrdChecklist';
import { WantedPoster } from '../components/WantedPoster';
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
import { StatRadar } from '../components/StatRadar';
import { useGameStore } from '../store/useGameStore';
import { useGameActions } from '../hooks/useGameActions';
import { getActionsForAlignment, getJusticeLabel } from '../constants/gameData';
import { Alignment } from '../types';
import { audio } from '../services/audioService';

export const PlayingScreen: React.FC = () => {
  const {
    character, stats, history, nemesis, upgrades, npcs,
    sidekicks, assets, archives, activeModal, activeTab,
    isProcessing, suggestedActions, activeCrisis, activeVillain,
    newspaperHeadline, fxState, isMuted, battlePassXp, bpRewards,
    isPremium,
    setActiveModal, setActiveTab, setFxState, setIsMuted, setArchives,
    setIsPremium,
  } = useGameStore();

  const {
    handleAction, handleShowdown, handlePurchaseUpgrade, handleSuitUpgrade,
    handleCrisisResolution, handleInteractNPC, handleVillainEncounter,
    handleRecruitSidekick, handleSidekickMission, handlePurchaseAsset,
    handleClaimReward,
  } = useGameActions();

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const handleToggleMute = () => setIsMuted(audio.toggleMute());

  useEffect(() => {
    if (virtuosoRef.current && history.length > 0) {
      virtuosoRef.current.scrollToIndex({ index: history.length - 1, behavior: 'smooth' });
    }
  }, [history.length, suggestedActions]);

  const actions = character ? getActionsForAlignment(character.alignment) : { civilian: [], hero: [] };
  const canConfront = stats.justice >= 30 && stats.glory >= 10 && !nemesis?.defeated;

  const renderEventItem = useCallback((index: number) => {
    const event = history[index];
    return <EventPanel key={event.id} event={event} isNew={index === history.length - 1} />;
  }, [history]);

  if (!character) return null;

  return (
    <div id="game-container" className="min-h-screen flex flex-col max-w-2xl mx-auto border-x-4 border-black bg-white shadow-2xl relative overflow-hidden">
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

      {/* ── Header ── */}
      <header id="game-header" className="bg-comic-black text-white p-3 pt-10 md:pt-3 flex flex-wrap justify-between items-start border-b-4 border-black sticky top-0 z-20 shadow-md gap-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 min-w-0">
          <div className="min-w-0">
            <h2 className="font-display italic text-comic-yellow text-3xl tracking-wide break-words leading-none truncate drop-shadow-[2px_2px_0_#000]">
              {character.heroName}
              {character.legacy && <span className="text-xs text-gray-400 ml-2 not-italic inline-block font-sans">({character.legacy.generation > 1 ? `Gen ${character.legacy.generation}` : ''})</span>}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-xs font-mono whitespace-nowrap">Career Week {character.week} | Age {character.age}</p>
              {character.currentArc && (
                <span className="text-[10px] font-bold bg-white text-black px-1 border border-white inline-block whitespace-nowrap">
                  ARC: {character.currentArc}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            <button onClick={() => { setActiveModal('LAIR'); audio.playClick(); }} className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 border border-white">LAIR</button>
            <button onClick={() => { setActiveModal('TEAM'); audio.playClick(); }} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-1 border border-white">TEAM</button>
            <button onClick={() => { setActiveModal('PULLLIST'); audio.playClick(); }} className="text-xs bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-2 py-1 border border-white">PULL LIST</button>
            <button onClick={() => { setActiveModal('LIFESTYLE'); audio.playClick(); }} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 border border-white">LIFESTYLE</button>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1 shrink-0">
          <div className="flex gap-2 mb-1">
            <button onClick={handleToggleMute} className="text-[10px] text-white bg-gray-800 px-2 py-0.5 hover:bg-gray-700 font-bold border border-black shadow-comic transition-transform active:translate-y-1 active:shadow-none">
              {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </button>
            <button onClick={() => { audio.playClick(); setActiveModal('PRD'); }} className="text-[10px] text-black bg-comic-yellow px-2 py-0.5 hover:bg-yellow-400 font-bold border border-black shadow-comic transition-transform active:translate-y-1 active:shadow-none">MISSION CONTROL</button>
            <button onClick={() => { audio.playClick(); useGameStore.getState().setGamePhase('TITLE'); }} className="text-[10px] text-white bg-black px-2 py-0.5 hover:bg-gray-800 font-bold border border-black shadow-comic transition-transform active:translate-y-1 active:shadow-none">TITLE</button>
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 border-2 border-white ${stats.suspicion > 80 ? 'bg-comic-red animate-pulse' : 'bg-blue-600'}`}>
            Suspicion: {stats.suspicion}%
          </div>
          {nemesis && !nemesis.defeated && (
            <div className="flex items-center gap-1 bg-black border border-red-500 px-2 py-0.5">
              <span className="text-[10px] text-red-500 font-black animate-pulse">DOOM</span>
              <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${nemesis.schemeProgress || 0}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Stats Display ── */}
      <div id="stats-display" className="bg-paper p-4 border-b-4 border-black shadow-inner flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-0 flex flex-col">
          <StatRadar stats={stats} alignment={character.alignment} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 flex-1">
            <div className="border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col h-full">
              <h3 className="font-black text-sm uppercase border-b-2 border-black pb-1 mb-2 bg-comic-yellow text-black px-1">Safehouses & Gear</h3>
              <ul className="text-xs space-y-1.5 flex-1 overflow-y-auto pr-1">
                {assets.filter(a => a.purchased).length === 0 && upgrades.length === 0 && (
                  <li className="text-gray-500 italic font-comic">Living on the streets.</li>
                )}
                {assets.filter(a => a.purchased).map(a => (
                  <li key={a.id} className="font-bold border-l-4 border-blue-500 pl-2 py-0.5 bg-blue-50 leading-tight">
                    {a.name} <span className="block text-[10px] text-gray-500 font-normal">{a.description}</span>
                  </li>
                ))}
                {upgrades.map((u, i) => (
                  <li key={i} className="font-bold border-l-4 border-comic-red pl-2 py-0.5 bg-red-50 leading-tight">
                    {u.name} <span className="block text-[10px] text-gray-500 font-normal">{u.type} Upgrade</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-[3px] border-black bg-white p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col h-full">
              <h3 className="font-black text-sm uppercase border-b-2 border-black pb-1 mb-2 bg-comic-blue text-white px-1">Allies & Contacts</h3>
              <ul className="text-xs space-y-1.5 flex-1 overflow-y-auto pr-1">
                {sidekicks.length === 0 && npcs.length === 0 && (
                  <li className="text-gray-500 italic font-comic">Operating strictly solo.</li>
                )}
                {sidekicks.map((s, i) => (
                  <li key={i} className="font-bold border-l-4 border-comic-yellow pl-2 py-0.5 bg-yellow-50 leading-tight">
                    {s.name} <span className="block text-[10px] text-gray-500 font-normal">{s.specialty} Specialist (Sidekick)</span>
                  </li>
                ))}
                {npcs.map((n, i) => (
                  <li key={i} className="font-bold border-l-4 border-green-500 pl-2 py-0.5 bg-green-50 leading-tight">
                    {n.name} <span className="block text-[10px] text-gray-500 font-normal">{n.relation} (Trust: {n.relationship}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {nemesis && (
          <div className="md:w-1/3 min-w-[200px]">
            <WantedPoster nemesis={nemesis} canConfront={canConfront} onConfront={handleShowdown} />
          </div>
        )}
      </div>

      {/* ── Infinite Canvas (Virtualized) ── */}
      <div id="history-scroll" className="flex-1 bg-paper" style={{ minHeight: '300px' }}>
        <Virtuoso
          ref={virtuosoRef}
          totalCount={history.length}
          itemContent={renderEventItem}
          followOutput="smooth"
          className="p-4"
          style={{ height: '100%' }}
        />

        {suggestedActions.length > 0 && !isProcessing && (
          <div className="p-2 animate-fade-in-up mx-4 mb-4">
            <div className="bg-yellow-100 border-2 border-black border-dashed p-3 mb-2">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">Narrative Choices</p>
              <div className="space-y-2">
                {suggestedActions.map((action) => (
                  <button key={action.id} onClick={() => handleAction(action)} className="w-full text-left bg-white border-2 border-black shadow-sm hover:bg-comic-yellow p-2 flex flex-col transition-colors group">
                    <span className="font-bold text-lg font-display group-hover:underline decoration-2 text-black tracking-wide">{action.label}</span>
                    <span className="text-xs text-gray-600 font-mono block">{action.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="flex justify-center p-4">
            <div className="font-display font-bold animate-pulse bg-yellow-200 border-4 border-black px-6 py-4 shadow-comic text-black text-xl">
              INKING NEXT PANEL...
            </div>
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div id="controls-panel" className="bg-white border-t-4 border-black sticky bottom-0 z-20 p-2 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <div className="flex -mt-6 mb-2 mx-4">
          <button
            onClick={() => { setActiveTab('CIVILIAN'); audio.playClick(); }}
            className={`flex-1 py-2 font-black border-2 border-black transition-transform ${activeTab === 'CIVILIAN' ? 'bg-gray-200 -translate-y-1 shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)] text-black' : 'bg-white translate-y-2 text-gray-500'}`}
          >
            {character.alignment === Alignment.VILLAIN ? 'CRIMINAL LIFE' : 'CIVILIAN LIFE'}
          </button>
          <button
            onClick={() => { setActiveTab('HERO'); audio.playClick(); }}
            className={`flex-1 py-2 font-black border-2 border-black transition-transform ${activeTab === 'HERO' ? 'bg-comic-blue text-white -translate-y-1 shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white translate-y-2 text-gray-500'}`}
          >
            {character.alignment === Alignment.VILLAIN ? 'VILLAINY' : 'HERO DUTIES'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          {activeTab === 'CIVILIAN'
            ? actions.civilian.map(action => (
                <Button key={action.id} variant="civilian" onClick={() => handleAction(action)} disabled={isProcessing} className="text-xs">{action.label}</Button>
              ))
            : actions.hero.map(action => (
                <Button key={action.id} variant="hero" onClick={() => handleAction(action)} disabled={isProcessing} className="text-xs">{action.label}</Button>
              ))
          }
        </div>
      </div>
    </div>
  );
};
