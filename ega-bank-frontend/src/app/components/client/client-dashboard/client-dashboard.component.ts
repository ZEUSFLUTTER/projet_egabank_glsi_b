import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { AuthService } from '../../../services/auth.service';
import { Compte } from '../../../models/models';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="dashboard-title">
              <svg class="title-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              Mon Tableau de Bord
            </h1>
            <p class="dashboard-subtitle">Bienvenue dans votre espace bancaire personnel</p>
          </div>
          <div class="header-decoration">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-card">
          <div class="loading-spinner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </div>
          <h3>Chargement de vos comptes...</h3>
          <p>Nous récupérons vos informations bancaires</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage && !isLoading" class="error-container">
        <div class="error-card">
          <div class="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Erreur de chargement</h3>
          <p>{{ errorMessage }}</p>
          <button (click)="retryLoad()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Réessayer
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="!isLoading && !errorMessage" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card stat-card-primary">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ comptes.length }}</h3>
                <p class="stat-label">Mes comptes</p>
              </div>
              <div class="stat-decoration"></div>
            </div>

            <div class="stat-card stat-card-success">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ totalSolde | number:'1.2-2' }}</h3>
                <p class="stat-label">Solde total (FCFA)</p>
              </div>
              <div class="stat-decoration"></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h2 class="section-title">Actions rapides</h2>
          <div class="actions-grid">
            <a routerLink="/client/comptes/new" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3>Nouveau Compte</h3>
              <p>Créer un nouveau compte bancaire</p>
            </a>

            <a routerLink="/client/operations" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </div>
              <h3>Opérations</h3>
              <p>Effectuer des transactions</p>
            </a>

            <a routerLink="/client/historique" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <h3>Historique</h3>
              <p>Consulter vos transactions</p>
            </a>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="comptes.length === 0" class="empty-state">
          <div class="empty-card">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Aucun compte trouvé</h3>
            <p>Vous n'avez pas encore de compte bancaire. Créez votre premier compte pour commencer votre parcours bancaire.</p>
            <a routerLink="/client/comptes/new" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Créer mon premier compte
            </a>
          </div>
        </div>

        <!-- Accounts List -->
        <div *ngIf="comptes.length > 0" class="accounts-section">
          <h2 class="section-title">Mes comptes</h2>
          <div class="accounts-grid">
            <div *ngFor="let compte of comptes" class="account-card">
              <div class="account-header">
                <span class="account-type" [class.type-courant]="compte.type === 'COURANT'" [class.type-epargne]="compte.type === 'EPARGNE'">
                  {{ compte.type }}
                </span>
                <span class="account-number">{{ compte.numeroCompte }}</span>
              </div>
              <div class="account-balance">
                <span class="balance-label">Solde disponible</span>
                <span class="balance-amount">{{ compte.solde | number:'1.2-2' }} <span class="currency">FCFA</span></span>
              </div>
              <a [routerLink]="['/client/comptes', compte.numeroCompte]" class="btn btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Voir détails
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 20px;
    }

    .dashboard-header {
      margin-bottom: 40px;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 20px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .header-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
      border-radius: 24px;
    }

    .welcome-section {
      position: relative;
      z-index: 2;
    }

    .dashboard-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-icon {
      color: #6366f1;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }

    .dashboard-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      opacity: 0.8;
    }

    .header-decoration {
      position: relative;
      z-index: 2;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
      animation: shapeFloat 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 60px;
      height: 60px;
      top: -20px;
      right: 20px;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 40px;
      height: 40px;
      top: 40px;
      right: -10px;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 30px;
      height: 30px;
      bottom: -10px;
      right: 60px;
      animation-delay: 4s;
    }

    @keyframes shapeFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(180deg); }
    }

    .loading-container, .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loading-card, .error-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 400px;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
      margin-bottom: 24px;
      color: #6366f1;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error-icon {
      color: #ef4444;
      margin-bottom: 24px;
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-section {
      margin-bottom: 60px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 0 4px 4px 0;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .stat-card-primary::before {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }

    .stat-card-success::before {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
    }

    .stat-card-primary .stat-icon {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }

    .stat-card-success .stat-icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-decoration {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .stat-content h3 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 4px;
      color: #1f2937;
    }

    .stat-content p {
      color: #6b7280;
      font-weight: 500;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 32px;
      text-align: center;
    }

    .actions-section {
      margin-bottom: 60px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 32px;
      text-align: center;
      text-decoration: none;
      color: #1f2937;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .action-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
      transition: left 0.6s;
    }

    .action-card:hover::before {
      left: 100%;
    }

    .action-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .action-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 0 auto 20px;
      transition: all 0.3s ease;
    }

    .action-card:hover .action-icon {
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }

    .action-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .action-card p {
      color: #6b7280;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .empty-state {
      margin-bottom: 60px;
    }

    .empty-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 60px 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      color: #d1d5db;
      margin-bottom: 24px;
    }

    .empty-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .empty-card p {
      color: #6b7280;
      margin-bottom: 32px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .accounts-section {
      margin-bottom: 60px;
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .account-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 32px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .account-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
    }

    .account-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .account-type {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-courant {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .type-epargne {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .account-number {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .account-balance {
      margin-bottom: 24px;
    }

    .balance-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .balance-amount {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
    }

    .currency {
      font-size: 1rem;
      font-weight: 600;
      color: #6b7280;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 0.875rem;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }

    .btn-outline {
      background: transparent;
      color: #6366f1;
      border: 2px solid #6366f1;
    }

    .btn-outline:hover {
      background: #6366f1;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 24px;
        padding: 32px 20px;
      }

      .dashboard-title {
        font-size: 2rem;
      }

      .stats-grid, .actions-grid, .accounts-grid {
        grid-template-columns: 1fr;
      }

      .stat-card, .action-card, .account-card {
        padding: 24px;
      }

      .floating-shape {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .dashboard-title {
        font-size: 1.75rem;
      }

      .stat-content h3 {
        font-size: 2rem;
      }

      .balance-amount {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  comptes: Compte[] = [];
  totalSolde = 0;
  errorMessage = '';
  isLoading = true;

  constructor(
    private compteService: CompteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  private loadComptes(): void {
    // Vérifier d'abord l'authentification
    if (!this.authService.isAuthenticated()) {
      console.error('Utilisateur non authentifié');
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier le rôle
    if (!this.authService.isClient()) {
      console.error('Accès refusé: rôle incorrect');
      this.router.navigate(['/login']);
      return;
    }

    console.log('🔍 Chargement des comptes...');
    console.log('📧 Email utilisateur:', this.authService.getEmail());
    console.log('🎭 Rôle utilisateur:', this.authService.getRole());
    console.log('🔑 Token présent:', !!this.authService.getToken());

    this.isLoading = true;
    this.errorMessage = '';

    this.compteService.listMyComptes().subscribe({
      next: (comptes) => {
        console.log('✅ Comptes reçus:', comptes);
        this.comptes = comptes;
        this.totalSolde = comptes.reduce((sum, c) => sum + c.solde, 0);
        this.errorMessage = '';
        this.isLoading = false;

        if (comptes.length === 0) {
          console.log('ℹ️ Aucun compte trouvé pour cet utilisateur');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des comptes:', error);
        this.isLoading = false;
        
        // Gestion spécifique des erreurs
        if (error.status === 401) {
          this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.authService.logout();
        } else if (error.status === 403) {
          this.errorMessage = 'Accès refusé. Vérifiez vos permissions.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = `Erreur lors du chargement des comptes (${error.status}). Veuillez réessayer.`;
        }
      }
    });
  }

  retryLoad(): void {
    this.loadComptes();
  }
}
