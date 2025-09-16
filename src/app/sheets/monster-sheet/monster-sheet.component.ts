import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Monster {
  name: string;
  size: string;           // e.g., "Medium"
  type: string;           // e.g., "beast"
  alignment: string;      // e.g., "chaotic sloppy"

  // Combat stats
  armorClass: number;
  hitPoints: HitPoints;
  speed: string;

  // Ability scores
  abilities: Abilities;

  // Optional fields
  conditionImmunities?: string[];
  senses?: string[];
  languages?: string[];
  challenge?: string;
  proficiencyBonus?: number;

  // Traits and actions
  traits?: Feature[];
  actions?: Feature[];
}

export interface HitPoints {
  current: number;
  formula?: string;       // e.g., "1d4 + 5"
}

export interface Abilities {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface Feature {
  name: string;
  description: string;
}



@Component({
  selector: 'app-monster-sheet',
  imports: [CommonModule],
  templateUrl: './monster-sheet.component.html',
  styleUrl: './monster-sheet.component.less'
})
export class MonsterSheetComponent {
  @Input() monster!: Monster
  @Input() isWide: boolean = false;
}
