import { ProfileComponent } from './client/profile/profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './auth/login/login.component'; // (À créer ensuite)
import { RegisterComponent } from './auth/register/register.component';
import { ClientDashboardComponent } from './client/client-dashboard.component';
import { AccountsComponent } from './client/accounts/accounts.component';
import { dashboardResolver } from './_services/dashboard.resolver';
import { VirementsComponent } from './client/virements/virements.component';
import { RelevesComponent } from './client/releves/releves.component';
import { AdminClientsComponent } from './admin/admin-clients/admin-clients.component';
import { AdminAccountsComponent } from './admin/admin-accounts/admin-accounts.component';
import { AdminTransactionsComponent } from './admin/admin-transactions/admin-transactions.component';

export const routes: Routes = [
  // Page d'accueil par défaut
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'client',
    component: ClientDashboardComponent,
    resolve: { donnees: dashboardResolver }
  },
  {
        path: 'accounts',
        component: AccountsComponent,
        resolve: { donnees: dashboardResolver }
      },
      {
        path: 'virements',
        component: VirementsComponent,
        resolve: { donnees: dashboardResolver }
      },
      {
        path: 'releves',
        component: RelevesComponent,
        resolve: { donnees: dashboardResolver }
      },

      {
        path: 'profile',
        component: ProfileComponent,
        resolve: { donnees: dashboardResolver }
      },

      {
    path: 'admin',
    children: [
      { path: '', component: AdminDashboardComponent },           // /admin (Dashboard)
      { path: 'clients', component: AdminClientsComponent },      // /admin/clients
      { path: 'comptes', component: AdminAccountsComponent },     // /admin/comptes
      { path: 'transactions', component: AdminTransactionsComponent }, // /admin/transactions
      // { path: 'documents', component: AdminDocumentsComponent },  // /admin/documents
    ]
  },
  // Redirection si route inconnue
  { path: '**', redirectTo: '' }
];
