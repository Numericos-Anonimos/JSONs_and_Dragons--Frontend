import { Component, Input, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, FormsModule],
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

  homebrewName: string = "";

  ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');

    //   if (id) {
    //     this.loadCharacterById(id);
    //   }
    // });
  }

  nextStep(): void {
    if (this.canProceed()) {
      this.step++;
    }
  }

  // Lógica de validação baseada no character-creation.component.ts
  canProceed(): boolean {
    return true;
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