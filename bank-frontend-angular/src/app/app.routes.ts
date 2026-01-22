import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/new',
    loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id/edit',
    loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id',
    loadComponent: () => import('./features/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'comptes',
    loadComponent: () => import('./features/comptes/compte-list/compte-list.component').then(m => m.CompteListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'comptes/new',
    loadComponent: () => import('./features/comptes/compte-form/compte-form.component').then(m => m.CompteFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'comptes/:id/edit',
    loadComponent: () => import('./features/comptes/compte-form/compte-form.component').then(m => m.CompteFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions/new',
    loadComponent: () => import('./features/transactions/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
    canActivate: [AuthGuard]
  },
  // Nouvelles routes conformes au cahier des charges
  {
    path: 'operations',
    loadComponent: () => import('./features/operations/operations.component').then(m => m.OperationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'releve',
    loadComponent: () => import('./features/releve/releve.component').then(m => m.ReleveComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];