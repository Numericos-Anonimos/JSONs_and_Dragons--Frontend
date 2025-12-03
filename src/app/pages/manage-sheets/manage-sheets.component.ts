import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterSheetComponent } from '../../shared/components/sheets/character-sheet/character-sheet.component';
import { Character } from '../../shared/components/sheets/character-sheet/character-sheet.component';

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
  imports: [CommonModule, FormsModule, CharacterSheetComponent],
  templateUrl: './manage-sheets.component.html',
  styleUrl: './manage-sheets.component.less'
})
export class ManageSheetsComponent {
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  searchTerm: string = '';

  onHover = false;
  hoverCharacter: Character | null = null;

  tooltipX = 0;
  tooltipY = 0;
  smoothOffsetX = 15;
  smoothOffsetY = 15;


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.characters = [
      {
        id: '1',
        name: "Thorin Martelo de Pedra",
        race: "Anão",
        classes: [
          { class: "Guerreiro", subclass: "Campeão", level: 12 }
        ],
        totalLevel: 12,
        background: "Soldado",
        alignment: "Leal e Bom",
        experience: 85000,
        avatar: "bi-shield-fill-check",

        attributes: {
          STR: 18, DEX: 12, CON: 18,
          INT: 10, WIS: 13, CHA: 11
        },

        savingThrows: {
          STR: true, DEX: false, CON: true,
          INT: false, WIS: false, CHA: false
        },

        skills: [
          "Athletics",
          "Insight",
          "Intimidation",
          "Perception",
          "Survival"
        ],

        armorClass: 19,
        initiative: 1,
        speed: "7.5m",
        hitPoints: { current: 85, max: 85, temporary: 0 },
        hitDice: "12d10",
        attacks: [
          { name: "Martelo de Guerra", bonus: "+8", damage: "1d10 + 4" },
          { name: "Ataque Extra", bonus: "+8", damage: "1d10 + 4" }
        ],

        equipment: ["Armadura de Placas", "Escudo", "Martelo de Guerra"],
        features: ["Ataque Extra", "Surto de Ação", "Indomável"],
        spells: [],
        notes: "Veterano da infantaria anã."
      },

      {
        id: '2',
        name: "Elara Vento Prateado",
        race: "Elfo",
        classes: [
          { class: "Mago", subclass: "Evocadora", level: 10 }
        ],
        totalLevel: 10,
        background: "Sábia",
        alignment: "Neutra e Boa",
        experience: 48000,
        avatar: "bi-stars",

        attributes: {
          STR: 8, DEX: 14, CON: 12,
          INT: 18, WIS: 13, CHA: 10
        },

        savingThrows: {
          STR: false, DEX: false, CON: false,
          INT: true, WIS: true, CHA: false
        },

        skills: [
          "Arcana",
          "History",
          "Insight",
          "Investigation",
          "Perception",
          "Religion"
        ],

        armorClass: 14,
        initiative: 2,
        speed: "9m",
        hitPoints: { current: 52, max: 52, temporary: 5 },
        hitDice: "10d6",
        attacks: [
          { name: "Raio de Gelo", bonus: "+7", damage: "1d8 frio" }
        ],

        equipment: ["Cajado Arcano", "Livro de Magias", "Manto Azul"],
        features: ["Tradição Arcana: Evocação"],
        spells: ["Bola de Fogo", "Mísseis Mágicos", "Escudo Arcano", "Nevoeiro"],
        notes: "Estuda fenômenos arcanos antigos."
      },

      {
        id: '3',
        name: "Kael Sombra Noturna",
        race: "Meio-Elfo",
        classes: [
          { class: "Ladino", subclass: "Assassino", level: 8 }
        ],
        totalLevel: 8,
        background: "Criminoso",
        alignment: "Caótico Neutro",
        experience: 24000,
        avatar: "bi-moon-stars-fill",

        attributes: {
          STR: 10, DEX: 18, CON: 12,
          INT: 14, WIS: 12, CHA: 14
        },

        savingThrows: {
          STR: false, DEX: true, CON: false,
          INT: false, WIS: false, CHA: true
        },

        skills: [
          "Acrobatics",
          "Deception",
          "Investigation",
          "Perception",
          "Persuasion",
          "SleightOfHand",
          "Stealth"
        ],

        armorClass: 15,
        initiative: 4,
        speed: "9m",
        hitPoints: { current: 48, max: 48, temporary: 0 },
        hitDice: "8d8",
        attacks: [
          { name: "Adaga", bonus: "+7", damage: "1d4 + 4" },
          { name: "Ataque Furtivo", bonus: "+7", damage: "4d6" }
        ],

        equipment: ["Adagas", "Capa Escura", "Ferramentas de Ladrão"],
        features: ["Ataque Furtivo", "Evasão"],
        spells: [],
        notes: "Especialista em infiltração."
      },

      {
        id: '4',
        name: "Aria Coração Valente",
        race: "Humano",
        classes: [
          { class: "Paladino", subclass: "Juramento da Devoção", level: 11 }
        ],
        totalLevel: 11,
        background: "Herói do Povo",
        alignment: "Leal e Bom",
        experience: 65000,
        avatar: "bi-brightness-high-fill",

        attributes: {
          STR: 18, DEX: 12, CON: 16,
          INT: 10, WIS: 14, CHA: 18
        },

        savingThrows: {
          STR: true, DEX: false, CON: true,
          INT: false, WIS: false, CHA: true
        },

        skills: [
          "Athletics",
          "Insight",
          "Medicine",
          "Perception",
          "Persuasion",
          "Religion"
        ],

        armorClass: 20,
        initiative: 1,
        speed: "9m",
        hitPoints: { current: 97, max: 97, temporary: 5 },
        hitDice: "11d10",
        attacks: [
          { name: "Espada Longa", bonus: "+8", damage: "1d8 + 4" },
          { name: "Golpe Divino", bonus: "+8", damage: "2d8 radiante" }
        ],

        equipment: ["Espada Longa", "Escudo Sagrado", "Armadura Completa"],
        features: ["Impor as Mãos", "Aura de Proteção"],
        spells: ["Cura pelas Mãos", "Escudo da Fé", "Comando"],
        notes: "Guerreira devota da luz."
      },

      {
        id: '5',
        name: "Grimm Pata Selvagem",
        race: "Meio-Orc",
        classes: [
          { class: "Druida", subclass: "Círculo da Lua", level: 9 }
        ],
        totalLevel: 9,
        background: "Eremita",
        alignment: "Neutro",
        experience: 34000,
        avatar: "bi-tree-fill",

        attributes: {
          STR: 14, DEX: 12, CON: 16,
          INT: 11, WIS: 18, CHA: 10
        },

        savingThrows: {
          STR: false, DEX: false, CON: false,
          INT: false, WIS: true, CHA: false
        },

        skills: [
          "Athletics",
          "Insight",
          "Medicine",
          "Nature",
          "Perception",
          "Survival"
        ],

        armorClass: 14,
        initiative: 1,
        speed: "9m",
        hitPoints: { current: 64, max: 64, temporary: 0 },
        hitDice: "9d8",
        attacks: [
          { name: "Cajado de Carvalho", bonus: "+6", damage: "1d6 + 3" }
        ],

        equipment: ["Cajado Druídico", "Ervas", "Pele de Animal"],
        features: ["Forma Selvagem Aprimorada"],
        spells: ["Forma Selvagem", "Chama Sagrada", "Encontrar Familiar"],
        notes: "Protetor das florestas sombrias."
      },

      {
        id: '6',
        name: "Luna Melodia Arcana",
        race: "Halfling",
        classes: [
          { class: "Bardo", subclass: "Colégio da Sabedoria", level: 7 }
        ],
        totalLevel: 7,
        background: "Artista",
        alignment: "Caótica Boa",
        experience: 18000,
        avatar: "bi-music-note-beamed",

        attributes: {
          STR: 8, DEX: 16, CON: 12,
          INT: 12, WIS: 10, CHA: 18
        },

        savingThrows: {
          STR: false, DEX: true, CON: false,
          INT: false, WIS: false, CHA: true
        },

        skills: [
          "Deception",
          "History",
          "Insight",
          "Perception",
          "Performance",
          "Persuasion",
          "Stealth"
        ],

        armorClass: 15,
        initiative: 3,
        speed: "7.5m",
        hitPoints: { current: 39, max: 39, temporary: 4 },
        hitDice: "7d8",
        attacks: [
          { name: "Adaga", bonus: "+6", damage: "1d4 + 3" }
        ],

        equipment: ["Alaúde", "Adaga", "Cartas de Atuação"],
        features: ["Inspiração Bárdica", "Canção de Descanso"],
        spells: ["Sussurros Dissonantes", "Cura", "Ilusão Menor"],
        notes: "Carismática e sempre cantando."
      }
    ];

    this.filteredCharacters = this.characters;
  }

  filterCharacters(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredCharacters = this.characters.filter(char =>
      char.name.toLowerCase().includes(term) ||
      char.race.toLowerCase().includes(term) ||

      // check class names
      char.classes.some(c => c.class.toLowerCase().includes(term)) ||

      // check subclass names (optional fields)
      char.classes.some(c => c.subclass?.toLowerCase().includes(term))
    );
  }

  editCharacter(id: string): void {
    this.router.navigate(['/character-creation', id]);
  }

  createNewCharacter(): void {
    this.router.navigate(['/character-creation']);
  }
}