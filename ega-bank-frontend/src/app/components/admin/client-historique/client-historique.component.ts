import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Client, Transaction, TypeOperation } from '../../../models/models';

@Component({
  selector: 'app-client-historique',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div class="header-section">
        <div class="breadcrumb">
          <a routerLink="/admin/dashboard">Dashboard</a>
          <span>></span>
          <a routerLink="/admin/clients">Clients</a>
          <span>></span>
          <a [routerLink]="['/admin/clients', clientId]">{{ client?.prenom }} {{ client?.nom }}</a>
          <span>></span>
          <span>Historique</span>
        </div>
        
        <h1>Historique des transactions</h1>
        <div *ngIf="client" class="client-info">
          <h3>{{ client.prenom }} {{ client.nom }}</h3>
          <p>{{ client.courriel }} | {{ client.telephone }}</p>
        </div>
      </div>

      <!-- Filtres et actions -->
      <div class="filters-section">
        <div class="filters">
          <div class="filter-group">
            <label for="typeFilter">Type d'opération</label>
            <select id="typeFilter" [(ngModel)]="filtres.type" (change)="applyFilters()" class="form-control">
              <option value="">Tous les types</option>
              <option value="DEPOT">Dépôts</option>
              <option value="RETRAIT">Retraits</option>
              <option value="VIREMENT">Virements</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="periodeFilter">Période</label>
            <select id="periodeFilter" [(ngModel)]="filtres.periode" (change)="onPeriodeChange()" class="form-control">
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">3 derniers mois</option>
              <option value="365">Dernière année</option>
              <option value="all">Toutes les transactions</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="montantMin">Montant minimum</label>
            <input 
              type="number" 
              id="montantMin" 
              [(ngModel)]="filtres.montantMin" 
              (input)="applyFilters()"
              class="form-control" 
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div class="actions">
          <button (click)="resetFilters()" class="btn btn-outline">
            Réinitialiser
          </button>
          <button (click)="exportPdf()" class="btn btn-secondary" [disabled]="loading">
            📄 Exporter PDF
          </button>
          <button (click)="loadTransactions()" class="btn btn-primary" [disabled]="loading">
            🔄 Actualiser
          </button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-section" *ngIf="transactionsFiltrees.length > 0">
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ transactionsFiltrees.length }}</h3>
              <p>Transactions</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>{{ totalDepots | number:'1.2-2' }} FCFA</h3>
              <p>Total dépôts</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💸</div>
            <div class="stat-content">
              <h3>{{ totalRetraits | number:'1.2-2' }} FCFA</h3>
              <p>Total retraits</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🔄</div>
            <div class="stat-content">
              <h3>{{ totalVirements | number:'1.2-2' }} FCFA</h3>
              <p>Total virements</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des transactions -->
      <div class="transactions-section">
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Chargement des transactions...</p>
        </div>

        <div *ngIf="!loading && transactionsFiltrees.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>Aucune transaction trouvée</h3>
          <p>Ce client n'a effectué aucune transaction correspondant aux critères sélectionnés.</p>
        </div>

        <div *ngIf="!loading && transactionsFiltrees.length > 0" class="transactions-list">
          <div class="transactions-header">
            <h2>{{ transactionsFiltrees.length }} transaction(s) trouvée(s)</h2>
            <div class="sort-options">
              <label>Trier par :</label>
              <select [(ngModel)]="sortBy" (change)="sortTransactions()" class="form-control">
                <option value="date-desc">Date (plus récent)</option>
                <option value="date-asc">Date (plus ancien)</option>
                <option value="montant-desc">Montant (décroissant)</option>
                <option value="montant-asc">Montant (croissant)</option>
              </select>
            </div>
          </div>

          <div class="transaction-item" *ngFor="let transaction of transactionsFiltrees">
            <div class="transaction-header">
              <div class="transaction-type">
                <span class="type-badge" 
                      [class.badge-success]="transaction.type === 'DEPOT'"
                      [class.badge-danger]="transaction.type === 'RETRAIT'"
                      [class.badge-primary]="transaction.type === 'VIREMENT'">
                  {{ getTypeLabel(transaction.type) }}
                </span>
                <span class="transaction-date">{{ transaction.dateOperation | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="transaction-amount">
                <span class="amount" 
                      [class.positive]="transaction.type === 'DEPOT'"
                      [class.negative]="transaction.type === 'RETRAIT' || transaction.type === 'VIREMENT'">
                  {{ getAmountPrefix(transaction.type) }}{{ transaction.montant | number:'1.2-2' }} FCFA
                </span>
              </div>
            </div>

            <div class="transaction-details">
              <div class="detail-row" *ngIf="transaction.compteSource">
                <span class="label">Compte source :</span>
                <span class="value">{{ transaction.compteSource.numeroCompte }}</span>
              </div>
              
              <div class="detail-row" *ngIf="transaction.compteDestination">
                <span class="label">Compte destination :</span>
                <span class="value">{{ transaction.compteDestination.numeroCompte }}</span>
              </div>
              
              <div class="detail-row" *ngIf="transaction.description">
                <span class="label">Description :</span>
                <span class="value">{{ transaction.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      margin-bottom: 32px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #666;
    }

    .breadcrumb a {
      color: var(--primary-purple);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .header-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--primary-purple);
      margin-bottom: 16px;
    }

    .client-info {
      background: var(--gradient-light);
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }

    .client-info h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-purple);
      margin-bottom: 8px;
    }

    .client-info p {
      color: #666;
      margin: 0;
    }

    .filters-section {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .filter-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-dark);
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .stats-section {
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 48px;
      background: var(--gradient-light);
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .stat-content h3 {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-purple);
      margin-bottom: 4px;
    }

    .stat-content p {
      color: #6B7280;
      font-size: 14px;
    }

    .transactions-section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-purple);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #666;
      font-size: 16px;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #eee;
    }

    .transactions-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }

    .sort-options {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sort-options label {
      font-size: 14px;
      color: #666;
    }

    .sort-options select {
      min-width: 200px;
    }

    .transactions-list {
      max-height: 600px;
      overflow-y: auto;
    }

    .transaction-item {
      border-bottom: 1px solid #f0f0f0;
      padding: 20px 24px;
      transition: background-color 0.2s;
    }

    .transaction-item:hover {
      background-color: #f8f9fa;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .transaction-type {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .type-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .transaction-date {
      font-size: 14px;
      color: #666;
    }

    .transaction-amount .amount {
      font-size: 18px;
      font-weight: 700;
    }

    .amount.positive {
      color: #10B981;
    }

    .amount.negative {
      color: #EF4444;
    }

    .transaction-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-row {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }

    .detail-row .label {
      font-weight: 600;
      color: #666;
      min-width: 140px;
    }

    .detail-row .value {
      color: var(--text-dark);
      font-family: monospace;
    }

    .alert {
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .filters {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      .transactions-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .transaction-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .grid-4 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClientHistoriqueComponent implements OnInit {
  clientId!: number;
  client: Client | null = null;
  transactions: Transaction[] = [];
  transactionsFiltrees: Transaction[] = [];
  loading = false;
  errorMessage = '';

  // Statistiques
  totalDepots = 0;
  totalRetraits = 0;
  totalVirements = 0;

  // Filtres
  filtres = {
    type: '',
    periode: '30',
    montantMin: null as number | null
  };

  sortBy = 'date-desc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clientId) {
      this.loadClient();
      this.loadTransactions();
    }
  }

  loadClient(): void {
    this.adminService.getClient(this.clientId).subscribe({
      next: (client) => {
        this.client = client;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client:', error);
        this.errorMessage = 'Impossible de charger les informations du client';
      }
    });
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getHistoriqueClient(this.clientId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
        this.errorMessage = 'Impossible de charger l\'historique des transactions';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.transactions];

    // Filtre par type
    if (this.filtres.type) {
      filtered = filtered.filter(t => t.type === this.filtres.type);
    }

    // Filtre par période
    if (this.filtres.periode !== 'all') {
      const jours = parseInt(this.filtres.periode);
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - jours);
      
      filtered = filtered.filter(t => {
        const dateTransaction = new Date(t.dateOperation);
        return dateTransaction >= dateLimit;
      });
    }

    // Filtre par montant minimum
    if (this.filtres.montantMin !== null && this.filtres.montantMin > 0) {
      filtered = filtered.filter(t => t.montant >= this.filtres.montantMin!);
    }

    this.transactionsFiltrees = filtered;
    this.sortTransactions();
    this.calculateStats();
  }

  onPeriodeChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.filtres = {
      type: '',
      periode: '30',
      montantMin: null
    };
    this.applyFilters();
  }

  sortTransactions(): void {
    this.transactionsFiltrees.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime();
        case 'date-asc':
          return new Date(a.dateOperation).getTime() - new Date(b.dateOperation).getTime();
        case 'montant-desc':
          return b.montant - a.montant;
        case 'montant-asc':
          return a.montant - b.montant;
        default:
          return 0;
      }
    });
  }

  calculateStats(): void {
    this.totalDepots = this.transactionsFiltrees
      .filter(t => t.type === 'DEPOT')
      .reduce((sum, t) => sum + t.montant, 0);

    this.totalRetraits = this.transactionsFiltrees
      .filter(t => t.type === 'RETRAIT')
      .reduce((sum, t) => sum + t.montant, 0);

    this.totalVirements = this.transactionsFiltrees
      .filter(t => t.type === 'VIREMENT')
      .reduce((sum, t) => sum + t.montant, 0);
  }

  getTypeLabel(type: TypeOperation): string {
    switch (type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'VIREMENT': return 'Virement';
      default: return type;
    }
  }

  getAmountPrefix(type: TypeOperation): string {
    switch (type) {
      case 'DEPOT': return '+';
      case 'RETRAIT': return '-';
      case 'VIREMENT': return '-';
      default: return '';
    }
  }

  exportPdf(): void {
    this.adminService.getHistoriqueClientPdf(this.clientId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historique-${this.client?.nom}-${this.client?.prenom}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors de l\'export PDF:', error);
        this.errorMessage = 'Impossible d\'exporter l\'historique en PDF';
      }
    });
  }
}