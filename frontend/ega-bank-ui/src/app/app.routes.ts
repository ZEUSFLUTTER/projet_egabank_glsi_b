import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'clients',
        loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'clients/:id',
        loadComponent: () => import('./features/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/account-list/account-list.component').then(m => m.AccountListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'accounts/:numero',
        loadComponent: () => import('./features/accounts/account-detail/account-detail.component').then(m => m.AccountDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
