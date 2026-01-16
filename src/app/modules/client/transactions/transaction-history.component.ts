import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientBankService } from '../../../shared/services/client-bank.service';
import { Transaction } from '../../../shared/models/bank.models';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-client-transactions',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container py-4">
      <h2 class="fw-bold mb-4 text-dark">Mon Historique de Transactions</h2>

      <!-- Filtres -->
      <div class="card border-0 shadow-sm mb-4 p-4 text-dark">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small fw-bold">Type d'opération</label>
            <select class="form-select" [(ngModel)]="filterType" (change)="loadTransactions()">
              <option value="">Toutes les opérations</option>
              <option value="DEPOT">Dépôts</option>
              <option value="RETRAIT">Retraits</option>
              <option value="VIREMENT">Virements</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Date de début</label>
            <input type="date" class="form-control" [(ngModel)]="dateDebut" (change)="loadTransactions()">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Date de fin</label>
            <input type="date" class="form-control" [(ngModel)]="dateFin" (change)="loadTransactions()">
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" (click)="resetFilters()">Réinitialiser</button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm text-dark">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Date</th>
                <th>Description</th>
                <th>Type</th>
                <th class="text-end pe-4">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of transactions$ | async">
                <td class="ps-4">
                  <div class="fw-bold">{{ t.date | date:'dd/MM/yyyy' }}</div>
                  <small class="text-muted">{{ t.date | date:'HH:mm' }}</small>
                </td>
                <td>
                  <div class="fw-bold">{{ t.description }}</div>
                  <div class="small text-muted" *ngIf="t.compteSource">Source: {{ t.compteSource }}</div>
                  <div class="small text-muted" *ngIf="t.compteDestination">Dest: {{ t.compteDestination }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success-subtle text-success': t.type === 'DEPOT',
                    'bg-danger-subtle text-danger': t.type === 'RETRAIT',
                    'bg-primary-subtle text-primary': t.type === 'VIREMENT'
                  }">{{ t.type }}</span>
                </td>
                <td class="text-end fw-bold pe-4 fs-5" [ngClass]="t.type === 'DEPOT' ? 'text-success' : 'text-danger'">
                  {{ t.type === 'DEPOT' ? '+' : '-' }}{{ t.montant | currency:'EUR' }}
                </td>
              </tr>
              <tr *ngIf="(transactions$ | async)?.length === 0">
                <td colspan="4" class="text-center py-5 text-muted fst-italic">Aucune transaction trouvée pour ces critères</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bg-success-subtle { background-color: #e8f5e9 !important; }
    .bg-danger-subtle { background-color: #ffebee !important; }
    .bg-primary-subtle { background-color: #e3f2fd !important; }
  `]
})
export class ClientTransactionHistoryComponent implements OnInit {
    transactions$: Observable<Transaction[]> | undefined;
    filterType = '';
    dateDebut = '';
    dateFin = '';

    constructor(private clientBankService: ClientBankService) { }

    ngOnInit(): void {
        this.loadTransactions();
    }

    loadTransactions() {
        this.transactions$ = this.clientBankService.getTransactions({
            type: this.filterType,
            dateDebut: this.dateDebut,
            dateFin: this.dateFin
        });
    }

    resetFilters() {
        this.filterType = '';
        this.dateDebut = '';
        this.dateFin = '';
        this.loadTransactions();
    }
}
