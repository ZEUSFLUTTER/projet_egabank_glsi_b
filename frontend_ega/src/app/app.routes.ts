import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ClientsListComponent } from './modules/clients/list/list.component';
import { ClientDetailComponent } from './modules/clients/detail/detail.component';
import { ComptesComponent } from './modules/comptes/comptes.component';
import { CompteDetailComponent } from './modules/comptes/detail/detail.component';
import { OperationsComponent } from './modules/operations/operations.component';
import { StatementComponent } from './modules/releves/releves.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'clients', component: ClientsListComponent },
            { path: 'clients/:id', component: ClientDetailComponent },
            { path: 'comptes', component: ComptesComponent },
            { path: 'comptes/:id', component: CompteDetailComponent },
            { path: 'virements', component: OperationsComponent },
            { path: 'releves', component: StatementComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    { path: '**', redirectTo: '/login' }
];

