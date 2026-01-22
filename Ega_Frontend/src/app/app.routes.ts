import { Routes } from '@angular/router';
import { AccountListComponent } from './pages/accounts/account.list/account.list.component';
import { CreateAccountNewComponent } from './pages/accounts/create-account-new/create-account-new.component';
import { ClientListComponent } from './pages/clients/client.list/client.list.component';
import { TransactionComponent } from './pages/transactions/transaction/transaction.component';
import { TransactionHistoriqueComponent } from './pages/transactions/transaction.historique/transaction.historique.component';
import { ListUserComponent } from './pages/users/list.user/list.user.component';
import { LoginComponent } from './pages/users/login/login.component';
import { RegisterCaissierComponent } from './pages/users/register-caissier/register-caissier.component';
import { RegisterGestionnaireComponent } from './pages/users/register-gestionnaire/register-gestionnaire.component';
import { CreateAccountExistingClientComponent } from './pages/accounts/create-account-old/create-account-old.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',  
    pathMatch: 'full'
  },

  // ========== LOGIN (pas de guard) ==========
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    data: { title: 'Connexion' }
  },

  // ========== GESTION DES COMPTES (GESTIONNAIRE uniquement) ==========
  {
    path: 'accounts',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        component: AccountListComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Liste des Comptes',
          role: 'GESTIONNAIRE'
        }
      },
      {
        path: 'create-new',
        component: CreateAccountNewComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Créer un Nouveau Compte',
          role: 'GESTIONNAIRE'
        }
      },
      {
        path: 'create-old',
        component: CreateAccountExistingClientComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Créer un Compte Ancien Client',
          role: 'GESTIONNAIRE'
        }
      }
    ]
  },

  // ========== GESTION DES CLIENTS (GESTIONNAIRE uniquement) ==========
  {
    path: 'clients',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        component: ClientListComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Liste des Clients',
          role: 'GESTIONNAIRE'
        }
      }
    ]
  },

  // ========== GESTION DES TRANSACTIONS ==========
  {
    path: 'transactions',
    canActivate: [authGuard],
    children: [
      // CAISSIER uniquement
      {
        path: 'operations',
        component: TransactionComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Opérations Bancaires',
          role: 'CAISSIERE'
        }
      },
      // GESTIONNAIRE uniquement
      {
        path: 'historique',
        component: TransactionHistoriqueComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Historique des Transactions',
          role: 'GESTIONNAIRE'
        }
      }
    ]
  },

  // ========== GESTION DES UTILISATEURS ==========
  {
    path: 'users',
    canActivate: [authGuard],
    children: [
      // ADMIN uniquement
      {
        path: 'list',
        component: ListUserComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Liste des Utilisateurs',
          role: 'ADMIN'
        }
      },
      // GESTIONNAIRE uniquement (selon votre spec)
      {
        path: 'register-caissier',
        component: RegisterCaissierComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Enregistrer un Caissier',
          role: 'ADMIN'
        }
      },
      // ADMIN uniquement
      {
        path: 'register-gestionnaire',
        component: RegisterGestionnaireComponent,
        canActivate: [authGuard],
        data: { 
          title: 'Enregistrer un Gestionnaire',
          role: 'ADMIN'
        }
      }
    ]
  },

  // ========== ROUTE 404 ==========
  {
    path: '**',
    redirectTo: '/login'
  }
];