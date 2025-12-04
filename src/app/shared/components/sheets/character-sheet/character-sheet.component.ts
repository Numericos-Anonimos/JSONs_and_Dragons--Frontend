import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterResponse, Header, AttributeDetail, Attributes, Attack, Skill, Combat, Equipment } from '../../../models/character-response.model';


@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.less'
})
export class CharacterSheetComponent {
  @Input() character!: CharacterResponse;
  @Input() isWide: boolean = false;
}