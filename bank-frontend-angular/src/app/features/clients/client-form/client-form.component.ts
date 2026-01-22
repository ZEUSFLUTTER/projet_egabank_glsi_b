import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

import { ClientService } from '../../../core/services/client.service';
import { CompteService } from '../../../core/services/compte.service';
import { Client, CreateCompteDto } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  template: `
    <div class="client-form-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode ? 'Modifier le client' : 'Nouveau client' }}</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="nom" required>
                <mat-error *ngIf="clientForm.get('nom')?.hasError('required')">
                  Le nom est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="prenom" required>
                <mat-error *ngIf="clientForm.get('prenom')?.hasError('required')">
                  Le prénom est requis
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Date de naissance</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateNaissance" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="clientForm.get('dateNaissance')?.hasError('required')">
                  La date de naissance est requise
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Sexe</mat-label>
                <mat-select formControlName="sexe" required>
                  <mat-option value="M">Masculin</mat-option>
                  <mat-option value="F">Féminin</mat-option>
                </mat-select>
                <mat-error *ngIf="clientForm.get('sexe')?.hasError('required')">
                  Le sexe est requis
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Adresse</mat-label>
              <textarea matInput formControlName="adresse" rows="3" required></textarea>
              <mat-error *ngIf="clientForm.get('adresse')?.hasError('required')">
                L'adresse est requise
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>Numéro de téléphone</mat-label>
                <input matInput formControlName="numeroTelephone" required>
                <mat-error *ngIf="clientForm.get('numeroTelephone')?.hasError('required')">
                  Le numéro de téléphone est requis
                </mat-error>
                <mat-error *ngIf="clientForm.get('numeroTelephone')?.hasError('pattern')">
                  Format de téléphone invalide
                </mat-error>
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="courriel" required>
                <mat-error *ngIf="clientForm.get('courriel')?.hasError('required')">
                  L'email est requis
                </mat-error>
                <mat-error *ngIf="clientForm.get('courriel')?.hasError('email')">
                  Format d'email invalide
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Nationalité</mat-label>
              <mat-select formControlName="nationalite" required>
                <mat-option value="Sénégalaise">Sénégalaise</mat-option>
                <mat-option value="Malienne">Malienne</mat-option>
                <mat-option value="Burkinabé">Burkinabé</mat-option>
                <mat-option value="Ivoirienne">Ivoirienne</mat-option>
                <mat-option value="Guinéenne">Guinéenne</mat-option>
                <mat-option value="Française">Française</mat-option>
                <mat-option value="Autre">Autre</mat-option>
              </mat-select>
              <mat-error *ngIf="clientForm.get('nationalite')?.hasError('required')">
                La nationalité est requise
              </mat-error>
            </mat-form-field>

            <!-- Section création de compte (uniquement en mode création) -->
            <mat-expansion-panel *ngIf="!isEditMode" class="compte-section">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>account_balance</mat-icon>
                  Créer un compte pour ce client
                </mat-panel-title>
                <mat-panel-description>
                  Optionnel - Vous pouvez créer un compte maintenant ou plus tard
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="compte-form-section">
                <mat-checkbox formControlName="creerCompte" class="full-width">
                  Créer un compte pour ce client
                </mat-checkbox>

                <div *ngIf="clientForm.get('creerCompte')?.value" class="compte-details">
                  <mat-form-field class="full-width">
                    <mat-label>Type de compte</mat-label>
                    <mat-select formControlName="typeCompte">
                      <mat-option value="COURANT">
                        <mat-icon>account_balance</mat-icon>
                        Compte Courant
                      </mat-option>
                      <mat-option value="EPARGNE">
                        <mat-icon>savings</mat-icon>
                        Compte Épargne
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="clientForm.get('typeCompte')?.hasError('required')">
                      Le type de compte est requis
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field class="full-width">
                    <mat-label>Solde initial (XOF)</mat-label>
                    <input matInput type="number" formControlName="soldeInitial" min="0">
                    <mat-icon matSuffix>attach_money</mat-icon>
                    <mat-hint>Laissez vide pour un solde de 0 XOF</mat-hint>
                    <mat-error *ngIf="clientForm.get('soldeInitial')?.hasError('min')">
                      Le solde initial ne peut pas être négatif
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
            </mat-expansion-panel>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Annuler
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="clientForm.invalid || isLoading">
                <mat-icon *ngIf="!isLoading">save</mat-icon>
                <mat-icon *ngIf="isLoading" class="spinning">refresh</mat-icon>
                {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .client-form-container {
      padding: 20px;
      max-width: 800px;
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
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 10px;
    }

    .form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }

    .form-actions button {
      min-width: 120px;
    }

    .compte-section {
      margin: 20px 0;
    }

    .compte-form-section {
      padding: 10px 0;
    }

    .compte-details {
      margin-top: 15px;
      padding-left: 20px;
      border-left: 3px solid #007bff;
    }

    mat-expansion-panel-header mat-icon {
      margin-right: 8px;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    mat-card {
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .form-field {
        width: 100%;
      }
    }
  `]
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private compteService: CompteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      adresse: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      courriel: ['', [Validators.required, Validators.email]],
      nationalite: ['', Validators.required],
      // Champs pour la création de compte
      creerCompte: [false],
      typeCompte: ['COURANT'],
      soldeInitial: [0, [Validators.min(0)]]
    });

    // Ajouter la validation conditionnelle pour le type de compte
    this.setupConditionalValidation();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.clientId = +id;
      this.loadClient();
    }
  }

  loadClient() {
    if (this.clientId) {
      this.clientService.getClientById(this.clientId).subscribe({
        next: (client) => {
          this.clientForm.patchValue({
            nom: client.nom,
            prenom: client.prenom,
            dateNaissance: new Date(client.dateNaissance),
            sexe: client.sexe,
            adresse: client.adresse,
            numeroTelephone: client.numeroTelephone,
            courriel: client.courriel,
            nationalite: client.nationalite
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement du client:', error);
          this.snackBar.open('Erreur lors du chargement du client', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.goBack();
        }
      });
    }
  }

  setupConditionalValidation() {
    // Écouter les changements de la checkbox "créer compte"
    this.clientForm.get('creerCompte')?.valueChanges.subscribe(creerCompte => {
      const typeCompteControl = this.clientForm.get('typeCompte');
      
      if (creerCompte) {
        typeCompteControl?.setValidators([Validators.required]);
      } else {
        typeCompteControl?.clearValidators();
      }
      typeCompteControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const formData = this.clientForm.value;
      
      // Préparer les données du client
      const clientData: Client = {
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance instanceof Date 
          ? formData.dateNaissance.toISOString().split('T')[0]
          : formData.dateNaissance,
        sexe: formData.sexe,
        adresse: formData.adresse,
        numeroTelephone: formData.numeroTelephone,
        courriel: formData.courriel,
        nationalite: formData.nationalite
      };

      console.log('Données envoyées au backend:', clientData);

      if (this.isEditMode) {
        // Mode édition - pas de création de compte
        this.updateClient(clientData);
      } else {
        // Mode création - possibilité de créer un compte
        this.createClientAndAccount(clientData, formData);
      }
    }
  }

  private createClientAndAccount(clientData: Client, formData: any) {
    this.clientService.createClient(clientData).subscribe({
      next: (clientResponse) => {
        if (formData.creerCompte && clientResponse.id) {
          // Créer le compte pour le client
          const compteData: CreateCompteDto = {
            proprietaireId: clientResponse.id,
            typeCompte: formData.typeCompte,
            solde: formData.soldeInitial || 0
          };
          
          this.compteService.createCompte(compteData).subscribe({
            next: (compteResponse) => {
              this.isLoading = false;
              this.snackBar.open(
                `Client créé avec succès ! Un compte ${formData.typeCompte.toLowerCase()} a également été créé.`,
                'Fermer',
                {
                  duration: 5000,
                  panelClass: ['success-snackbar']
                }
              );
              this.router.navigate(['/clients', clientResponse.id]);
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Erreur lors de la création du compte:', error);
              this.snackBar.open(
                'Client créé mais erreur lors de la création du compte. Vous pouvez créer le compte manuellement.',
                'Fermer',
                {
                  duration: 7000,
                  panelClass: ['warning-snackbar']
                }
              );
              this.router.navigate(['/clients', clientResponse.id]);
            }
          });
        } else {
          this.isLoading = false;
          this.snackBar.open('Client créé avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/clients']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la création du client:', error);
        
        // Afficher les détails des erreurs de validation
        let errorMessage = 'Erreur lors de la création du client';
        if (error.error && error.error.errors) {
          const validationErrors = Object.entries(error.error.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          errorMessage = `Erreurs de validation:\n${validationErrors}`;
          console.error('Détails des erreurs de validation:', error.error.errors);
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 8000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private updateClient(clientData: Client) {
    this.clientService.updateClient(this.clientId!, clientData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Client modifié avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/clients']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la modification:', error);
        this.snackBar.open(
          error.error?.message || 'Erreur lors de la modification',
          'Fermer',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
}