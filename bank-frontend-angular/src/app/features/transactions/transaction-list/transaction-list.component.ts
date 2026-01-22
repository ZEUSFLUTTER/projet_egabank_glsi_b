import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TransactionService } from '../../../core/services/transaction.service';
import { CompteService } from '../../../core/services/compte.service';
import { TransactionAvecCompte, CompteAvecProprietaire } from '../../../core/models/client.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="transaction-list-container">
      <div class="header">
        <h1>Gestion des Transactions</h1>
        <button mat-raised-button color="primary" (click)="navigateToNewTransaction()">
          <mat-icon>add</mat-icon>
          Nouvelle Transaction
        </button>
      </div>

      <!-- Filtres -->
      <mat-card class="filters-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filters-form">
            <mat-form-field>
              <mat-label>Compte</mat-label>
              <mat-select formControlName="compteId" (selectionChange)="applyFilters()">
                <mat-option value="">Tous les comptes</mat-option>
                <mat-option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ compte.numeroCompte }} - {{ compte.proprietaire.nom }} {{ compte.proprietaire.prenom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Type de transaction</mat-label>
              <mat-select formControlName="typeTransaction" (selectionChange)="applyFilters()">
                <mat-option value="">Tous les types</mat-option>
                <mat-option value="DEPOT">Dépôt</mat-option>
                <mat-option value="RETRAIT">Retrait</mat-option>
                <mat-option value="VIREMENT">Virement</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Date de début</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="dateDebut" 
                     (dateChange)="applyFilters()">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Date de fin</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="dateFin" 
                     (dateChange)="applyFilters()">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-button type="button" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Effacer filtres
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="!isLoading; else loadingTemplate">
        <mat-card-content>
          <div class="table-container" *ngIf="filteredTransactions.length > 0; else noDataTemplate">
            <table mat-table [dataSource]="filteredTransactions" class="transactions-table">
              <!-- Colonne Date -->
              <ng-container matColumnDef="dateTransaction">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let transaction">
                  {{ transaction.dateTransaction | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <!-- Colonne Type -->
              <ng-container matColumnDef="typeTransaction">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let transaction">
                  <span class="type-badge" [class]="transaction.typeTransaction.toLowerCase()">
                    <mat-icon>{{ getTransactionIcon(transaction.typeTransaction) }}</mat-icon>
                    {{ transaction.typeTransaction }}
                  </span>
                </td>
              </ng-container>

              <!-- Colonne Compte -->
              <ng-container matColumnDef="compte">
                <th mat-header-cell *matHeaderCellDef>Compte</th>
                <td mat-cell *matCellDef="let transaction">
                  <div class="compte-info">
                    <div class="numero-compte">{{ transaction.compte.numeroCompte }}</div>
                    <div class="proprietaire">
                      {{ transaction.compte.proprietaire.nom }} {{ transaction.compte.proprietaire.prenom }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Montant -->
              <ng-container matColumnDef="montant">
                <th mat-header-cell *matHeaderCellDef>Montant</th>
                <td mat-cell *matCellDef="let transaction">
                  <span class="montant" [class]="getMontantClass(transaction.typeTransaction)">
                    {{ getMontantDisplay(transaction) | currency:'XOF':'symbol':'1.0-0' }}
                  </span>
                </td>
              </ng-container>

              <!-- Colonne Description -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let transaction">
                  <div class="description">
                    {{ transaction.description }}
                    <div *ngIf="transaction.compteDestinataire" class="destination">
                      → {{ transaction.compteDestinataire }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Solde après -->
              <ng-container matColumnDef="soldeApres">
                <th mat-header-cell *matHeaderCellDef>Solde après</th>
                <td mat-cell *matCellDef="let transaction">
                  <span class="solde" [class.negative]="transaction.soldeApres < 0">
                    {{ transaction.soldeApres | currency:'XOF':'symbol':'1.0-0' }}
                  </span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <ng-template #noDataTemplate>
            <div class="no-data">
              <mat-icon>swap_horiz</mat-icon>
              <h3>Aucune transaction trouvée</h3>
              <p>{{ getNoDataMessage() }}</p>
              <button mat-raised-button color="primary" (click)="navigateToNewTransaction()">
                <mat-icon>add</mat-icon>
                Nouvelle transaction
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des transactions...</p>
        </div>
      </ng-template>

      <!-- Statistiques -->
      <div class="stats-section" *ngIf="!isLoading && filteredTransactions.length > 0">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Statistiques des transactions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <mat-icon>swap_horiz</mat-icon>
                <div>
                  <h3>{{ filteredTransactions.length }}</h3>
                  <p>Total transactions</p>
                </div>
              </div>
              <div class="stat-item depot">
                <mat-icon>arrow_downward</mat-icon>
                <div>
                  <h3>{{ getTotalByType('DEPOT') | currency:'XOF':'symbol':'1.0-0' }}</h3>
                  <p>Total dépôts</p>
                </div>
              </div>
              <div class="stat-item retrait">
                <mat-icon>arrow_upward</mat-icon>
                <div>
                  <h3>{{ getTotalByType('RETRAIT') | currency:'XOF':'symbol':'1.0-0' }}</h3>
                  <p>Total retraits</p>
                </div>
              </div>
              <div class="stat-item virement">
                <mat-icon>compare_arrows</mat-icon>
                <div>
                  <h3>{{ getTotalByType('VIREMENT') | currency:'XOF':'symbol':'1.0-0' }}</h3>
                  <p>Total virements</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .transaction-list-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filters-card {
      margin-bottom: 20px;
    }

    .filters-form {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filters-form mat-form-field {
      min-width: 200px;
    }

    .table-container {
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
    }

    .transactions-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .transactions-table td, .transactions-table th {
      padding: 12px 8px;
    }

    .type-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      width: fit-content;
    }

    .type-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .type-badge.depot {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .type-badge.retrait {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .type-badge.virement {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .compte-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .numero-compte {
      font-family: monospace;
      font-size: 0.9rem;
      color: #333;
    }

    .proprietaire {
      font-size: 0.8rem;
      color: #666;
    }

    .montant {
      font-weight: 600;
      font-size: 1rem;
    }

    .montant.positive {
      color: #388e3c;
    }

    .montant.negative {
      color: #d32f2f;
    }

    .description {
      max-width: 200px;
    }

    .destination {
      font-size: 0.8rem;
      color: #666;
      margin-top: 2px;
    }

    .solde {
      font-weight: 600;
    }

    .solde.negative {
      color: #f44336;
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

    .no-data {
      text-align: center;
      padding: 50px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
      color: #ccc;
    }

    .no-data h3 {
      margin: 0 0 10px 0;
    }

    .no-data p {
      margin-bottom: 20px;
    }

    .no-data button {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }

    .stats-section {
      margin-top: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .stat-item.depot mat-icon {
      color: #388e3c;
    }

    .stat-item.retrait mat-icon {
      color: #d32f2f;
    }

    .stat-item.virement mat-icon {
      color: #1976d2;
    }

    .stat-item h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .stat-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    mat-card {
      margin-top: 20px;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: TransactionAvecCompte[] = [];
  filteredTransactions: TransactionAvecCompte[] = [];
  comptes: CompteAvecProprietaire[] = [];
  displayedColumns: string[] = ['dateTransaction', 'typeTransaction', 'compte', 'montant', 'description', 'soldeApres'];
  isLoading = true;
  filterForm: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      compteId: [''],
      typeTransaction: [''],
      dateDebut: [''],
      dateFin: ['']
    });
  }

  ngOnInit() {
    this.loadData();
    this.checkQueryParams();
  }

  checkQueryParams() {
    const compteId = this.route.snapshot.queryParamMap.get('compteId');
    if (compteId) {
      this.filterForm.patchValue({ compteId: +compteId });
    }
  }

  loadData() {
    this.isLoading = true;
    
    Promise.all([
      this.transactionService.getAllTransactions().toPromise(),
      this.compteService.getAllComptes().toPromise()
    ]).then(([transactions, comptes]) => {
      // Transformer les transactions en TransactionAvecCompte pour l'affichage
      this.transactions = (transactions || []).map(transaction => ({
        ...transaction,
        compte: {
          numeroCompte: transaction.numeroCompte,
          proprietaire: {
            nom: transaction.proprietaireNom || 'N/A',
            prenom: transaction.proprietairePrenom || 'N/A'
          }
        }
      }));
      
      // Transformer les comptes en CompteAvecProprietaire pour l'affichage
      this.comptes = (comptes || []).map(compte => ({
        ...compte,
        proprietaire: {
          id: compte.proprietaireId,
          nom: compte.proprietaireNom || 'N/A',
          prenom: compte.proprietairePrenom || 'N/A'
        }
      }));
      
      this.applyFilters();
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement:', error);
      this.snackBar.open('Erreur lors du chargement des données', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
      
      // En cas d'erreur, utiliser des données mock comme fallback
      const mockTransactions: TransactionAvecCompte[] = [
        {
          id: 1,
          typeTransaction: 'DEPOT',
          montant: 50000,
          dateTransaction: new Date().toISOString(),
          description: 'Dépôt initial',
          compteId: 1,
          numeroCompte: 'SN12K00100152000025000000268',
          soldeAvant: 100000,
          soldeApres: 150000,
          compte: {
            numeroCompte: 'SN12K00100152000025000000268',
            proprietaire: {
              nom: 'Diop',
              prenom: 'Amadou'
            }
          }
        }
      ];

      const mockComptes: CompteAvecProprietaire[] = [
        {
          id: 1,
          numeroCompte: 'SN12K00100152000025000000268',
          typeCompte: 'COURANT',
          dateCreation: new Date().toISOString(),
          solde: 150000,
          proprietaireId: 1,
          proprietaire: {
            id: 1,
            nom: 'Diop',
            prenom: 'Amadou'
          }
        }
      ];

      this.transactions = mockTransactions;
      this.comptes = mockComptes;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.transactions];
    const filters = this.filterForm.value;

    if (filters.compteId) {
      filtered = filtered.filter(t => t.compteId === filters.compteId);
    }

    if (filters.typeTransaction) {
      filtered = filtered.filter(t => t.typeTransaction === filters.typeTransaction);
    }

    if (filters.dateDebut) {
      const startDate = new Date(filters.dateDebut);
      filtered = filtered.filter(t => new Date(t.dateTransaction) >= startDate);
    }

    if (filters.dateFin) {
      const endDate = new Date(filters.dateFin);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => new Date(t.dateTransaction) <= endDate);
    }

    this.filteredTransactions = filtered.sort((a, b) => 
      new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
    );
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  navigateToNewTransaction() {
    const compteId = this.filterForm.value.compteId;
    const queryParams = compteId ? { compteId } : {};
    this.router.navigate(['/transactions/new'], { queryParams });
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'DEPOT': return 'arrow_downward';
      case 'RETRAIT': return 'arrow_upward';
      case 'VIREMENT': return 'compare_arrows';
      default: return 'swap_horiz';
    }
  }

  getMontantClass(type: string): string {
    return type === 'DEPOT' ? 'positive' : 'negative';
  }

  getMontantDisplay(transaction: TransactionAvecCompte): number {
    return transaction.typeTransaction === 'DEPOT' ? transaction.montant : -transaction.montant;
  }

  getTotalByType(type: string): number {
    return this.filteredTransactions
      .filter(t => t.typeTransaction === type)
      .reduce((total, t) => total + t.montant, 0);
  }

  getNoDataMessage(): string {
    const filters = this.filterForm.value;
    if (filters.compteId || filters.typeTransaction || filters.dateDebut || filters.dateFin) {
      return 'Aucune transaction ne correspond aux filtres sélectionnés';
    }
    return 'Aucune transaction n\'a encore été effectuée';
  }
}