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
import { HomeBrewService } from '../../shared/services/homebrew-service';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-homebrew-creation',
  imports: [CommonModule, FormsModule, LoadingOverlayComponent],
  templateUrl: './homebrew-creation.component.html',
  styleUrl: './homebrew-creation.component.less'
})
export class HomebrewCreationComponent {

  constructor(
    private route: ActivatedRoute,
    private homebrewService:HomeBrewService,
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
  selectedFile: File | null = null;
  uploading: boolean = false;
  message: string = ''

  ngOnInit() {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Validação
      if (!this.selectedFile.name.endsWith('.zip')) {
        this.message = 'Por favor, selecione um arquivo ZIP';
        this.selectedFile = null;
      }
    }
  }

  uploadHomebrew(): void {
    if (!this.selectedFile || !this.homebrewName) {
      return;
    }

    this.uploading = true;
    this.message = '';

    this.homebrewService.uploadHomebrew(this.homebrewName, this.selectedFile)
    .subscribe({
      next: (response) => {
        this.message = response.message;
        this.uploading = false;
        this.homebrewName = '';
        this.selectedFile = null;
      },
      error: (error) => {
        this.message = `Erro: ${error.error?.detail || 'Erro ao fazer upload'}`;
        this.uploading = false;
      }
    });
  }

}