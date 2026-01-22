import { Routes } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { AdminClientsComponent } from './components/admin-clients.component';
import { HomeComponent } from './components/home.component';
import { AccountsComponent } from './components/accounts.component';
import { TransactionsComponent } from './components/transactions.component';
import { ProfileComponent } from './components/profile.component';
import { CompleteProfileComponent } from './components/complete-profile.component';
import { LayoutComponent } from './components/layout.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Auth required
  {
    path: 'complete-profile',
    component: CompleteProfileComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Admin
      {
        path: 'admin-clients',
        component: AdminClientsComponent,
        canActivate: [AdminGuard]
      },

      {
        path: 'client-details/:id',
        canActivate: [AdminGuard],
        loadComponent: () =>
          import('./components/client-details.component')
            .then(m => m.ClientDetailsComponent)
      },

      // Comptes
      { path: 'accounts', component: AccountsComponent },

      {
        path: 'account-details/:id',
        loadComponent: () =>
          import('./components/account-details.component')
            .then(m => m.AccountDetailsComponent)
      },

      // Autres
      { path: 'transactions', component: TransactionsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'home', component: HomeComponent }
    ]
  },

  { path: '**', redirectTo: '/dashboard' }
];
