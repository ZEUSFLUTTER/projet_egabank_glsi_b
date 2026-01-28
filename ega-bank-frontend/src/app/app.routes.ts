import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models/models';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'welcome',
    loadComponent: () => import('./components/shared/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: Role.ADMIN },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./components/admin/clients-list/clients-list.component').then(m => m.ClientsListComponent)
      },
      {
        path: 'clients/new',
        loadComponent: () => import('./components/admin/client-form/client-form.component').then(m => m.ClientFormComponent)
      },
      {
        path: 'clients/:id',
        loadComponent: () => import('./components/admin/client-detail/client-detail.component').then(m => m.ClientDetailComponent)
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () => import('./components/admin/client-form/client-form.component').then(m => m.ClientFormComponent)
      },
      {
        path: 'clients/:id/create-compte',
        loadComponent: () => import('./components/admin/create-compte/create-compte.component').then(m => m.CreateCompteComponent)
      },
      {
        path: 'clients/:id/historique',
        loadComponent: () => import('./components/admin/client-historique/client-historique.component').then(m => m.ClientHistoriqueComponent)
      },
      {
        path: 'clients/:id/operations',
        loadComponent: () => import('./components/admin/admin-operations/admin-operations.component').then(m => m.AdminOperationsComponent)
      },
      {
        path: 'comptes',
        loadComponent: () => import('./components/admin/comptes-list/comptes-list.component').then(m => m.ComptesListComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/admin/admin-register/admin-register.component').then(m => m.AdminRegisterComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [AuthGuard],
    data: { role: Role.CLIENT },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/client/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent)
      },
      {
        path: 'comptes',
        loadComponent: () => import('./components/client/mes-comptes/mes-comptes.component').then(m => m.MesComptesComponent)
      },
      {
        path: 'comptes/new',
        loadComponent: () => import('./components/client/compte-form/compte-form.component').then(m => m.CompteFormComponent)
      },
      {
        path: 'comptes/:numero',
        loadComponent: () => import('./components/client/compte-detail/compte-detail.component').then(m => m.CompteDetailComponent)
      },
      {
        path: 'operations',
        loadComponent: () => import('./components/client/operations/operations.component').then(m => m.OperationsComponent)
      },
      {
        path: 'historique',
        loadComponent: () => import('./components/client/historique/historique.component').then(m => m.HistoriqueComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: '/welcome' }
];
