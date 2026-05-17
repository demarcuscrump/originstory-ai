import { describe, it, expect } from 'vitest';
import {
  clampStat,
  clampAllStats,
  getActionOutcome,
  getJusticeLabel,
  getActionsForAlignment,
  STANDARD_OUTCOMES,
  INITIAL_STATS,
} from '../constants/gameData';
import { Alignment } from '../types';

describe('clampStat', () => {
  it('clamps value within 0-100 by default', () => {
    expect(clampStat(150)).toBe(100);
    expect(clampStat(-20)).toBe(0);
    expect(clampStat(50)).toBe(50);
  });

  it('respects custom min/max', () => {
    expect(clampStat(5, 10, 90)).toBe(10);
    expect(clampStat(95, 10, 90)).toBe(90);
  });
});

describe('clampAllStats', () => {
  it('clamps all stat fields to valid ranges', () => {
    const broken = {
      wealth: -50,
      sanity: 200,
      justice: 101,
      glory: -1,
      suspicion: 150,
      retconPoints: -3,
    };
    const result = clampAllStats(broken);
    expect(result.wealth).toBe(0);
    expect(result.sanity).toBe(100);
    expect(result.justice).toBe(100);
    expect(result.glory).toBe(0);
    expect(result.suspicion).toBe(100);
    expect(result.retconPoints).toBe(0);
  });

  it('leaves valid stats unchanged', () => {
    const valid = { ...INITIAL_STATS };
    const result = clampAllStats(valid);
    expect(result).toEqual(valid);
  });
});

describe('getActionOutcome', () => {
  it('returns a string from the outcomes pool', () => {
    const outcome = getActionOutcome('rest');
    expect(typeof outcome).toBe('string');
    expect(STANDARD_OUTCOMES['rest']).toContain(outcome);
  });

  it('returns a fallback for unknown action', () => {
    const outcome = getActionOutcome('nonexistent_action_xyz');
    expect(typeof outcome).toBe('string');
    expect(outcome.length).toBeGreaterThan(0);
  });
});

describe('getJusticeLabel', () => {
  it('returns INFAMY for villains', () => {
    expect(getJusticeLabel(Alignment.VILLAIN)).toBe('INFAMY');
  });
  it('returns VENGEANCE for anti-heroes', () => {
    expect(getJusticeLabel(Alignment.ANTI_HERO)).toBe('VENGEANCE');
  });
  it('returns JUSTICE for heroes', () => {
    expect(getJusticeLabel(Alignment.HERO)).toBe('JUSTICE');
  });
  it('returns JUSTICE for undefined alignment', () => {
    expect(getJusticeLabel(undefined)).toBe('JUSTICE');
  });
});

describe('getActionsForAlignment', () => {
  it('returns civilian and hero actions for HERO', () => {
    const actions = getActionsForAlignment(Alignment.HERO);
    expect(actions.civilian.length).toBeGreaterThan(0);
    expect(actions.hero.length).toBeGreaterThan(0);
    expect(actions.hero.some(a => a.id === 'patrol')).toBe(true);
  });

  it('returns villain-specific actions for VILLAIN', () => {
    const actions = getActionsForAlignment(Alignment.VILLAIN);
    expect(actions.hero.some(a => a.id === 'crime')).toBe(true);
    expect(actions.civilian.some(a => a.id === 'launder')).toBe(true);
  });

  it('returns anti-hero actions for ANTI_HERO', () => {
    const actions = getActionsForAlignment(Alignment.ANTI_HERO);
    expect(actions.hero.some(a => a.id === 'shakedown')).toBe(true);
  });
});
