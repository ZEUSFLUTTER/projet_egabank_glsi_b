import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LoginClientComponent } from './components/auth/login-client/login-client.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { DashboardClientComponent } from './components/client/dashboard-client/dashboard-client.component';
import { ComptesClientComponent } from './components/client/comptes-client/comptes-client.component';
import { TransactionsClientComponent } from './components/client/transactions-client/transactions-client.component';
import { authGuard } from './guards/auth.guard';
import { clientAuthGuard } from './guards/client-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'client/login', component: LoginClientComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },
  { path: 'comptes', component: ComptesComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard] },
  { path: 'client/dashboard', component: DashboardClientComponent, canActivate: [clientAuthGuard] },
  { path: 'client/comptes', component: ComptesClientComponent, canActivate: [clientAuthGuard] },
  { path: 'client/transactions', component: TransactionsClientComponent, canActivate: [clientAuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

