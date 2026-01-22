import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CompteService } from '../../../core/services/compte.service';
import { CompteAvecProprietaire } from '../../../core/models/client.model';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="compte-list-container">
      <div class="header">
        <h1>Gestion des Comptes</h1>
        <button mat-raised-button color="primary" (click)="navigateToNewCompte()">
          <mat-icon>add</mat-icon>
          Nouveau Compte
        </button>
      </div>

      <mat-card *ngIf="!isLoading; else loadingTemplate">
        <mat-card-content>
          <div class="table-container" *ngIf="comptes.length > 0; else noDataTemplate">
            <table mat-table [dataSource]="comptes" class="comptes-table">
              <!-- Colonne Numéro de compte -->
              <ng-container matColumnDef="numeroCompte">
                <th mat-header-cell *matHeaderCellDef>Numéro de compte</th>
                <td mat-cell *matCellDef="let compte">
                  <div class="numero-compte">
                    {{ compte.numeroCompte }}
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Propriétaire -->
              <ng-container matColumnDef="proprietaire">
                <th mat-header-cell *matHeaderCellDef>Propriétaire</th>
                <td mat-cell *matCellDef="let compte">
                  <div class="proprietaire">
                    {{ compte.proprietaire.nom }} {{ compte.proprietaire.prenom }}
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Type -->
              <ng-container matColumnDef="typeCompte">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let compte">
                  <span class="type-badge" [class]="compte.typeCompte.toLowerCase()">
                    {{ compte.typeCompte }}
                  </span>
                </td>
              </ng-container>

              <!-- Colonne Solde -->
              <ng-container matColumnDef="solde">
                <th mat-header-cell *matHeaderCellDef>Solde</th>
                <td mat-cell *matCellDef="let compte">
                  <span class="solde" [class.negative]="compte.solde < 0">
                    {{ compte.solde | currency:'XOF':'symbol':'1.0-0' }}
                  </span>
                </td>
              </ng-container>

              <!-- Colonne Date de création -->
              <ng-container matColumnDef="dateCreation">
                <th mat-header-cell *matHeaderCellDef>Date de création</th>
                <td mat-cell *matCellDef="let compte">{{ compte.dateCreation | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let compte">
                  <button mat-icon-button color="primary" 
                          (click)="viewTransactions(compte.id)"
                          matTooltip="Voir transactions">
                    <mat-icon>list</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" 
                          (click)="makeTransaction(compte.id)"
                          matTooltip="Nouvelle transaction">
                    <mat-icon>add_circle</mat-icon>
                  </button>
                  <button mat-icon-button color="primary" 
                          (click)="viewClient(compte.proprietaire.id)"
                          matTooltip="Voir client">
                    <mat-icon>person</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <ng-template #noDataTemplate>
            <div class="no-data">
              <mat-icon>account_balance_wallet</mat-icon>
              <h3>Aucun compte trouvé</h3>
              <p>Commencez par créer le premier compte</p>
              <button mat-raised-button color="primary" (click)="navigateToNewCompte()">
                <mat-icon>add</mat-icon>
                Créer un compte
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des comptes...</p>
        </div>
      </ng-template>

      <!-- Statistiques -->
      <div class="stats-section" *ngIf="!isLoading && comptes.length > 0">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Statistiques</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <mat-icon>account_balance_wallet</mat-icon>
                <div>
                  <h3>{{ comptes.length }}</h3>
                  <p>Total comptes</p>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>trending_up</mat-icon>
                <div>
                  <h3>{{ getTotalSolde() | currency:'XOF':'symbol':'1.0-0' }}</h3>
                  <p>Solde total</p>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>account_balance</mat-icon>
                <div>
                  <h3>{{ getComptesByType('COURANT').length }}</h3>
                  <p>Comptes courants</p>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>savings</mat-icon>
                <div>
                  <h3>{{ getComptesByType('EPARGNE').length }}</h3>
                  <p>Comptes épargne</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .compte-list-container {
      padding: 20px;
      max-width: 1200px;
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

    .table-container {
      overflow-x: auto;
    }

    .comptes-table {
      width: 100%;
    }

    .comptes-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .comptes-table td, .comptes-table th {
      padding: 12px 8px;
    }

    .numero-compte {
      font-family: monospace;
      font-size: 0.9rem;
      color: #333;
    }

    .proprietaire {
      font-weight: 500;
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .type-badge.courant {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-badge.epargne {
      background-color: #e8f5e8;
      color: #388e3c;
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

    .stat-item h3 {
      margin: 0;
      font-size: 1.5rem;
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
export class CompteListComponent implements OnInit {
  comptes: CompteAvecProprietaire[] = [];
  displayedColumns: string[] = ['numeroCompte', 'proprietaire', 'typeCompte', 'solde', 'dateCreation', 'actions'];
  isLoading = true;

  constructor(
    private compteService: CompteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadComptes();
  }

  loadComptes() {
    this.isLoading = true;
    
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        // Transformer les comptes en CompteAvecProprietaire pour l'affichage
        this.comptes = comptes.map(compte => ({
          ...compte,
          proprietaire: {
            id: compte.proprietaireId,
            nom: compte.proprietaireNom || 'N/A',
            prenom: compte.proprietairePrenom || 'N/A'
          }
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.snackBar.open('Erreur lors du chargement des comptes', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
        
        // En cas d'erreur, utiliser des données mock comme fallback
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
        this.comptes = mockComptes;
      }
    });
  }

  navigateToNewCompte() {
    this.router.navigate(['/comptes/new']);
  }

  viewTransactions(compteId: number) {
    this.router.navigate(['/transactions'], { 
      queryParams: { compteId: compteId } 
    });
  }

  makeTransaction(compteId: number) {
    this.router.navigate(['/transactions/new'], { 
      queryParams: { compteId: compteId } 
    });
  }

  viewClient(clientId: number) {
    this.router.navigate(['/clients', clientId]);
  }

  getTotalSolde(): number {
    return this.comptes.reduce((total, compte) => total + compte.solde, 0);
  }

  getComptesByType(type: string): CompteAvecProprietaire[] {
    return this.comptes.filter(compte => compte.typeCompte === type);
  }
}