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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CompteService } from '../../../core/services/compte.service';
import { ClientService } from '../../../core/services/client.service';
import { Client, CreateCompteDto } from '../../../core/models/client.model';

@Component({
  selector: 'app-compte-form',
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
    MatSnackBarModule
  ],
  template: `
    <div class="compte-form-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode ? 'Modifier le compte' : 'Nouveau compte' }}</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="compteForm" (ngSubmit)="onSubmit()">
            
            <!-- Sélection du client -->
            <mat-form-field class="full-width">
              <mat-label>Client propriétaire</mat-label>
              <mat-select formControlName="proprietaireId" required [disabled]="!!clientIdFromRoute">
                <mat-option *ngFor="let client of clients" [value]="client.id">
                  {{ client.nom }} {{ client.prenom }} - {{ client.courriel }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="compteForm.get('proprietaireId')?.hasError('required')">
                Le client propriétaire est requis
              </mat-error>
            </mat-form-field>

            <!-- Type de compte -->
            <mat-form-field class="full-width">
              <mat-label>Type de compte</mat-label>
              <mat-select formControlName="typeCompte" required>
                <mat-option value="COURANT">
                  <mat-icon>account_balance</mat-icon>
                  Compte Courant
                </mat-option>
                <mat-option value="EPARGNE">
                  <mat-icon>savings</mat-icon>
                  Compte Épargne
                </mat-option>
              </mat-select>
              <mat-error *ngIf="compteForm.get('typeCompte')?.hasError('required')">
                Le type de compte est requis
              </mat-error>
            </mat-form-field>

            <!-- Solde initial (optionnel pour modification) -->
            <mat-form-field class="full-width" *ngIf="!isEditMode">
              <mat-label>Solde initial (XOF)</mat-label>
              <input matInput type="number" formControlName="soldeInitial" min="0">
              <mat-icon matSuffix>attach_money</mat-icon>
              <mat-hint>Laissez vide pour un solde de 0 XOF</mat-hint>
              <mat-error *ngIf="compteForm.get('soldeInitial')?.hasError('min')">
                Le solde initial ne peut pas être négatif
              </mat-error>
            </mat-form-field>

            <!-- Informations du client sélectionné -->
            <div class="client-info" *ngIf="selectedClient">
              <h3>Informations du client</h3>
              <div class="info-grid">
                <p><strong>Nom complet :</strong> {{ selectedClient.nom }} {{ selectedClient.prenom }}</p>
                <p><strong>Email :</strong> {{ selectedClient.courriel }}</p>
                <p><strong>Téléphone :</strong> {{ selectedClient.numeroTelephone }}</p>
                <p><strong>Adresse :</strong> {{ selectedClient.adresse }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Annuler
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="compteForm.invalid || isLoading">
                <mat-icon *ngIf="!isLoading">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                <mat-icon *ngIf="isLoading" class="spinning">refresh</mat-icon>
                {{ isLoading ? 'Traitement...' : (isEditMode ? 'Modifier' : 'Créer le compte') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .compte-form-container {
      padding: 20px;
      max-width: 600px;
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

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .client-info {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #007bff;
    }

    .client-info h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .info-grid p {
      margin: 8px 0;
      color: #555;
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

    mat-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class CompteFormComponent implements OnInit {
  compteForm: FormGroup;
  clients: Client[] = [];
  selectedClient: Client | null = null;
  isLoading = false;
  isEditMode = false;
  compteId?: number;
  clientIdFromRoute?: number;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.compteForm = this.fb.group({
      proprietaireId: ['', Validators.required],
      typeCompte: ['', Validators.required],
      soldeInitial: [0, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.checkRouteParams();
    this.loadClients();
    this.setupFormSubscriptions();
  }

  checkRouteParams() {
    // Vérifier si on est en mode édition
    this.compteId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.compteId;

    // Vérifier si un client est pré-sélectionné
    const clientId = this.route.snapshot.queryParamMap.get('clientId');
    if (clientId) {
      this.clientIdFromRoute = +clientId;
      this.compteForm.patchValue({ proprietaireId: +clientId });
    }
  }

  loadClients() {
    // Charger les clients depuis l'API
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        if (this.clientIdFromRoute) {
          this.selectedClient = this.clients.find(c => c.id === this.clientIdFromRoute) || null;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        // En cas d'erreur, utiliser des données mock comme fallback
        const mockClients: Client[] = [
          {
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
          },
          {
            id: 2,
            nom: 'Fall',
            prenom: 'Fatou',
            dateNaissance: '1985-08-22',
            sexe: 'F',
            adresse: '456 Avenue Bourguiba, Dakar',
            numeroTelephone: '+221 76 987 65 43',
            courriel: 'fatou.fall@email.com',
            nationalite: 'Sénégalaise',
            dateCreation: new Date().toISOString()
          }
        ];
        
        this.clients = mockClients;
        if (this.clientIdFromRoute) {
          this.selectedClient = this.clients.find(c => c.id === this.clientIdFromRoute) || null;
        }
      }
    });
  }

  setupFormSubscriptions() {
    // Écouter les changements de sélection du client
    this.compteForm.get('proprietaireId')?.valueChanges.subscribe(clientId => {
      this.selectedClient = this.clients.find(c => c.id === clientId) || null;
    });
  }

  onSubmit() {
    if (this.compteForm.valid) {
      this.isLoading = true;
      const formData = this.compteForm.value;

      const compteData: CreateCompteDto = {
        proprietaireId: formData.proprietaireId,
        typeCompte: formData.typeCompte,
        solde: formData.soldeInitial || 0
      };

      this.compteService.createCompte(compteData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Compte créé avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          if (this.clientIdFromRoute) {
            this.router.navigate(['/clients', this.clientIdFromRoute]);
          } else {
            this.router.navigate(['/comptes']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de la création du compte:', error);
          this.snackBar.open(
            error.error?.message || 'Erreur lors de la création du compte',
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

  goBack() {
    if (this.clientIdFromRoute) {
      this.router.navigate(['/clients', this.clientIdFromRoute]);
    } else {
      this.router.navigate(['/comptes']);
    }
  }
}