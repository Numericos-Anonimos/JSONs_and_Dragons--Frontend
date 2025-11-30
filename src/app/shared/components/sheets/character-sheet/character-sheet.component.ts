import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Character {
  name: string;
  race: string;
  class: string;
  subclass: string;
  level: number;
  background?: string;
  alignment?: string;
  experience?: number;

  // Attributes / Ability Scores
  attributes: Attributes;

  // Saving throws
  savingThrows: SavingThrows;

  // Skills
  skills: Skills;

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

export interface Skills {
  Acrobatics: boolean;
  Arcana: boolean;
  Athletics: boolean;
  Deception: boolean;
  History: boolean;
  Insight: boolean;
  Intimidation: boolean;
  Investigation: boolean;
  Medicine: boolean;
  Nature: boolean;
  Perception: boolean;
  Performance: boolean;
  Persuasion: boolean;
  Religion: boolean;
  SleightOfHand: boolean;
  Stealth: boolean;
  Survival: boolean;
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



@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.less'
})
export class CharacterSheetComponent {
  @Input() character!: Character;
  @Input() isWide: boolean = false;
}