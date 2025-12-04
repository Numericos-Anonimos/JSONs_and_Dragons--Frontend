import { Component, Input, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character, SavingThrows, Attributes } from '../../shared/models/character.model';
import { Monster } from '../../shared/components/sheets/monster-sheet/monster-sheet.component';
import { CharacterSheetComponent } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { MonsterSheetComponent } from '../../shared/components/sheets/monster-sheet/monster-sheet.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
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
    private characterSheetsService: CharacterSheetsService,
    private baseDataService: BaseDataService,
    private http: HttpClient
  ) {}

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

  character: Character = this.initializeCharacter();

  characterResponse: CharacterResponse | null = null;

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

  ngOnDestroy(): void {
    document.body.classList.remove('loading-active');
  }

  // Função para controlar o loading
  private setLoading(loading: boolean): void {
    this.isLoadingDecision = loading;
    
    if (loading) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }
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

  // selectClass(className: any): void {
  //   this.character.class = className;
  //   const classInfo = this.classes[className];
    
  //   // Reset skills
  //   Object.keys(this.character.skills).forEach(skill => {
  //     this.character.skills = [];
  //   });
    
  //   // Set saving throws
  //   // Object.keys(this.character.savingThrows).forEach(ability => {
  //   //   this.character.savingThrows[ability as keyof SavingThrows] = 
  //   //     classInfo.savingThrows.includes(ability);
  //   // });
    
  //   // Set equipment
  //   // this.character.equipment = [...classInfo.equipment];
    
  //   this.updateDerivedStats();
  // }

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
      case 6: return this.character.background !== undefined && this.character.background.length > 0;
      case 7: return this.character.alignment !== undefined && this.character.alignment.length > 0;
      case 8: return true;
      default: return true;
    }
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

  loadCharacterToView() {
    this.setLoading(true);

    this.characterSheetsService.getSheetbyId(this.character.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.characterResponse = response;
          }
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao buscar personagem:', error);
          this.setLoading(false);
        }
      });
  }

  // oldSetRace(race: any) {
  //   this.character.race = race;
  //   // this.selectedSubrace = ''; <--- Não precisamos mais limpar isso manualmente aqui

  //   // Chama o endpoint do Python: POST /ficha/{id}/raca/{race}
  //   // Nota: Precisamos do ID do personagem (salvo no passo anterior)
  //   this.characterCreationService.sendRace(this.character.id, race)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe(response => {

  //     });
  // }

  // oldSetBackground(background: any) {
  //   this.character.background = background;
  //   this.characterCreationService.sendBackground(this.character.id, background)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe(response => {

  //     });
  // }

  setRace(race: string): void {
    if (this.character.race !== '') return;
    
    this.character.race = race;
    this.setLoading(true);

    this.characterCreationService.sendRace(this.character.id, race)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao adicionar raça:', error);
          this.setLoading(false);
        }
      });
  }

  setBackground(bg: string): void {
    if (this.character.background !== '') return;
    
    this.character.background = bg;
    this.setLoading(true);

    this.characterCreationService.sendBackground(this.character.id, bg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao adicionar background:', error);
          this.setLoading(false);
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

    this.setLoading(true);

    this.characterCreationService.sendClass(this.character.id, classe, classLevel)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao adicionar classe:', error);
          this.setLoading(false);
        }
      });
  }

  loadClassLevelOne(classe: string) {
    const existingClass = this.character.classes.find(c => c.class == classe);
    if (existingClass) {
      existingClass.level = 1;
    }
    else throw Error('Error while updating class level (level 1)');

    this.setLoading(true);

    this.characterCreationService.sendClass(this.character.id, classe, 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addDecision(response);
          }
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Erro ao adicionar classe:', error);
          this.setLoading(false);
        }
      });
  }

  addNewLevel() {
    this.clearDecisions();
    this.showAddLevelButton = false;
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

    this.setLoading(true);
    
    this.characterCreationService.createCharacter(ficha)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => {
      console.log('Ficha criada com sucesso:', response);
      this.setLoading(false);
      
      this.character.id = response.id;
    });
  }


  //DECISIONS SECTION

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

  // Verifica se uma opção está selecionada
  isDecisionOptionSelected(decisionIndex: number, option: string): boolean {
    if (!this.decisionsArray[decisionIndex]) return false;
    return this.decisionsArray[decisionIndex].selectedOptions.includes(option);
  }

  // Seleciona/deseleciona uma opção
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
        
        // Marca como completa se atingiu o número necessário
        if (decision.selectedOptions.length === decision.n) {
          decision.isComplete = true;
          // Faz a chamada automática para o backend
          this.submitDecisionAndLoadNext(decisionIndex);
        }
      } else if (decision.n === 1) {
        // Se só pode escolher 1, substitui a seleção anterior
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

  this.setLoading(true);

  const payload = {
    // character_id: this.character.id,
    // decision: decision.label,
    // selected_options: decision.selectedOptions.length == 1 ? decision.selectedOptions[0] : decision.selectedOptions
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
        
        this.setLoading(false);
      },
      error: (error) => {
        console.error('Erro ao enviar decisão:', error);
        alert('Erro ao processar sua escolha. Tente novamente.');
        
        // Reverte a decisão em caso de erro
        decision.isComplete = false;
        decision.selectedOptions = [];
        
        this.setLoading(false);
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


interface ClassInfo {
  skills: string[];
  count: number;
  hitDice: string;
  savingThrows: string[];
  equipment: string[];
}