import { Routes } from '@angular/router';
import { gardeAuthentification } from './coeur/garde-authentification.guard';

import { ConnexionComponent } from './pages/connexion/connexion.component';
import { LayoutAppComponent } from './layouts/layout-app/layout-app.component';

import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ComptesComponent } from './pages/comptes/comptes.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { RelevesComponent } from './pages/releves/releves.component';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  {
    path: 'connexion',
    component: ConnexionComponent,
  },

  {
    path: 'application',
    component: LayoutAppComponent,
    canActivate: [gardeAuthentification],
    canActivateChild: [gardeAuthentification],
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'comptes', component: ComptesComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'releves', component: RelevesComponent },
    ],
  },

  { path: '**', redirectTo: 'connexion' },
];
