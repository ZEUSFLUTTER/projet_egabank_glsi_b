import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientDashboardService, DashboardData } from '../../../services/client-dashboard.service';
import { Notification } from '../../../models/notification.model';
import { ClientAuthService } from '../../../services/client-auth.service';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">◼</div>
          <div class="stat-content">
            <h3>{{ dashboardData?.totalSolde | number:'1.2-2' }} F</h3>
            <p>Solde total</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">◫</div>
          <div class="stat-content">
            <h3>{{ dashboardData?.nombreComptes }}</h3>
            <p>Nombre de comptes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
  <i class="fa-regular fa-bell"></i>
</div>

          <div class="stat-content">
            <h3>{{ dashboardData?.nombreNotifications }}</h3>
            <p>Notifications non lues</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h2>Notifications récentes</h2>
          </div>
          <div *ngIf="loadingNotifications" class="loading">Chargement...</div>
          <div *ngIf="!loadingNotifications && notifications.length === 0" class="empty-state">
            <p>Aucune notification</p>
          </div>
          <div *ngIf="!loadingNotifications && notifications.length > 0" class="notifications-list">
            <div *ngFor="let notification of notifications.slice(0, 5)" 
                 class="notification-item" 
                 [class.unread]="!notification.lu"
                 (click)="markAsRead(notification)">
              <div class="notification-content">
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-date">{{ formatDate(notification.dateNotification) }}</span>
              </div>
              <span *ngIf="!notification.lu" class="unread-badge">Nouveau</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Actions rapides</h2>
          </div>
          <div class="quick-actions">
            <a routerLink="/client/comptes" class="action-btn">
              <i class="fa-solid fa-building-columns"></i>
              <span>Mes comptes</span>
            </a>
            <a routerLink="/client/transactions" class="action-btn">
              <i class="fa-solid fa-exchange-alt"></i>
              <span>Mes transactions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: #ffffff;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 2px solid #000000;
      padding-bottom: 1rem;
    }

    .header h1 {
      margin: 0;
      color: #000000;
      font-size: 2rem;
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-black);
  border-radius: 0;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0 var(--color-black);
}

.stat-icon {
  font-size: 2rem;
  color: var(--color-black);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-light-gray);
  border: 1px solid var(--color-black);
}

.stat-content h3 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-black);
  font-weight: 700;
  line-height: 1;
}

.stat-content p {
  margin: 0.5rem 0 0 0;
  color: var(--color-gray);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--color-white);
  border: 1px solid var(--color-black);
  border-radius: 0;
  overflow: hidden;
}

.card-header {
  background-color: var(--color-black);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-black);
}

.card-header h2 {
  margin: 0;
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 600;
}


    .card-header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .notifications-list {
      padding: 1rem;
    }

    .notification-item {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background-color: #f5f5f5;
    }

    .notification-item.unread {
      background-color: #fff9e6;
      font-weight: 500;
    }

    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-message {
      margin: 0;
      flex: 1;
    }

    .notification-date {
      color: #808080;
      font-size: 0.875rem;
      margin-left: 1rem;
    }

    .unread-badge {
      background-color: #ff0000;
      color: #ffffff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      margin-left: 1rem;
    }

    .quick-actions {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      flex-direction: column;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #000000;
      text-decoration: none;
      color: #000000;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: #000000;
      color: #ffffff;
    }

    .loading, .empty-state {
      padding: 2rem;
      text-align: center;
      color: #808080;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid #000000;
      background-color: #ffffff;
      color: #000000;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background-color: #000000;
      color: #ffffff;
    }
  `]
})
export class DashboardClientComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  notifications: Notification[] = [];
  loadingNotifications = true;

  constructor(
    private dashboardService: ClientDashboardService,
    private clientAuthService: ClientAuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadNotifications();
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du dashboard:', err);
      }
    });
  }

  loadNotifications(): void {
    this.loadingNotifications = true;
    this.dashboardService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loadingNotifications = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
        this.loadingNotifications = false;
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.id && !notification.lu) {
      this.dashboardService.marquerNotificationLue(notification.id).subscribe({
        next: () => {
          notification.lu = true;
          this.loadDashboard(); // Recharger pour mettre à jour le compteur
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la notification:', err);
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
