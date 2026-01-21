import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">
      <div class="brand-logo">BE</div>
      <a routerLink="/dashboard" class="brand-name">Banque Ega</a>
    </div>
    
    <div class="navbar-content">
      <ul class="navbar-menu">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
            </svg>
            <span>Tableau de bord</span>
          </a>
        </li>
        <li>
          <a routerLink="/clients" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            <span>Clients</span>
          </a>
        </li>
        <li>
          <a routerLink="/comptes" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="currentColor"/>
            </svg>
            <span>Comptes</span>
          </a>
        </li>
        <li>
          <a routerLink="/transactions" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
            </svg>
            <span>Transactions</span>
          </a>
        </li>
      </ul>
      
      <div class="navbar-user">
        <div class="user-info">
          <div class="user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="user-details">
            <span class="username">{{ username }}</span>
            <span class="user-role">Administrateur</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3Z" fill="currentColor"/>
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </div>
</nav>
  `,
  styles: [`:host {
  --color-navy: #000080;
  --color-white: #ffffff;
  --color-navy-light: rgba(0, 0, 128, 0.1);
  --color-navy-medium: rgba(0, 0, 128, 0.3);
  --color-navy-dark: #000066;
  --color-gray: #666666;
  --color-gray-light: #f5f5f7;
  --color-success: #008000;
  --color-error: #ff0000;
}

.navbar {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  color: var(--color-white);
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-white) 0%, rgba(255, 255, 255, 0.5) 100%);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
  max-width: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  background-color: var(--color-white);
  color: var(--color-navy);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.brand-name {
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: opacity 0.3s ease;
}

.brand-name:hover {
  opacity: 0.9;
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: space-between;
  margin-left: 2rem;
}

.navbar-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.navbar-menu li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.navbar-menu li a:hover {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-menu li a.active {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-menu li a.active::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 1.25rem;
  right: 1.25rem;
  height: 2px;
  background-color: var(--color-white);
  border-radius: 1px;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--color-white);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: var(--color-white);
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 400;
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Mobile menu */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 1rem;
  }
  
  .navbar-content {
    margin-left: 1rem;
  }
  
  .navbar-menu li a span {
    display: none;
  }
  
  .navbar-menu li a {
    padding: 0.75rem;
    justify-content: center;
  }
  
  .logout-btn span {
    display: none;
  }
  
  .logout-btn {
    padding: 0.6rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    height: 56px;
  }
  
  .brand-name {
    display: none;
  }
  
  .navbar-content {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .navbar-content.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
  }
  
  .navbar-content.mobile-open .navbar-menu {
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .navbar-content.mobile-open .navbar-menu li a {
    justify-content: flex-start;
    padding: 0.75rem 1rem;
  }
  
  .navbar-content.mobile-open .navbar-menu li a span {
    display: inline;
  }
  
  .navbar-content.mobile-open .navbar-user {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .navbar-content.mobile-open .logout-btn {
    width: 100%;
    justify-content: center;
  }
  
  .navbar-content.mobile-open .logout-btn span {
    display: inline;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 0.75rem;
  }
  
  .brand-logo {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
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

