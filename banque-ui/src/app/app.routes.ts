import { Routes } from '@angular/router';
import { CompteGestionComponent } from './components/compte-gestion/compte-gestion.component';
import { Login } from './components/login/login';
import { ClientList } from './components/client-list/client-list';
import { ClientDetails } from './components/client-details/client-details';
import { ClientForm } from './components/client-form/client-form';
import { ClientModifier } from './components/client-modifier/client-modifier';
import { DashboardComponent } from './components/dashboard/dashboard'; // Importation maintenue

export const routes: Routes = [
  // Page d'authentification
  { path: 'login', component: Login },

  // Page d'accueil après connexion (Option dans la sidebar)
  { path: 'dashboard', component: DashboardComponent },

  // Autres fonctionnalités
  { path: 'gestion', component: CompteGestionComponent },
  { path: 'clients', component: ClientList },
  { path: 'client-details/:id', component: ClientDetails },
  { path: 'nouveau-client', component: ClientForm },
  { path: 'modifier-client/:id', component: ClientModifier },

  // --- LOGIQUE DE REDIRECTION ---

  // Au lancement (URL vide), on va vers le LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Si l'utilisateur tape n'importe quoi d'autre, on le renvoie au LOGIN
  { path: '**', redirectTo: 'login' }
];
