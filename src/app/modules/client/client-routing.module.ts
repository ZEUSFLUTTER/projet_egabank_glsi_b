import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Dashboard
import { ClientDashboardComponent } from './dashboard/dashboard.component';

// Comptes
import { ClientComptesListComponent } from './comptes/compte-list.component';
import { ClientCompteDetailComponent } from './comptes/compte-detail.component';

// Virement
import { ClientVirementComponent } from './virement/virement.component';

// Transactions
import { ClientTransactionHistoryComponent } from './transactions/transaction-history.component';

// Relevés
import { ClientRelevésComponent } from './releves/releve-generate.component';

// Profil
import { ClientProfilComponent } from './profil/profil.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: ClientDashboardComponent },

    // Mes Comptes
    { path: 'comptes', component: ClientComptesListComponent },
    { path: 'comptes/:id', component: ClientCompteDetailComponent },

    // Virement
    { path: 'virement', component: ClientVirementComponent },

    // Transactions
    { path: 'transactions', component: ClientTransactionHistoryComponent },

    // Relevés
    { path: 'releves', component: ClientRelevésComponent },

    // Profil
    { path: 'profil', component: ClientProfilComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
