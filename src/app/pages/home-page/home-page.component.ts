import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.less'
})
export class HomePageComponent {

  constructor(private router: Router) {}
  
  features = [
    {
      icon: 'bi bi-phone',
      title: 'Ficha Digital Mobile',
      description: 'Gerencie seu personagem em tempo real através do celular. Controle HP, recursos, magias e inventário com sincronização instantânea.'
    },
    {
      icon: 'bi bi-pencil-square',
      title: 'Motor de Homebrew',
      description: 'Crie itens, magias e monstros customizados através de templates. Suas criações são autocontidas e funcionam independentemente.'
    }
  ];

  team = [
    { name: 'João Victor Assaoka Ribeiro' },
    { name: 'Lucas Molinari' },
    { name: 'Thomas Pires Correia' }
  ];
  
  createNewCharacter(): void {
    this.router.navigate(['/character-creation']);
  }
}