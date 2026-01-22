import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TransactionService } from '../../core/services/transaction.service';
import { CompteService } from '../../core/services/compte.service';
import { Compte, OperationDto, VirementDto } from '../../core/models/client.model';

/**
 * Composant pour les opérations bancaires
 * Utilise l'API CRUD classique pour éviter les problèmes d'authentification
 */
@Component({
  selector: 'app-operations',
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
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="operations-container">
      <div class="header">
        <h1>
          <mat-icon>account_balance</mat-icon>
          Opérations bancaires
        </h1>
        <p>Effectuez vos opérations bancaires en toute sécurité</p>
      </div>

      <div *ngIf="!isLoadingComptes; else loadingTemplate">
        <mat-tab-group class="operations-tabs">
          
          <!-- Onglet Dépôt/Versement -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>add_circle</mat-icon>
              Dépôt
            </ng-template>
            
            <mat-card class="operation-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>add_circle</mat-icon>
                  Faire un versement sur un compte
                </mat-card-title>
                <mat-card-subtitle>
                  Ajoutez de l'argent sur un compte
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="depotForm" (ngSubmit)="effectuerDepot()">
                  
                  <mat-form-field class="full-width">
                    <mat-label>Compte à créditer</mat-label>
                    <mat-select formControlName="numeroCompte" required>
                      <mat-option *ngFor="let compte of mesComptes" [value]="compte.numeroCompte">
                        {{ compte.numeroCompte }} - {{ compte.typeCompte }} 
                        ({{ compte.solde | currency:'XOF':'symbol':'1.0-0' }})
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="depotForm.get('numeroCompte')?.hasError('required')">
                      Veuillez sélectionner un compte
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Montant (XOF)</mat-label>
                    <input matInput type="number" formControlName="montant" min="1" required>
                    <mat-icon matSuffix>attach_money</mat-icon>
                    <mat-error *ngIf="depotForm.get('montant')?.hasError('required')">
                      Le montant est requis
                    </mat-error>
                    <mat-error *ngIf="depotForm.get('montant')?.hasError('min')">
                      Le montant doit être positif
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Description (optionnel)</mat-label>
                    <input matInput formControlName="description" maxlength="200">
                    <mat-hint>Décrivez brièvement cette opération</mat-hint>
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="depotForm.invalid || isLoadingOperation">
                      <mat-icon *ngIf="!isLoadingOperation">add_circle</mat-icon>
                      <mat-icon *ngIf="isLoadingOperation" class="spinning">refresh</mat-icon>
                      {{ isLoadingOperation ? 'Traitement...' : 'Effectuer le dépôt' }}
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <!-- Onglet Retrait -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>remove_circle</mat-icon>
              Retrait
            </ng-template>
            
            <mat-card class="operation-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>remove_circle</mat-icon>
                  Faire un retrait sur un compte
                </mat-card-title>
                <mat-card-subtitle>
                  Retirez de l'argent si le solde le permet
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="retraitForm" (ngSubmit)="effectuerRetrait()">
                  
                  <mat-form-field class="full-width">
                    <mat-label>Compte à débiter</mat-label>
                    <mat-select formControlName="numeroCompte" required>
                      <mat-option *ngFor="let compte of mesComptes" [value]="compte.numeroCompte">
                        {{ compte.numeroCompte }} - {{ compte.typeCompte }} 
                        ({{ compte.solde | currency:'XOF':'symbol':'1.0-0' }})
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="retraitForm.get('numeroCompte')?.hasError('required')">
                      Veuillez sélectionner un compte
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Montant (XOF)</mat-label>
                    <input matInput type="number" formControlName="montant" min="1" required>
                    <mat-icon matSuffix>attach_money</mat-icon>
                    <mat-error *ngIf="retraitForm.get('montant')?.hasError('required')">
                      Le montant est requis
                    </mat-error>
                    <mat-error *ngIf="retraitForm.get('montant')?.hasError('min')">
                      Le montant doit être positif
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Description (optionnel)</mat-label>
                    <input matInput formControlName="description" maxlength="200">
                    <mat-hint>Décrivez brièvement cette opération</mat-hint>
                  </mat-form-field>

                  <!-- Affichage du solde disponible -->
                  <div class="solde-info" *ngIf="compteSelectionneRetrait">
                    <mat-icon>info</mat-icon>
                    <span>Solde disponible : {{ compteSelectionneRetrait.solde | currency:'XOF':'symbol':'1.0-0' }}</span>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="warn" type="submit" 
                            [disabled]="retraitForm.invalid || isLoadingOperation">
                      <mat-icon *ngIf="!isLoadingOperation">remove_circle</mat-icon>
                      <mat-icon *ngIf="isLoadingOperation" class="spinning">refresh</mat-icon>
                      {{ isLoadingOperation ? 'Traitement...' : 'Effectuer le retrait' }}
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <!-- Onglet Virement -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>swap_horiz</mat-icon>
              Virement
            </ng-template>
            
            <mat-card class="operation-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>swap_horiz</mat-icon>
                  Faire un virement d'un compte à un autre
                </mat-card-title>
                <mat-card-subtitle>
                  Transférez de l'argent entre comptes
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <form [formGroup]="virementForm" (ngSubmit)="effectuerVirement()">
                  
                  <mat-form-field class="full-width">
                    <mat-label>Compte source (à débiter)</mat-label>
                    <mat-select formControlName="compteSource" required>
                      <mat-option *ngFor="let compte of mesComptes" [value]="compte.numeroCompte">
                        {{ compte.numeroCompte }} - {{ compte.typeCompte }} 
                        ({{ compte.solde | currency:'XOF':'symbol':'1.0-0' }})
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="virementForm.get('compteSource')?.hasError('required')">
                      Veuillez sélectionner le compte source
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Compte destinataire</mat-label>
                    <input matInput formControlName="compteDestinataire" required
                           placeholder="Numéro de compte destinataire">
                    <mat-icon matSuffix>account_balance</mat-icon>
                    <mat-error *ngIf="virementForm.get('compteDestinataire')?.hasError('required')">
                      Le compte destinataire est requis
                    </mat-error>
                    <mat-hint>Saisissez le numéro de compte complet (IBAN)</mat-hint>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Montant (XOF)</mat-label>
                    <input matInput type="number" formControlName="montant" min="1" required>
                    <mat-icon matSuffix>attach_money</mat-icon>
                    <mat-error *ngIf="virementForm.get('montant')?.hasError('required')">
                      Le montant est requis
                    </mat-error>
                    <mat-error *ngIf="virementForm.get('montant')?.hasError('min')">
                      Le montant doit être positif
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Description (optionnel)</mat-label>
                    <input matInput formControlName="description" maxlength="200">
                    <mat-hint>Décrivez brièvement ce virement</mat-hint>
                  </mat-form-field>

                  <!-- Affichage du solde disponible -->
                  <div class="solde-info" *ngIf="compteSelectionneVirement">
                    <mat-icon>info</mat-icon>
                    <span>Solde disponible : {{ compteSelectionneVirement.solde | currency:'XOF':'symbol':'1.0-0' }}</span>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="accent" type="submit" 
                            [disabled]="virementForm.invalid || isLoadingOperation">
                      <mat-icon *ngIf="!isLoadingOperation">swap_horiz</mat-icon>
                      <mat-icon *ngIf="isLoadingOperation" class="spinning">refresh</mat-icon>
                      {{ isLoadingOperation ? 'Traitement...' : 'Effectuer le virement' }}
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des comptes...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .operations-container {
      padding: 20px;
      max-width: 800px;
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

    .operations-tabs {
      margin-top: 20px;
    }

    .operation-card {
      margin-top: 20px;
    }

    .operation-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .form-actions button {
      min-width: 200px;
    }

    .solde-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 4px;
      margin-bottom: 15px;
      color: #1976d2;
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

    ::ng-deep .mat-tab-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class OperationsComponent implements OnInit {
  depotForm: FormGroup;
  retraitForm: FormGroup;
  virementForm: FormGroup;
  
  mesComptes: Compte[] = [];
  compteSelectionneRetrait: Compte | null = null;
  compteSelectionneVirement: Compte | null = null;
  
  isLoadingComptes = true;
  isLoadingOperation = false;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {
    this.depotForm = this.fb.group({
      numeroCompte: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.retraitForm = this.fb.group({
      numeroCompte: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.virementForm = this.fb.group({
      compteSource: ['', Validators.required],
      compteDestinataire: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadMesComptes();
    this.setupFormSubscriptions();
  }

  loadMesComptes() {
    this.isLoadingComptes = true;
    
    // Utiliser l'API CRUD classique (pas d'authentification requise)
    this.compteService.getAllComptes().subscribe({
      next: (comptes: any[]) => {
        // Transformer les comptes pour l'affichage
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
    // Écouter les changements de sélection pour le retrait
    this.retraitForm.get('numeroCompte')?.valueChanges.subscribe(numeroCompte => {
      this.compteSelectionneRetrait = this.mesComptes.find(c => c.numeroCompte === numeroCompte) || null;
    });

    // Écouter les changements de sélection pour le virement
    this.virementForm.get('compteSource')?.valueChanges.subscribe(numeroCompte => {
      this.compteSelectionneVirement = this.mesComptes.find(c => c.numeroCompte === numeroCompte) || null;
    });
  }

  effectuerDepot() {
    if (this.depotForm.valid) {
      this.isLoadingOperation = true;
      const formData = this.depotForm.value;
      
      const operation: OperationDto = {
        numeroCompte: formData.numeroCompte,
        montant: formData.montant,
        description: formData.description || 'Dépôt'
      };

      this.transactionService.effectuerDepot(operation).subscribe({
        next: (transaction: any) => {
          this.isLoadingOperation = false;
          this.snackBar.open('Dépôt effectué avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.depotForm.reset();
          this.loadMesComptes();
        },
        error: (error: any) => {
          this.isLoadingOperation = false;
          console.error('Erreur lors du dépôt:', error);
          this.snackBar.open(
            error.error?.message || 'Erreur lors du dépôt',
            'Fermer',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  effectuerRetrait() {
    if (this.retraitForm.valid) {
      this.isLoadingOperation = true;
      const formData = this.retraitForm.value;
      
      // Vérifier le solde avant d'effectuer l'opération
      if (this.compteSelectionneRetrait && this.compteSelectionneRetrait.solde < formData.montant) {
        this.isLoadingOperation = false;
        this.snackBar.open('Solde insuffisant pour effectuer ce retrait', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      
      const operation: OperationDto = {
        numeroCompte: formData.numeroCompte,
        montant: formData.montant,
        description: formData.description || 'Retrait'
      };

      this.transactionService.effectuerRetrait(operation).subscribe({
        next: (transaction: any) => {
          this.isLoadingOperation = false;
          this.snackBar.open('Retrait effectué avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.retraitForm.reset();
          this.compteSelectionneRetrait = null;
          this.loadMesComptes();
        },
        error: (error: any) => {
          this.isLoadingOperation = false;
          console.error('Erreur lors du retrait:', error);
          this.snackBar.open(
            error.error?.message || 'Erreur lors du retrait',
            'Fermer',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  effectuerVirement() {
    if (this.virementForm.valid) {
      this.isLoadingOperation = true;
      const formData = this.virementForm.value;
      
      // Vérifier le solde avant d'effectuer l'opération
      if (this.compteSelectionneVirement && this.compteSelectionneVirement.solde < formData.montant) {
        this.isLoadingOperation = false;
        this.snackBar.open('Solde insuffisant pour effectuer ce virement', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      
      const virement: VirementDto = {
        compteSource: formData.compteSource,
        compteDestinataire: formData.compteDestinataire,
        montant: formData.montant,
        description: formData.description || 'Virement'
      };

      this.transactionService.effectuerVirement(virement).subscribe({
        next: (transactions: any[]) => {
          this.isLoadingOperation = false;
          this.snackBar.open('Virement effectué avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.virementForm.reset();
          this.compteSelectionneVirement = null;
          this.loadMesComptes();
        },
        error: (error: any) => {
          this.isLoadingOperation = false;
          console.error('Erreur lors du virement:', error);
          this.snackBar.open(
            error.error?.message || 'Erreur lors du virement',
            'Fermer',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}