import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <app-sidebar class="sticky top-0 h-screen"></app-sidebar>
      <main class="flex-1 overflow-y-auto p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayout {}