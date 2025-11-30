import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-screen/login-screen.component';
import { CharacterCreationComponent } from './pages/character-creation/character-creation.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ManageSheetsComponent } from './pages/manage-sheets/manage-sheets.component';
import { HomebrewCreationComponent } from './pages/homebrew-creation/homebrew-creation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login-screen', pathMatch: 'full' },
  { 
    path: 'login-screen', 
    component: LoginComponent,
  },
  {
    path: 'login-success', 
    component: LoginComponent
  },
  { 
    path: 'character-creation', 
    component: CharacterCreationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'homebrew-creation', 
    component: HomebrewCreationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'manage-sheets', 
    component: ManageSheetsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'home', 
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login-screen' }
];
