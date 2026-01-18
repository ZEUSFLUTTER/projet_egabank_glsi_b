import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../shared/services/transaction.service';
import { Transaction } from '../../../shared/models/bank.models';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-dark">Historique des Transactions</h2>
      <div class="btn-group">
        <button class="btn btn-success" [routerLink]="['/admin/transactions/depot']">
          <i class="bi bi-plus-circle me-2"></i>Dépôt
        </button>
        <button class="btn btn-danger" [routerLink]="['/admin/transactions/retrait']">
          <i class="bi bi-dash-circle me-2"></i>Retrait
        </button>
        <button class="btn btn-primary" [routerLink]="['/admin/transactions/virement']">
          <i class="bi bi-arrow-left-right me-2"></i>Virement
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Type</label>
            <select class="form-select" [(ngModel)]="filterType" (change)="loadTransactions()">
              <option value="">Tous les types</option>
              <option value="DEPOT">Dépôt</option>
              <option value="RETRAIT">Retrait</option>
              <option value="VIREMENT">Virement</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold text-dark">Recherche Compte (IBAN)</label>
            <input type="text" class="form-control" placeholder="FR76..." [(ngModel)]="filterCompteId">
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button class="btn btn-primary w-100" (click)="loadTransactions()" [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-3 text-muted">Chargement des transactions...</p>
    </div>

    <!-- Error -->
    <div *ngIf="errorMessage" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ errorMessage }}
      <button class="btn btn-sm btn-outline-danger ms-3" (click)="loadTransactions()">Réessayer</button>
    </div>

    <!-- Table -->
    <div class="card border-0 shadow-sm" *ngIf="!isLoading">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="text-dark">Date</th>
              <th class="text-dark">Type</th>
              <th class="text-dark">Description</th>
              <th class="text-dark">Comptes</th>
              <th class="text-end text-dark">Montant</th>
              <th class="text-dark">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transactions">
              <td class="text-dark">{{ t.date | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success-subtle text-success': t.type === 'DEPOT',
                  'bg-danger-subtle text-danger': t.type === 'RETRAIT',
                  'bg-primary-subtle text-primary': t.type === 'VIREMENT' || t.type === 'TRANSFER'
                }">{{ t.type }}</span>
              </td>
              <td class="text-dark">{{ t.description }}</td>
              <td>
                <div *ngIf="t.compteSource" class="small">
                  <span class="text-muted">De:</span> <span class="fw-bold text-dark">{{ t.compteSource }}</span>
                </div>
                <div *ngIf="t.compteDestination" class="small">
                  <span class="text-muted">Vers:</span> <span class="fw-bold text-dark">{{ t.compteDestination }}</span>
                </div>
              </td>
              <td class="text-end fw-bold" [ngClass]="t.type === 'DEPOT' ? 'text-success' : 'text-danger'">
                {{ t.type === 'DEPOT' ? '+' : '-' }}{{ t.montant | number:'1.0-0' }} FCFA
              </td>
              <td>
                <span class="badge bg-success">Réussie</span>
              </td>
            </tr>
            <tr *ngIf="transactions.length === 0">
              <td colspan="6" class="text-center py-5 text-muted fst-italic">
                <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                Aucune transaction trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer bg-white text-muted small" *ngIf="transactions.length > 0">
        {{ transactions.length }} transaction(s) trouvée(s)
      </div>
    </div>
  `,
  styles: [`
    .bg-primary-subtle { background-color: #e3f2fd; }
    .bg-success-subtle { background-color: #e8f5e9; }
    .bg-danger-subtle { background-color: #ffebee; }
  `]
})
export class TransactionHistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  filterType: string = '';
  filterCompteId: string = '';

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    console.log('[AdminTransactionHistory] Loading transactions with filters:', {
      type: this.filterType,
      compteId: this.filterCompteId
    });

    this.isLoading = true;
    this.errorMessage = null;
    this.transactions = [];

    const filters: any = {};
    if (this.filterType) {
      filters.type = this.filterType;
    }
    if (this.filterCompteId) {
      filters.compteId = this.filterCompteId;
    }

    this.transactionService.getTransactions(filters).pipe(
      tap(data => console.log('[AdminTransactionHistory] Received:', data)),
      catchError(err => {
        console.error('[AdminTransactionHistory] Error:', err);
        // Détecter les erreurs de parsing JSON (status 200 avec "Unknown Error")
        if (err.status === 200 && err.statusText === 'Unknown Error') {
          this.errorMessage = 'Erreur de chargement: la réponse du serveur est trop volumineuse ou malformée. Essayez de filtrer par compte (IBAN).';
        } else {
          this.errorMessage = err.error?.message || err.message || 'Erreur lors du chargement des transactions';
        }
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}

