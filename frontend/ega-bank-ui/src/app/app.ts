import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebar } from './shared/app-sidebar.component';
import { DashboardHeader } from './shared/dashboard-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebar, DashboardHeader],
  templateUrl: './app.html',
  // Rely on global styles.css for theming and utilities
})
export class App {
  protected readonly title = signal('angular-app');
}
