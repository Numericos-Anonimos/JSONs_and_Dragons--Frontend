import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-screen/login-screen.component';
import { CharacterCreationComponent } from './pages/character-creation/character-creation.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login-screen', pathMatch: 'full' },
  { 
    path: 'login-screen', 
    component: LoginComponent,
  },
  { 
    path: 'character-creation', 
    component: CharacterCreationComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login-screen' }
];
