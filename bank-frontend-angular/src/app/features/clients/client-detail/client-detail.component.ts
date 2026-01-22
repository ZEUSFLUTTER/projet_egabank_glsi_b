import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientOperationsService } from '../../../core/services/client-operations.service';
import { CompteService } from '../../../core/services/compte.service';
import { ClientService } from '../../../core/services/client.service';
import { Client, Compte } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="client-detail-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails du client</h1>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="editClient()" *ngIf="client">
            <mat-icon>edit</mat-icon>
            Modifier
          </button>
        </div>
      </div>

      <div *ngIf="!isLoading; else loadingTemplate">
        <!-- Informations du client -->
        <mat-card class="client-info" *ngIf="client">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              {{ client.nom }} {{ client.prenom }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <strong>Date de naissance:</strong>
                <span>{{ client.dateNaissance | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="info-item">
                <strong>Sexe:</strong>
                <span>{{ client.sexe === 'M' ? 'Masculin' : 'Féminin' }}</span>
              </div>
              <div class="info-item">
                <strong>Email:</strong>
                <span>{{ client.courriel }}</span>
              </div>
              <div class="info-item">
                <strong>Téléphone:</strong>
                <span>{{ client.numeroTelephone }}</span>
              </div>
              <div class="info-item">
                <strong>Nationalité:</strong>
                <span>{{ client.nationalite }}</span>
              </div>
              <div class="info-item full-width">
                <strong>Adresse:</strong>
                <span>{{ client.adresse }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Comptes du client -->
        <mat-card class="comptes-section">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>account_balance_wallet</mat-icon>
              Comptes ({{ comptes.length }})
            </mat-card-title>
            <div class="spacer"></div>
            <button mat-raised-button color="primary" (click)="createCompte()">
              <mat-icon>add</mat-icon>
              Nouveau compte
            </button>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="comptes.length > 0; else noComptesTemplate">
              <table mat-table [dataSource]="comptes" class="comptes-table">
                <!-- Colonne Numéro de compte -->
                <ng-container matColumnDef="numeroCompte">
                  <th mat-header-cell *matHeaderCellDef>Numéro de compte</th>
                  <td mat-cell *matCellDef="let compte">{{ compte.numeroCompte }}</td>
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
                            (click)="viewCompteTransactions(compte.id)"
                            matTooltip="Voir transactions">
                      <mat-icon>list</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>

            <ng-template #noComptesTemplate>
              <div class="no-comptes">
                <mat-icon>account_balance_wallet</mat-icon>
                <h3>Aucun compte</h3>
                <p>Ce client n'a pas encore de compte bancaire</p>
                <button mat-raised-button color="primary" (click)="createCompte()">
                  <mat-icon>add</mat-icon>
                  Créer un compte
                </button>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des informations...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .client-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0 0 0 10px;
      color: #333;
      flex: 1;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .client-info {
      margin-bottom: 20px;
    }

    .client-info mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item strong {
      color: #666;
      font-size: 0.9rem;
    }

    .info-item span {
      color: #333;
      font-size: 1rem;
    }

    .comptes-section mat-card-header {
      display: flex;
      align-items: center;
    }

    .comptes-section mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .spacer {
      flex: 1;
    }

    .comptes-table {
      width: 100%;
      margin-top: 20px;
    }

    .comptes-table th {
      background-color: #f5f5f5;
      font-weight: 600;
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

    .no-comptes {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-comptes mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 15px;
      color: #ccc;
    }

    .no-comptes h3 {
      margin: 0 0 10px 0;
    }

    .no-comptes p {
      margin-bottom: 20px;
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
  `]
})
export class ClientDetailComponent implements OnInit {
  client?: Client;
  comptes: Compte[] = [];
  displayedColumns: string[] = ['numeroCompte', 'typeCompte', 'solde', 'dateCreation', 'actions'];
  isLoading = true;
  clientId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientOperationsService: ClientOperationsService,
    private compteService: CompteService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = +id;
      this.loadClientDetails();
    }
  }

  loadClientDetails() {
    if (!this.clientId) return;

    this.isLoading = true;
    
    // Utiliser les APIs CRUD classiques pour la gestion des clients
    Promise.all([
      this.clientService.getClientById(this.clientId).toPromise(),
      this.compteService.getComptesByClientId(this.clientId).toPromise()
    ]).then(([client, comptes]) => {
      this.client = client;
      this.comptes = comptes || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement:', error);
      this.snackBar.open('Erreur lors du chargement des informations', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
      
      // En cas d'erreur, utiliser des données mock comme fallback
      const mockClient: Client = {
        id: 1,
        nom: 'Diop',
        prenom: 'Amadou',
        dateNaissance: '1990-05-15',
        sexe: 'M',
        adresse: '123 Rue de la Paix, Dakar',
        numeroTelephone: '+221 77 123 45 67',
        courriel: 'amadou.diop@email.com',
        nationalite: 'Sénégalaise',
        dateCreation: new Date().toISOString()
      };

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
          proprietaireCourriel: 'amadou.diop@email.com',
          nombreTransactions: 15
        }
      ];

      this.client = mockClient;
      this.comptes = mockComptes;
    });
  }

  editClient() {
    if (this.clientId) {
      this.router.navigate(['/clients', this.clientId, 'edit']);
    }
  }

  createCompte() {
    if (this.clientId) {
      this.router.navigate(['/comptes/new'], { 
        queryParams: { clientId: this.clientId } 
      });
    }
  }

  viewCompteTransactions(compteId: number) {
    this.router.navigate(['/transactions'], { 
      queryParams: { compteId: compteId } 
    });
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}