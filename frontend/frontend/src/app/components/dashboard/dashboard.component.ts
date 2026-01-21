import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';
import { Client } from '../../models/client.model';
import { Compte } from '../../models/compte.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="dashboard-container">
  <div class="dashboard-header">
    <div class="header-content">
      <h1>Tableau de bord</h1>
      <p>Vue d'ensemble de votre espace Banque Ega</p>
    </div>
    <div class="logo-container">
      <div class="bank-logo">BE</div>
    </div>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#ffffff"/>
        </svg>
      </div>
      <div class="stat-content">
        <h3>{{ totalClients }}</h3>
        <p>Clients</p>
      </div>
      <div class="stat-trend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="#ffffff"/>
        </svg>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#ffffff"/>
        </svg>
      </div>
      <div class="stat-content">
        <h3>{{ totalComptes }}</h3>
        <p>Comptes</p>
      </div>
      <div class="stat-trend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="#ffffff"/>
        </svg>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#ffffff"/>
        </svg>
      </div>
      <div class="stat-content">
        <h4>{{ totalSolde | number:'1.2-2' }} F</h4>
        <p>Solde total</p>
      </div>
      <div class="stat-trend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="#ffffff"/>
        </svg>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="#ffffff"/>
        </svg>
      </div>
      <div class="stat-content">
        <h3>{{ totalTransactions }}</h3>
        <p>Transactions</p>
      </div>
      <div class="stat-trend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="#ffffff"/>
        </svg>
      </div>
    </div>
  </div>

  <div class="dashboard-content">
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#ffffff"/>
          </svg>
          <h2>Derniers clients</h2>
        </div>
       
      </div>
      <div *ngIf="loadingClients" class="loading">
        <div class="loading-spinner"></div>
        <span>Chargement...</span>
      </div>
      <div *ngIf="!loadingClients && recentClients.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#000080"/>
        </svg>
        <p>Aucun client</p>
      </div>
      <table *ngIf="!loadingClients && recentClients.length > 0" class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let client of recentClients">
            <td>{{ client.nom }}</td>
            <td>{{ client.prenom }}</td>
            <td>{{ client.courriel }}</td>
            <td>{{ client.numTelephone }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
            <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="#ffffff"/>
          </svg>
          <h2>Dernières transactions</h2>
        </div>
       
      </div>
      <div *ngIf="loadingTransactions" class="loading">
        <div class="loading-spinner"></div>
        <span>Chargement...</span>
      </div>
      <div *ngIf="!loadingTransactions && recentTransactions.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#000080"/>
        </svg>
        <p>Aucune transaction</p>
      </div>
      <table *ngIf="!loadingTransactions && recentTransactions.length > 0" class="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Compte</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of recentTransactions">
            <td>
              <span class="transaction-type" 
                    [class.transaction-depot]="transaction.typeTransaction === 'DEPOT'" 
                    [class.transaction-retrait]="transaction.typeTransaction === 'RETRAIT'"
                    [class.transaction-transfert]="transaction.typeTransaction === 'TRANSFERT'">
                {{ getTransactionTypeLabel(transaction.typeTransaction) }}
              </span>
            </td>
            <td>{{ transaction.montant | number:'1.2-2' }} F</td>
            <td>{{ formatDate(transaction.dateTransaction) }}</td>
            <td>{{ transaction.compteSourceId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
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

.dashboard-container {
  height: 100vh;
  width: 100%;
  background-color: var(--color-gray-light);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-navy-light);
  flex-shrink: 0;
}

.header-content h1 {
  margin: 0 0 0.25rem 0;
  color: var(--color-navy);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-content p {
  margin: 0;
  color: var(--color-gray);
  font-size: 0.9rem;
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.stat-card {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-white) 0%, rgba(255, 255, 255, 0.5) 100%);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  flex-shrink: 0;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3, .stat-content h4 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-white);
  font-weight: 700;
  line-height: 1;
}

.stat-content p {
  margin: 0.25rem 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.stat-trend {
  opacity: 0.8;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1rem;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.card {
  background-color: var(--color-white);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.card:hover {
  transform: translateY(-1px);
}

.card-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-navy-light);
  flex-shrink: 0;
}

.card-title {
  display: flex;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: var(--color-white);
  font-size: 1.1rem;
  font-weight: 600;
}

.view-all {
  color: var(--color-white);
  font-size: 0.8rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.view-all:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateX(2px);
}

/* Tables */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: block;
}

.table thead {
  background-color: var(--color-gray-light);
  position: sticky;
  top: 0;
}

.table th {
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--color-navy);
  font-weight: 600;
  border-bottom: 1px solid var(--color-navy-light);
  border-right: 1px solid var(--color-navy-light);
  white-space: nowrap;
}

.table th:last-child {
  border-right: none;
}

.table td {
  padding: 0.75rem 1rem;
  color: var(--color-gray);
  border-bottom: 1px solid var(--color-navy-light);
  border-right: 1px solid var(--color-navy-light);
  white-space: nowrap;
}

.table td:last-child {
  border-right: none;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--color-navy-light);
}

.transaction-type {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: inline-block;
}

.transaction-depot {
  background-color: rgba(0, 128, 0, 0.1);
  color: var(--color-success);
}

.transaction-retrait {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--color-error);
}

.transaction-transfert {
  background-color: rgba(0, 0, 128, 0.1);
  color: var(--color-navy);
}

/* Loading and Empty States */
.loading {
  padding: 2rem;
  text-align: center;
  color: var(--color-gray);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid var(--color-navy-light);
  border-top-color: var(--color-navy);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-gray);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  justify-content: center;
}

.empty-state p {
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
    height: auto;
    min-height: 100vh;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .view-all {
    align-self: flex-start;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .table {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .bank-logo {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .stat-content h3, .stat-content h4 {
    font-size: 1.3rem;
  }
  
  .card-header h2 {
    font-size: 1rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
  `]
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  totalComptes = 0;
  totalSolde = 0;
  totalTransactions = 0;
  recentClients: Client[] = [];
  recentTransactions: Transaction[] = [];
  loadingClients = true;
  loadingTransactions = true;

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentClients();
    this.loadRecentTransactions();
  }

  loadStats(): void {
    this.clientService.getAllClients().subscribe(clients => {
      this.totalClients = clients.length;
      this.recentClients = clients.slice(-5).reverse();
    });

    this.compteService.getAllComptes().subscribe(comptes => {
      this.totalComptes = comptes.length;
      this.totalSolde = comptes.reduce((sum, compte) => sum + (compte.solde ?? 0), 0);
    });

    this.transactionService.getAllTransactions().subscribe(transactions => {
      this.totalTransactions = transactions.length;
    });
  }

  loadRecentClients(): void {
    this.loadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.recentClients = clients.slice(-5).reverse();
        this.loadingClients = false;
      },
      error: () => {
        this.loadingClients = false;
      }
    });
  }

  loadRecentTransactions(): void {
    this.loadingTransactions = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(-10).reverse();
        this.loadingTransactions = false;
      },
      error: () => {
        this.loadingTransactions = false;
      }
    });
  }

  getTransactionTypeLabel(
  type: 'DEPOT' | 'RETRAIT' | 'TRANSFERT'
): string {
  switch (type) {
    case 'DEPOT': return 'Dépôt';
    case 'RETRAIT': return 'Retrait';
    case 'TRANSFERT': return 'Transfert';
  }
}


  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}

