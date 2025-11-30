import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CharacterSheetComponent } from './shared/components/sheets/character-sheet/character-sheet.component';
import { MonsterSheetComponent } from './shared/components/sheets/monster-sheet/monster-sheet.component';
import { Monster } from './shared/components/sheets/monster-sheet/monster-sheet.component';
import { Character } from './shared/components/sheets/character-sheet/character-sheet.component';
import { NotificationComponent } from "./shared/components/notification/notification.component";
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { AuthService } from './shared/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login-screen']);
  }

  get isLoginPage(): boolean {
    return !this.auth.isLoggedIn();
  }

  
  
  title = 'jsons-and-dragons';

}
