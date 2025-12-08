import { Component, HostListener, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterResponse } from '../../shared/models/character-response.model';
import { CharacterSheetsService } from '../../shared/services/character-sheets-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SimpleCharacterResponse } from '../../shared/models/simple-character-response.model';
import { SheetModalComponent } from '../../shared/components/sheet-modal/sheet-modal.component';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-manage-sheets',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingOverlayComponent, SheetModalComponent],
  templateUrl: './manage-sheets.component.html',
  styleUrl: './manage-sheets.component.less'
})
export class ManageSheetsComponent {
  characters: SimpleCharacterResponse[] = [];
  filteredCharacters: SimpleCharacterResponse[] = [];
  searchTerm: string = '';

  onHover = false;
  hoverCharacter: CharacterResponse | null = null;

  selectedCharacter: CharacterResponse | null = null;
  showModal: boolean = false;

  tooltipX = 0;
  tooltipY = 0;
  smoothOffsetX = 15;
  smoothOffsetY = 15;

  isLoading: boolean = true;
  isLoadingCharacter: boolean = false;


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private characterSheetsService: CharacterSheetsService
  ) {}

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading = true;
    this.characterSheetsService.getAllSheets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.characters = response;
            this.filteredCharacters = this.characters;
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Erro ao buscar personagem:', error);
          this.isLoading = false;
        }
      });
  }

filterCharacters(): void {
  const term = this.searchTerm.toLowerCase();

  this.filteredCharacters = this.characters.filter(char =>
    
    // HEADER
    char.name.toLowerCase().includes(term) ||
    Object.values(char.race).some(a => a.toLowerCase().includes(term)) ||
    char.class.keys.toLowerCase().includes(term) ||
    char.background.toLowerCase().includes(term)
  );
}


  viewCharacter(id: string): void {
    this.isLoadingCharacter = true;
    this.characterSheetsService.getSheetbyId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.selectedCharacter = response;
            
            this.selectedCharacter.skills.sort((a, b) => {
              const attrCompare = a.attribute.localeCompare(b.attribute);
              return attrCompare !== 0 ? attrCompare : a.name.localeCompare(b.name);
            });

            this.showModal = true;
            this.isLoadingCharacter = false;
          }
        },
        error: (error) => {
          console.error('Erro ao buscar personagem:', error);
          this.isLoadingCharacter = false;
        }
      });
  }

  createNewCharacter(): void {
    this.router.navigate(['/character-creation']);
  }

  closeModal(): void {
    this.showModal = false;
  }
}