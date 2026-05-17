import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/useGameStore';
import { INITIAL_STATS } from '../constants/gameData';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetForNewGame();
  });

  it('initializes with default state', () => {
    const state = useGameStore.getState();
    expect(state.character).toBeNull();
    expect(state.stats).toEqual(INITIAL_STATS);
    expect(state.history).toEqual([]);
    expect(state.gamePhase).toBe('TITLE');
  });

  it('setGamePhase updates phase', () => {
    useGameStore.getState().setGamePhase('PLAYING');
    expect(useGameStore.getState().gamePhase).toBe('PLAYING');
  });

  it('grantXp increases battlePassXp', () => {
    useGameStore.getState().grantXp(50);
    expect(useGameStore.getState().battlePassXp).toBe(50);
    useGameStore.getState().grantXp(25);
    expect(useGameStore.getState().battlePassXp).toBe(75);
  });

  it('setStats with functional updater', () => {
    useGameStore.getState().setStats(prev => ({ ...prev, wealth: 99 }));
    expect(useGameStore.getState().stats.wealth).toBe(99);
  });

  it('resetForNewGame restores defaults', () => {
    useGameStore.getState().setGamePhase('VICTORY');
    useGameStore.getState().grantXp(999);
    useGameStore.getState().setStats({ ...INITIAL_STATS, wealth: 0 });

    useGameStore.getState().resetForNewGame();
    const state = useGameStore.getState();
    expect(state.gamePhase).toBe('TITLE');
    expect(state.battlePassXp).toBe(0);
    expect(state.stats.wealth).toBe(50);
  });

  it('setHistory with functional updater appends events', () => {
    const event = { id: '1', text: 'test', type: 'NARRATIVE' as const, timestamp: Date.now() };
    useGameStore.getState().setHistory(prev => [...prev, event]);
    expect(useGameStore.getState().history).toHaveLength(1);
    expect(useGameStore.getState().history[0].text).toBe('test');
  });

  it('setActiveModal cycles through modals', () => {
    useGameStore.getState().setActiveModal('LAIR');
    expect(useGameStore.getState().activeModal).toBe('LAIR');
    useGameStore.getState().setActiveModal(null);
    expect(useGameStore.getState().activeModal).toBeNull();
  });
});
