import { GameAction, ActionCategory, Stats, BattlePassReward, Asset, Alignment } from '../types';

export const SAVE_VERSION = "2.0.0";

export const INITIAL_STATS: Stats = {
  wealth: 50,
  sanity: 80,
  justice: 10,
  glory: 0,
  suspicion: 0,
  retconPoints: 1,
};

export const STANDARD_OUTCOMES: Record<string, string[]> = {
  rest: [
    "You spent a quiet evening recovering. Your mind clears.",
    "A peaceful night's sleep does wonders for your sanity.",
    "You tended to your wounds and rested. Tomorrow is another day.",
    "The silence of your room feels foreign after all the chaos.",
    "You meditated until dawn, letting the tension drain away.",
    "A hot meal and a locked door — tonight, that's enough.",
    "You slept through the night for the first time in weeks.",
    "Dreams of a normal life felt closer tonight than usual.",
  ],
  work: [
    "Another grueling day at the day job. At least the pay is steady.",
    "You blended in with the civilians and earned your paycheck.",
    "Mundane tasks fill your day, but the bills won't pay themselves.",
    "Your coworkers complained about traffic. You bit your tongue.",
    "Eight hours of normalcy. It almost felt real.",
    "The boss praised your work. If only they knew the truth.",
    "You clocked out and stared at the skyline. Duty calls soon.",
    "Spreadsheets by day, something else entirely by night.",
  ],
  patrol: [
    "You stopped a mugging in an alleyway. The victim was grateful.",
    "Patrolled the rooftops. It was quiet tonight, almost too quiet.",
    "You broke up a small smuggling ring at the docks.",
    "A car chase through the warehouse district ended with arrests.",
    "You pulled a family from a burning apartment on 5th Street.",
    "Gang activity near the waterfront. You sent them running.",
    "A street dealer offered you a cut. You declined — forcefully.",
    "You found a missing child hiding under a bridge. Reunited safely.",
    "Graffiti on the wall: your symbol. The neighborhood remembers.",
  ],
  train: [
    "You pushed your physical limits in the training room.",
    "Hours of practice have honed your skills further.",
    "You discovered a new application for your powers while sparring.",
    "The heavy bag didn't survive today's session.",
    "You ran the obstacle course in record time.",
    "Muscle memory is taking over. Reactions are faster now.",
    "You studied footage of past encounters and drilled counters.",
    "Pain is just weakness leaving the body. You feel sharper.",
  ],
  investigate: [
    "You followed up on a lead from an informant. The plot thickens.",
    "You spent hours reviewing evidence on the conspiracy board.",
    "A stakeout yields valuable intel on enemy movements.",
    "Surveillance cameras captured something strange downtown.",
    "A coded message intercepted — it took hours to crack it.",
    "The trail leads to an abandoned factory on the east side.",
    "Financial records reveal shell companies and hidden payments.",
    "An anonymous tip drops in your lap. Smells like a setup — or a break.",
  ],
  launder: [
    "You successfully cleaned the cash through a shell company.",
    "The money is safe in an offshore account now.",
    "A discreet transaction washes the dirt off your funds.",
    "The accountant asks no questions. That's why you pay them.",
    "Cryptocurrency, art purchases, charity galas — all clean now.",
    "The paper trail vanishes into a maze of LLCs.",
    "Your front business reported record profits this quarter.",
    "A bagman handled the exchange. No fingerprints, no traces.",
  ],
  crime: [
    "You pulled off a heist without a hitch. The vault is empty.",
    "You terrorized the locals, taking what you wanted.",
    "A successful robbery adds to your growing war chest.",
    "The security system never stood a chance against your powers.",
    "Sirens wailed in the distance as you vanished into the night.",
    "You left your calling card. Let them know who runs this city.",
    "The take was better than expected. Fear is profitable.",
    "A rival crew tried to stop you. They won't try again.",
  ],
  plot: [
    "You spent hours in the lair, finalizing your master plan.",
    "Your schemes grow more complex and deadly.",
    "You moved the pieces on the board. Soon, they will all fall.",
    "The blueprint is complete. Phase two begins tomorrow.",
    "You recruited a specialist for the next stage of the plan.",
    "Every contingency accounted for. Every exit mapped.",
    "The dominoes are set. One push is all it takes.",
    "Your rival has no idea what's coming. Perfect.",
  ],
  shakedown: [
    "You intimidated a local gang into paying tribute.",
    "A brutal interrogation yields cash and fear.",
    "You took a cut of the local syndicate's profits.",
    "The shop owner paid without a word. Wise choice.",
    "You collected debts that were long overdue.",
    "Fear spreads faster than fire. The district is yours.",
    "A protection fee — that's what you're calling it now.",
    "They'll pay, or they'll pay differently. Either works.",
  ],
};

export const INITIAL_BP_REWARDS: BattlePassReward[] = [
  { level: 1, xpRequired: 50, freeReward: { type: 'RESOURCE', label: '+20 Wealth', value: 20, resource: 'wealth' }, premiumReward: { type: 'COSMETIC', label: 'Variant Cover: Noir' }, isClaimedFree: false, isClaimedPremium: false },
  { level: 2, xpRequired: 150, freeReward: { type: 'RESOURCE', label: '+1 Retcon Point', value: 1, resource: 'retconPoints' }, premiumReward: { type: 'CONTENT', label: 'Mystery Crate (+50 Glory)' }, isClaimedFree: false, isClaimedPremium: false },
  { level: 3, xpRequired: 300, freeReward: { type: 'RESOURCE', label: '+50 Glory', value: 50, resource: 'glory' }, premiumReward: { type: 'COSMETIC', label: 'Variant Cover: Retro' }, isClaimedFree: false, isClaimedPremium: false },
  { level: 4, xpRequired: 500, freeReward: { type: 'RESOURCE', label: '+20 Justice', value: 20, resource: 'justice' }, premiumReward: { type: 'COSMETIC', label: 'Variant Cover: Neon' }, isClaimedFree: false, isClaimedPremium: false },
];

export const INITIAL_ASSETS: Asset[] = [
  { id: 'apartment', name: 'Downtown Apartment', description: 'A decent place to crash.', type: 'REAL_ESTATE', cost: 100, upkeep: 5, passiveBonus: { stat: 'sanity', amount: 5 }, purchased: false },
  { id: 'penthouse', name: 'Luxury Penthouse', description: 'The peak of civilian living.', type: 'REAL_ESTATE', cost: 500, upkeep: 20, passiveBonus: { stat: 'sanity', amount: 15 }, purchased: false },
  { id: 'sports_car', name: 'Sports Car', description: 'Fast, flashy, and expensive.', type: 'VEHICLE', cost: 200, upkeep: 10, passiveBonus: { stat: 'glory', amount: 5 }, purchased: false },
  { id: 'pr_firm', name: 'PR Retainer', description: 'A team to manage your public image.', type: 'BUSINESS', cost: 300, upkeep: 25, passiveBonus: { stat: 'glory', amount: 10 }, purchased: false },
  { id: 'shell_corp', name: 'Shell Corporation', description: 'Hides your money and identity.', type: 'BUSINESS', cost: 400, upkeep: 30, passiveBonus: { stat: 'suspicion', amount: -10 }, purchased: false },
];

export const getActionOutcome = (actionId: string): string => {
  const outcomes = STANDARD_OUTCOMES[actionId] || [
    "You went about your business.",
    "Just another day in the city.",
    "You completed your task successfully.",
  ];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

export const getJusticeLabel = (alignment?: Alignment): string => {
  if (alignment === Alignment.VILLAIN) return 'INFAMY';
  if (alignment === Alignment.ANTI_HERO) return 'VENGEANCE';
  return 'JUSTICE';
};

export const getActionsForAlignment = (alignment?: Alignment): { civilian: GameAction[]; hero: GameAction[] } => {
  const baseCivilian: GameAction[] = [
    { id: 'rest', label: 'Rest & Recover', category: ActionCategory.CIVILIAN, description: 'Regain sanity.', effect: { sanity: 15, suspicion: -2 } },
    { id: 'contacts', label: 'Contacts', category: ActionCategory.CIVILIAN, description: 'Call friends or allies.', effect: {} },
  ];

  if (alignment === Alignment.VILLAIN) {
    return {
      civilian: [
        { id: 'launder', label: 'Launder Money', category: ActionCategory.CIVILIAN, description: 'Clean your dirty cash.', effect: { wealth: 5, suspicion: -10 } },
        ...baseCivilian,
      ],
      hero: [
        { id: 'crime', label: 'Commit Crime', category: ActionCategory.HERO, description: 'Rob banks or terrorize.', effect: { wealth: 25, justice: 15, suspicion: 15, sanity: -2 } },
        { id: 'plot', label: 'Plot Scheme', category: ActionCategory.HERO, description: 'Plan your next move.', effect: { justice: 10, sanity: 10, suspicion: 5 } },
        { id: 'investigate', label: 'Hunt Nemesis', category: ActionCategory.HERO, description: 'Stalk the hero stopping you.', effect: { justice: 10, suspicion: 5 } },
      ],
    };
  }

  if (alignment === Alignment.ANTI_HERO) {
    return {
      civilian: [
        { id: 'work', label: 'Day Job', category: ActionCategory.CIVILIAN, description: 'Keep up appearances.', effect: { wealth: 10, sanity: -5, suspicion: -5 } },
        ...baseCivilian,
      ],
      hero: [
        { id: 'patrol', label: 'Brutal Patrol', category: ActionCategory.HERO, description: 'Punish criminals severely.', effect: { justice: 20, suspicion: 15, sanity: -5, glory: -2 } },
        { id: 'shakedown', label: 'Shakedown', category: ActionCategory.HERO, description: 'Take cash from criminals.', effect: { wealth: 15, justice: 5, suspicion: 5 } },
        { id: 'investigate', label: 'Investigate', category: ActionCategory.HERO, description: 'Track down the target.', effect: { justice: 15, suspicion: 10, sanity: -5 } },
      ],
    };
  }

  return {
    civilian: [
      { id: 'work', label: 'Day Job', category: ActionCategory.CIVILIAN, description: 'Earn money, lose sanity.', effect: { wealth: 10, sanity: -5, suspicion: -5 } },
      ...baseCivilian,
    ],
    hero: [
      { id: 'patrol', label: 'Street Patrol', category: ActionCategory.HERO, description: 'Fight crime, gain justice.', effect: { justice: 10, glory: 2, suspicion: 10, sanity: -5 } },
      { id: 'train', label: 'Train Powers', category: ActionCategory.HERO, description: 'Prepare for threats.', effect: { justice: 5, glory: 5, suspicion: 5, sanity: -2 } },
      { id: 'investigate', label: 'Investigate', category: ActionCategory.HERO, description: 'Find the Nemesis.', effect: { justice: 15, suspicion: 15, sanity: -10 } },
    ],
  };
};

export const clampStat = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

export const clampAllStats = (s: Stats): Stats => ({
  wealth: Math.max(0, s.wealth),
  sanity: clampStat(s.sanity),
  justice: clampStat(s.justice),
  glory: clampStat(s.glory),
  suspicion: clampStat(s.suspicion),
  retconPoints: Math.max(0, s.retconPoints),
});
