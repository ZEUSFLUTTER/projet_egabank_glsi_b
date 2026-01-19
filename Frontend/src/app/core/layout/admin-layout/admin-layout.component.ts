import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { AdminNavbarComponent } from './admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AdminSidebarComponent, AdminNavbarComponent],
  template: `
    <div class="wrapper">
      <!-- Sidebar -->
      <app-admin-sidebar></app-admin-sidebar>

      <div id="content">
        <!-- Navbar -->
        <app-admin-navbar></app-admin-navbar>

        <!-- Main Content -->
        <main class="p-4">
          <div class="container-fluid">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      width: 100%;
      align-items: stretch;
    }
    #content {
      width: 100%;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class AdminLayoutComponent { }
