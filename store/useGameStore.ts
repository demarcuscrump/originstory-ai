import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import {
  Character, Stats, GameEvent, GameAction, Nemesis, Upgrade,
  Crisis, CrisisOption, NPC, ArchivedHero, MinorVillain,
  Sidekick, BattlePassReward, ThemeVariant, Asset, LegacyData,
} from '../types';
import { INITIAL_STATS, INITIAL_BP_REWARDS, INITIAL_ASSETS, SAVE_VERSION } from '../constants/gameData';

// ── localforage adapter for Zustand persist middleware ──
const localforageStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await localforage.getItem<string>(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

// ── Modal & Phase types ──
export type ModalType = 'PRD' | 'LAIR' | 'PHONE' | 'NEWSPAPER' | 'LONGBOX' | 'TEAM' | 'PULLLIST' | 'LIFESTYLE' | null;
export type GamePhase = 'TITLE' | 'CREATION' | 'PLAYING' | 'GAMEOVER' | 'VICTORY';
export type FXState = { text: string; type: 'COMBAT' | 'DANGER' | 'VICTORY' } | null;

// ── Store interface ──
interface GameState {
  // Core (persisted)
  character: Character | null;
  stats: Stats;
  history: GameEvent[];
  nemesis: Nemesis | null;
  gamePhase: GamePhase;
  upgrades: Upgrade[];
  npcs: NPC[];
  sidekicks: Sidekick[];
  battlePassXp: number;
  bpRewards: BattlePassReward[];
  isPremium: boolean;
  activeTheme: ThemeVariant;
  assets: Asset[];

  // UI (transient — not persisted)
  activeTab: 'CIVILIAN' | 'HERO';
  isProcessing: boolean;
  activeModal: ModalType;
  isMuted: boolean;
  suggestedActions: GameAction[];
  activeCrisis: Crisis | null;
  newspaperHeadline: string;
  activeVillain: MinorVillain | null;
  fxState: FXState;
  pendingLegacy: LegacyData | undefined;
  gameOverReason: string;
  hydrated: boolean;

  // Archives (separate persistence)
  archives: ArchivedHero[];

  // ── Setters ──
  setCharacter: (c: Character | null) => void;
  setStats: (s: Stats | ((prev: Stats) => Stats)) => void;
  setHistory: (h: GameEvent[] | ((prev: GameEvent[]) => GameEvent[])) => void;
  setNemesis: (n: Nemesis | null | ((prev: Nemesis | null) => Nemesis | null)) => void;
  setGamePhase: (p: GamePhase) => void;
  setUpgrades: (u: Upgrade[] | ((prev: Upgrade[]) => Upgrade[])) => void;
  setNpcs: (n: NPC[] | ((prev: NPC[]) => NPC[])) => void;
  setSidekicks: (s: Sidekick[] | ((prev: Sidekick[]) => Sidekick[])) => void;
  setBattlePassXp: (xp: number | ((prev: number) => number)) => void;
  setBpRewards: (r: BattlePassReward[] | ((prev: BattlePassReward[]) => BattlePassReward[])) => void;
  setIsPremium: (v: boolean) => void;
  setActiveTheme: (t: ThemeVariant) => void;
  setAssets: (a: Asset[] | ((prev: Asset[]) => Asset[])) => void;
  setArchives: (a: ArchivedHero[] | ((prev: ArchivedHero[]) => ArchivedHero[])) => void;

  // UI Setters
  setActiveTab: (t: 'CIVILIAN' | 'HERO') => void;
  setIsProcessing: (v: boolean) => void;
  setActiveModal: (m: ModalType) => void;
  setIsMuted: (v: boolean) => void;
  setSuggestedActions: (a: GameAction[]) => void;
  setActiveCrisis: (c: Crisis | null) => void;
  setNewspaperHeadline: (h: string) => void;
  setActiveVillain: (v: MinorVillain | null) => void;
  setFxState: (f: FXState) => void;
  setPendingLegacy: (l: LegacyData | undefined) => void;
  setGameOverReason: (r: string) => void;
  setHydrated: (v: boolean) => void;

  // Helpers
  grantXp: (amount: number) => void;
  resetForNewGame: () => void;
}

// ── Functional setter helper ──
const resolve = <T>(val: T | ((prev: T) => T), prev: T): T =>
  typeof val === 'function' ? (val as (prev: T) => T)(prev) : val;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Core state
      character: null,
      stats: { ...INITIAL_STATS },
      history: [],
      nemesis: null,
      gamePhase: 'TITLE' as GamePhase,
      upgrades: [],
      npcs: [],
      sidekicks: [],
      battlePassXp: 0,
      bpRewards: [...INITIAL_BP_REWARDS],
      isPremium: false,
      activeTheme: 'DEFAULT' as ThemeVariant,
      assets: [...INITIAL_ASSETS],
      archives: [],

      // UI state
      activeTab: 'CIVILIAN',
      isProcessing: false,
      activeModal: null,
      isMuted: false,
      suggestedActions: [],
      activeCrisis: null,
      newspaperHeadline: '',
      activeVillain: null,
      fxState: null,
      pendingLegacy: undefined,
      gameOverReason: '',
      hydrated: false,

      // Core setters
      setCharacter: (c) => set({ character: c }),
      setStats: (s) => set((state) => ({ stats: resolve(s, state.stats) })),
      setHistory: (h) => set((state) => ({ history: resolve(h, state.history) })),
      setNemesis: (n) => set((state) => ({ nemesis: resolve(n, state.nemesis) })),
      setGamePhase: (p) => set({ gamePhase: p }),
      setUpgrades: (u) => set((state) => ({ upgrades: resolve(u, state.upgrades) })),
      setNpcs: (n) => set((state) => ({ npcs: resolve(n, state.npcs) })),
      setSidekicks: (s) => set((state) => ({ sidekicks: resolve(s, state.sidekicks) })),
      setBattlePassXp: (xp) => set((state) => ({ battlePassXp: resolve(xp, state.battlePassXp) })),
      setBpRewards: (r) => set((state) => ({ bpRewards: resolve(r, state.bpRewards) })),
      setIsPremium: (v) => set({ isPremium: v }),
      setActiveTheme: (t) => set({ activeTheme: t }),
      setAssets: (a) => set((state) => ({ assets: resolve(a, state.assets) })),
      setArchives: (a) => set((state) => ({ archives: resolve(a, state.archives) })),

      // UI setters
      setActiveTab: (t) => set({ activeTab: t }),
      setIsProcessing: (v) => set({ isProcessing: v }),
      setActiveModal: (m) => set({ activeModal: m }),
      setIsMuted: (v) => set({ isMuted: v }),
      setSuggestedActions: (a) => set({ suggestedActions: a }),
      setActiveCrisis: (c) => set({ activeCrisis: c }),
      setNewspaperHeadline: (h) => set({ newspaperHeadline: h }),
      setActiveVillain: (v) => set({ activeVillain: v }),
      setFxState: (f) => set({ fxState: f }),
      setPendingLegacy: (l) => set({ pendingLegacy: l }),
      setGameOverReason: (r) => set({ gameOverReason: r }),
      setHydrated: (v) => set({ hydrated: v }),

      // Helpers
      grantXp: (amount) => set((state) => ({ battlePassXp: state.battlePassXp + amount })),
      resetForNewGame: () =>
        set({
          character: null,
          stats: { ...INITIAL_STATS },
          history: [],
          nemesis: null,
          gamePhase: 'TITLE',
          upgrades: [],
          npcs: [],
          sidekicks: [],
          battlePassXp: 0,
          bpRewards: [...INITIAL_BP_REWARDS],
          isPremium: false,
          activeTheme: 'DEFAULT',
          assets: [...INITIAL_ASSETS],
          activeTab: 'CIVILIAN',
          isProcessing: false,
          activeModal: null,
          suggestedActions: [],
          activeCrisis: null,
          newspaperHeadline: '',
          activeVillain: null,
          fxState: null,
          pendingLegacy: undefined,
          gameOverReason: '',
        }),
    }),
    {
      name: 'origin-story-save',
      version: 2,
      storage: createJSONStorage(() => localforageStorage),
      partialize: (state) => ({
        character: state.character,
        stats: state.stats,
        history: state.history,
        nemesis: state.nemesis,
        gamePhase: state.gamePhase,
        upgrades: state.upgrades,
        npcs: state.npcs,
        sidekicks: state.sidekicks,
        battlePassXp: state.battlePassXp,
        bpRewards: state.bpRewards,
        isPremium: state.isPremium,
        activeTheme: state.activeTheme,
        assets: state.assets,
        archives: state.archives,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
