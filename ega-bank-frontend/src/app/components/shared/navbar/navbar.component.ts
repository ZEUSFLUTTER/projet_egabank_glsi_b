import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">
            <svg class="brand-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span class="brand-text">EGA Bank</span>
          </a>
        </div>

        <div class="navbar-menu" *ngIf="isAuthenticated">
          <!-- Menu Client -->
          <div *ngIf="isClient" class="navbar-links">
            <a routerLink="/client/dashboard" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              Dashboard
            </a>
            <a routerLink="/client/comptes" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Mes Comptes
            </a>
            <a routerLink="/client/operations" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
              Opérations
            </a>
          </div>

          <!-- Menu Admin -->
          <div *ngIf="isAdmin" class="navbar-links">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              Dashboard
            </a>
            <a routerLink="/admin/clients" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Clients
            </a>
            <a routerLink="/admin/comptes" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Comptes
            </a>
          </div>
        </div>

        <div class="navbar-user">
          <div *ngIf="isAuthenticated" class="user-menu">
            <div class="user-info">
              <span class="user-email">{{ userEmail }}</span>
              <span class="user-role badge" 
                    [class.badge-primary]="isClient" 
                    [class.badge-success]="isAdmin">
                {{ userRole }}
              </span>
            </div>
            <button (click)="logout()" class="btn btn-outline btn-sm">
              <svg class="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Déconnexion
            </button>
          </div>
          
          <div *ngIf="!isAuthenticated" class="auth-links">
            <a routerLink="/login" class="btn btn-outline btn-sm">Connexion</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Inscription</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all 0.3s ease;
    }

    .navbar:hover {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .navbar-brand .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #6366f1;
      font-weight: 800;
      font-size: 24px;
      transition: all 0.3s ease;
      position: relative;
    }

    .navbar-brand .brand-link:hover {
      color: #4f46e5;
      transform: scale(1.02);
    }

    .brand-icon {
      color: #6366f1;
      transition: all 0.3s ease;
    }

    .navbar-brand .brand-link:hover .brand-icon {
      color: #4f46e5;
      transform: rotate(5deg);
    }

    .brand-text {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      text-decoration: none;
      color: #64748b;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
      transition: left 0.5s;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    }

    .nav-link.active {
      color: #6366f1;
      background: rgba(99, 102, 241, 0.1);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      border-radius: 1px;
    }

    .nav-icon {
      transition: all 0.3s ease;
    }

    .nav-link:hover .nav-icon {
      transform: scale(1.1);
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .user-menu:hover {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .user-email {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .user-role {
      font-size: 12px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .badge-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }

    .btn-outline {
      background: transparent;
      color: #6366f1;
      border: 2px solid #6366f1;
    }

    .btn-outline:hover {
      background: #6366f1;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }

    .auth-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 16px;
        height: 60px;
      }

      .navbar-links {
        display: none;
      }

      .brand-text {
        display: none;
      }

      .user-menu {
        padding: 6px 12px;
      }

      .user-info {
        display: none;
      }

      .auth-links {
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .navbar-brand .brand-link {
        font-size: 20px;
      }

      .btn {
        padding: 6px 10px;
        font-size: 12px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isClient = false;
  isAdmin = false;
  userEmail = '';
  userRole = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.updateUserInfo();
      }
    });

    this.authService.currentRole$.subscribe(role => {
      this.isClient = role === Role.CLIENT;
      this.isAdmin = role === Role.ADMIN;
      this.userRole = role || '';
    });

    // Initialiser les données utilisateur
    if (this.authService.isAuthenticated()) {
      this.updateUserInfo();
    }
  }

  private updateUserInfo(): void {
    this.userEmail = this.authService.getEmail() || '';
    this.userRole = this.authService.getRole() || '';
    this.isClient = this.authService.isClient();
    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}