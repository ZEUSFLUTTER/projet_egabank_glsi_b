import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientBankService } from '../../../shared/services/client-bank.service';
import { Transaction, Compte } from '../../../shared/models/bank.models';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-client-transaction-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 text-dark">
        <h2 class="fw-bold">Historique des Transactions</h2>
      </div>

      <!-- Filtres -->
      <div class="card border-0 shadow-sm mb-4 p-4 text-dark">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label small fw-bold">Compte</label>
            <select class="form-select" [(ngModel)]="filters.compteId" (change)="loadTransactions()">
              <option value="">Tous les comptes</option>
              <option *ngFor="let acc of accounts$ | async" [value]="acc.id">
                {{ acc.numeroCompte }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Type</label>
            <select class="form-select" [(ngModel)]="filters.type" (change)="loadTransactions()">
              <option value="">Tous</option>
              <option value="DEPOT">Dépôt</option>
              <option value="RETRAIT">Retrait</option>
              <option value="VIREMENT">Virement</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Du</label>
            <input type="date" class="form-control" [(ngModel)]="filters.dateDebut" (change)="loadTransactions()">
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Au</label>
            <input type="date" class="form-control" [(ngModel)]="filters.dateFin" (change)="loadTransactions()">
          </div>
          <div class="col-md-3">
            <button class="btn btn-outline-secondary w-100" (click)="resetFilters()">
              <i class="bi bi-x-circle me-2"></i>Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3 text-muted">Chargement des transactions...</p>
      </div>

      <!-- Error state -->
      <div *ngIf="errorMessage" class="alert alert-danger border-0">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
      </div>

      <!-- Liste des transactions -->
      <div *ngIf="!isLoading && !errorMessage" class="card border-0 shadow-sm text-dark">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Date</th>
                <th>Description</th>
                <th>Compte</th>
                <th>Type</th>
                <th>Statut</th>
                <th class="text-end pe-4">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of transactions">
                <td class="ps-4">
                  <div class="fw-bold">{{ t.date | date:'dd/MM/yyyy' }}</div>
                  <small class="text-muted">{{ t.date | date:'HH:mm' }}</small>
                </td>
                <td>{{ t.description || 'Transaction' }}</td>
                <td>
                  <small class="text-muted">{{ t.compteSource || '-' }}</small>
                </td>
                <td>
                  <span class="badge rounded-pill" 
                        [ngClass]="{
                          'bg-success-subtle text-success': t.type === 'DEPOT',
                          'bg-danger-subtle text-danger': t.type === 'RETRAIT',
                          'bg-primary-subtle text-primary': t.type === 'VIREMENT'
                        }">
                    {{ getTypeLabel(t.type) }}
                  </span>
                </td>
                <td>
                  <span class="badge" 
                        [ngClass]="{
                          'bg-success': t.statut === 'SUCCESS' || t.statut === 'COMPLETED',
                          'bg-warning text-dark': t.statut === 'PENDING',
                          'bg-danger': t.statut === 'FAILED'
                        }">
                    {{ getStatutLabel(t.statut) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <span class="fw-bold fs-5" 
                        [ngClass]="{'text-success': t.type === 'DEPOT', 'text-danger': t.type !== 'DEPOT'}">
                    {{ t.type === 'DEPOT' ? '+' : '-' }}{{ t.montant | number:'1.0-0' }} FCFA
                  </span>
                </td>
              </tr>
              <tr *ngIf="transactions.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                  Aucune transaction trouvée
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination simple -->
        <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center py-3" *ngIf="transactions.length > 0">
          <small class="text-muted">{{ transactions.length }} transaction(s) affichée(s)</small>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bg-primary-subtle { background-color: #e3f2fd; }
    .bg-success-subtle { background-color: #e8f5e9; }
    .bg-danger-subtle { background-color: #ffebee; }
  `]
})
export class ClientTransactionHistoryComponent implements OnInit {
    accounts$: Observable<Compte[]>;
    transactions: Transaction[] = [];
    isLoading = false;
    errorMessage = '';

    filters = {
        compteId: '',
        type: '',
        dateDebut: '',
        dateFin: ''
    };

    constructor(private clientBankService: ClientBankService) {
        this.accounts$ = this.clientBankService.getAccounts();
    }

    ngOnInit(): void {
        this.loadTransactions();
    }

    loadTransactions(): void {
        this.isLoading = true;
        this.errorMessage = '';

        const filterParams: any = {};
        if (this.filters.compteId) filterParams.compteId = this.filters.compteId;
        if (this.filters.type) filterParams.type = this.filters.type;
        if (this.filters.dateDebut) filterParams.dateDebut = this.filters.dateDebut;
        if (this.filters.dateFin) filterParams.dateFin = this.filters.dateFin;

        this.clientBankService.getTransactions(filterParams).pipe(
            catchError(err => {
                console.error('Error loading transactions:', err);
                this.errorMessage = 'Erreur lors du chargement des transactions';
                return of([]);
            })
        ).subscribe({
            next: (transactions) => {
                this.transactions = transactions;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    resetFilters(): void {
        this.filters = {
            compteId: '',
            type: '',
            dateDebut: '',
            dateFin: ''
        };
        this.loadTransactions();
    }

    getTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            'DEPOT': 'Dépôt',
            'RETRAIT': 'Retrait',
            'VIREMENT': 'Virement',
            'TRANSFER': 'Virement',
            'DEPOSIT': 'Dépôt',
            'WITHDRAWAL': 'Retrait'
        };
        return labels[type] || type;
    }

    getStatutLabel(statut: string): string {
        const labels: Record<string, string> = {
            'SUCCESS': 'Réussi',
            'COMPLETED': 'Terminé',
            'PENDING': 'En cours',
            'FAILED': 'Échoué'
        };
        return labels[statut] || statut;
    }
}
