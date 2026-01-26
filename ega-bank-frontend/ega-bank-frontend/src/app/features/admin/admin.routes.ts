import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../core/layout/main-layout/main-layout';
import { AdminDashboardPage } from './pages/dashboard/dashboard';
import { AdminClientsPage } from './pages/clients/clients';
import { AdminComptesPage } from './pages/comptes/comptes';
import { AdminAgentsPage } from './pages/agents/agents';
import { AdminTransactionsPage } from './pages/transactions/transactions';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardPage,
      },
      {
        path: 'clients',
        component: AdminClientsPage,
      },
      {
        path: 'comptes',
        component: AdminComptesPage,
      },
      {
        path: 'agents',
        component: AdminAgentsPage,
      },
      {
        path: 'transactions',
        component: AdminTransactionsPage,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];