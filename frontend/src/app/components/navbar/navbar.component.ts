import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <div class="navbar-brand">
            <a routerLink="/dashboard">Banque Ega</a>
          </div>
          <ul class="navbar-menu">
            <li><a routerLink="/dashboard" routerLinkActive="active">Tableau de bord</a></li>
            <li><a routerLink="/clients" routerLinkActive="active">Clients</a></li>
            <li><a routerLink="/comptes" routerLinkActive="active">Comptes</a></li>
            <li><a routerLink="/transactions" routerLinkActive="active">Transactions</a></li>
          </ul>
          <div class="navbar-user">
            <span class="username">{{ username }}</span>
            <button class="btn btn-secondary" (click)="logout()">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--color-black);
      color: var(--color-white);
      padding: 15px 0;
      border-bottom: 2px solid var(--color-gray);
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand a {
      color: var(--color-white);
      font-size: 24px;
      font-weight: bold;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .navbar-menu {
      display: flex;
      list-style: none;
      gap: 30px;
      margin: 0;
      padding: 0;
    }

    .navbar-menu li a {
      color: var(--color-white);
      text-decoration: none;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: color 0.3s ease;
    }

    .navbar-menu li a:hover,
    .navbar-menu li a.active {
      color: var(--color-gray);
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .username {
      color: var(--color-white);
      font-weight: 500;
    }

    .btn {
      padding: 8px 16px;
      font-size: 12px;
    }
  `]
})
export class NavbarComponent {
  username: string | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.username = user;
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}

