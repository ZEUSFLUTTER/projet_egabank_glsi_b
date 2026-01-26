import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  // AUTH (PUBLIC)
  ...AUTH_ROUTES,

  // CLIENT (PROTÉGÉ)
  {
    path: 'client',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CLIENT'] },
    loadChildren: () => import('./features/client/client.routes').then((m) => m.CLIENT_ROUTES),
  },

  // AGENT (PROTÉGÉ)
  {
    path: 'agent',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['AGENT'] },
    loadChildren: () => import('./features/agent/agent.routes').then((m) => m.AGENT_ROUTES),
  },

  // ADMIN (PROTÉGÉ)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // REDIRECTIONS
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
