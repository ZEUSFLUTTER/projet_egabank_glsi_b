import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ComptesComponent } from './pages/comptes/comptes.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'comptes', component: ComptesComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },

  // Route par défaut
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Sécurité : toute autre route → login
  { path: '**', redirectTo: 'login' }
];
