export interface Character {
  id: string;
  name: string;
  race: string;
  classes: ClassLevel[];
  totalLevel: number;
  background?: string;
  alignment?: string;
  experience?: number;
  avatar?: string;

  // Attributes / Ability Scores
  attributes: Attributes;

  // Saving throws
  savingThrows: SavingThrows;

  // Skills
  skills: string[];

  // Combat
  armorClass: number;
  initiative: number;
  speed: string;
  hitPoints: HitPoints;
  hitDice: string;
  attacks: Attack[];

  // Equipment
  equipment: string[];

  // Features & Traits
  features: string[];

  // Spells (for casters)
  spells: string[];

  // Notes / Flavor
  notes?: string;
}

// Nested interfaces

export interface Attributes {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface SavingThrows {
  STR: boolean;
  DEX: boolean;
  CON: boolean;
  INT: boolean;
  WIS: boolean;
  CHA: boolean;
}

export interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
}

export interface ClassLevel {
  class: string;
  subclass?: string;
  level: number;
}