import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ClientFormComponent } from './clients/client-form/client-form.component';
import { ComptesListComponent } from './comptes/comptes-list/comptes-list.component';
import { CompteFormComponent } from './comptes/compte-form/compte-form.component';
import { TransactionsListComponent } from './transactions/transactions-list/transactions-list.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { HistoriqueComponent } from './historique/historique.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'clients', component: ClientsListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/edit/:id', component: ClientFormComponent },
  { path: 'comptes', component: ComptesListComponent },
  { path: 'comptes/new', component: CompteFormComponent },
  { path: 'comptes/edit/:id', component: CompteFormComponent },
  { path: 'transactions', component: TransactionsListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
  { path: 'transactions/edit/:id', component: TransactionFormComponent },
  { path: 'historique', component: HistoriqueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }