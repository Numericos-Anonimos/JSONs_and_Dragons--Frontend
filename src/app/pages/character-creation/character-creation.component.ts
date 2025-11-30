import { Component, Input, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../shared/components/sheets/character-sheet/character-sheet.component';
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
import { Choice } from '../../shared/models/choice.model';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-character-creation',
  imports: [CommonModule, CharacterSheetComponent, FormsModule],
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.less'
})
export class CharacterCreationComponent {

  constructor(
    private route: ActivatedRoute,
    private characterCreationService: CharacterCreationService,
    private baseDataService: BaseDataService,
    private http: HttpClient
  ) {}

  private destroyRef = inject(DestroyRef);

  choices: Choice[] = [];
  selections: { [key: number]: number[] } = {};
  activeChoices = new Set<number>([0]);
  loadedOptions: { [key: number]: string[] } = {};
  loading: { [key: number]: boolean } = {};

  step: number = 1;
  totalSteps: number = 8;
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
    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');

    //   if (id) {
    //     this.loadCharacterById(id);
    //   }
    // });
  }

  initializeCharacter(): Character {
    return {
      id: '',
      name: '',
      race: '',
      class: '',
      subclass: '',
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
      skills: [],
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

  // loadCharacterById(id: string) {
  //   this.characterCreationService.getCharacter(id)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (character) => {
  //         this.character = character;

  //         // any derived fields you always recalc:
  //         this.updateDerivedStats();

  //         // now update feats
  //         this.updateCharacterFeats();
  //       },
  //       error: (err) => {
  //         console.error(`Failed to load character ${id}`, err);
  //       }
  //     });
  // }

  // updateCharacterFeats() {
  //   if (!this.character.class || !this.character.subclass || !this.character.level) return;

  //   this.characterCreationService.getFeatsForCharacter(
  //     this.character.class,
  //     this.character.subclass,
  //     this.character.level
  //   )
  //   .pipe(takeUntilDestroyed(this.destroyRef))
  //   .subscribe(feats => {
  //     this.character.features = feats;
  //   });
  // }


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

  getBackgrounds() {
    if (this.character.class) {
      this.baseDataService.getBackgrounds()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.backgrounds = response;
      });
    }
  }

  loadDynamicOptions(): void {
    this.choices.forEach((choice, index) => {
      if (typeof choice.opcoes === 'object' && choice.opcoes.action === 'REQUEST') {
        this.loadOptionsFromAPI(index, choice.opcoes.query);
      }
    });
  }

  loadOptionsFromAPI(choiceIndex: number, query: string): void {
    this.loading[choiceIndex] = true;
    
    // Substitua pela sua URL da API
    this.http.get<string[]>(`api/${query}`).subscribe({
      next: (data) => {
        this.loadedOptions[choiceIndex] = data;
        this.loading[choiceIndex] = false;
      },
      error: (err) => {
        console.error(`Erro ao carregar opções para ${query}:`, err);
        // Mock para desenvolvimento
        this.loadedOptions[choiceIndex] = ['Espada Longa', 'Machado de Batalha', 'Lança', 'Martelo de Guerra'];
        this.loading[choiceIndex] = false;
      }
    });
  }

  getClassChoices() {
    this.characterCreationService.sendClass(this.character.class, '0')
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      console.log(response);
      this.choices = response;
      this.loadDynamicOptions();
    });
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
    this.getSubclasses();
    
    // Reset skills
    Object.keys(this.character.skills).forEach(skill => {
      this.character.skills = [];
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
      if (this.step === 3 && this.selectedSubrace) {
        this.applyRacialBonuses();
        this.getClasses();
      }
      if (this.step === 4 && this.character.class) {
        this.getClassChoices();
      } 
      if (this.step === 5 && this.character.class) {
        this.getBackgrounds();
      } 
      // if (this.step === 6) {
      //   this.updateDerivedStats();
      // }
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
      case 2: return this.calculateUsedPoints() === this.pointBuyPoints;
      case 3: return this.character.race.length > 0 && this.selectedSubrace.length > 0;
      case 4: return this.character.class.length > 0 && this.character.subclass.length > 0;
      // case 5: return this.getSelectedSkillsCount() === this.getSkillCount();
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
      'Standard': {},
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

  getSkillKeys(): string[] {
    return this.character.skills;
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

  //choices

  getOptions(choiceIndex: number): string[] {
    const choice = this.choices[choiceIndex];
    if (Array.isArray(choice.opcoes)) {
      return choice.opcoes;
    }
    return this.loadedOptions[choiceIndex] || [];
  }

  isLoading(choiceIndex: number): boolean {
    return this.loading[choiceIndex] || false;
  }

  handleSelection(choiceIndex: number, optionIndex: number): void {
    const choice = this.choices[choiceIndex];
    const currentSelection = this.selections[choiceIndex] || [];
    
    let newSelection: number[];
    
    if (choice.n === 1) {
      // Seleção única
      newSelection = [optionIndex];
    } else {
      // Seleção múltipla
      if (currentSelection.includes(optionIndex)) {
        // Remove se já estava selecionado
        newSelection = currentSelection.filter(i => i !== optionIndex);
      } else if (currentSelection.length < choice.n) {
        // Adiciona se não excedeu o limite
        newSelection = [...currentSelection, optionIndex];
      } else {
        // Já atingiu o limite
        return;
      }
    }

    this.selections[choiceIndex] = newSelection;
    this.updateActiveChoices();
  }

  calculateNextChoice(currentIndex: number, selectedOptionIndex: number): number | null {
    const choice = this.choices[currentIndex];
    const relacao = choice.relacao[selectedOptionIndex];
    const offset = choice.offsets[selectedOptionIndex];
    
    // Se ambos são 0, não há próxima escolha
    if (relacao === 0 && offset === 0) {
      return null;
    }
    
    const nextIndex = currentIndex + relacao + offset;
    
    console.log(`Escolha ${currentIndex} "${choice.label}", Opção ${selectedOptionIndex}:`);
    console.log(`  relacao: ${relacao}, offset: ${offset}`);
    console.log(`  cálculo: ${currentIndex} + ${relacao} + ${offset} = ${nextIndex}`);
    
    return nextIndex >= 0 && nextIndex < this.choices.length ? nextIndex : null;
  }

  updateActiveChoices(): void {
    const newActiveChoices = new Set<number>();
    
    // Adiciona todas as escolhas que devem estar sempre ativas
    // (aquelas que não dependem de nenhuma escolha anterior)
    for (let i = 0; i < this.choices.length; i++) {
      // Verifica se alguma escolha anterior pode desbloquear esta
      let hasDependency = false;
      
      for (let j = 0; j < i; j++) {
        const choice = this.choices[j];
        // Se alguma opção da escolha anterior pode desbloquear esta escolha
        for (let optIdx = 0; optIdx < choice.relacao.length; optIdx++) {
          const nextIndex = j + choice.relacao[optIdx] + choice.offsets[optIdx];
          if (nextIndex === i) {
            hasDependency = true;
            break;
          }
        }
        if (hasDependency) break;
      }
      
      // Se não tem dependência, está sempre ativa
      if (!hasDependency) {
        newActiveChoices.add(i);
        console.log(`Escolha ${i} "${this.choices[i].label}" não tem dependências - sempre ativa`);
      }
    }
    
    // Agora processa as escolhas que desbloqueiam outras
    let changed = true;
    let iterations = 0;
    const maxIterations = 100;
    
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      
      for (let i = 0; i < this.choices.length; i++) {
        if (!newActiveChoices.has(i)) continue;
        
        const selection = this.selections[i];
        if (!selection || selection.length !== this.choices[i].n) continue;

        selection.forEach(optionIndex => {
          const nextIndex = this.calculateNextChoice(i, optionIndex);
          if (nextIndex !== null && !newActiveChoices.has(nextIndex)) {
            console.log(`Escolha ${i} "${this.choices[i].label}", opção ${optionIndex} -> desbloqueia escolha ${nextIndex} "${this.choices[nextIndex].label}"`);
            newActiveChoices.add(nextIndex);
            changed = true;
          }
        });
      }
    }

    console.log('Escolhas ativas:', Array.from(newActiveChoices).sort((a,b) => a-b));
    this.activeChoices = newActiveChoices;
  }

  isChoiceActive(index: number): boolean {
    return this.activeChoices.has(index);
  }

  isChoiceComplete(index: number): boolean {
    const selection = this.selections[index];
    return selection ? selection.length === this.choices[index].n : false;
  }

  isOptionSelected(choiceIndex: number, optionIndex: number): boolean {
    return this.selections[choiceIndex]?.includes(optionIndex) || false;
  }

  getSelectionCount(choiceIndex: number): number {
    return this.selections[choiceIndex]?.length || 0;
  }

  getSelectionSummary(): Array<{ label: string; options: string[] }> {
    return Object.entries(this.selections)
      .filter(([, sel]) => sel.length > 0)
      .map(([idx, sel]) => {
        const choice = this.choices[parseInt(idx)];
        const options = this.getOptions(parseInt(idx));
        const selectedOptions = sel.map(i => options[i]);
        return {
          label: choice.label,
          options: selectedOptions
        };
      });
  }

  getActiveChoicesArray(): number[] {
    return Array.from(this.activeChoices).sort((a, b) => a - b);
  }

}

interface ClassInfo {
  skills: string[];
  count: number;
  hitDice: string;
  savingThrows: string[];
  equipment: string[];
}