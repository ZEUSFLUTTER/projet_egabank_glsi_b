import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { Transaction } from '../../../models/transaction.model';
import { Compte } from '../../../models/compte.model';
import { ClientAuthService } from '../../../services/client-auth.service';

@Component({
  selector: 'app-transactions-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="actions-section">
        <div class="action-card">
          <h3>Effectuer un retrait</h3>
          <form (ngSubmit)="effectuerRetrait()" #retraitForm="ngForm">
            <div class="form-group">
              <label>Compte</label>
              <select [(ngModel)]="retraitFormData.compteId" name="compteId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Montant</label>
              <input type="number" [(ngModel)]="retraitFormData.montant" name="montant" required min="0.01" step="0.01" />
            </div>
            <div class="form-group">
              <label>Description (optionnel)</label>
              <input type="text" [(ngModel)]="retraitFormData.description" name="description" />
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="loadingRetrait">Retirer</button>
            <div *ngIf="retraitError" class="error-message">{{ retraitError }}</div>
            <div *ngIf="retraitSuccess" class="success-message">{{ retraitSuccess }}</div>
          </form>
        </div>

        <div class="action-card">
          <h3>Effectuer un virement</h3>
          <form (ngSubmit)="effectuerVirement()" #virementForm="ngForm">
            <div class="form-group">
              <label>Compte source</label>
              <select [(ngModel)]="virementFormData.compteSourceId" name="compteSourceId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Compte destination</label>
              <select [(ngModel)]="virementFormData.compteDestinationId" name="compteDestinationId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Montant</label>
              <input type="number" [(ngModel)]="virementFormData.montant" name="montant" required min="0.01" step="0.01" />
            </div>
            <div class="form-group">
              <label>Description (optionnel)</label>
              <input type="text" [(ngModel)]="virementFormData.description" name="description" />
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="loadingVirement">Virer</button>
            <div *ngIf="virementError" class="error-message">{{ virementError }}</div>
            <div *ngIf="virementSuccess" class="success-message">{{ virementSuccess }}</div>
          </form>
        </div>
      </div>

      <div class="transactions-section">
        <div class="section-header">
          <h2>Historique des transactions</h2>
          <button class="btn btn-secondary" (click)="downloadHistory()">Télécharger l'historique</button>
        </div>
        
        <div *ngIf="loadingTransactions" class="loading">Chargement...</div>
        
        <div *ngIf="!loadingTransactions && transactions.length === 0" class="empty-state">
          <p>Aucune transaction</p>
        </div>

        <div *ngIf="!loadingTransactions && transactions.length > 0" class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of transactions">
                <td>{{ formatDate(transaction.dateTransaction) }}</td>
                <td>{{ getTransactionTypeLabel(transaction.typeTransaction) }}</td>
                <td>{{ transaction.montant | number:'1.2-2' }} F</td>
                <td>{{ transaction.description || '-' }}</td>
              </tr>
            </tbody>
          </table>
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

    .actions-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .action-card {
      background-color: #ffffff;
      border: 1px solid #000000;
      padding: 1.5rem;
    }

    .action-card h3 {
      margin: 0 0 1.5rem 0;
      color: #000000;
      font-size: 1.25rem;
      font-weight: 600;
      border-bottom: 1px solid #000000;
      padding-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #000000;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #000000;
      background-color: #ffffff;
      color: #000000;
      font-size: 1rem;
    }

    .transactions-section {
      margin-top: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: #000000;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .transactions-table {
      border: 1px solid #000000;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #000000;
      color: #ffffff;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    tbody tr:hover {
      background-color: #f5f5f5;
    }

    .loading, .empty-state {
      padding: 2rem;
      text-align: center;
      color: #808080;
    }

    .error-message {
      color: #ff0000;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #ffe6e6;
      border: 1px solid #ff0000;
    }

    .success-message {
      color: #00aa00;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #e6ffe6;
      border: 1px solid #00aa00;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid #000000;
      background-color: #ffffff;
      color: #000000;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn:hover:not(:disabled) {
      background-color: #000000;
      color: #ffffff;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #000000;
      color: #ffffff;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #333333;
    }
  `]
})
export class TransactionsClientComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  loadingTransactions = true;
  loadingRetrait = false;
  loadingVirement = false;
  clientEmail: string | null = null;

  retraitFormData = {
    compteId: null as number | null,
    montant: null as number | null,
    description: ''
  };

  virementFormData = {
    compteSourceId: null as number | null,
    compteDestinationId: null as number | null,
    montant: null as number | null,
    description: ''
  };

  retraitError = '';
  retraitSuccess = '';
  virementError = '';
  virementSuccess = '';

  constructor(
    private dashboardService: ClientDashboardService,
    private clientAuthService: ClientAuthService
  ) {}

  ngOnInit(): void {
    this.clientEmail = this.clientAuthService.getCurrentClientEmail();
    this.loadComptes();
    this.loadTransactions();
  }

  loadComptes(): void {
    this.dashboardService.getComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
      }
    });
  }

  loadTransactions(): void {
    this.loadingTransactions = true;
    this.dashboardService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions:', err);
        this.loadingTransactions = false;
      }
    });
  }

  effectuerRetrait(): void {
    if (!this.retraitFormData.compteId || !this.retraitFormData.montant) {
      this.retraitError = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loadingRetrait = true;
    this.retraitError = '';
    this.retraitSuccess = '';

    this.dashboardService.effectuerRetrait(
      this.retraitFormData.compteId,
      this.retraitFormData.montant,
      this.retraitFormData.description || undefined
    ).subscribe({
      next: () => {
        this.retraitSuccess = 'Retrait effectué avec succès';
        this.retraitFormData = { compteId: null, montant: null, description: '' };
        this.loadComptes();
        this.loadTransactions();
        this.loadingRetrait = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du retrait';
        this.retraitError = errorMessage;
        this.loadingRetrait = false;
        console.error('Erreur retrait:', err);
      }
    });
  }

  effectuerVirement(): void {
    if (!this.virementFormData.compteSourceId || !this.virementFormData.compteDestinationId || !this.virementFormData.montant) {
      this.virementError = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.virementFormData.compteSourceId === this.virementFormData.compteDestinationId) {
      this.virementError = 'Le compte source et le compte destination doivent être différents';
      return;
    }

    this.loadingVirement = true;
    this.virementError = '';
    this.virementSuccess = '';

    this.dashboardService.effectuerVirement(
      this.virementFormData.compteSourceId,
      this.virementFormData.compteDestinationId!,
      this.virementFormData.montant,
      this.virementFormData.description || undefined
    ).subscribe({
      next: () => {
        this.virementSuccess = 'Virement effectué avec succès';
        this.virementFormData = { compteSourceId: null, compteDestinationId: null, montant: null, description: '' };
        this.loadComptes();
        this.loadTransactions();
        this.loadingVirement = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du virement';
        this.virementError = errorMessage;
        this.loadingVirement = false;
        console.error('Erreur virement:', err);
      }
    });
  }

  downloadHistory(): void {
    // Créer un CSV simple
    const headers = ['Date', 'Type', 'Montant', 'Description'];
    const rows = this.transactions.map(t => [
      this.formatDate(t.dateTransaction),
      this.getTransactionTypeLabel(t.typeTransaction),
      t.montant.toString(),
      t.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getTypeCompteLabel(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'TRANSFERT': return 'Virement';
      default: return type;
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
