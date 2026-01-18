import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ClientLayoutComponent } from './shared/components/client-layout/client-layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ClientsListComponent } from './modules/clients/list/list.component';
import { ClientDetailComponent } from './modules/clients/detail/detail.component';
import { ComptesComponent } from './modules/comptes/comptes.component';
import { CompteDetailComponent } from './modules/comptes/detail/detail.component';
import { OperationsComponent } from './modules/operations/operations.component';
import { StatementComponent } from './modules/releves/releves.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ClientDashboardComponent } from './modules/client-dashboard/client-dashboard.component';
import { ClientOperationsComponent } from './modules/client-operations/client-operations.component';
import { ClientCompteDetailComponent } from './modules/client-compte-detail/client-compte-detail.component';
import { ClientHistoryComponent } from './modules/client-history/client-history.component';
import { ClientStatisticsComponent } from './modules/client-statistics/client-statistics.component';
import { ClientProfileComponent } from './modules/client-profile/client-profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Routes Admin
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
        ]
    },

    // Routes Client avec Layout dédié
    {
        path: 'client',
        component: ClientLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: ClientDashboardComponent },
            { path: 'comptes', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'operations', component: ClientOperationsComponent },
            { path: 'comptes/:id', component: ClientCompteDetailComponent },
            { path: 'historique', component: ClientHistoryComponent },
            { path: 'statistiques', component: ClientStatisticsComponent },
            { path: 'profil', component: ClientProfileComponent },
            { path: 'releves', component: StatementComponent },
        ]
    },

    { path: '**', redirectTo: '/login' }
];


