import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ClientsComponent } from './components/clients/clients';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home';
import { NewClientComponent } from './components/new-client/new-client';
import { ClientDetailsComponent } from './components/client-details/client-details';
import { EditClientComponent } from './components/edit-client/edit-client';
import { ComptesComponent } from './components/comptes/comptes';
import { AccountDetailsComponent } from './components/account-details/account-details';
import { NewCompteComponent } from './components/new-compte/new-compte';
import { RelevesComponent } from './components/releves/releves';
import { OperationsComponent } from './components/operations/operations';

import { MesComptesComponent } from './components/client/mes-comptes/mes-comptes';
import { VirementClientComponent } from './components/client/virement-client/virement-client';
import { DepotClientComponent } from './components/client/depot-client/depot-client';
import { HistoriqueClientComponent } from './components/client/historique-client/historique-client';
import { RetraitClientComponent } from './components/client/retrait-client/retrait-client';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { 
    path: "admin", component: DashboardComponent, children: [
      { path: "home", component: DashboardHomeComponent },
      // Routes réservées à l'Admin
      { path: "clients", component: ClientsComponent },
      { path: "new-client", component: NewClientComponent },
      { path: "client-details/:id", component: ClientDetailsComponent },
      { path: "edit-client/:id", component: EditClientComponent },
      { path: "comptes", component: ComptesComponent }, 
      { path: "account-details/:id", component: AccountDetailsComponent }, 
      { path: "new-compte/:clientId", component: NewCompteComponent }, 
      { path: "operations", component: OperationsComponent }, 
      
      // Routes réservées au Client
      { path: "mes-comptes", component: MesComptesComponent },
      { path: "virement-client", component: VirementClientComponent },
        { path: "depot-client", component: DepotClientComponent },
         { path: "historique-client", component: HistoriqueClientComponent }, 
         { path: "depot-client", component: DepotClientComponent },     
    { path: "retrait-client", component: RetraitClientComponent },

      // Route commune 
      { path: "releves", component: RelevesComponent },

      { path: "", redirectTo: "home", pathMatch: "full" }
    ]
  },
  { path: "", redirectTo: "/login", pathMatch: "full" }
];