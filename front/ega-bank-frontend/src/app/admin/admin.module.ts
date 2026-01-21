import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ClientFormComponent } from './clients/client-form/client-form.component';
import { ComptesListComponent } from './comptes/comptes-list/comptes-list.component';
import { CompteFormComponent } from './comptes/compte-form/compte-form.component';
import { TransactionsListComponent } from './transactions/transactions-list/transactions-list.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { HistoriqueComponent } from './historique/historique.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ClientsListComponent,
    ClientFormComponent,
    ComptesListComponent,
    CompteFormComponent,
    TransactionsListComponent,
    TransactionFormComponent,
    HistoriqueComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }