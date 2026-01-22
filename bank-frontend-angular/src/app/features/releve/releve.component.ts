import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CompteService } from '../../core/services/compte.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Compte, Transaction } from '../../core/models/client.model';

/**
 * Composant pour afficher les transactions et imprimer le relevé
 * Conforme au cahier des charges : "Afficher toutes les transactions effectuées sur un compte au cours d'une période donnée"
 * et "Donner la possibilité au client d'imprimer son relevé"
 */
@Component({
  selector: 'app-releve',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="releve-container">
      <div class="header">
        <h1>
          <mat-icon>receipt_long</mat-icon>
          Relevé de compte et transactions
        </h1>
        <p>Consultez vos transactions et imprimez votre relevé</p>
      </div>

      <!-- Formulaire de sélection -->
      <mat-card class="selection-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>filter_list</mat-icon>
            Sélection des critères
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="releveForm" class="selection-form">
            
            <mat-form-field class="full-width">
              <mat-label>Compte</mat-label>
              <mat-select formControlName="numeroCompte" required>
                <mat-option *ngFor="let compte of mesComptes" [value]="compte.numeroCompte">
                  {{ compte.numeroCompte }} - {{ compte.typeCompte }} 
                  ({{ compte.solde | currency:'XOF':'symbol':'1.0-0' }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="releveForm.get('numeroCompte')?.hasError('required')">
                Veuillez sélectionner un compte
              </mat-error>
            </mat-form-field>

            <div class="date-range">
              <mat-form-field class="date-field">
                <mat-label>Date de début</mat-label>
                <input matInput [matDatepicker]="dateDebutPicker" formControlName="dateDebut" required>
                <mat-datepicker-toggle matSuffix [for]="dateDebutPicker"></mat-datepicker-toggle>
                <mat-datepicker #dateDebutPicker></mat-datepicker>
                <mat-error *ngIf="releveForm.get('dateDebut')?.hasError('required')">
                  La date de début est requise
                </mat-error>
              </mat-form-field>

              <mat-form-field class="date-field">
                <mat-label>Date de fin</mat-label>
                <input matInput [matDatepicker]="dateFinPicker" formControlName="dateFin" required>
                <mat-datepicker-toggle matSuffix [for]="dateFinPicker"></mat-datepicker-toggle>
                <mat-datepicker #dateFinPicker></mat-datepicker>
                <mat-error *ngIf="releveForm.get('dateFin')?.hasError('required')">
                  La date de fin est requise
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="button" 
                      (click)="chargerTransactions()"
                      [disabled]="releveForm.invalid || isLoadingTransactions">
                <mat-icon *ngIf="!isLoadingTransactions">search</mat-icon>
                <mat-icon *ngIf="isLoadingTransactions" class="spinning">refresh</mat-icon>
                {{ isLoadingTransactions ? 'Chargement...' : 'Afficher les transactions' }}
              </button>

              <button mat-raised-button color="accent" type="button" 
                      (click)="imprimerReleve()"
                      [disabled]="releveForm.invalid || !transactions.length || isLoadingReleve">
                <mat-icon *ngIf="!isLoadingReleve">print</mat-icon>
                <mat-icon *ngIf="isLoadingReleve" class="spinning">refresh</mat-icon>
                {{ isLoadingReleve ? 'Génération...' : 'Imprimer le relevé' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Informations du compte sélectionné -->
      <mat-card class="compte-info" *ngIf="compteSelectionne">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>account_balance_wallet</mat-icon>
            Informations du compte
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <strong>Numéro de compte :</strong>
              <span>{{ compteSelectionne.numeroCompte }}</span>
            </div>
            <div class="info-item">
              <strong>Type :</strong>
              <span class="type-badge" [class]="compteSelectionne.typeCompte.toLowerCase()">
                {{ compteSelectionne.typeCompte }}
              </span>
            </div>
            <div class="info-item">
              <strong>Solde actuel :</strong>
              <span class="solde" [class.negative]="compteSelectionne.solde < 0">
                {{ compteSelectionne.solde | currency:'XOF':'symbol':'1.0-0' }}
              </span>
            </div>
            <div class="info-item">
              <strong>Propriétaire :</strong>
              <span>{{ compteSelectionne.proprietairePrenom }} {{ compteSelectionne.proprietaireNom }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Liste des transactions -->
      <mat-card class="transactions-card" *ngIf="transactions.length > 0">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>list</mat-icon>
            Transactions ({{ transactions.length }})
          </mat-card-title>
          <mat-card-subtitle>
            Période du {{ dateDebutFormatted }} au {{ dateFinFormatted }}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <table mat-table [dataSource]="transactions" class="transactions-table">
            
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
                <span class="type-badge" [class]="getTransactionTypeClass(transaction.typeTransaction)">
                  <mat-icon>{{ getTransactionIcon(transaction.typeTransaction) }}</mat-icon>
                  {{ getTransactionLabel(transaction.typeTransaction) }}
                </span>
              </td>
            </ng-container>

            <!-- Colonne Montant -->
            <ng-container matColumnDef="montant">
              <th mat-header-cell *matHeaderCellDef>Montant</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="montant" [class]="getMontantClass(transaction.typeTransaction)">
                  {{ getMontantPrefix(transaction.typeTransaction) }}{{ transaction.montant | currency:'XOF':'symbol':'1.0-0' }}
                </span>
              </td>
            </ng-container>

            <!-- Colonne Description -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let transaction">
                {{ transaction.description || '-' }}
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
        </mat-card-content>
      </mat-card>

      <!-- Message si aucune transaction -->
      <mat-card class="no-transactions" *ngIf="transactionsLoaded && transactions.length === 0">
        <mat-card-content>
          <div class="no-data">
            <mat-icon>receipt_long</mat-icon>
            <h3>Aucune transaction</h3>
            <p>Aucune transaction trouvée pour la période sélectionnée</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading -->
      <div class="loading-container" *ngIf="isLoadingComptes">
        <mat-spinner></mat-spinner>
        <p>Chargement de vos comptes...</p>
      </div>
    </div>
  `,
  styles: [`
    .releve-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 0 0 10px 0;
      color: #333;
    }

    .header p {
      color: #666;
      margin: 0;
    }

    .selection-card {
      margin-bottom: 20px;
    }

    .selection-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .selection-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .full-width {
      width: 100%;
    }

    .date-range {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .date-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 10px;
    }

    .form-actions button {
      min-width: 180px;
    }

    .compte-info {
      margin-bottom: 20px;
    }

    .compte-info mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item strong {
      color: #666;
      font-size: 0.9rem;
    }

    .info-item span {
      color: #333;
      font-size: 1rem;
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .type-badge.courant {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-badge.epargne {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .type-badge.depot, .type-badge.versement {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .type-badge.retrait {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .type-badge.virement_entrant {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-badge.virement_sortant {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .solde {
      font-weight: 600;
    }

    .solde.negative {
      color: #f44336;
    }

    .transactions-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .transactions-table {
      width: 100%;
      margin-top: 15px;
    }

    .transactions-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .montant {
      font-weight: 600;
    }

    .montant.credit {
      color: #388e3c;
    }

    .montant.debit {
      color: #d32f2f;
    }

    .no-transactions {
      margin-top: 20px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 15px;
      color: #ccc;
    }

    .no-data h3 {
      margin: 0 0 10px 0;
    }

    .no-data p {
      margin: 0;
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

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .date-range {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReleveComponent implements OnInit {
  releveForm: FormGroup;
  mesComptes: Compte[] = [];
  transactions: Transaction[] = [];
  compteSelectionne: Compte | null = null;
  
  displayedColumns: string[] = ['dateTransaction', 'typeTransaction', 'montant', 'description', 'soldeApres'];
  
  isLoadingComptes = true;
  isLoadingTransactions = false;
  isLoadingReleve = false;
  transactionsLoaded = false;
  
  dateDebutFormatted = '';
  dateFinFormatted = '';

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {
    // Initialiser les dates par défaut (dernier mois)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    this.releveForm = this.fb.group({
      numeroCompte: ['', Validators.required],
      dateDebut: [lastMonth, Validators.required],
      dateFin: [today, Validators.required]
    });
  }

  ngOnInit() {
    this.loadMesComptes();
    this.setupFormSubscriptions();
  }

  loadMesComptes() {
    this.isLoadingComptes = true;
    
    // Charger les comptes depuis l'API CRUD classique
    this.compteService.getAllComptes().subscribe({
      next: (comptes: any[]) => {
        this.mesComptes = comptes.map((compte: any) => ({
          id: compte.id || 0,
          numeroCompte: compte.numeroCompte,
          typeCompte: compte.typeCompte,
          dateCreation: compte.dateCreation,
          solde: compte.solde,
          proprietaireId: compte.proprietaireId,
          proprietaireNom: compte.proprietaireNom,
          proprietairePrenom: compte.proprietairePrenom,
          nombreTransactions: compte.nombreTransactions || 0
        }));
        this.isLoadingComptes = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.snackBar.open('Erreur lors du chargement des comptes', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoadingComptes = false;
        
        // En cas d'erreur, utiliser des données mock comme fallback
        const mockComptes: Compte[] = [
          {
            id: 1,
            numeroCompte: 'SN12K00100152000025000000268',
            typeCompte: 'COURANT',
            dateCreation: new Date().toISOString(),
            solde: 150000,
            proprietaireId: 1,
            proprietaireNom: 'Diop',
            proprietairePrenom: 'Amadou',
            nombreTransactions: 15
          }
        ];
        this.mesComptes = mockComptes;
      }
    });
  }

  setupFormSubscriptions() {
    // Écouter les changements de sélection du compte
    this.releveForm.get('numeroCompte')?.valueChanges.subscribe(numeroCompte => {
      this.compteSelectionne = this.mesComptes.find(c => c.numeroCompte === numeroCompte) || null;
      this.transactions = [];
      this.transactionsLoaded = false;
    });
  }

  chargerTransactions() {
    if (this.releveForm.valid) {
      this.isLoadingTransactions = true;
      const formData = this.releveForm.value;
      
      // Formater les dates pour l'affichage
      this.dateDebutFormatted = formData.dateDebut.toLocaleDateString('fr-FR');
      this.dateFinFormatted = formData.dateFin.toLocaleDateString('fr-FR');
      
      // Charger les transactions depuis l'API CRUD classique
      const dateDebut = formData.dateDebut.toISOString();
      const dateFin = formData.dateFin.toISOString();
      
      this.transactionService.getAllTransactions().subscribe({
        next: (allTransactions: any[]) => {
          // Filtrer les transactions par compte et période
          this.transactions = allTransactions
            .filter((t: any) => t.numeroCompte === formData.numeroCompte)
            .filter((t: any) => {
              const transactionDate = new Date(t.dateTransaction);
              return transactionDate >= formData.dateDebut && transactionDate <= formData.dateFin;
            })
            .map((t: any) => ({
              id: t.id,
              typeTransaction: t.typeTransaction,
              montant: t.montant,
              dateTransaction: t.dateTransaction,
              description: t.description,
              compteId: t.compteId,
              numeroCompte: t.numeroCompte,
              soldeAvant: t.soldeAvant || 0,
              soldeApres: t.soldeApres || 0
            }))
            .sort((a: any, b: any) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime());
          
          this.transactionsLoaded = true;
          this.isLoadingTransactions = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des transactions:', error);
          this.snackBar.open('Erreur lors du chargement des transactions', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoadingTransactions = false;
          
          // En cas d'erreur, utiliser des données mock comme fallback
          const mockTransactions: Transaction[] = [
            {
              id: 1,
              typeTransaction: 'DEPOT',
              montant: 50000,
              dateTransaction: new Date(2024, 0, 15, 10, 30).toISOString(),
              description: 'Dépôt initial',
              compteId: 1,
              numeroCompte: formData.numeroCompte,
              soldeAvant: 100000,
              soldeApres: 150000
            }
          ];
          this.transactions = mockTransactions;
          this.transactionsLoaded = true;
        }
      });
    }
  }

  imprimerReleve() {
    if (this.releveForm.valid && this.transactions.length > 0) {
      this.isLoadingReleve = true;
      
      // Générer le relevé localement (pas d'API de génération disponible sans authentification)
      setTimeout(() => {
        this.genererReleveLocal();
        this.isLoadingReleve = false;
        this.snackBar.open('Relevé généré avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 1000);
    }
  }

  private genererReleveLocal() {
    if (!this.compteSelectionne) return;
    
    let releve = '================================================================================\n';
    releve += '                           RELEVÉ DE COMPTE\n';
    releve += '                         Société bancaire "Ega"\n';
    releve += '================================================================================\n\n';
    
    releve += `Client: ${this.compteSelectionne.proprietairePrenom} ${this.compteSelectionne.proprietaireNom}\n`;
    releve += `Compte: ${this.compteSelectionne.numeroCompte}\n`;
    releve += `Type: ${this.compteSelectionne.typeCompte}\n`;
    releve += `Période: du ${this.dateDebutFormatted} au ${this.dateFinFormatted}\n`;
    releve += `Solde actuel: ${this.compteSelectionne.solde.toLocaleString('fr-FR')} XOF\n\n`;
    
    releve += '--------------------------------------------------------------------------------\n';
    releve += String.prototype.padEnd.call('DATE', 20) + 
              String.prototype.padEnd.call('TYPE', 15) + 
              String.prototype.padEnd.call('MONTANT', 12) + 
              String.prototype.padEnd.call('DESCRIPTION', 25) + 
              'SOLDE\n';
    releve += '--------------------------------------------------------------------------------\n';
    
    this.transactions.forEach(transaction => {
      const date = new Date(transaction.dateTransaction).toLocaleDateString('fr-FR') + ' ' + 
                   new Date(transaction.dateTransaction).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
      const type = this.getTransactionLabel(transaction.typeTransaction);
      const montant = transaction.montant.toLocaleString('fr-FR');
      const description = (transaction.description || '').substring(0, 24);
      const solde = transaction.soldeApres.toLocaleString('fr-FR');
      
      releve += String.prototype.padEnd.call(date, 20) + 
                String.prototype.padEnd.call(type, 15) + 
                String.prototype.padEnd.call(montant, 12) + 
                String.prototype.padEnd.call(description, 25) + 
                solde + '\n';
    });
    
    releve += '--------------------------------------------------------------------------------\n';
    releve += `Nombre de transactions: ${this.transactions.length}\n`;
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Relevé de compte</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${releve}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'DEPOT':
      case 'VERSEMENT':
        return 'add_circle';
      case 'RETRAIT':
        return 'remove_circle';
      case 'VIREMENT_ENTRANT':
        return 'call_received';
      case 'VIREMENT_SORTANT':
        return 'call_made';
      default:
        return 'swap_horiz';
    }
  }

  getTransactionLabel(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'Dépôt';
      case 'VERSEMENT':
        return 'Versement';
      case 'RETRAIT':
        return 'Retrait';
      case 'VIREMENT_ENTRANT':
        return 'Virement entrant';
      case 'VIREMENT_SORTANT':
        return 'Virement sortant';
      default:
        return type;
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'DEPOT':
      case 'VERSEMENT':
        return 'depot';
      case 'RETRAIT':
        return 'retrait';
      case 'VIREMENT_ENTRANT':
        return 'virement_entrant';
      case 'VIREMENT_SORTANT':
        return 'virement_sortant';
      default:
        return '';
    }
  }

  getMontantClass(type: string): string {
    switch (type) {
      case 'DEPOT':
      case 'VERSEMENT':
      case 'VIREMENT_ENTRANT':
        return 'credit';
      case 'RETRAIT':
      case 'VIREMENT_SORTANT':
        return 'debit';
      default:
        return '';
    }
  }

  getMontantPrefix(type: string): string {
    switch (type) {
      case 'DEPOT':
      case 'VERSEMENT':
      case 'VIREMENT_ENTRANT':
        return '+';
      case 'RETRAIT':
      case 'VIREMENT_SORTANT':
        return '-';
      default:
        return '';
    }
  }
}