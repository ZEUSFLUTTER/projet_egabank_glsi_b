import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompteService, Compte } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';

interface DashboardStats {
  totalClients: number;
  totalComptes: number;
  totalTransactions: number;
  soldeGlobal: number;
  comptesParType: { [key: string]: number };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📊 Tableau de Bord</h1>
        <p class="subtitle">Bienvenue! Voici un aperçu de votre système bancaire</p>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des données...</p>
      </div>

      <div *ngIf="!isLoading" class="dashboard-content">
        <!-- Cartes de statistiques principales -->
        <div class="stats-grid">
          <div class="stat-card card-clients">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Clients</h3>
              <p class="stat-number">{{ stats.totalClients }}</p>
              <small>clients actifs</small>
            </div>
          </div>

          <div class="stat-card card-comptes">
            <div class="stat-icon">💳</div>
            <div class="stat-info">
              <h3>Comptes</h3>
              <p class="stat-number">{{ stats.totalComptes }}</p>
              <small>comptes ouverts</small>
            </div>
          </div>

          <div class="stat-card card-transactions">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>Transactions</h3>
              <p class="stat-number">{{ stats.totalTransactions }}</p>
              <small>transactions</small>
            </div>
          </div>

          <div class="stat-card card-solde">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <h3>Solde Total</h3>
              <p class="stat-number">{{ stats.soldeGlobal | currency:'EUR':'symbol':'1.2-2' }}</p>
              <small>somme des soldes</small>
            </div>
          </div>
        </div>

        <!-- Section Comptes par Type -->
        <div class="section">
          <h2>📋 Répartition des Comptes</h2>
          <div class="compte-distribution">
            <div class="distribution-item">
              <div class="distribution-label">
                <span class="label-icon">💼</span>
                <span>Comptes Courants</span>
              </div>
              <div class="distribution-bar">
                <div class="bar-fill"
                     [style.width.%]="stats.comptesParType['COURANT'] ? (stats.comptesParType['COURANT'] / stats.totalComptes * 100) : 0">
                </div>
              </div>
              <span class="distribution-count">{{ stats.comptesParType['COURANT'] || 0 }}</span>
            </div>

            <div class="distribution-item">
              <div class="distribution-label">
                <span class="label-icon">🏦</span>
                <span>Comptes Épargne</span>
              </div>
              <div class="distribution-bar">
                <div class="bar-fill epargne"
                     [style.width.%]="stats.comptesParType['EPARGNE'] ? (stats.comptesParType['EPARGNE'] / stats.totalComptes * 100) : 0">
                </div>
              </div>
              <span class="distribution-count">{{ stats.comptesParType['EPARGNE'] || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Section Actions Rapides -->
        <div class="section">
          <h2>⚡ Actions Rapides</h2>
          <div class="quick-actions">
            <a routerLink="/clients/new" class="action-btn action-clients">
              <div class="action-icon">➕</div>
              <div class="action-text">
                <h4>Ajouter Client</h4>
                <p>Créer un nouveau client</p>
              </div>
            </a>

            <a routerLink="/comptes/new" class="action-btn action-comptes">
              <div class="action-icon">🆕</div>
              <div class="action-text">
                <h4>Ouvrir Compte</h4>
                <p>Créer un nouveau compte</p>
              </div>
            </a>

            <a routerLink="/clients" class="action-btn action-view">
              <div class="action-icon">👁️</div>
              <div class="action-text">
                <h4>Voir Clients</h4>
                <p>Consulter tous les clients</p>
              </div>
            </a>

            <a routerLink="/comptes" class="action-btn action-view">
              <div class="action-icon">👁️</div>
              <div class="action-text">
                <h4>Voir Comptes</h4>
                <p>Consulter tous les comptes</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Section Info -->
        <div class="info-section">
          <div class="info-card">
            <h3>ℹ️ À Propos</h3>
            <p>EgaBank est votre plateforme bancaire digitale complète. Gérez vos clients, comptes et transactions de manière sécurisée et efficace.</p>
          </div>
          <div class="info-card">
            <h3>🔒 Sécurité</h3>
            <p>Vos données sont protégées par le chiffrement JWT et les meilleures pratiques de sécurité. Accès authentifié requis.</p>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
      background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
      min-height: 100vh;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
      color: #2c3e50;
    }

    .dashboard-header h1 {
      font-size: 2.5em;
      margin: 0 0 10px 0;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1em;
      color: #7f8c8d;
      margin: 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 20px;
    }

    .spinner {
      border: 4px solid #ecf0f1;
      border-top: 4px solid #34495e;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      border-left: 5px solid #34495e;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-card.card-clients { border-left-color: #3498db; }
    .stat-card.card-comptes { border-left-color: #2ecc71; }
    .stat-card.card-transactions { border-left-color: #f39c12; }
    .stat-card.card-solde { border-left-color: #e74c3c; }

    .stat-icon {
      font-size: 3em;
      min-width: 80px;
      text-align: center;
    }

    .stat-info {
      flex: 1;
    }

    .stat-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1.1em;
    }

    .stat-number {
      font-size: 2em;
      font-weight: 700;
      color: #34495e;
      margin: 5px 0;
    }

    .stat-info small {
      color: #95a5a6;
      font-size: 0.9em;
    }

    /* Section */
    .section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .section h2 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 25px;
      font-size: 1.5em;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 15px;
    }

    /* Distribution */
    .compte-distribution {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .distribution-item {
      display: grid;
      grid-template-columns: 150px 1fr 80px;
      align-items: center;
      gap: 15px;
    }

    .distribution-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #2c3e50;
    }

    .label-icon {
      font-size: 1.5em;
    }

    .distribution-bar {
      height: 30px;
      background: #ecf0f1;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2980b9);
      border-radius: 15px;
      transition: width 0.5s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      color: white;
      font-weight: 600;
      font-size: 0.9em;
    }

    .bar-fill.epargne {
      background: linear-gradient(90deg, #2ecc71, #27ae60);
    }

    .distribution-count {
      text-align: right;
      font-weight: 700;
      color: #34495e;
      font-size: 1.2em;
    }

    /* Quick Actions */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      background: white;
      border: 2px solid #ecf0f1;
      border-radius: 10px;
      text-decoration: none;
      color: #2c3e50;
      transition: all 0.3s;
      cursor: pointer;
    }

    .action-btn:hover {
      transform: translateX(5px);
      border-color: #34495e;
      box-shadow: 0 4px 15px rgba(52, 73, 94, 0.2);
    }

    .action-btn.action-clients {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }

    .action-btn.action-comptes {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }

    .action-btn.action-view {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .action-icon {
      font-size: 2em;
      min-width: 50px;
      text-align: center;
    }

    .action-text h4 {
      margin: 0;
      font-size: 1.1em;
      color: #2c3e50;
    }

    .action-text p {
      margin: 5px 0 0 0;
      color: #7f8c8d;
      font-size: 0.9em;
    }

    /* Info Section */
    .info-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border-top: 4px solid #34495e;
    }

    .info-card h3 {
      margin-top: 0;
      color: #2c3e50;
    }

    .info-card p {
      color: #7f8c8d;
      line-height: 1.6;
      margin: 10px 0 0 0;
    }

    /* Alert */
    .alert {
      padding: 15px 20px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 20px 15px;
      }

      .dashboard-header h1 {
        font-size: 1.8em;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .distribution-item {
        grid-template-columns: 120px 1fr 60px;
        gap: 10px;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 15px;
      }

      .stat-icon {
        font-size: 2em;
        min-width: 60px;
      }

      .stat-number {
        font-size: 1.5em;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalClients: 0,
    totalComptes: 0,
    totalTransactions: 0,
    soldeGlobal: 0,
    comptesParType: {}
  };

  isLoading = true;
  error = '';

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = '';

    Promise.all([
      this.loadClients(),
      this.loadComptes(),
      this.loadTransactions()
    ])
      .then(() => {
        this.isLoading = false;
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du dashboard', err);
        this.error = 'Erreur lors du chargement des données du dashboard';
        this.isLoading = false;
      });
  }

  loadClients(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientService.getAll().subscribe({
        next: (data) => {
          this.stats.totalClients = data.length;
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  loadComptes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.compteService.getAll().subscribe({
        next: (data: Compte[]) => {
          this.stats.totalComptes = data.length;
          this.stats.soldeGlobal = data.reduce((sum, compte) => sum + (compte.solde || 0), 0);

          this.stats.comptesParType = {};
          data.forEach(compte => {
            if (compte.typeCompte) {
              this.stats.comptesParType[compte.typeCompte] = (this.stats.comptesParType[compte.typeCompte] || 0) + 1;
            }
          });
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  loadTransactions(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Note: Vous devriez ajouter une méthode getAll() à TransactionService
      // Pour l'instant, on initialise simplement le compte de transactions
      this.stats.totalTransactions = 0;
      resolve();
    });
  }
}
