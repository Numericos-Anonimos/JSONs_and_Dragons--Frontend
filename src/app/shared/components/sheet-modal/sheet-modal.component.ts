import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CharacterResponse, Skill } from "../../models/character-response.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CharacterSheetComponent } from "../sheets/character-sheet/character-sheet.component";
import { CharacterCreationComponent } from "../../../pages/character-creation/character-creation.component";
import { CharacterSheetsService } from "../../services/character-sheets-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-sheet-modal',
  imports: [CommonModule, FormsModule, CharacterSheetComponent],
  templateUrl: './sheet-modal.component.html',
  styleUrls: ['./sheet-modal.component.less']
})
export class SheetModalComponent {
  @Input() character: CharacterResponse | null = null;
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  
  constructor(
    private characterSheetsService: CharacterSheetsService,
    private router: Router
  ) {}

  activeTab: string = 'sheet';

  closeModal() {
    this.closeModalEvent.emit();
  }

  downloadSheet() {
    this.characterSheetsService.exportSheet(this.character?.header.id!)
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

  levelUp() {
    this.closeModal();
    this.router.navigate(['/character-creation'], {
      state: { character: this.character }
    });
  }


  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getAttributeName(key: string): string {
    const names: { [key: string]: string } = {
      str: 'Força',
      dex: 'Destreza',
      con: 'Constituição',
      int: 'Inteligência',
      wis: 'Sabedoria',
      cha: 'Carisma'
    };
    return names[key] || key;
  }

  formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  getSkillsByAttribute(attr: string): Skill[] {
    return this.character?.skills.filter(s => s.attribute === attr) || [];
  }

  isProficient(skill: Skill): boolean {
    return skill.roll === 'D';
  }

  isExpertise(skill: Skill): boolean {
    return skill.roll === 'E';
  }
}