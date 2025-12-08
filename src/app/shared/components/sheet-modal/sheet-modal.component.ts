import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CharacterResponse, Skill } from "../../models/character-response.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CharacterSheetComponent } from "../sheets/character-sheet/character-sheet.component";

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

  activeTab: string = 'sheet';

  closeModal() {
    this.closeModalEvent.emit();
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