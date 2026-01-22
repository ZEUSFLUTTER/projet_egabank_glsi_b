import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { Depot } from './depot/depot/depot';
import { Layout } from './layout/layout';
import { authGuard, adminGuard } from './core/guards/auth-guard';
import { Virement } from './virement/virement/virement';
import { Retrait } from './retrait/retrait/retrait';
import { Transaction } from './transaction/transaction/transaction';
import { ParametreComponent } from './parametre/parametre';
import { Compte } from './compte/compte/compte';
import { ProfilComponent } from './profil/profil';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Diagnostic (sans authentification pour debug)
  { path: 'diagnostic', component: DiagnosticComponent },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Layout protégé pour CLIENT avec routes enfants
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'comptes', component: Compte },
      { path: 'depot', component: Depot },
      { path: 'retrait', component: Retrait },
      { path: 'virement', component: Virement },
      { path: 'historique', component: Transaction },
      { path: 'parametres', component: ParametreComponent },
      { path: 'profil', component: ProfilComponent },
    ]
  },

  // Routes ADMIN (sera créé plus tard)
  {
    path: 'admin',
    component: Layout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard }, // Dashboard admin sera différent
      { path: 'clients', component: Compte }, // Liste des clients
      { path: 'transactions', component: Transaction }, // Toutes les transactions
    ]
  },

  // Wildcard pour page 404
  { path: '**', redirectTo: 'login' },
];
