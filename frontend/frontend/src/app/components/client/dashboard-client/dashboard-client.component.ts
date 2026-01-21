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
    <div class="dashboard-container">
      <!-- En-tête de page -->
      <div class="page-header">
        <div class="header-content">
          <div class="logo-container">
            <div class="bank-logo">BE</div>
          </div>
          <div class="header-text">
            <h1>Tableau de Bord Client</h1>
            <p>Vue d'ensemble de vos finances et activités</p>
          </div>
        </div>
        <div class="user-info">
          <span class="user-name">Bienvenue, {{ getClientName() }}</span>
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 14.26 7.75 14.3 8.9H16.35C16.3 7.33 15 5.9 12.7 5.49V3H10.2V5.49C7.97 5.9 6.3 7.15 6.3 8.95C6.3 11.2 8.14 12.35 11.1 13.05C13.5 13.65 14.2 14.5 14.2 15.55C14.2 16.5 13.4 17.4 11.5 17.4C9.5 17.4 8.35 16.45 8.25 15.2H6.2C6.3 17.25 7.95 18.6 10.2 19.01V21.5H12.7V19.01C14.95 18.6 16.7 17.25 16.7 15.55C16.7 12.85 14.1 11.8 11.8 10.9Z" fill="#ffffff"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ dashboardData?.totalSolde | number:'1.2-2' }} F</h3>
            <p>Solde total</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#ffffff"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ dashboardData?.nombreComptes }}</h3>
            <p>Nombre de comptes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#ffffff"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ dashboardData?.nombreNotifications }}</h3>
            <p>Notifications non lues</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#ffffff"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ getCurrentMonthTransactions() }}</h3>
            <p>Transactions ce mois</p>
          </div>
        </div>
      </div>

      <!-- Grille principale -->
      <div class="dashboard-grid">
        <!-- Carte Notifications -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#ffffff"/>
              </svg>
              <h2>Notifications récentes</h2>
              <span class="badge" *ngIf="dashboardData?.nombreNotifications && (dashboardData?.nombreNotifications ?? 0) > 0">
                {{ dashboardData?.nombreNotifications }}
              </span>
            </div>
          </div>
          
          <div class="card-body">
            <div *ngIf="loadingNotifications" class="loading-state">
              <div class="loading-spinner"></div>
              <span>Chargement des notifications...</span>
            </div>
            
            <div *ngIf="!loadingNotifications && notifications.length === 0" class="empty-state">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="var(--color-navy-light)"/>
              </svg>
              <h3>Aucune notification</h3>
              <p>Toutes vos notifications sont à jour</p>
            </div>
            
            <div *ngIf="!loadingNotifications && notifications.length > 0" class="notifications-list">
              <div *ngFor="let notification of notifications.slice(0, 5)" 
                   class="notification-item" 
                   [class.unread]="!notification.lu"
                   (click)="markAsRead(notification)">
                <div class="notification-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path *ngIf="notification.message.includes('dépôt')" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="var(--color-deposit)"/>
                    <path *ngIf="notification.message.includes('retrait')" d="M19 13H5V11H19V13Z" fill="var(--color-withdraw)"/>
                    <path *ngIf="notification.message.includes('virement')" d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="var(--color-transfer)"/>
                    <path *ngIf="!notification.message.includes('dépôt') && !notification.message.includes('retrait') && !notification.message.includes('virement')" 
                          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
                <div class="notification-content">
                  <p class="notification-message">{{ notification.message }}</p>
                  <span class="notification-date">{{ formatDate(notification.dateNotification) }}</span>
                </div>
                <div class="notification-actions">
                  <span *ngIf="!notification.lu" class="unread-badge">Nouveau</span>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>

        <!-- Carte Actions Rapides -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
              </svg>
              <h2>Actions rapides</h2>
            </div>
          </div>
          
          <div class="card-body">
            <div class="quick-actions-grid">
              <a routerLink="/client/comptes" class="action-card">
                <div class="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Mes comptes</h3>
                  <p>Consultez et gérez tous vos comptes bancaires</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
              </a>

              <a routerLink="/client/transactions" class="action-card">
                <div class="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Mes transactions</h3>
                  <p>Suivez l'historique de toutes vos opérations</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
              </a>

              <a routerLink="/client/virements" class="action-card">
                <div class="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
                <div class="action-content">
                  <h3>Effectuer un virement</h3>
                  <p>Transférez de l'argent vers un autre compte</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="var(--color-navy)"/>
                  </svg>
                </div>
              </a>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --color-navy: #000080;
      --color-white: #ffffff;
      --color-navy-light: rgba(0, 0, 128, 0.1);
      --color-navy-medium: rgba(0, 0, 128, 0.3);
      --color-navy-dark: #000066;
      --color-gray: #666666;
      --color-gray-light: #f5f5f7;
      --color-deposit: #4CAF50;
      --color-withdraw: #F44336;
      --color-transfer: #2196F3;
    }

    .dashboard-container {
      height: 100vh;
      width: 100%;
      background-color: var(--color-gray-light);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }

    /* En-tête de page */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--color-navy-light);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .logo-container {
      display: flex;
      justify-content: center;
    }

    .bank-logo {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      color: var(--color-white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
    }

    .header-text h1 {
      margin: 0 0 0.25rem 0;
      color: var(--color-navy);
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-text p {
      margin: 0;
      color: var(--color-gray);
      font-size: 0.9rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-name {
      color: var(--color-navy);
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.5rem 1rem;
      background-color: var(--color-white);
      border-radius: 20px;
      border: 1px solid var(--color-navy-medium);
    }

    /* Grille de statistiques */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: var(--color-white);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 128, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.15);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.75rem;
      color: var(--color-navy);
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

    /* Grille principale */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      flex: 1;
      min-height: 0;
    }

    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Cartes */
    .dashboard-card {
      background-color: var(--color-white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-header {
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--color-navy-light);
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-title h2 {
      margin: 0;
      color: var(--color-white);
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
    }

    .badge {
      background-color: rgba(255, 255, 255, 0.2);
      color: var(--color-white);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }

    .card-body {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* États de chargement et vide */
    .loading-state {
      padding: 3rem 1rem;
      text-align: center;
      color: var(--color-gray);
      font-size: 0.9rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      flex: 1;
      justify-content: center;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-navy-light);
      border-top-color: var(--color-navy);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: var(--color-gray);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      flex: 1;
      justify-content: center;
    }

    .empty-state h3 {
      margin: 0;
      color: var(--color-navy);
      font-size: 1.25rem;
    }

    .empty-state p {
      margin: 0;
      color: var(--color-gray);
      font-size: 0.95rem;
    }

    /* Liste des notifications */
    .notifications-list {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid var(--color-navy-light);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background-color: var(--color-navy-light);
      border-radius: 8px;
    }

    .notification-item.unread {
      background-color: rgba(33, 150, 243, 0.05);
    }

    .notification-icon {
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-message {
      margin: 0 0 0.5rem 0;
      color: var(--color-navy);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .notification-item.unread .notification-message {
      font-weight: 600;
    }

    .notification-date {
      color: var(--color-gray);
      font-size: 0.75rem;
      display: block;
    }

    .notification-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .unread-badge {
      background-color: var(--color-transfer);
      color: var(--color-white);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-footer {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--color-navy-light);
    }

    .view-all-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--color-navy);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .view-all-link:hover {
      background-color: var(--color-navy-light);
    }

    /* Actions rapides */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      height: 100%;
    }

    @media (min-width: 768px) {
      .quick-actions-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background-color: var(--color-white);
      border: 1px solid var(--color-navy-light);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      height: 100%;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.15);
      border-color: var(--color-navy-medium);
      background-color: var(--color-navy-light);
    }

    .action-icon {
      flex-shrink: 0;
    }

    .action-content {
      flex: 1;
      min-width: 0;
    }

    .action-content h3 {
      margin: 0 0 0.25rem 0;
      color: var(--color-navy);
      font-size: 1rem;
      font-weight: 600;
    }

    .action-content p {
      margin: 0;
      color: var(--color-gray);
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .action-arrow {
      flex-shrink: 0;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .action-card:hover .action-arrow {
      opacity: 1;
      transform: translateX(4px);
    }

    /* Animations */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .user-info {
        width: 100%;
        justify-content: flex-start;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
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
      next: (data: any) => {
        this.dashboardData = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du dashboard:', error);
      }
    });
  }

  loadNotifications(): void {
    this.loadingNotifications = true;
    this.dashboardService.getNotifications().subscribe({
      next: (notifications: any) => {
        this.notifications = notifications;
        this.loadingNotifications = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des notifications:', error);
        this.loadingNotifications = false;
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.id && !notification.lu) {
      this.dashboardService.marquerNotificationLue(notification.id).subscribe({
        next: (response: any) => {
          notification.lu = true;
          this.loadDashboard(); // Recharger pour mettre à jour le compteur
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour de la notification:', error);
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getClientName(): string {
    // Essayer d'obtenir le nom depuis les données du dashboard
    const clientName = localStorage.getItem('clientName') || localStorage.getItem('userName');
    if (clientName) {
      return clientName;
    }
    return "Utilisateur";
  }

  getCurrentMonthTransactions(): number {
    // Retourner 0 si dashboardData est null ou si la propriété n'existe pas
    return 0;
  }
}