import { Routes } from '@angular/router';
import { gardeAuthentificationGuard } from './coeur/garde-authentification.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },
  { 
    path: 'connexion', 
    loadComponent: () => import('./pages/connexion/connexion.component').then(m => m.ConnexionComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/layout-principal/layout-principal.component').then(m => m.LayoutPrincipalComponent),
    canActivate: [gardeAuthentificationGuard],
    children: [
      { 
        path: 'tableau-de-bord', 
        loadComponent: () => import('./pages/tableau-de-bord/tableau-de-bord.component').then(m => m.TableauDeBordComponent)
      },
      { 
        path: 'mes-comptes', 
        loadComponent: () => import('./pages/mes-comptes/mes-comptes.component').then(m => m.MesComptesComponent)
      },
      { 
        path: 'transactions', 
        loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      { 
        path: 'releves', 
        loadComponent: () => import('./pages/releves/releves.component').then(m => m.RelevesComponent)
      },
      { 
        path: 'profil', 
        loadComponent: () => import('./pages/profil/profil.component').then(m => m.ProfilComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/connexion' }
];
