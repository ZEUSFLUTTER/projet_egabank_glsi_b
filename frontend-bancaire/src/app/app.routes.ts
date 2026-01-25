import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransferComponent } from './transfer/transfer.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { FirstAccountComponent } from './first-account/first-account.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminComponent } from './admin/admin/admin.component'; // <--- Importe le composant standalone
import { AdminAccountsForClientComponent } from './admin/accounts-for-client/accounts-for-client.component'; // <--- Importe le nouveau composant
import { AdminTransactionsForAccountComponent } from './admin/transactions-for-account/transactions-for-account.component'; // <--- Importe le composant pour les transactions
import { AdminCreateClientComponent } from './admin/create-client/create-client.component'; // <--- Importe le composant pour créer un client
import { AdminAuditLogComponent } from './admin/audit-log/audit-log.component'; // <--- Importe le composant pour les logs d'audit

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'first-account', component: FirstAccountComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'transfer', component: TransferComponent, canActivate: [AuthGuard] },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [ // <--- Ajoute les routes enfants ici
      {
        path: 'client/:clientId/accounts', // URL : /admin/client/{id}/accounts
        component: AdminAccountsForClientComponent
      },
      {
        path: 'account/:accountId/transactions', // URL : /admin/account/{id}/transactions
        component: AdminTransactionsForAccountComponent
      },
      {
        path: 'client/create', // URL : /admin/client/create
        component: AdminCreateClientComponent
      },
      {
        path: 'logs', // URL : /admin/logs
        component: AdminAuditLogComponent
      }
      // Tu peux ajouter d'autres routes admin ici
    ]
  },
  { path: '**', redirectTo: '/login' }
];