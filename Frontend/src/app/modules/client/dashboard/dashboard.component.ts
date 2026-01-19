import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientBankService } from '../../../shared/services/client-bank.service';
import { Compte, Client, Transaction } from '../../../shared/models/bank.models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-client-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container py-4">
      <!-- Bienvenue -->
      <div class="mb-4 text-dark">
        <h2 class="fw-bold" *ngIf="profile$ | async as p">Bonjour, {{ p.prenom }} {{ p.nom }} 👋</h2>
        <p class="text-muted">Bienvenue sur votre espace bancaire Egabank</p>
      </div>

      <!-- Statistiques rapides -->
      <div class="row g-4 mb-4">
        <!-- Solde total -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-4 bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-2 opacity-75">Solde total</h6>
                <h3 class="fw-bold mb-0">{{ totalBalance | number:'1.0-0' }} FCFA</h3>
              </div>
              <div class="bg-white bg-opacity-25 p-3 rounded-circle">
                <i class="bi bi-wallet2 fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Nombre de comptes -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-4 text-dark">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-2 text-muted">Mes comptes</h6>
                <h3 class="fw-bold mb-0">{{ accountCount }}</h3>
              </div>
              <div class="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i class="bi bi-bank fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Dernière transaction -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-4 text-dark">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-2 text-muted">Transactions récentes</h6>
                <h3 class="fw-bold mb-0">{{ recentTransactionsCount }}</h3>
              </div>
              <div class="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i class="bi bi-arrow-left-right fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Liste des comptes -->
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm text-dark">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 class="fw-bold mb-0">Mes comptes</h5>
              <a routerLink="/client/comptes" class="btn btn-sm btn-outline-primary">Voir tout</a>
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <tbody>
                  <tr *ngFor="let acc of accounts$ | async" [routerLink]="['/client/comptes', acc.id]" style="cursor: pointer;">
                    <td class="ps-4">
                      <div class="fw-bold">{{ acc.numeroCompte }}</div>
                      <small class="text-muted">{{ acc.type }}</small>
                    </td>
                    <td class="text-end pe-4">
                      <div class="fw-bold fs-5">{{ acc.solde | number:'1.0-0' }} FCFA</div>
                    </td>
                  </tr>
                  <tr *ngIf="(accounts$ | async)?.length === 0">
                    <td colspan="2" class="text-center py-4 text-muted">Aucun compte trouvé</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm p-4 text-dark h-100">
            <h5 class="fw-bold mb-4">Actions rapides</h5>
            <div class="d-grid gap-3">
              <a routerLink="/client/virement" class="btn btn-primary btn-lg p-3">
                <i class="bi bi-send me-2"></i>Effectuer un virement
              </a>
              <a routerLink="/client/transactions" class="btn btn-outline-dark btn-lg p-3">
                <i class="bi bi-clock-history me-2"></i>Historique des transactions
              </a>
              <a routerLink="/client/releves" class="btn btn-outline-dark btn-lg p-3">
                <i class="bi bi-file-earmark-text me-2"></i>Générer un relevé
              </a>
              <a routerLink="/client/profil" class="btn btn-outline-dark btn-lg p-3">
                <i class="bi bi-person me-2"></i>Mon profil
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions récentes -->
      <div class="card border-0 shadow-sm mt-4 text-dark">
        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h5 class="fw-bold mb-0">Transactions récentes</h5>
          <a routerLink="/client/transactions" class="btn btn-sm btn-outline-primary">Voir tout</a>
        </div>
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
              <tr *ngFor="let t of recentTransactions">
                <td class="ps-4">{{ t.date | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ t.description || 'Transaction' }}</td>
                <td>
                  <span class="badge rounded-pill" 
                        [ngClass]="{
                          'bg-success-subtle text-success': t.type === 'DEPOT',
                          'bg-danger-subtle text-danger': t.type === 'RETRAIT',
                          'bg-primary-subtle text-primary': t.type === 'VIREMENT'
                        }">
                    {{ t.type }}
                  </span>
                </td>
                <td class="text-end pe-4 fw-bold" 
                    [ngClass]="{'text-success': t.type === 'DEPOT', 'text-danger': t.type !== 'DEPOT'}">
                  {{ t.type === 'DEPOT' ? '+' : '-' }}{{ t.montant | number:'1.0-0' }} FCFA
                </td>
              </tr>
              <tr *ngIf="recentTransactions.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">Aucune transaction récente</td>
              </tr>
            </tbody>
          </table>
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
export class ClientDashboardComponent implements OnInit {
    profile$: Observable<Client>;
    accounts$: Observable<Compte[]>;

    totalBalance = 0;
    accountCount = 0;
    recentTransactions: Transaction[] = [];
    recentTransactionsCount = 0;

    constructor(private clientBankService: ClientBankService) {
        this.profile$ = this.clientBankService.getProfile();
        this.accounts$ = this.clientBankService.getAccounts();
    }

    ngOnInit(): void {
        // Calculate total balance and account count
        this.accounts$.subscribe({
            next: (accounts) => {
                this.accountCount = accounts.length;
                this.totalBalance = accounts.reduce((sum, acc) => sum + acc.solde, 0);
            },
            error: (err) => console.error('Error loading accounts:', err)
        });

        // Load recent transactions
        this.clientBankService.getTransactions().pipe(
            map(transactions => transactions.slice(0, 5)),
            catchError(err => {
                console.error('Error loading transactions:', err);
                return of([]);
            })
        ).subscribe({
            next: (transactions) => {
                this.recentTransactions = transactions;
                this.recentTransactionsCount = transactions.length;
            }
        });
    }
}
