import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Dashboard
import { AdminDashboardComponent } from './dashboard/dashboard.component';

// Clients
import { ClientListComponent } from './clients/client-list.component';
import { ClientFormComponent } from './clients/client-form.component';
import { ClientDetailComponent } from './clients/client-detail.component';

// Comptes
import { CompteListComponent } from './comptes/compte-list.component';
import { CompteDetailComponent } from './comptes/compte-detail.component';

// Transactions
import { TransactionHistoryComponent } from './transactions/transaction-history.component';
import { TransactionVirementComponent } from './transactions/transaction-virement.component';
import { TransactionOperationComponent } from './transactions/transaction-operation.component';

// Relevés
import { ReleveGenerateComponent } from './releves/releve-generate.component';

import { PlaceholderComponent } from '../../shared/components/placeholder.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent },

    // Onglet Clients
    { path: 'clients', component: ClientListComponent },
    { path: 'clients/nouveau', component: ClientFormComponent },
    { path: 'clients/modifier/:id', component: ClientFormComponent },
    { path: 'clients/:id', component: ClientDetailComponent },

    // Onglet Comptes
    { path: 'comptes', component: CompteListComponent },
    { path: 'comptes/:id', component: CompteDetailComponent },

    // Onglet Transactions
    { path: 'transactions', component: TransactionHistoryComponent },
    { path: 'transactions/virement', component: TransactionVirementComponent },
    { path: 'transactions/depot', component: TransactionOperationComponent, data: { type: 'DEPOT' } },
    { path: 'transactions/retrait', component: TransactionOperationComponent, data: { type: 'RETRAIT' } },

    // Onglet Relevés
    { path: 'releves', component: ReleveGenerateComponent },

    { path: 'profil', component: PlaceholderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
