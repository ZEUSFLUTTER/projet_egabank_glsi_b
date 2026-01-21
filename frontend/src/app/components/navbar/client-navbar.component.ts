import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientAuthService } from '../../services/client-auth.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <div class="navbar-brand">
            <a routerLink="/client/dashboard">Banque Ega</a>
          </div>
          <ul class="navbar-menu">
            <li><a routerLink="/client/dashboard" routerLinkActive="active">Tableau de bord</a></li>
            <li><a routerLink="/client/comptes" routerLinkActive="active">Comptes</a></li>
            <li><a routerLink="/client/transactions" routerLinkActive="active">Transactions</a></li>
          </ul>
          <div class="navbar-user">
            <span class="username">{{ clientEmail }}</span>
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
      border: 1px solid var(--color-white);
      background-color: transparent;
      color: var(--color-white);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background-color: var(--color-white);
      color: var(--color-black);
    }
  `]
})
export class ClientNavbarComponent {
  clientEmail: string | null = null;

  constructor(private clientAuthService: ClientAuthService) {
    this.clientAuthService.currentClient$.subscribe(email => {
      this.clientEmail = email;
    });
    // Initialiser avec la valeur actuelle
    this.clientEmail = this.clientAuthService.getCurrentClientEmail();
  }

  logout(): void {
    this.clientAuthService.logout();
    window.location.href = '/client/login';
  }
}
