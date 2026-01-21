import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">
        <h1>📊 EgaBank</h1>
      </div>
      <nav class="navbar-menu">
        <a routerLink="/dashboard" class="nav-link" routerLinkActive="active">
          <span class="nav-icon">📊</span>Tableau de Bord
        </a>
        <a routerLink="/clients" class="nav-link" routerLinkActive="active">
          <span class="nav-icon">👥</span>Clients
        </a>
        <a routerLink="/comptes" class="nav-link" routerLinkActive="active">
          <span class="nav-icon">💳</span>Comptes
        </a>
        <a routerLink="/transactions" class="nav-link" routerLinkActive="active">
          <span class="nav-icon">💰</span>Transactions
        </a>
        <a routerLink="/operations" class="nav-link" routerLinkActive="active">
          <span class="nav-icon">⚙️</span>Opérations
        </a>
      </nav>
      <button class="btn btn-logout" (click)="logout()" title="Déconnexion">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
      border-radius: 10px 10px 0 0;
      margin: -30px -30px 30px -30px;
      height: 70px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      padding: 0 30px;
      flex-shrink: 0;
    }

    .navbar-brand h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .navbar-menu {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      gap: 0;
      margin: 0 30px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px 20px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      font-size: 15px;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      height: 100%;
    }

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-bottom-color: rgba(255, 255, 255, 0.3);
    }

    .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.15);
      border-bottom-color: #3498db;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 18px;
      display: inline-block;
    }

    .btn-logout {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
      border: none !important;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px !important;
      margin: 0 30px 0 0;
      font-weight: 600;
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 14px;
      height: 45px;
    }

    .btn-logout:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e63946 100%) !important;
      box-shadow: 0 6px 16px rgba(255, 107, 107, 0.5) !important;
      transform: translateY(-2px);
    }

    .btn-logout svg {
      width: 18px;
      height: 18px;
      stroke: white;
    }
  `]
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
