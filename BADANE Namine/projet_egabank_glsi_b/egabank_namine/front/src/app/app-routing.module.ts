import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepotComponent } from './components/depot/depot.component';
import { RetraitComponent } from './components/retrait/retrait.component';
import { VirementComponent } from './components/virement/virement.component';
import { CompteComponent } from './components/comptes/compte.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ProfileComponent } from './components/profile/profile.component';
// Comment out missing:
// import { AdminClientsComponent } from './components/admin-clients/admin-clients.component';
// etc.

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'depot', component: DepotComponent },
      { path: 'retrait', component: RetraitComponent },
      { path: 'virement', component: VirementComponent },
      { path: 'comptes', component: CompteComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'profile', component: ProfileComponent },
      // { path: 'admin/clients', component: AdminClientsComponent },
      // etc.
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }