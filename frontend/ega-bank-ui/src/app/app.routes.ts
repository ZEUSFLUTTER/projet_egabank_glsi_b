import { Routes } from '@angular/router';
import { AccountsComponent } from './pages/accounts.component';
import { ClientsComponent } from './pages/clients.component';
import { TransactionsComponent } from './pages/transactions.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'clients', pathMatch: 'full' },
	{ path: 'clients', component: ClientsComponent },
	{ path: 'accounts', component: AccountsComponent },
	{ path: 'transactions', component: TransactionsComponent },
	{ path: '**', redirectTo: 'clients' },
];
