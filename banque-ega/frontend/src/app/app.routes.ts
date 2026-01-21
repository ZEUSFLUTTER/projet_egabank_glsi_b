import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ClientFormComponent } from './components/clients/client-form/client-form.component';
import { CompteListComponent } from './components/comptes/compte-list/compte-list.component';
import { CompteFormComponent } from './components/comptes/compte-form/compte-form.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transactions/transaction-form/transaction-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'clients', 
    component: ClientListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'clients/new', 
    component: ClientFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'clients/:id/edit', 
    component: ClientFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'comptes', 
    component: CompteListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'comptes/new', 
    component: CompteFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transactions', 
    component: TransactionListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transactions/new', 
    component: TransactionFormComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

