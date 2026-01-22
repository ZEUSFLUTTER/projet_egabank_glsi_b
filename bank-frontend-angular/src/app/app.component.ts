import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule
  ],
  template: `
    <div class="app-container">
      <!-- Header -->
      <mat-toolbar class="app-header" *ngIf="isAuthenticated">
        <span>
          <mat-icon>account_balance</mat-icon>
          Banque EGA
        </span>
        <span class="spacer"></span>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>person</mat-icon>
          {{ authService.getCurrentUser()?.username }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </mat-menu>
      </mat-toolbar>

      <!-- Navigation -->
      <nav class="nav-menu" *ngIf="isAuthenticated">
        <mat-tab-group (selectedTabChange)="onTabChange($event)">
          <mat-tab label="Tableau de bord">
            <ng-template mat-tab-label>
              <mat-icon>dashboard</mat-icon>
              Tableau de bord
            </ng-template>
          </mat-tab>
          <mat-tab label="Opérations">
            <ng-template mat-tab-label>
              <mat-icon>account_balance</mat-icon>
              Opérations
            </ng-template>
          </mat-tab>
          <mat-tab label="Relevé">
            <ng-template mat-tab-label>
              <mat-icon>receipt_long</mat-icon>
              Relevé
            </ng-template>
          </mat-tab>
          <mat-tab label="Clients">
            <ng-template mat-tab-label>
              <mat-icon>people</mat-icon>
              Clients
            </ng-template>
          </mat-tab>
          <mat-tab label="Comptes">
            <ng-template mat-tab-label>
              <mat-icon>account_balance_wallet</mat-icon>
              Comptes
            </ng-template>
          </mat-tab>
          <mat-tab label="Transactions">
            <ng-template mat-tab-label>
              <mat-icon>swap_horiz</mat-icon>
              Transactions
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </nav>

      <!-- Contenu principal -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-menu {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    ::ng-deep .mat-tab-label {
      min-width: 120px !important;
    }

    ::ng-deep .mat-tab-label-content {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Banque EGA';
  isAuthenticated = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements d'authentification
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (!this.isAuthenticated) {
        this.router.navigate(['/login']);
      } else {
        // Si l'utilisateur est connecté et sur la page de login, rediriger vers dashboard
        if (this.router.url === '/login' || this.router.url === '/') {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  onTabChange(event: any) {
    const routes = ['/dashboard', '/operations', '/releve', '/clients', '/comptes', '/transactions'];
    this.router.navigate([routes[event.index]]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}