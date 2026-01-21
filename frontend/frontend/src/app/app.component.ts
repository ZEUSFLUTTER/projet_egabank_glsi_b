import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClientNavbarComponent } from './components/navbar/client-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ClientNavbarComponent],
  template: `
    <app-navbar *ngIf="showNavbar()"></app-navbar>
    <app-client-navbar *ngIf="showClientNavbar()"></app-client-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  showNavbar(): boolean {
    const path = window.location.pathname;
    return path !== '/login' && path !== '/register' && !path.startsWith('/client') && path !== '/login-client';
  }

  showClientNavbar(): boolean {
    const path = window.location.pathname;
    return path.startsWith('/client') && path !== '/client/login';
  }
}

