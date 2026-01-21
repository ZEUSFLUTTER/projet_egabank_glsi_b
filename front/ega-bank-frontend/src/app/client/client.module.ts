import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ComptesTableauComponent } from './comptes/comptes-tableau/comptes-tableau.component';
import { OperationsHistoriqueComponent } from './operations/operations-historique/operations-historique.component';
import { OperationFormComponent } from './operations/operation-form/operation-form.component';

@NgModule({
  declarations: [
    ClientDashboardComponent,
    ComptesTableauComponent,
    OperationsHistoriqueComponent,
    OperationFormComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }