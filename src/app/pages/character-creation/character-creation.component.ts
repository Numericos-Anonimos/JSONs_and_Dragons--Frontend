import { Component, Input, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character, SavingThrows, Attributes } from '../../shared/models/character.model';
import { CharacterSheetComponent } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { FormsModule } from '@angular/forms';
import { CharacterCreationService } from '../../shared/services/character-creation-service';
import { CharacterSheetsService } from '../../shared/services/character-sheets-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseDataService } from '../../shared/services/base-data-service';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { CriarFichaRequest } from '../../shared/models/criar-ficha-request.model';
import { Atributos } from '../../shared/models/atributos.model';
import { Decision } from '../../shared/models/decision.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { ClassLevel } from '../../shared/models/character.model';
import { CharacterResponse } from '../../shared/models/character-response.model';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-creation',
  imports: [CommonModule, CharacterSheetComponent, LoadingOverlayComponent, FormsModule],
  templateUrl: './character-creation.component.html',
  styleUrl: './character-creation.component.less'
})
export class CharacterCreationComponent {

  constructor(
    private route: ActivatedRoute,
    private characterCreationService: CharacterCreationService,
    private characterSheetsService: CharacterSheetsService,
    private baseDataService: BaseDataService,
    private http: HttpClient,
    private router: Router
  ) {
      const nav = this.router.getCurrentNavigation();
      const characterFromLevelUp = nav?.extras.state?.['character'];

      if (characterFromLevelUp) {
        this.character.id = characterFromLevelUp.header.id;
        this.step = 5;
        this.isLevelingUp = true;
        this.getClasses();
      }
  }

  private destroyRef = inject(DestroyRef);

  selections: { [key: number]: number[] } = {};
  activeChoices = new Set<number>([0]);
  loadedOptions: { [key: number]: string[] } = {};
  loading: { [key: number]: boolean } = {};

  decisionsArray: Decision[] = [];
  isLoadingDecision: boolean = false;
  currentDecisionIndex = 0;

  step: number = 1;
  totalSteps: number = 6;
  pointBuyPoints: number = 27;
  selectedSubrace: string = '';

  showAddLevelButton: boolean = false;
  isLevelingUp: boolean = false;

  character: Character = this.initializeCharacter();

  characterResponse: CharacterResponse | null = null;

  races: string[] = [];

  subraces: string[] = [];

  classes: string[] = [];
  subclasses: string[] = [];

  backgrounds: string[] = [];

  ngOnInit() {
  }

  ngOnDestroy(): void {
    document.body.classList.remove('loading-active');
  }

  private setLoading(loading: boolean): void {
    this.isLoadingDecision = loading;
  }

  initializeCharacter(): Character {
    return {
      id: '',
      name: '',
      race: '',
      classes: [],
      totalLevel: 0,
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

  getRaces() {
    this.baseDataService.getRaces()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      this.races = response;
    });
  }

  getClasses() {
    this.baseDataService.getClasses()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      this.classes = response;
    });
  }

  getBackgrounds() {
    this.baseDataService.getBackgrounds()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      this.backgrounds = response;
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
      // this.updateDerivedStats();
    }
  }

  updateDerivedStats(): void {
    // Update initiative
    this.character.initiative = this.getAbilityModifier(this.character.attributes.DEX);
    
    // Update AC (base 10 + DEX modifier)
    this.character.armorClass = 10 + this.getAbilityModifier(this.character.attributes.DEX);
  }

  nextStep(): void {
    if (this.canProceed()) {
      if (this.step === 1) {
        // loading everything
        this.getRaces();
        this.getClasses();
        this.getBackgrounds();
      }
      if (this.step === 2) {
        this.saveCharacter();
      }
      if (this.step === 3) {
        // this.sendBackground();
      }
      if (this.step === 4) {
        // this.getClassChoices();
      } 
      if (this.step === 5) {
        this.loadCharacterToView();
      } 
      // if (this.step === 6) {
      //   this.updateDerivedStats();
      // }
      this.clearDecisions();
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  canProceed(): boolean {
    if (this.decisionsArray.length > 0 && !this.decisionsArray.every(d => d.isComplete)) {
      return false;
    }
    switch (this.step) {
      case 1: return this.character.name.trim().length > 0;
      case 2: return this.calculateUsedPoints() === this.pointBuyPoints;
      case 3: return this.character.race.length > 0;
      case 4: return this.character.background != null && this.character.background.length > 0;
      // case 5: return this.getSelectedSkillsCount() === this.getSkillCount();
      // case 6: return this.character.background !== undefined && this.character.background.length > 0;
      // case 7: return this.character.alignment !== undefined && this.character.alignment.length > 0;
      // case 8: return true;
      default: return true;
    }
  }

    downloadSheet() {
    this.characterSheetsService.exportSheet(this.character.id)
    .subscribe({
      next: (response) => {
        const json = JSON.stringify(response, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'character.json';
        a.click();

        URL.revokeObjectURL(url);
      },
      error: (error) => {
      }
    });
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

  loadCharacterToView() {
    this.isLoadingDecision = true;

    this.characterSheetsService.getSheetbyId(this.character.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.characterResponse = response;
            this.characterResponse.skills = this.characterResponse.skills.filter(f => f.bonus > 0)
          }
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao buscar personagem:', error);
          this.isLoadingDecision = false;
        }
      });
  }

  setRace(race: string): void {
    if (this.character.race !== '') return;
    
    this.character.race = race;
    this.isLoadingDecision = true;

    this.characterCreationService.sendRace(this.character.id, race)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao adicionar raça:', error);
          this.isLoadingDecision = false;
        }
      });
  }

  setBackground(bg: string): void {
    if (this.character.background !== '') return;
    
    this.character.background = bg;
    this.isLoadingDecision = true;

    this.characterCreationService.sendBackground(this.character.id, bg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao adicionar background:', error);
          this.isLoadingDecision = false;
        }
      });
  }

  setClass(classe: string): void {
    const existingClass = this.character.classes.find(c => c.class == classe);
    let classLevel = 0;
    if (existingClass == null) {
      classLevel = this.character.classes.length > 0 ? 1 : 0;
      const newClass: ClassLevel = {class: classe, level: classLevel};
      this.character.classes.push(newClass);
    }
    else {
      existingClass.level++;
      classLevel = existingClass.level;
    }

    this.character.totalLevel++;

    this.isLoadingDecision = true;

    this.characterCreationService.sendClass(this.character.id, classe, classLevel)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao adicionar classe:', error);
          this.isLoadingDecision = false;
        }
      });
  }

  loadClassLevelOne(classe: string) {
    const existingClass = this.character.classes.find(c => c.class == classe);
    if (existingClass) {
      existingClass.level = 1;
    }
    else throw Error('Error while updating class level (level 1)');

    setTimeout(() => this.isLoadingDecision = true);

    this.characterCreationService.sendClass(this.character.id, classe, 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao adicionar classe:', error);
          this.isLoadingDecision = false;
        }
      });
  }

  addNewLevel() {
    this.clearDecisions();
    this.showAddLevelButton = false;
  }

  isLoading(choiceIndex: number): boolean {
    return this.loading[choiceIndex] || false;
  }

  saveCharacter() {
    const ficha: CriarFichaRequest = {
      nome: this.character.name,
      atributos: {
          forca: this.character.attributes.STR,
          destreza: this.character.attributes.DEX,
          constituicao: this.character.attributes.CON,
          inteligencia: this.character.attributes.INT,
          sabedoria: this.character.attributes.WIS,
          carisma: this.character.attributes.CHA
      }
    }

    this.isLoadingDecision = true;
    
    this.characterCreationService.createCharacter(ficha)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      console.log('Ficha criada com sucesso:', response);
      this.isLoadingDecision = false;
      
      this.character.id = response.id;
    });
  }

  // Decisions

  addDecision(apiResponse: ApiResponse): void {
    if (apiResponse.required_decision && apiResponse.required_decision.label) {
      const decision: Decision = {
        label: apiResponse.required_decision.label,
        options: apiResponse.required_decision.options,
        n: apiResponse.required_decision.n,
        selectedOptions: [],
        isComplete: false
      };
      this.decisionsArray.push(decision);
    }
  }

  isDecisionOptionSelected(decisionIndex: number, option: string): boolean {
    if (!this.decisionsArray[decisionIndex]) return false;
    return this.decisionsArray[decisionIndex].selectedOptions.includes(option);
  }

  toggleDecisionOption(decisionIndex: number, option: string): void {
    const decision = this.decisionsArray[decisionIndex];
    if (!decision) return;

    const optionIndex = decision.selectedOptions.indexOf(option);

    if (optionIndex > -1) {
      // Remove a opção
      decision.selectedOptions.splice(optionIndex, 1);
      decision.isComplete = false;
    } else {
      // Adiciona a opção
      if (decision.selectedOptions.length < decision.n) {
        decision.selectedOptions.push(option);
        
        if (decision.selectedOptions.length === decision.n) {
          decision.isComplete = true;
          this.submitDecisionAndLoadNext(decisionIndex);
        }

      } else if (decision.n === 1) {
        decision.selectedOptions = [option];
        decision.isComplete = true;
        this.submitDecisionAndLoadNext(decisionIndex);
      }
    }
  }

  // Envia a decisão e carrega a próxima se necessário
  submitDecisionAndLoadNext(decisionIndex: number): void {
    const decision = this.decisionsArray[decisionIndex];
    if (!decision.isComplete) return;

    this.isLoadingDecision = true;

    const payload = {
      decision: decision.selectedOptions.length == 1 ? decision.selectedOptions[0] : decision.selectedOptions
    };

    this.characterCreationService.getNextChoices(this.character.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);

          // Se houver uma nova decisão, adiciona ao array
          if (response && response.required_decision && response.required_decision.label) {
            this.addDecision(response);
            this.currentDecisionIndex = this.decisionsArray.length - 1;
          } else {
            if (this.step === 5 && this.character.classes.length == 1 && this.character.classes[0].level == 0) {
              this.loadClassLevelOne(this.character.classes[0].class);
            }
            if (this.step === 5) {
              this.showAddLevelButton = true;
            }
            console.log('Todas as decisões foram completadas!');
          }
          
          this.isLoadingDecision = false;
        },
        error: (error) => {
          console.error('Erro ao enviar decisão:', error);
          alert('Erro ao processar sua escolha. Tente novamente.');
          
          // Reverte a decisão em caso de erro
          decision.isComplete = false;
          decision.selectedOptions = [];
          
          this.isLoadingDecision = false;
        }
      });
  }

  // Verifica se a decisão está completa
  isDecisionComplete(decisionIndex: number): boolean {
    const decision = this.decisionsArray[decisionIndex];
    return decision ? decision.isComplete : false;
  }

  // Conta quantas opções foram selecionadas
  getSelectedCount(decisionIndex: number): number {
    const decision = this.decisionsArray[decisionIndex];
    return decision ? decision.selectedOptions.length : 0;
  }

  // Limpa o array de decisões (ao mudar de step)
  clearDecisions(): void {
    this.decisionsArray = [];
    this.currentDecisionIndex = 0;
  }

  // Obtém resumo das decisões para exibir
  getDecisionsSummary(): string[] {
    return this.decisionsArray.map(d => 
      `${d.label}: ${d.selectedOptions.join(', ')}`
    );
  }

  findClassNextLevel(classe: string) {
    const existingClass = this.character.classes.find(c => c.class == classe);
    return existingClass ? existingClass.level + 1 : 1;
  }
  
}