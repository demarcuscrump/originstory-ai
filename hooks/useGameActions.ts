import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import {
  Character, Stats, GameEvent, GameAction, ActionCategory,
  Nemesis, Upgrade, NPC, ArchivedHero, MinorVillain,
  LegacyData, CrisisOption, Alignment, OriginArchetype,
  IncitingIncident, UniverseTone,
} from '../types';
import {
  generateNarrative, generatePanelImage, generateSuggestedActions,
  generateNemesis, generateShowdownNarrative, generateHeadline,
  generateUpgrades, generateCrisis, generateNPCs, generateNewCostume,
  generateMinorVillain, generateRetconNarrative, generateSidekick,
  generateArcEvent, generateEntityImage,
} from '../services/aiService';
import { audio } from '../services/audioService';
import {
  INITIAL_STATS, getActionOutcome, clampAllStats,
} from '../constants/gameData';

const PANEL_IMAGE_FAILURE = 'Panel art could not be generated. Check your OpenRouter key, credits, or image model.';

export const useGameActions = () => {
  const store = useGameStore();

  const {
    character, stats, history, nemesis, upgrades, npcs,
    sidekicks, assets, archives, gamePhase, isProcessing,
    setCharacter, setStats, setHistory, setNemesis, setGamePhase,
    setUpgrades, setNpcs, setSidekicks, setAssets, setArchives,
    setIsProcessing, setActiveModal, setSuggestedActions,
    setActiveCrisis, setNewspaperHeadline, setActiveVillain,
    setFxState, setPendingLegacy, setGameOverReason,
    setBpRewards,
    grantXp,
  } = store;

  // ── Helpers ──

  const triggerFX = useCallback((text: string, type: 'COMBAT' | 'DANGER' | 'VICTORY') => {
    setFxState({ text, type });
    if (type === 'COMBAT') audio.playAction('Hero');
    if (type === 'DANGER') audio.playDanger();
    if (type === 'VICTORY') audio.playFanfare();
  }, [setFxState]);

  const updateSuggestions = useCallback(async (narrative: string, char: Character) => {
    const newActions = await generateSuggestedActions(narrative, char);
    setSuggestedActions(newActions);
  }, [setSuggestedActions]);

  const finishPanelImage = useCallback((eventId: string, imageUrl: string | undefined) => {
    setHistory(prev => prev.map(e => e.id === eventId ? {
      ...e,
      imageUrl,
      isGeneratingImage: false,
      imageError: imageUrl ? undefined : PANEL_IMAGE_FAILURE,
    } : e));
  }, [setHistory]);

  const archiveCurrentHero = useCallback((outcome: 'VICTORY' | 'DEFEATED' | 'RETIRED' | 'MIA') => {
    if (!character) return;
    const coverImage = history.find(e => e.type === 'ORIGIN')?.imageUrl || [...history].reverse().find(e => e.imageUrl)?.imageUrl;
    const archived: ArchivedHero = {
      id: Date.now().toString(),
      heroName: character.heroName,
      civilianName: character.name,
      origin: character.origin,
      universe: character.universe,
      weeksActive: character.week,
      outcome,
      finalStats: stats,
      date: Date.now(),
      coverImage,
    };
    setArchives((prev) => [archived, ...prev].slice(0, 5));
  }, [character, history, stats, setArchives]);

  // ── Character Creation ──

  const handleCharacterComplete = useCallback(async (char: Character, originStory: string) => {
    audio.playFanfare();

    let startingStats = { ...INITIAL_STATS };
    if (char.legacy) {
      startingStats.wealth = 50 + char.legacy.inheritedWealth;
      startingStats.glory = char.legacy.inheritedGlory;
    }

    switch (char.origin) {
      case OriginArchetype.ORPHAN: startingStats.justice += 25; startingStats.wealth += 10; break;
      case OriginArchetype.SOLDIER: startingStats.glory += 30; startingStats.justice += 10; break;
      case OriginArchetype.BILLIONAIRE: startingStats.wealth = 100; startingStats.sanity -= 20; break;
      case OriginArchetype.ALIEN: startingStats.glory += 20; startingStats.suspicion += 20; break;
      case OriginArchetype.RELUCTANT: startingStats.sanity += 20; startingStats.glory -= 10; break;
      case OriginArchetype.DARK_AVENGER: startingStats.justice = 80; startingStats.suspicion += 30; startingStats.glory -= 20; break;
      case OriginArchetype.CHOSEN: startingStats.glory += 25; startingStats.sanity += 10; break;
      case OriginArchetype.REFORMED: startingStats.suspicion += 40; startingStats.justice -= 10; break;
      case OriginArchetype.GENIUS: startingStats.wealth += 40; startingStats.sanity += 10; break;
      case OriginArchetype.STREET: startingStats.justice += 10; startingStats.wealth -= 10; startingStats.glory += 10; break;
      default: startingStats.justice += 10;
    }

    const charWithCostume = {
      ...char,
      currentArc: "The Beginning",
      costume: `a homemade outfit related to ${char.specificPower || char.origin}`,
    };
    setCharacter(charWithCostume);
    setStats(clampAllStats(startingStats));
    setSidekicks([]);
    grantXp(50);

    const initialEventId = Date.now().toString();
    setHistory([{
      id: initialEventId, type: 'ORIGIN', text: originStory,
      timestamp: Date.now(), statsChanged: startingStats, isGeneratingImage: true,
    }]);
    setGamePhase('PLAYING');

    generatePanelImage(originStory, charWithCostume).then(imageUrl => finishPanelImage(initialEventId, imageUrl));
    updateSuggestions(originStory, charWithCostume);

    generateNemesis(charWithCostume).then(async newNemesis => {
      if (newNemesis) {
        if (char.legacy && char.legacy.generation > 1) {
          newNemesis.power = Math.floor(newNemesis.power * (1 + (char.legacy.generation - 1) * 0.2));
        }
        setNemesis({ ...newNemesis, isGeneratingImage: true });
        const img = await generateEntityImage(newNemesis.name, newNemesis.description, char.alignment === Alignment.VILLAIN ? 'HERO' : 'VILLAIN', char.universe);
        setNemesis(prev => prev ? ({ ...prev, imageUrl: img || undefined, isGeneratingImage: false }) : null);
      }
    });

    generateUpgrades(charWithCostume).then(u => setUpgrades(u));
    generateNPCs(charWithCostume).then(n => setNpcs(n));
  }, [setCharacter, setStats, setSidekicks, grantXp, setHistory, setGamePhase, setNemesis, setUpgrades, setNpcs, updateSuggestions, finishPanelImage]);

  // ── Legacy ──

  const handleLegacy = useCallback(() => {
    if (!character) return;
    audio.playFanfare();
    archiveCurrentHero('RETIRED');

    const legacyData: LegacyData = {
      parentName: character.heroName,
      generation: (character.legacy?.generation || 1) + 1,
      inheritedWealth: Math.floor(stats.wealth * 0.5),
      inheritedGlory: Math.floor(stats.glory * 0.2),
    };

    setPendingLegacy(legacyData);
    setCharacter(null);
    setHistory([]);
    setNemesis(null);
    setSidekicks([]);
    setGamePhase('CREATION');
  }, [character, stats, archiveCurrentHero, setPendingLegacy, setCharacter, setHistory, setNemesis, setSidekicks, setGamePhase]);

  // ── Reset ──

  const handleReset = useCallback((shouldArchive = false, outcome: 'VICTORY' | 'DEFEATED' | 'RETIRED' | 'MIA' = 'MIA') => {
    audio.playClick();
    if (shouldArchive) archiveCurrentHero(outcome);
    useGameStore.getState().resetForNewGame();
  }, [archiveCurrentHero]);

  // ── Retcon ──

  const handleRetcon = useCallback(async () => {
    if (!character || stats.retconPoints <= 0) return;
    audio.playType();
    setIsProcessing(true);

    const narrative = await generateRetconNarrative(character, useGameStore.getState().gameOverReason);
    setStats(prev => ({
      ...prev,
      retconPoints: prev.retconPoints - 1,
      sanity: Math.max(prev.sanity, 50),
      suspicion: Math.min(prev.suspicion, 50),
      wealth: Math.max(prev.wealth, 20),
    }));

    const eventId = Date.now().toString();
    setHistory(prev => [...prev, {
      id: eventId, text: narrative, type: 'RETCON',
      timestamp: Date.now(), isGeneratingImage: true,
    }]);
    setGamePhase('PLAYING');
    setIsProcessing(false);

    generatePanelImage(narrative, character).then(imageUrl => finishPanelImage(eventId, imageUrl));
  }, [character, stats.retconPoints, setIsProcessing, setStats, setHistory, setGamePhase, finishPanelImage]);

  // ── Sidekick ──

  const handleRecruitSidekick = useCallback(async () => {
    if (!character || stats.glory < 50) return;
    setIsProcessing(true);
    audio.playClick();
    setStats(prev => ({ ...prev, glory: prev.glory - 50 }));

    const sidekick = await generateSidekick(character);
    if (sidekick) {
      setSidekicks(prev => [...prev, sidekick]);
      setHistory(prev => [...prev, {
        id: Date.now().toString(),
        text: `You found a recruit worthy of joining your mission. Welcome, ${sidekick.name}! They bring expertise in ${sidekick.specialty}.`,
        type: 'NARRATIVE', timestamp: Date.now(),
      }]);
      audio.playFanfare();
      grantXp(20);
    }
    setIsProcessing(false);
  }, [character, stats.glory, setIsProcessing, setStats, setSidekicks, setHistory, grantXp]);

  // ── Sidekick Mission ──

  const handleSidekickMission = useCallback((sidekickId: string, type: 'COMBAT' | 'INTEL' | 'SUPPORT') => {
    const sidekick = sidekicks.find(s => s.id === sidekickId);
    if (!sidekick || sidekick.status !== 'ACTIVE') return;
    audio.playAction('Hero');
    setActiveModal(null);

    let successChance = sidekick.specialty === type ? 0.9 : 0.7;
    const success = Math.random() < successChance;
    const newStats = { ...stats };
    let resultText = "";

    if (success) {
      resultText = `${sidekick.name} completed their mission perfectly.`;
      if (type === 'COMBAT') { newStats.justice = Math.min(100, newStats.justice + 10); }
      if (type === 'INTEL' && nemesis) {
        setNemesis(prev => prev ? ({ ...prev, schemeProgress: Math.max(0, (prev.schemeProgress || 0) - 10) }) : null);
        resultText += " They sabotaged the enemy's plans.";
      }
      if (type === 'SUPPORT') { newStats.glory = Math.min(100, newStats.glory + 15); resultText += " Your reputation grows."; }
      grantXp(15);
    } else {
      resultText = `${sidekick.name} ran into trouble and failed the mission.`;
      newStats.suspicion = Math.min(100, newStats.suspicion + 5);
      grantXp(5);
    }

    setStats(newStats);
    setHistory(prev => [...prev, { id: Date.now().toString(), text: resultText, type: 'TEAM_REPORT', timestamp: Date.now() }]);
  }, [sidekicks, stats, nemesis, setActiveModal, setNemesis, setStats, setHistory, grantXp]);

  // ── Asset Purchase ──

  const handlePurchaseAsset = useCallback((assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || asset.purchased || stats.wealth < asset.cost) return;
    setStats({ ...stats, wealth: stats.wealth - asset.cost });
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, purchased: true } : a));
    audio.playFanfare();
    grantXp(20);
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      text: `You acquired ${asset.name}. This will require $${asset.upkeep} per week in upkeep, but provide passive benefits.`,
      type: 'NARRATIVE', timestamp: Date.now(),
    }]);
  }, [assets, stats, setStats, setAssets, grantXp, setHistory]);

  // ── Upgrade Purchase ──

  const handlePurchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return;
    const newStats = { ...stats };
    if (newStats[upgrade.costType] < upgrade.costAmount) return;
    newStats[upgrade.costType] -= upgrade.costAmount;
    setStats(newStats);
    setUpgrades(prev => prev.map(u => u.id === upgradeId ? { ...u, purchased: true } : u));
    audio.playFanfare();
    grantXp(20);
  }, [upgrades, stats, setStats, setUpgrades, grantXp]);

  // ── Suit Upgrade ──

  const handleSuitUpgrade = useCallback(async () => {
    if (!character || stats.wealth < 50 || stats.glory < 20) return;
    setStats({ ...stats, wealth: Math.max(0, stats.wealth - 50), glory: Math.max(0, stats.glory - 20) });
    setActiveModal(null);
    setIsProcessing(true);
    audio.playType();

    const newCostume = await generateNewCostume(character, stats);
    const updatedChar = { ...character, costume: newCostume };
    setCharacter(updatedChar);

    const narrative = `You enter the workshop and finalize the designs. The fabrication units whir to life. You step out wearing your new gear: ${newCostume}. You feel stronger, faster, and ready for anything.`;
    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'NARRATIVE', timestamp: Date.now(), isGeneratingImage: true }]);
    generatePanelImage(narrative, updatedChar).then(imageUrl => finishPanelImage(eventId, imageUrl));
    setIsProcessing(false);
    audio.playFanfare();
    grantXp(50);
  }, [character, stats, setStats, setActiveModal, setIsProcessing, setCharacter, setHistory, grantXp, finishPanelImage]);

  // ── Crisis Resolution ──

  const handleCrisisResolution = useCallback(async (option: CrisisOption) => {
    if (!character) return;
    const crisis = useGameStore.getState().activeCrisis;
    if (!crisis) return;
    audio.playClick();
    setActiveCrisis(null);
    setIsProcessing(true);

    const newStats = { ...stats };
    if (option.type === 'ALTRUISTIC') {
      newStats.glory = Math.min(100, newStats.glory + 15);
      newStats.justice = Math.min(100, newStats.justice + 10);
      newStats.sanity = Math.max(0, newStats.sanity - 10);
    } else {
      newStats.justice = Math.min(100, newStats.justice + 15);
      newStats.suspicion = Math.min(100, newStats.suspicion + 10);
      newStats.glory = Math.max(0, newStats.glory - 5);
    }
    setStats(newStats);

    const narrative = await generateNarrative(
      character,
      { id: 'crisis_resolve', label: `Chose: ${option.label}`, category: ActionCategory.HERO, description: crisis.title } as GameAction,
      newStats, history, nemesis
    );
    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'CRISIS', timestamp: Date.now(), isGeneratingImage: true }]);
    generatePanelImage(narrative, character).then(imageUrl => finishPanelImage(eventId, imageUrl));
    updateSuggestions(narrative, character);
    setIsProcessing(false);
    grantXp(25);
  }, [character, stats, history, nemesis, setActiveCrisis, setIsProcessing, setStats, setHistory, updateSuggestions, grantXp, finishPanelImage]);

  // ── NPC Interaction ──

  const handleInteractNPC = useCallback(async (npc: NPC) => {
    if (!character || isProcessing) return;
    setActiveModal(null);
    audio.playClick();
    setIsProcessing(true);

    const newStats = { ...stats };
    if (npc.bonusType === 'SANITY') newStats.sanity = Math.min(100, newStats.sanity + 20);
    if (npc.bonusType === 'WEALTH') newStats.wealth = Math.min(100, newStats.wealth + 15);
    if (npc.bonusType === 'JUSTICE') newStats.justice = Math.min(100, newStats.justice + 10);
    newStats.wealth = Math.max(0, newStats.wealth - 5);

    setNpcs(prev => prev.map(n => n.id === npc.id ? { ...n, relationship: Math.min(100, n.relationship + 15) } : n));
    setStats(newStats);

    const narrative = await generateNarrative(
      character,
      { id: 'interact_npc', label: `Meet ${npc.name}`, category: ActionCategory.CIVILIAN, description: `Spending time with ${npc.relation} ${npc.name}` } as GameAction,
      newStats, history, nemesis
    );
    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'NARRATIVE', timestamp: Date.now(), statsChanged: { sanity: npc.bonusType === 'SANITY' ? 20 : 0 } }]);

    if (Math.random() > 0.75) {
      setHistory(prev => prev.map(e => e.id === eventId ? { ...e, isGeneratingImage: true, imageError: undefined } : e));
      generatePanelImage(narrative, character).then(imageUrl => finishPanelImage(eventId, imageUrl));
    }
    updateSuggestions(narrative, character);
    setIsProcessing(false);
    grantXp(10);
  }, [character, isProcessing, stats, history, nemesis, setActiveModal, setIsProcessing, setNpcs, setStats, setHistory, updateSuggestions, grantXp, finishPanelImage]);

  // ── Villain Encounter ──

  const handleVillainEncounter = useCallback(async (actionType: 'CAPTURE' | 'BRAWL' | 'OUTSMART') => {
    if (!character) return;
    const villain = useGameStore.getState().activeVillain;
    if (!villain) return;

    const roll = Math.random() * 100;
    const success = actionType === 'CAPTURE' ? roll > 30 : actionType === 'BRAWL' ? roll > 40 : roll > 20;
    setActiveVillain(null);
    setIsProcessing(true);

    const newStats = { ...stats };
    let narrative = "";

    if (success) {
      triggerFX("POW!", "COMBAT");
      narrative = `VICTORY! You defeated ${villain.name}. They tried to use their ${villain.gimmick}, but you were ready.`;
      if (villain.loot === 'INTEL' && nemesis) {
        setNemesis(prev => prev ? ({ ...prev, schemeProgress: Math.max(0, (prev.schemeProgress || 0) - 15) }) : null);
        narrative += " You interrogated them and found flaws in the Nemesis's plan (-15% Scheme).";
      }
      if (villain.loot === 'WEALTH') { newStats.wealth = Math.min(100, newStats.wealth + 20); narrative += " You confiscated their stolen goods (+20 Wealth)."; }
      if (villain.loot === 'REP') { newStats.glory = Math.min(100, newStats.glory + 15); narrative += " The public cheers your victory (+15 Glory)."; }
      newStats.justice = Math.min(100, newStats.justice + 10);
      grantXp(25);
    } else {
      triggerFX("OOOF!", "DANGER");
      narrative = `FAILURE! ${villain.name} escaped! Their ${villain.gimmick} caught you off guard.`;
      newStats.sanity = Math.max(0, newStats.sanity - 10);
      newStats.glory = Math.max(0, newStats.glory - 5);
      grantXp(5);
    }

    setStats(newStats);
    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'ACTION_RESULT', timestamp: Date.now(), isGeneratingImage: true }]);
    generatePanelImage(narrative, character).then(imageUrl => finishPanelImage(eventId, imageUrl));
    setIsProcessing(false);
  }, [character, stats, nemesis, triggerFX, setActiveVillain, setIsProcessing, setNemesis, setStats, setHistory, grantXp, finishPanelImage]);

  // ── Main Action ──

  const handleAction = useCallback(async (action: GameAction) => {
    if (!character || isProcessing) return;

    if (action.id === 'contacts') { setActiveModal('PHONE'); audio.playClick(); return; }
    if (action.id === 'retire') { handleLegacy(); return; }

    audio.playClick();
    audio.playAction(action.category === ActionCategory.HERO ? 'Hero' : 'Civilian');

    if (action.id === 'continue') {
      setCharacter({ ...character, week: character.week + 1 });
    }

    if (action.category === ActionCategory.HERO && Math.random() > 0.85 && history.length > 3) {
      setIsProcessing(true);
      triggerFX("CRISIS!", "DANGER");
      const crisis = await generateCrisis(character);
      setIsProcessing(false);
      if (crisis) { setActiveCrisis(crisis); return; }
    }

    if (action.id === 'patrol' && Math.random() > 0.8 && history.length > 2) {
      setIsProcessing(true);
      const minorVillain = await generateMinorVillain(character);
      setIsProcessing(false);
      if (minorVillain) { triggerFX("AMBUSH!", "DANGER"); setActiveVillain(minorVillain); return; }
    }

    setIsProcessing(true);
    setSuggestedActions([]);
    grantXp(10);

    const newStats = { ...stats };
    const comfortUpgrade = upgrades.find(u => u.type === 'COMFORT' && u.purchased);
    const intelUpgrade = upgrades.find(u => u.type === 'INTEL' && u.purchased);
    const sanityBonus = (comfortUpgrade && action.id === 'rest') ? 5 : 0;
    const justiceBonus = (intelUpgrade && action.id === 'investigate') ? 5 : 0;

    if (action.effect) {
      if (action.effect.wealth) newStats.wealth += action.effect.wealth;
      if (action.effect.sanity) newStats.sanity += action.effect.sanity + sanityBonus;
      if (action.effect.justice) newStats.justice += action.effect.justice + justiceBonus;
      if (action.effect.glory) newStats.glory += action.effect.glory;
      if (action.effect.suspicion) newStats.suspicion += action.effect.suspicion;
    }

    if (action.category === ActionCategory.HERO) {
      if (character.origin === OriginArchetype.GENIUS) newStats.wealth -= 2;
      if (character.origin === OriginArchetype.RELUCTANT) newStats.sanity -= 2;
      if (character.origin === OriginArchetype.ALIEN) newStats.suspicion += 2;
    }

    assets.filter(a => a.purchased).forEach(asset => {
      newStats.wealth -= asset.upkeep;
      if (asset.passiveBonus) newStats[asset.passiveBonus.stat] += asset.passiveBonus.amount;
    });

    const clamped = clampAllStats(newStats);
    setStats(clamped);

    const nextWeek = character.week + 1;
    const newChar = { ...character, week: nextWeek };
    if (newChar.week > 0 && newChar.week % 52 === 0) newChar.age += 1;
    setCharacter(newChar);

    if (npcs.length > 0) setNpcs(prev => prev.map(n => ({ ...n, relationship: Math.max(0, n.relationship - 2) })));

    // Doomsday Clock
    if (nemesis && !nemesis.defeated) {
      let schemeChange = action.category === ActionCategory.CIVILIAN ? 5 : 1;
      if (action.id === 'investigate') { schemeChange = -10; audio.playAction('Hero'); }

      const newSchemeProgress = Math.max(0, Math.min(100, (nemesis.schemeProgress || 0) + schemeChange));
      const newNemesis = { ...nemesis, schemeProgress: newSchemeProgress };
      setNemesis(newNemesis);

      if (newSchemeProgress >= 100) {
        triggerFX("DOOM!", "DANGER");
        clamped.glory = Math.max(0, clamped.glory - 40);
        clamped.justice = Math.max(0, clamped.justice - 20);
        clamped.wealth = Math.max(0, clamped.wealth - 20);
        clamped.sanity = Math.max(0, clamped.sanity - 20);
        newNemesis.schemeProgress = 20;
        setNemesis(newNemesis);
        setStats(clamped);
        setHistory(prev => [...prev, {
          id: `scheme_exec_${Date.now()}`, type: 'CRISIS', timestamp: Date.now(),
          text: `${nemesis.name} unleashed ${nemesis.schemeName}! Chaos floods the streets as you fail to stop the master plan in time.`,
        }]);
      }
    }

    const narrative = getActionOutcome(action.id);
    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'NARRATIVE', timestamp: Date.now(), statsChanged: action.effect }]);

    if (clamped.suspicion >= 100) {
      triggerFX("BUSTED!", "DANGER");
      setGameOverReason("Identity Exposed to the Public");
      setGamePhase('GAMEOVER');
      setIsProcessing(false);
      return;
    } else if (clamped.sanity <= 0) {
      triggerFX("SNAP!", "DANGER");
      setGameOverReason("Mental Breakdown");
      setGamePhase('GAMEOVER');
      setIsProcessing(false);
      return;
    }

    if (nextWeek % 4 === 0) {
      generateHeadline(character, clamped).then(headline => {
        setNewspaperHeadline(headline);
        setActiveModal('NEWSPAPER');
      });
    }

    // Arc Events
    let arcPhase = "";
    if (nextWeek === 3 && newChar.currentArc === "The Beginning") arcPhase = "THE AWAKENING";
    else if (nextWeek === 8 && newChar.currentArc === "THE AWAKENING") arcPhase = "THE ESCALATION";
    else if (nextWeek === 12 && newChar.currentArc === "THE ESCALATION") arcPhase = "THE GAUNTLET";
    else if (nextWeek === 52) arcPhase = "YEAR ONE";

    if (arcPhase) {
      triggerFX("DRAMA!", "VICTORY");
      const arcChar = { ...newChar, currentArc: arcPhase };
      setCharacter(arcChar);

      if (arcPhase === "YEAR ONE") {
        setHistory(prev => [...prev, { id: Date.now().toString(), text: "ONE YEAR LATER... You have survived your first year. The city knows your name. You have become a legend.", type: 'ARC_EVENT', timestamp: Date.now() }]);
        grantXp(500);
        setStats(prev => ({ ...prev, glory: 100 }));
        setSuggestedActions([
          { id: 'retire', label: 'Retire as Legend', category: ActionCategory.HERO, description: 'End career with MAX Legacy bonus.' },
          { id: 'continue', label: 'Continue Crusade', category: ActionCategory.HERO, description: 'Keep playing indefinitely.' },
        ]);
        setIsProcessing(false);
        return;
      }

      const arcNarrative = await generateArcEvent(arcChar, arcPhase, nemesis);
      const arcEventId = Date.now().toString();
      setHistory(prev => [...prev, { id: arcEventId, text: arcNarrative, type: 'ARC_EVENT', timestamp: Date.now(), isGeneratingImage: true }]);
      generatePanelImage(arcNarrative, arcChar).then(imageUrl => finishPanelImage(arcEventId, imageUrl));

      if (arcPhase === "THE GAUNTLET" && nemesis && !nemesis.defeated) {
        setNemesis(prev => prev ? ({ ...prev, schemeProgress: Math.min(90, (prev.schemeProgress || 0) + 30) }) : null);
      }
    }

    setSuggestedActions([]);
    setIsProcessing(false);
  }, [character, isProcessing, stats, history, nemesis, upgrades, npcs, assets,
    setCharacter, setStats, setHistory, setNemesis, setGamePhase, setNpcs,
    setIsProcessing, setActiveModal, setSuggestedActions, setActiveCrisis,
    setActiveVillain, setNewspaperHeadline, setGameOverReason,
    triggerFX, grantXp, handleLegacy, updateSuggestions, finishPanelImage]);

  // ── Showdown ──

  const handleShowdown = useCallback(async () => {
    if (!character || !nemesis || isProcessing) return;
    audio.playClick();
    setIsProcessing(true);
    setSuggestedActions([]);

    let heroPower = (stats.justice + stats.glory + (stats.wealth * 0.5)) / 2.5;
    if (upgrades.find(u => u.type === 'WEAPON' && u.purchased)) heroPower += 20;
    if (stats.justice > 50 || upgrades.find(u => u.type === 'INTEL' && u.purchased)) heroPower += 20;

    const finalScore = heroPower + Math.random() * 20;
    const isVictory = finalScore >= nemesis.power;
    const narrative = await generateShowdownNarrative(character, nemesis, isVictory);

    const eventId = Date.now().toString();
    setHistory(prev => [...prev, { id: eventId, text: narrative, type: 'ACTION_RESULT', timestamp: Date.now(), isGeneratingImage: true }]);
    generatePanelImage(narrative, character).then(imageUrl => finishPanelImage(eventId, imageUrl));

    if (isVictory) {
      triggerFX("K.O.!", "VICTORY");
      setNemesis({ ...nemesis, defeated: true });
      setStats({ ...stats, glory: 100, justice: 100, suspicion: 0 });
      setGamePhase('VICTORY');
      grantXp(100);
    } else {
      triggerFX("ARGH!", "DANGER");
      setStats({ ...stats, sanity: Math.max(5, stats.sanity - 40), wealth: Math.max(0, stats.wealth - 20) });
      grantXp(20);
      if (stats.sanity <= 20) { setGameOverReason("Defeated by Nemesis"); setGamePhase('GAMEOVER'); }
    }
    setIsProcessing(false);
  }, [character, nemesis, isProcessing, stats, upgrades, setIsProcessing, setSuggestedActions, setHistory, setNemesis, setStats, setGamePhase, setGameOverReason, triggerFX, grantXp, finishPanelImage]);

  // ── Battle Pass ──

  const handleClaimReward = useCallback((level: number, type: 'FREE' | 'PREMIUM') => {
    const bpRewards = useGameStore.getState().bpRewards;
    const rewardIndex = bpRewards.findIndex(r => r.level === level);
    if (rewardIndex === -1) return;
    const reward = bpRewards[rewardIndex];
    const newStats = { ...stats };

    if (type === 'FREE') {
      if (reward.isClaimedFree) return;
      if (reward.freeReward.resource) newStats[reward.freeReward.resource] += reward.freeReward.value;
      setBpRewards(prev => prev.map((r, i) => i === rewardIndex ? { ...r, isClaimedFree: true } : r));
    } else {
      if (reward.isClaimedPremium) return;
      if (reward.premiumReward.type === 'CONTENT') newStats.glory += 50;
      setBpRewards(prev => prev.map((r, i) => i === rewardIndex ? { ...r, isClaimedPremium: true } : r));
    }
    setStats(newStats);
    audio.playFanfare();
  }, [stats, setStats, setBpRewards]);

  return {
    handleCharacterComplete,
    handleAction,
    handleShowdown,
    handleLegacy,
    handleReset,
    handleRetcon,
    handleRecruitSidekick,
    handleSidekickMission,
    handlePurchaseAsset,
    handlePurchaseUpgrade,
    handleSuitUpgrade,
    handleCrisisResolution,
    handleInteractNPC,
    handleVillainEncounter,
    handleClaimReward,
    triggerFX,
  };
};
