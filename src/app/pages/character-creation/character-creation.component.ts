import { Component, Input, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { Skills } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { SavingThrows } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { Attributes } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { Monster } from '../../shared/components/sheets/monster-sheet/monster-sheet.component';
import { CharacterSheetComponent } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { MonsterSheetComponent } from '../../shared/components/sheets/monster-sheet/monster-sheet.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { FormsModule } from '@angular/forms';
import { CharacterCreationService } from '../../shared/services/character-creation-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseDataService } from '../../shared/services/base-data-service';

@Component({
  selector: 'app-character-creation',
  imports: [CommonModule, CharacterSheetComponent, FormsModule],
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.less'
})
export class CharacterCreationComponent {

  constructor(
    private characterCreationService: CharacterCreationService,
    private baseDataService: BaseDataService
  ) {}

  private destroyRef = inject(DestroyRef);

  step: number = 1;
  totalSteps: number = 9;
  pointBuyPoints: number = 27;
  selectedSubrace: string = '';

  character: Character = this.initializeCharacter();

  races: string[] = [];

  subraces: string[] = [];

  classes: string[] = [];
  subclasses: string[] = [];

  backgrounds: string[] = [];

  alignments: string[] = [
    'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
  ];

  ngOnInit() {
  }

  initializeCharacter(): Character {
    return {
      name: '',
      race: '',
      class: '',
      level: 1,
      background: '',
      alignment: '',
      experience: 0,
      attributes: {
        STR: 8,
        DEX: 8,
        CON: 8,
        INT: 8,
        WIS: 8,
        CHA: 8
      },
      savingThrows: {
        STR: false,
        DEX: false,
        CON: false,
        INT: false,
        WIS: false,
        CHA: false
      },
      skills: {
        Acrobatics: false,
        Arcana: false,
        Athletics: false,
        Deception: false,
        History: false,
        Insight: false,
        Intimidation: false,
        Investigation: false,
        Medicine: false,
        Nature: false,
        Perception: false,
        Performance: false,
        Persuasion: false,
        Religion: false,
        SleightOfHand: false,
        Stealth: false,
        Survival: false
      },
      armorClass: 10,
      initiative: 0,
      speed: '30 ft',
      hitPoints: {
        current: 0,
        max: 0,
        temporary: 0
      },
      hitDice: '1d6',
      attacks: [],
      equipment: [],
      features: [],
      spells: [],
      notes: ''
    };
  }

  getRaces() {
    this.baseDataService.getRaces()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      this.races = response;
    });
  }

  getSubraces() {
    if (this.character.race) {
      this.baseDataService.getSubraces(this.character.race)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.subraces = response;
      });
    }
  }

  getClasses() {
    this.baseDataService.getClasses()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      this.classes = response;
    });
  }

  getSubclasses() {
    if (this.character.class) {
      this.baseDataService.getSubclasses(this.character.class)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.subclasses = response;
      });
    }
  }

  getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  getPointCost(score: number): number {
    const costs: { [key: number]: number } = {
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costs[score] || 0;
  }

  calculateUsedPoints(): number {
    const scores = this.character.attributes;
    return Object.values(scores).reduce((sum, score) => sum + this.getPointCost(score), 0);
  }

  canIncreaseAbility(ability: keyof Attributes): boolean {
    const currentScore = this.character.attributes[ability];
    if (currentScore >= 15) return false;
    const nextCost = this.getPointCost(currentScore + 1);
    const currentUsed = this.calculateUsedPoints();
    return (currentUsed - this.getPointCost(currentScore) + nextCost) <= this.pointBuyPoints;
  }

  canDecreaseAbility(ability: keyof Attributes): boolean {
    return this.character.attributes[ability] > 8;
  }

  increaseAbility(ability: keyof Attributes): void {
    if (this.canIncreaseAbility(ability)) {
      this.character.attributes[ability]++;
      this.updateDerivedStats();
    }
  }

  decreaseAbility(ability: keyof Attributes): void {
    if (this.canDecreaseAbility(ability)) {
      this.character.attributes[ability]--;
      this.updateDerivedStats();
    }
  }

  updateDerivedStats(): void {
    // Update initiative
    this.character.initiative = this.getAbilityModifier(this.character.attributes.DEX);
    
    // Update AC (base 10 + DEX modifier)
    this.character.armorClass = 10 + this.getAbilityModifier(this.character.attributes.DEX);
    
    // Update speed based on race
    this.character.speed = this.getRaceSpeed();
    
    // Calculate hit points
    // if (this.character.class) {
    //   const classInfo = this.classes[this.character.class];
    //   const hitDie = parseInt(classInfo.hitDice.substring(2));
    //   const conMod = this.getAbilityModifier(this.character.attributes.CON);
    //   this.character.hitPoints.max = hitDie + conMod;
    //   this.character.hitPoints.current = this.character.hitPoints.max;
    //   this.character.hitDice = classInfo.hitDice;
    // }
  }

  getRaceSpeed(): string {
    const speedMap: { [key: string]: string } = {
      'Dwarf': '25 ft',
      'Elf': '30 ft',
      'Halfling': '25 ft',
      'Human': '30 ft',
      'Dragonborn': '30 ft',
      'Gnome': '25 ft',
      'Half-Elf': '30 ft',
      'Half-Orc': '30 ft',
      'Tiefling': '30 ft'
    };
    return speedMap[this.character.race] || '30 ft';
  }

  selectClass(className: any): void {
    this.character.class = className;
    const classInfo = this.classes[className];
    
    // Reset skills
    Object.keys(this.character.skills).forEach(skill => {
      this.character.skills[skill as keyof Skills] = false;
    });
    
    // Set saving throws
    // Object.keys(this.character.savingThrows).forEach(ability => {
    //   this.character.savingThrows[ability as keyof SavingThrows] = 
    //     classInfo.savingThrows.includes(ability);
    // });
    
    // Set equipment
    // this.character.equipment = [...classInfo.equipment];
    
    this.updateDerivedStats();
  }

  nextStep(): void {
    if (this.canProceed()) {
      if (this.step == 1) {
        this.getRaces();
      }
      if (this.step === 2 && this.selectedSubrace) {
        this.applyRacialBonuses();
      }
      if (this.step === 3 && this.character.class) {
        this.characterCreationService.sendClass(this.character.class, '0')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(response => {
          console.log(response);
        });
      } 
      if (this.step === 5) {
        this.updateDerivedStats();
      }
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  canProceed(): boolean {
    switch (this.step) {
      case 1: return this.character.name.trim().length > 0;
      case 2: return this.character.race.length > 0 && this.selectedSubrace.length > 0;
      case 3: return this.character.class.length > 0;
      // case 4: return this.getSelectedSkillsCount() === this.getSkillCount();
      case 5: return this.calculateUsedPoints() === this.pointBuyPoints;
      case 6: return this.character.background !== undefined && this.character.background.length > 0;
      case 7: return this.character.alignment !== undefined && this.character.alignment.length > 0;
      case 8: return true;
      default: return true;
    }
  }

  applyRacialBonuses(): void {
    const bonuses: { [key: string]: Partial<Attributes> } = {
      'Hill Dwarf': { CON: 2, WIS: 1 },
      'Mountain Dwarf': { STR: 2, CON: 2 },
      'High Elf': { DEX: 2, INT: 1 },
      'Wood Elf': { DEX: 2, WIS: 1 },
      'Dark Elf (Drow)': { DEX: 2, CHA: 1 },
      'Lightfoot': { DEX: 2, CHA: 1 },
      'Stout': { DEX: 2, CON: 1 },
      'Standard': {}, // Human handled separately
      'Dragonborn': { STR: 2, CHA: 1 },
      'Forest Gnome': { INT: 2, DEX: 1 },
      'Rock Gnome': { INT: 2, CON: 1 },
      'Half-Elf': { CHA: 2 },
      'Half-Orc': { STR: 2, CON: 1 },
      'Tiefling': { INT: 1, CHA: 2 }
    };

    // Apply racial bonuses
    const bonus = bonuses[this.selectedSubrace];
    if (bonus) {
      Object.keys(bonus).forEach(ability => {
        this.character.attributes[ability as keyof Attributes] += bonus[ability as keyof Attributes]!;
      });
    }

    // Human gets +1 to all
    if (this.selectedSubrace === 'Standard' && this.character.race === 'Human') {
      Object.keys(this.character.attributes).forEach(ability => {
        this.character.attributes[ability as keyof Attributes]++;
      });
    }
  }

  getRaceBonus(ability: string): number {
    // This is for display purposes only - showing what bonus will be applied
    const bonuses: { [key: string]: { [key: string]: number } } = {
      'Hill Dwarf': { CON: 2, WIS: 1 },
      'Mountain Dwarf': { STR: 2, CON: 2 },
      'High Elf': { DEX: 2, INT: 1 },
      'Wood Elf': { DEX: 2, WIS: 1 },
      'Dark Elf (Drow)': { DEX: 2, CHA: 1 },
      'Lightfoot': { DEX: 2, CHA: 1 },
      'Stout': { DEX: 2, CON: 1 },
      'Dragonborn': { STR: 2, CHA: 1 },
      'Forest Gnome': { INT: 2, DEX: 1 },
      'Rock Gnome': { INT: 2, CON: 1 },
      'Half-Elf': { CHA: 2 },
      'Half-Orc': { STR: 2, CON: 1 },
      'Tiefling': { INT: 1, CHA: 2 }
    };

    if (this.selectedSubrace === 'Standard' && this.character.race === 'Human') {
      return 1;
    }

    return bonuses[this.selectedSubrace]?.[ability] || 0;
  }

  downloadCharacter(): void {
    const dataStr = JSON.stringify(this.character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.character.name.replace(/\s+/g, '_')}_character.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  resetCharacter(): void {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
      this.character = this.initializeCharacter();
      this.selectedSubrace = '';
      this.step = 1;
    }
  }

  getObjectKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  getAttributeKeys(): (keyof Attributes)[] {
    return ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  }

  getSavingThrowKeys(): (keyof SavingThrows)[] {
    return ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  }

  getSkillKeys(): (keyof Skills)[] {
    return Object.keys(this.character.skills) as (keyof Skills)[];
  }

  setRace(race: any) {
    this.character.race = race;
    this.selectedSubrace = '';
  }

  onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      console.log(files);
      // upload filessssss
    }
  }

}

interface ClassInfo {
  skills: string[];
  count: number;
  hitDice: string;
  savingThrows: string[];
  equipment: string[];
}