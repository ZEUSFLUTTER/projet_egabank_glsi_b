import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppSidebar } from './shared/app-sidebar.component';
import { DashboardHeader } from './shared/dashboard-header.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, AppSidebar, DashboardHeader],
  templateUrl: './app.html',
  // Rely on global styles.css for theming and utilities
})
export class App {
  protected readonly title = signal('angular-app');
  showLayout = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Nettoyer l'URL des paramètres (?) et des ancres (#)
        const url = this.router.url.split('?')[0].split('#')[0];
        // Masquer le layout pour le login, register et la landing page
        const publicRoutes = ['/', '', '/login', '/register'];
        this.showLayout.set(!publicRoutes.includes(url));
      }
    });
  }
}
