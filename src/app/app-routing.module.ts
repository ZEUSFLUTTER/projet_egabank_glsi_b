import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './core/layout/client-layout/client-layout.component';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
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
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)
            }
        ]
    },
    { path: '', redirectTo: 'client', pathMatch: 'full' },
    { path: '**', redirectTo: 'client' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
