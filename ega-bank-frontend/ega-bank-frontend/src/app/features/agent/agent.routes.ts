import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../core/layout/main-layout/main-layout';
import { AgentDashboardPage } from './pages/dashboard/dashboard';
import { AgentClientsPage } from './pages/clients/clients';
import { AgentTransactionsPage } from './pages/transactions/transactions';

export const AGENT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AgentDashboardPage,
      },
      {
        path: 'clients',
        component: AgentClientsPage,
      },
      {
        path: 'transactions',
        component: AgentTransactionsPage,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];