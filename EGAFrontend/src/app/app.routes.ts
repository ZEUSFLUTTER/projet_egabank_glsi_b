import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { ClientList } from './components/client/client-list/client-list';
import { CompteList } from './components/compte/compte-list/compte-list';
import { CompteListClient } from './components/compte/compte-list-client/compte-list-client';
import { TransactionList } from './components/transaction/transaction-list/transaction-list';
import { TransactionCompteHistory } from './components/transaction/transaction-compte-history/transaction-compte-history';
import { ClientAdd } from './components/client/client-add/client-add';
import { AdminLayout } from './components/admin-component/admin-component';
import { ClientEdit } from './components/client/client-edit/client-edit';
import { authGuard } from './core/guards/auth.guard';
import { GesAdmin } from './components/ges-admin/ges-admin';
import { AddAdmin } from './components/add-admin/add-admin';
import { Parametres } from './components/parametres/parametres';
export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        component: AdminLayout,
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
            { path: 'client', component: ClientList, canActivate: [authGuard] },
            { path: 'client/ajouter', component: ClientAdd, canActivate: [authGuard] },
            { path: 'client/:id/comptes', component: CompteListClient, canActivate: [authGuard] },
            { path: 'compte', component: CompteList, canActivate: [authGuard] },
            { path: 'transaction', component: TransactionList, canActivate: [authGuard] },
            { path: 'client/modifier/:id', component: ClientEdit, canActivate: [authGuard] },
            { path: 'client/:clientId/comptes/:compteId/history', component: TransactionCompteHistory, canActivate: [authGuard] },
            { path: 'administrateur', component: GesAdmin, canActivate: [authGuard] },
            { path: 'administrateur/ajouter', component: AddAdmin, canActivate: [authGuard] },
            { path: 'parametres', component: Parametres, canActivate: [authGuard] },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]   
    },
    { path: '**', redirectTo: 'login' }
];