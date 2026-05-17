
export enum UniverseTone {
  GOLDEN_AGE = 'Golden Age',
  SILVER_AGE = 'Silver Age',
  BRONZE_AGE = 'Bronze Age',
  MODERN = 'Modern',
  GRIM_DARK = 'Grim/Dark',
  COSMIC = 'Cosmic',
  STREET_NOIR = 'Street/Noir',
  HORROR = 'Horror/Supernatural',
  CYBERPUNK = 'Future Cyberpunk',
  POST_APOC = 'Post-Apocalyptic',
}

export enum OriginArchetype {
  ORPHAN = 'The Orphan Hero',
  SOLDIER = 'The Super Soldier',
  BILLIONAIRE = 'The Billionaire Vigilante',
  ALIEN = 'The Alien Outsider',
  RELUCTANT = 'The Reluctant Hero',
  DARK_AVENGER = 'The Dark Avenger',
  CHOSEN = 'The Chosen One',
  REFORMED = 'The Reformed Villain',
  GENIUS = 'The Scientific Genius',
  STREET = 'The Street-Level Protector',
}

export enum IncitingIncident {
  TRAGEDY = 'Murder of Loved One',
  ACCIDENT = 'Lab Accident',
  ARTIFACT = 'Alien Artifact',
  EXPERIMENT = 'Military Experiment',
  DEATH = 'Near-Death Experience',
  LEGACY = 'Inheritance of Power',
  CRASH = 'Alien Crash Landing',
  CHEMICAL = 'Chemical Exposure',
  DIVINE = 'Divine Selection',
  MUTATION = 'Natural Mutation',
}

export enum Alignment {
  HERO = 'Hero',
  ANTI_HERO = 'Anti-Hero',
  VILLAIN = 'Villain',
}

export interface Character {
  name: string;
  heroName: string;
  universe: UniverseTone;
  origin: OriginArchetype;
  incident: IncitingIncident; // New field for the "How"
  alignment: Alignment;
  age: number; // In years
  week: number; // Current week of the year
  costume?: string; // Visual description of the suit
  legacy?: LegacyData; // Information about the parent/predecessor
  specificPower?: string; // User-defined details (e.g. "Spiders", "Gamma Radiation")
  currentArc?: string; // e.g. "The Awakening", "The Escalation"
}

export interface LegacyData {
  parentName: string;
  generation: number;
  inheritedWealth: number;
  inheritedGlory: number;
}

export interface Nemesis {
  name: string;
  epithet: string; // e.g. "The World Eater"
  archetype: string;
  description: string;
  weakness: string;
  power: number; // 0-100
  defeated: boolean;
  schemeName?: string; // e.g. "Operation Zero"
  schemeDescription?: string; 
  schemeProgress?: number; // 0-100
  imageUrl?: string; // Visual mugshot
  isGeneratingImage?: boolean; // Track if image is currently generating
}

export interface MinorVillain {
  id: string;
  name: string;
  gimmick: string; // e.g. "Uses weaponized condiments"
  powerLevel: number; // 10-40
  loot: 'INTEL' | 'WEALTH' | 'REP';
}

export interface Sidekick {
  id: string;
  name: string; // Hero name
  realName: string; // Civilian name
  archetype: string; // e.g. "The Hacker"
  specialty: 'COMBAT' | 'INTEL' | 'SUPPORT';
  loyalty: number; // 0-100
  status: 'ACTIVE' | 'ON_MISSION' | 'INJURED';
  description: string;
}

export interface Stats {
  wealth: number; // Civilian resource
  sanity: number; // Civilian resource
  justice: number; // Hero resource
  glory: number; // Hero resource
  suspicion: number; // Risk mechanic
  retconPoints: number; // PRD 2.2.3: Currency to survive death
}

export interface GameEvent {
  id: string;
  text: string;
  type: 'NARRATIVE' | 'DIALOGUE' | 'ACTION_RESULT' | 'ORIGIN' | 'CRISIS' | 'RETCON' | 'TEAM_REPORT' | 'ARC_EVENT';
  imagePrompt?: string; 
  imageUrl?: string; // New field for generated image
  isGeneratingImage?: boolean; // Track if image is currently generating
  timestamp: number;
  statsChanged?: Partial<Stats>;
}

export enum ActionCategory {
  CIVILIAN = 'Civilian',
  HERO = 'Hero',
}

export interface GameAction {
  id: string;
  label: string;
  category: ActionCategory;
  description: string;
  cost?: Partial<Stats>; // Negative values imply cost
  effect?: Partial<Stats>; // Positive values imply gain
  risk?: number; // Probability of something going wrong or suspicion raising high
}

export interface Upgrade {
  id: string;
  type: 'COMFORT' | 'INTEL' | 'WEAPON';
  name: string;
  description: string;
  costType: 'wealth' | 'justice' | 'glory';
  costAmount: number;
  purchased: boolean;
}

export interface CrisisOption {
  label: string;
  description: string;
  type: 'ALTRUISTIC' | 'PRAGMATIC';
}

export interface Crisis {
  id: string;
  title: string;
  description: string;
  options: [CrisisOption, CrisisOption];
}

export interface NPC {
  id: string;
  name: string;
  relation: string; // e.g. "Aunt", "Editor", "Mentor"
  description: string;
  relationship: number; // 0-100
  bonusType: 'SANITY' | 'WEALTH' | 'JUSTICE';
}

export interface ArchivedHero {
  id: string;
  heroName: string;
  civilianName: string;
  origin: OriginArchetype;
  universe: UniverseTone;
  weeksActive: number;
  outcome: 'VICTORY' | 'DEFEATED' | 'RETIRED' | 'MIA';
  finalStats: Stats;
  date: number;
  coverImage?: string; 
}

// PRD 2.2.4 Pull List
export type ThemeVariant = 'DEFAULT' | 'NOIR' | 'RETRO' | 'NEON';

export interface BattlePassReward {
    level: number;
    xpRequired: number;
    freeReward: { type: 'RESOURCE' | 'CURRENCY'; label: string; value: number; resource?: keyof Stats };
    premiumReward: { type: 'COSMETIC' | 'CONTENT'; label: string; themeId?: ThemeVariant; scenarioId?: string };
    isClaimedFree: boolean;
    isClaimedPremium: boolean;
}

// BitLife Expansion: Phase 1
export interface Asset {
  id: string;
  name: string;
  description: string;
  type: 'REAL_ESTATE' | 'VEHICLE' | 'BUSINESS' | 'LUXURY';
  cost: number;
  upkeep: number; // Cost per week in wealth
  passiveBonus: {
    stat: keyof Stats;
    amount: number;
  };
  purchased: boolean;
}
