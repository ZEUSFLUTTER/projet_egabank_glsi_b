import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../core/layout/main-layout/main-layout';
import { ClientDashboardPage } from './pages/dashboard/dashboard';
import { ClientAccountsPage } from './pages/accounts/accounts';
import { ClientTransactionsPage } from './pages/transactions/transactions';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: ClientDashboardPage,
      },
      {
        path: 'accounts',
        component: ClientAccountsPage,
      },
      {
        path: 'transactions',
        component: ClientTransactionsPage,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];