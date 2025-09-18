import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CharacterSheetComponent } from './components/sheets/character-sheet/character-sheet.component';
import { MonsterSheetComponent } from './components/sheets/monster-sheet/monster-sheet.component';
import { Monster } from './components/sheets/monster-sheet/monster-sheet.component';
import { Character } from './components/sheets/character-sheet/character-sheet.component';
import { NotificationComponent } from "./components/notification/notification.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, CharacterSheetComponent, MonsterSheetComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'jsons-and-dragons';

  myMonster: Monster = {
  name: 'Stellar Tennis Juggernaut',
  size: 'Medium',
  type: 'beast',
  alignment: 'chaotic sloppy',

  // Combat stats
  armorClass: 11,
  hitPoints: {
    current: 34,
    formula: '1d4 + 5'
  },
  speed: '35 ft.',

  // Abilities
  abilities: {
    STR: 2,
    DEX: 11,
    CON: 16,
    INT: 14,
    WIS: 5,
    CHA: 5
  },

  // Optional fields
  conditionImmunities: ['weak-kneed'],
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Common'],
  challenge: '11 (1227 XP)',
  proficiencyBonus: 2,

  // Traits
  traits: [
    {
      name: 'Pack Tactics',
      description: 'These guys work together like peanut butter and jelly.'
    },
    {
      name: 'Big Jerk',
      description: 'Whenever this creature makes an attack, it starts telling you how much cooler it is than you.'
    },
    {
      name: 'Enormous Nose',
      description: 'This creature gains advantage on any check involving putting things in its nose.'
    },
    {
      name: 'Sassiness',
      description: 'When questioned, this creature will talk back instead of answering.'
    },
    {
      name: 'Full of Detergent',
      description: 'This creature has swallowed an entire bottle of dish detergent and is actually having a pretty good time. While walking near this creature, you must make a dexterity check or become "a soapy mess" for three hours, after which your skin will get all dry and itchy.'
    }
  ],

  // Actions
  actions: [
    {
      name: 'Jumping Driver',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2).'
    },
    {
      name: 'Suffering Wringer',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2).'
    },
    {
      name: 'Super Hip Submission',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2).'
    }
  ]
};

  myCharacter: Character = {
    name: 'Alaric Stormblade',
    race: 'Human',
    class: 'Fighter',
    level: 5,
    background: 'Soldier',
    alignment: 'Neutral Good',
    experience: 6500,
    // Attributes
    attributes: {
      STR: 16,
      DEX: 12,
      CON: 14,
      INT: 10,
      WIS: 11,
      CHA: 13
    },
    // Saving Throws
    savingThrows: {
      STR: true,
      DEX: false,
      CON: true,
      INT: false,
      WIS: false,
      CHA: false
    },
    // Skills
    skills: {
      Acrobatics: false,
      Arcana: false,
      Athletics: true,
      Deception: false,
      History: false,
      Insight: true,
      Intimidation: true,
      Investigation: false,
      Medicine: false,
      Nature: false,
      Perception: true,
      Performance: false,
      Persuasion: false,
      Religion: false,
      SleightOfHand: false,
      Stealth: false,
      Survival: true
    },
    // Combat
    armorClass: 17,
    initiative: 1,
    speed: '30 ft.',
    hitPoints: {
      current: 38,
      max: 38,
      temporary: 0
    },
    hitDice: '5d10',
    attacks: [
      { name: 'Longsword', bonus: '+5', damage: '1d8+3' },
      { name: 'Shortbow', bonus: '+3', damage: '1d6+1' }
    ],
    // Equipment
    equipment: ['Chain Mail', 'Longsword', 'Shortbow', 'Adventurer\'s Pack'],
    // Features & Traits
    features: [
      'Second Wind',
      'Action Surge',
      'Fighting Style: Defense'
    ],
    // Spells (if applicable)
    spells: [
      // empty for Fighter, could be populated for spellcasters
    ],
    // Notes
    notes: 'Has a scar across left cheek from past battle.'
  };


}
