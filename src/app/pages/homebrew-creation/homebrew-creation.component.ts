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
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-homebrew-creation',
  imports: [CommonModule, CharacterSheetComponent, FormsModule],
  templateUrl: './homebrew-creation.component.html',
  styleUrl: './homebrew-creation.component.less'
})
export class HomebrewCreationComponent {

  constructor(
    private route: ActivatedRoute,
    private characterCreationService: CharacterCreationService,
    private baseDataService: BaseDataService,
    private http: HttpClient
  ) {}

  private destroyRef = inject(DestroyRef);
  selections: { [key: number]: number[] } = {};
  activeChoices = new Set<number>([0]);
  loadedOptions: { [key: number]: string[] } = {};
  loading: { [key: number]: boolean } = {};

  step: number = 1;
  totalSteps: number = 8;

  character: Character = this.initializeCharacter();

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
      classes: [],
      totalLevel: 1,
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

  nextStep(): void {
    if (this.canProceed()) {
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  // Lógica de validação baseada no character-creation.component.ts
  canProceed(): boolean {
    switch (this.step) {
      case 1: return this.character.name.trim().length > 0;
      // Adicione aqui a lógica de validação para as próximas etapas (ex: case 2: ...)
      default: return true;
    }
  }

  onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      console.log(files);
      // upload filessssss
    }
  }

  // Lógica de reinício baseada no character-creation.component.ts
  resetHomebrew() {
    if (confirm('Tem certeza de que deseja recomeçar? Todo o progresso será perdido.')) {
      this.character = this.initializeCharacter();
      this.step = 1;
    }
  }

}