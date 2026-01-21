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
  template: `
    <div class="container">
  <h1>Tableau de bord</h1>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">▣</div>
      <div class="stat-content">
        <h3>{{ totalClients }}</h3>
        <p>Clients</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">◫</div>
      <div class="stat-content">
        <h3>{{ totalComptes }}</h3>
        <p>Comptes</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">◼</div>
      <div class="stat-content">
        <h4>{{ totalSolde | number:'1.2-2' }} F</h4>
        <p>Solde total</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">▤</div>
      <div class="stat-content">
        <h3>{{ totalTransactions }}</h3>
        <p>Transactions</p>
      </div>
    </div>
  </div>

  <div class="dashboard-grid">
    <div class="card">
      <div class="card-header">
        <h2>Derniers clients</h2>
      </div>
      <div *ngIf="loadingClients" class="loading">Chargement...</div>
      <div *ngIf="!loadingClients && recentClients.length === 0" class="empty-state">
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
        <h2>Dernières transactions</h2>
      </div>
      <div *ngIf="loadingTransactions" class="loading">Chargement...</div>
      <div *ngIf="!loadingTransactions && recentTransactions.length === 0" class="empty-state">
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
            <td>{{ getTransactionTypeLabel(transaction.typeTransaction) }}</td>
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
  styles: [`
    :host {
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray: #808080;
  --color-light-gray: #f5f5f5;
  --color-medium-gray: #e0e0e0;
  --color-dark-gray: #333333;
}

.container {
  padding: 2rem;
  background-color: var(--color-white);
  min-height: 100vh;
}

h1 {
  margin-bottom: 2.5rem;
  color: var(--color-black);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  border-bottom: 2px solid var(--color-black);
  padding-bottom: 1rem;
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

/* Tables */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table thead {
  background-color: var(--color-light-gray);
}

.table th {
  padding: 1rem 1.25rem;
  text-align: left;
  color: var(--color-black);
  font-weight: 600;
  border-bottom: 1px solid var(--color-medium-gray);
  border-right: 1px solid var(--color-medium-gray);
}

.table th:last-child {
  border-right: none;
}

.table td {
  padding: 1rem 1.25rem;
  color: var(--color-dark-gray);
  border-bottom: 1px solid var(--color-medium-gray);
  border-right: 1px solid var(--color-medium-gray);
}

.table td:last-child {
  border-right: none;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--color-light-gray);
}

/* Loading and Empty States */
.loading, .empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-gray);
  font-size: 0.9rem;
}

.empty-state p {
  margin: 0;
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

