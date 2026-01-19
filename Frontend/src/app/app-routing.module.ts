import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './core/layout/client-layout/client-layout.component';
import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'ADMIN' },
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
            }
        ]
    },
    {
        path: 'client',
        component: ClientLayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'CLIENT' },
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)
            }
        ]
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
