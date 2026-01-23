import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { RoleType } from './shared/models/user.model';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN] }
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.CAISSIERE] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
