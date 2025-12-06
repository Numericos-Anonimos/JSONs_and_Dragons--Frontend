import { Component, HostListener, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterSheetComponent } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { Character } from '../../shared/models/character.model';
import { CharacterResponse } from '../../shared/models/character-response.model';
import { CharacterSheetsService } from '../../shared/services/character-sheets-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SimpleCharacterResponse } from '../../shared/models/simple-character-response.model';
import { SheetModalComponent } from '../../shared/components/sheet-modal/sheet-modal.component';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

// interface Character {
//   id: number;
//   name: string;
//   class: string;
//   race: string;
//   level: number;
//   avatar: string;
// }

@Component({
  selector: 'app-manage-sheets',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterSheetComponent, LoadingOverlayComponent, SheetModalComponent],
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

  @HostListener('document:mousemove', ['$event'])
onMouseMove(event: MouseEvent) {
  if (this.onHover) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // ---- HORIZONTAL: 3 ZONAS (LEFT, MIDDLE, RIGHT) --------------------
    const centerZoneStartX = screenWidth * 0.375; 
    const centerZoneEndX   = screenWidth * 0.625;

    let targetOffsetX: number;

    if (mouseX < centerZoneStartX) {
      targetOffsetX = 15;                    // esquerda
    } 
    else if (mouseX > centerZoneEndX) {
      targetOffsetX = -715;                  // direita
    } 
    else {
      targetOffsetX = -350;                  // meio horizontal
    }

    // ---- VERTICAL: 3 ZONAS (TOP, MIDDLE, BOTTOM) ----------------------
    const centerZoneStartY = screenHeight * 0.375; 
    const centerZoneEndY   = screenHeight * 0.625;

    let targetOffsetY: number;

    if (mouseY < centerZoneStartY) {
      targetOffsetY = 15;                    // topo
    } 
    else if (mouseY > centerZoneEndY) {
      targetOffsetY = -400;                  // baixo
    } 
    else {
      targetOffsetY = -180;                  // meio vertical
      // Ajuste conforme o tamanho do seu tooltip
    }

    // ---- SUAVIZAÇÃO ---------------------------------------------------
    this.smoothOffsetX = this.lerp(this.smoothOffsetX, targetOffsetX, 0.15);
    this.smoothOffsetY = this.lerp(this.smoothOffsetY, targetOffsetY, 0.15);

    // ---- APLICA POSIÇÃO FINAL -----------------------------------------
    this.tooltipX = mouseX + this.smoothOffsetX;
    this.tooltipY = mouseY + this.smoothOffsetY;

    this.cdr.detectChanges();
  }
}



private lerp(start: number, end: number, smoothing: number = 0.15): number {
  return start + (end - start) * smoothing;
}


  showTooltip(character: any) {
    this.hoverCharacter = character;
    this.onHover = true;
  }

  hideTooltip() {
    this.onHover = false;
  }

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