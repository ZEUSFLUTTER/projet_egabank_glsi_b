import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CompteService } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { Transaction } from '../../models/transaction.model';
import { Compte } from '../../models/compte.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Gestion des Transactions</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="openTransactionModal('DEPOT')">+ Dépôt</button>
          <button class="btn btn-primary" (click)="openTransactionModal('RETRAIT')">- Retrait</button>
          <button class="btn btn-primary" (click)="openTransactionModal('VIREMENT')">⇄ Virement</button>
        </div>
      </div>

      <div class="card filters-card">
        <h3>Filtres</h3>
        <div class="filters-grid">
          <div class="form-group">
            <label for="filterCompte">Compte</label>
            <select id="filterCompte" name="filterCompte" [(ngModel)]="filterCompteId" (change)="loadTransactions()">
              <option value="">Tous les comptes</option>
              <option *ngFor="let compte of comptes" [value]="compte.id">{{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dateDebut">Date début</label>
            <input type="date" id="dateDebut" name="dateDebut" [(ngModel)]="dateDebut" (change)="loadTransactions()" />
          </div>
          <div class="form-group">
            <label for="dateFin">Date fin</label>
            <input type="date" id="dateFin" name="dateFin" [(ngModel)]="dateFin" (change)="loadTransactions()" />
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button class="btn btn-secondary" (click)="clearFilters()">Réinitialiser</button>
          </div>
        </div>
      </div>

      <div *ngIf="filterCompteId" class="card">
        <div class="card-header">
          <h3>Générer un relevé</h3>
        </div>
        <button class="btn btn-primary" (click)="downloadReleve()">Télécharger le relevé PDF</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && transactions.length === 0" class="empty-state">
        <p>Aucune transaction trouvée</p>
      </div>

      <div *ngIf="!loading && transactions.length > 0" class="card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Compte source</th>
              <th>Compte destinataire</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of transactions">
              <td>{{ transaction.id }}</td>
              <td>
                <span [class]="'badge badge-' + transaction.typeTransaction.toLowerCase()">
                  {{ getTransactionTypeLabel(transaction.typeTransaction) }}
                </span>
              </td>
              <td>{{ transaction.montant | number:'1.2-2' }} F</td>
              <td>{{ formatDate(transaction.dateTransaction) }}</td>
              <td>{{ transaction.compteSourceId ? getCompteClientName(transaction.compteSourceId) : '-' }}</td>
              <td>{{ transaction.compteDestinationId ? getCompteClientName(transaction.compteDestinationId) : '-' }}</td>
              <td>{{ transaction.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Transaction -->
      <div class="modal" [class.show]="showModal" (click)="closeModalOnBackdrop($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ getTransactionModalTitle() }}</h3>
            <button class="close" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="executeTransaction()" #transactionForm="ngForm">
            <div class="form-group" *ngIf="transactionType !== 'VIREMENT'">
              <label for="compteId">Compte *</label>
              <select id="compteId" name="compteId" [(ngModel)]="transactionData.compteId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }} - Solde: {{ compte.solde | number:'1.2-2' }} F
                </option>
              </select>
            </div>
            <div class="form-group" *ngIf="transactionType === 'VIREMENT'">
              <label for="compteSourceId">Compte source *</label>
              <select id="compteSourceId" name="compteSourceId" [(ngModel)]="transactionData.compteSourceId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }} - Solde: {{ compte.solde | number:'1.2-2' }} F
                </option>
              </select>
            </div>
            <div class="form-group" *ngIf="transactionType === 'VIREMENT'">
              <label for="compteDestId">Compte destinataire *</label>
              <select id="compteDestId" name="compteDestId" [(ngModel)]="transactionData.compteDestId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="montant">Montant *</label>
              <input type="number" id="montant" name="montant" [(ngModel)]="transactionData.montant" step="0.01" min="0.01" required />
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" name="description" [(ngModel)]="transactionData.description" rows="3"></textarea>
            </div>
            <div *ngIf="error" class="error-message">{{ error }}</div>
            <div *ngIf="success" class="success-message">{{ success }}</div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary">Exécuter</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .page-header h1 {
      margin: 0;
      color: var(--color-black);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .filters-card {
      margin-bottom: 20px;
    }

    .filters-card h3 {
      margin-top: 0;
      color: var(--color-black);
      text-transform: uppercase;
      font-size: 14px;
      letter-spacing: 1px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .table {
      font-size: 14px;
    }

    .table td {
      font-size: 13px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-depot {
      background-color: var(--color-success);
      color: var(--color-white);
    }

    .badge-retrait {
      background-color: var(--color-error);
      color: var(--color-white);
    }

    .badge-virement {
      background-color: var(--color-gray);
      color: var(--color-white);
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  clients: Client[] = [];
  loading = true;
  showModal = false;
  transactionType: 'DEPOT' | 'RETRAIT' | 'VIREMENT' = 'DEPOT';
  transactionData: any = {
    compteId: null,
    compteSourceId: null,
    compteDestId: null,
    montant: null,
    description: ''
  };
  filterCompteId: number | null = null;
  dateDebut = '';
  dateFin = '';
  error = '';
  success = '';

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
    this.loadClients();
    this.loadTransactions();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
      }
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      }
    });
  }

  loadTransactions(): void {
    this.loading = true;
    if (this.filterCompteId) {
      this.transactionService.getTransactionsByCompte(
        this.filterCompteId,
        this.dateDebut || undefined,
        this.dateFin || undefined
      ).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.transactionService.getAllTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  clearFilters(): void {
    this.filterCompteId = null;
    this.dateDebut = '';
    this.dateFin = '';
    this.loadTransactions();
  }

  openTransactionModal(type: 'DEPOT' | 'RETRAIT' | 'VIREMENT'): void {
    this.transactionType = type;
    this.transactionData = {
      compteId: null,
      compteSourceId: null,
      compteDestId: null,
      montant: null,
      description: ''
    };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeModalOnBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  getTransactionModalTitle(): string {
    const titles: { [key: string]: string } = {
      'DEPOT': 'Effectuer un dépôt',
      'RETRAIT': 'Effectuer un retrait',
      'VIREMENT': 'Effectuer un virement'
    };
    return titles[this.transactionType] || 'Transaction';
  }

  executeTransaction(): void {
    this.error = '';
    this.success = '';

    if (this.transactionType === 'DEPOT') {
      this.transactionService.effectuerDepot(
        this.transactionData.compteId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Dépôt effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du dépôt';
          this.error = errorMessage;
          console.error('Erreur dépôt:', err);
        }
      });
    } else if (this.transactionType === 'RETRAIT') {
      this.transactionService.effectuerRetrait(
        this.transactionData.compteId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Retrait effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du retrait';
          this.error = errorMessage;
          console.error('Erreur retrait:', err);
        }
      });
    } else if (this.transactionType === 'VIREMENT') {
      this.transactionService.effectuerVirement(
        this.transactionData.compteSourceId,
        this.transactionData.compteDestId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Virement effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du virement';
          this.error = errorMessage;
          console.error('Erreur virement:', err);
        }
      });
    }
  }

  downloadReleve(): void {
    if (!this.filterCompteId) {
      alert('Veuillez sélectionner un compte');
      return;
    }

    this.transactionService.downloadReleve(
      this.filterCompteId,
      this.dateDebut || undefined,
      this.dateFin || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_compte_${this.filterCompteId}_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors du téléchargement du relevé');
      }
    });
  }

  getTransactionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'TRANSFERT': 'Virement'
    };
    return labels[type] || type;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getClientName(clientId?: number): string {
    if (!clientId) return 'Client inconnu';
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  }

  getTypeLabel(type: string): string {
    if (type === 'COURANT') return 'Courant';
    if (type === 'EPARGNE') return 'Épargne';
    return type;
  }

  getCompteClientName(compteId: number): string {
    const compte = this.comptes.find(c => c.id === compteId);
    if (!compte) return 'Inconnu';
    return this.getClientName(compte.clientId);
  }
}

