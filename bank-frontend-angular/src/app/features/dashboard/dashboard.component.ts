import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { ClientService } from '../../core/services/client.service';
import { CompteService } from '../../core/services/compte.service';
import { TransactionService } from '../../core/services/transaction.service';

interface DashboardStats {
  totalClients: number;
  totalComptes: number;
  totalTransactions: number;
  soldeTotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de bord - Banque EGA</h1>
      
      <div class="stats-grid" *ngIf="!isLoading; else loadingTemplate">
        <mat-card class="stat-card clients">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ stats.totalClients }}</h2>
                <p>Clients</p>
              </div>
            </div>
            <button mat-button color="primary" (click)="navigateToClients()">
              Voir tous
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card comptes">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>account_balance_wallet</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ stats.totalComptes }}</h2>
                <p>Comptes</p>
              </div>
            </div>
            <button mat-button color="primary" (click)="navigateToComptes()">
              Voir tous
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card transactions">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>swap_horiz</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ stats.totalTransactions }}</h2>
                <p>Transactions</p>
              </div>
            </div>
            <button mat-button color="primary" (click)="navigateToTransactions()">
              Voir toutes
            </button>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card solde">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="stat-info">
                <h2>{{ stats.soldeTotal | currency:'XOF':'symbol':'1.0-0' }}</h2>
                <p>Solde Total</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des statistiques...</p>
        </div>
      </ng-template>

      <div class="quick-actions" *ngIf="!isLoading">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" (click)="navigateToNewClient()">
            <mat-icon>person_add</mat-icon>
            Nouveau Client
          </button>
          <button mat-raised-button color="accent" (click)="navigateToTransactions()">
            <mat-icon>add</mat-icon>
            Nouvelle Transaction
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card.clients {
      border-left: 4px solid #2196F3;
    }

    .stat-card.comptes {
      border-left: 4px solid #4CAF50;
    }

    .stat-card.transactions {
      border-left: 4px solid #FF9800;
    }

    .stat-card.solde {
      border-left: 4px solid #9C27B0;
    }

    .stat-content {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .stat-icon {
      margin-right: 15px;
    }

    .stat-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
    }

    .stat-info h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .stat-info p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    .quick-actions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .quick-actions h2 {
      margin-top: 0;
      color: #333;
    }

    .actions-grid {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .actions-grid button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalClients: 0,
    totalComptes: 0,
    totalTransactions: 0,
    soldeTotal: 0
  };
  
  isLoading = true;

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.isLoading = true;
    
    // Charger les statistiques en parallèle
    Promise.all([
      this.clientService.getAllClients().toPromise(),
      this.compteService.getAllComptes().toPromise(),
      this.transactionService.getAllTransactions().toPromise()
    ]).then(([clients, comptes, transactions]) => {
      this.stats.totalClients = clients?.length || 0;
      this.stats.totalComptes = comptes?.length || 0;
      this.stats.totalTransactions = transactions?.length || 0;
      this.stats.soldeTotal = comptes?.reduce((total, compte) => total + (compte.solde || 0), 0) || 0;
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement des statistiques:', error);
      this.isLoading = false;
    });
  }

  navigateToClients() {
    this.router.navigate(['/clients']);
  }

  navigateToComptes() {
    this.router.navigate(['/comptes']);
  }

  navigateToTransactions() {
    this.router.navigate(['/transactions']);
  }

  navigateToNewClient() {
    this.router.navigate(['/clients/new']);
  }
}