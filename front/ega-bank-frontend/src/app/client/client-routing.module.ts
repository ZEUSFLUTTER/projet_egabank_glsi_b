import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComptesTableauComponent } from './comptes/comptes-tableau/comptes-tableau.component';
import { OperationsHistoriqueComponent } from './operations/operations-historique/operations-historique.component';
import { OperationFormComponent } from './operations/operation-form/operation-form.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';

const routes: Routes = [
  { path: '', component: ClientDashboardComponent },
  { path: 'comptes', component: ComptesTableauComponent },
  { path: 'operations', component: OperationsHistoriqueComponent },
  { path: 'operations/new', component: OperationFormComponent },
  { path: 'operations/edit/:id', component: OperationFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }