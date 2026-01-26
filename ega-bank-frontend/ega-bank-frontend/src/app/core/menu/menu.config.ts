import { MenuItem } from './menu.model';

export const MENU_CONFIG: MenuItem[] = [
  // ADMIN
  {
    id: 'admin-section',
    label: 'Administration',
    icon: 'administration',
    roles: ['ADMIN'],
    children: [
      {
        id: 'admin-dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/admin/dashboard',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-clients',
        label: 'Clients',
        icon: 'client',
        route: '/admin/clients',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-accounts',
        label: 'Comptes',
        icon: 'compte',
        route: '/admin/comptes',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-transactions',
        label: 'Transactions',
        icon: 'transaction',
        route: '/admin/transactions',
        roles: ['ADMIN'],
      },
      {
        id: 'admin-agents',
        label: 'Agents',
        icon: 'agent',
        route: '/admin/agents',
        roles: ['ADMIN'],
      },
    ],
  },

  // AGENT
  {
    id: 'agent-section',
    label: 'Opérations',
    icon: 'briefcase',
    roles: ['AGENT'],
    children: [
      {
        id: 'agent-dashboard',
        label: 'Dashboard',
        icon: 'layout-dashboard',
        route: '/agent/dashboard',
        roles: ['AGENT'],
      },
      {
        id: 'agent-clients',
        label: 'Clients',
        icon: 'users',
        route: '/agent/clients',
        roles: ['AGENT'],
      },
      {
        id: 'agent-accounts',
        label: 'Comptes',
        icon: 'wallet',
        route: '/agent/comptes',
        roles: ['AGENT'],
      },
      {
        id: 'agent-transactions',
        label: 'Transactions',
        icon: 'arrow-left-right',
        route: '/agent/transactions',
        roles: ['AGENT'],
      },
    ],
  },

  // CLIENT
  {
    id: 'client-section',
    label: 'Mon espace',
    icon: 'client',
    roles: ['CLIENT'],
    children: [
      {
        id: 'client-dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/client/dashboard',
        roles: ['CLIENT'],
      },
      {
        id: 'client-accounts',
        label: 'Mes comptes',
        icon: 'compte',
        route: '/client/comptes',
        roles: ['CLIENT'],
      },
      {
        id: 'client-transactions',
        label: 'Mes transactions',
        icon: 'transaction',
        route: '/client/transactions',
        roles: ['CLIENT'],
      },
    ],
  },

  // COMMUN
  {
    id: 'profile',
    label: 'Profil',
    icon: 'profile',
    route: '/profile',
    roles: ['ADMIN', 'AGENT', 'CLIENT'],
  },
  {
    id: 'logout',
    label: 'Déconnexion',
    icon: 'disconnect',
    roles: ['ADMIN', 'AGENT', 'CLIENT'],
    isAction: true,
  },
];