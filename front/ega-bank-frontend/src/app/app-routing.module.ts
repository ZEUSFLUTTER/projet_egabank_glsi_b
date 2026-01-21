import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ClientsListComponent } from './admin/clients/clients-list/clients-list.component';
import { ClientFormComponent } from './admin/clients/client-form/client-form.component';
import { ComptesListComponent } from './admin/comptes/comptes-list/comptes-list.component';
import { CompteFormComponent } from './admin/comptes/compte-form/compte-form.component';
import { TransactionsListComponent } from './admin/transactions/transactions-list/transactions-list.component';
import { TransactionFormComponent } from './admin/transactions/transaction-form/transaction-form.component';
import { HistoriqueComponent } from './admin/historique/historique.component';
import { ComptesTableauComponent } from './client/comptes/comptes-tableau/comptes-tableau.component';
import { OperationsHistoriqueComponent } from './client/operations/operations-historique/operations-historique.component';
import { OperationFormComponent } from './client/operations/operation-form/operation-form.component';
import { ClientDashboardComponent } from './client/client-dashboard/client-dashboard.component';

const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/clients', component: ClientsListComponent },
  { path: 'admin/clients/new', component: ClientFormComponent },
  { path: 'admin/clients/edit/:id', component: ClientFormComponent },
  { path: 'admin/comptes', component: ComptesListComponent },
  { path: 'admin/comptes/new', component: CompteFormComponent },
  { path: 'admin/comptes/edit/:id', component: CompteFormComponent },
  { path: 'admin/transactions', component: TransactionsListComponent },
  { path: 'admin/transactions/new', component: TransactionFormComponent },
  { path: 'admin/transactions/edit/:id', component: TransactionFormComponent },
  { path: 'admin/historique', component: HistoriqueComponent },
  { path: 'client', component: ClientDashboardComponent },
  { path: 'client/comptes', component: ComptesTableauComponent },
  { path: 'client/operations/historique', component: OperationsHistoriqueComponent },
  { path: 'client/operations/new', component: OperationFormComponent },
  { path: 'client/operations/edit/:id', component: OperationFormComponent },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
  { path: '**', redirectTo: '/client' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }