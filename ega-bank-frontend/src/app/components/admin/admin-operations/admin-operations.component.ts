import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { OperationRequest, TypeOperation, Compte, Client } from '../../../models/models';

@Component({
  selector: 'app-admin-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px; max-width: 800px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">
        Effectuer une opération
        <span *ngIf="client" style="font-size: 18px; color: #666; font-weight: 400;">
          pour {{ client.prenom }} {{ client.nom }}
        </span>
      </h1>
      
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
          
          <div class="form-group">
            <label class="form-label">Type d'opération</label>
            <select [(ngModel)]="operation.type" name="type" class="form-select" required>
              <option value="">Sélectionner</option>
              <option [value]="TypeOperation.DEPOT">Dépôt</option>
              <option [value]="TypeOperation.RETRAIT">Retrait</option>
              <option [value]="TypeOperation.VIREMENT">Virement</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Compte source</label>
            <select [(ngModel)]="operation.numeroCompteSource" name="source" class="form-select" required>
              <option value="">Sélectionner un compte</option>
              <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                {{ compte.numeroCompte }} - {{ compte.type }} ({{ compte.solde | number:'1.2-2' }} FCFA)
              </option>
            </select>
          </div>
          
          <div class="form-group" *ngIf="operation.type === TypeOperation.VIREMENT">
            <label class="form-label">Compte destination</label>
            <input 
              type="text" 
              [(ngModel)]="operation.numeroCompteDestination" 
              name="destination" 
              class="form-control" 
              placeholder="Numéro de compte destination..." 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Montant (FCFA)</label>
            <input 
              type="number" 
              [(ngModel)]="montantNumber" 
              name="montant" 
              class="form-control" 
              placeholder="0.00" 
              min="0.01" 
              step="0.01" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Description (optionnel)</label>
            <input 
              type="text" 
              [(ngModel)]="operation.description" 
              name="description" 
              class="form-control" 
              placeholder="Ex: Dépôt administrateur, Correction solde..." 
            />
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="loading || !isFormValid()"
            >
              {{ loading ? 'Traitement...' : 'Valider l'opération' }}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="goBack()"
            >
              Retour
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminOperationsComponent implements OnInit {
  TypeOperation = TypeOperation;
  client: Client | null = null;
  comptes: Compte[] = [];
  montantNumber: number = 0;
  operation: OperationRequest = {
    type: TypeOperation.DEPOT,
    montant: 0,
    numeroCompteSource: '',
    numeroCompteDestination: '',
    description: ''
  };
  errorMessage = '';
  successMessage = '';
  loading = false;
  clientId: number = 0;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      this.loadClient(this.clientId);
      this.loadComptes(this.clientId);
    });

    // Pré-sélectionner un compte si spécifié dans les query params
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['compte']) {
        this.operation.numeroCompteSource = queryParams['compte'];
      }
    });
  }

  loadClient(id: number): void {
    this.adminService.getClient(id).subscribe({
      next: (client) => this.client = client,
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du client';
        console.error(err);
      }
    });
  }

  loadComptes(clientId: number): void {
    this.adminService.getComptesByClient(clientId).subscribe({
      next: (comptes) => this.comptes = comptes,
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des comptes';
        console.error(err);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.operation.type &&
      this.operation.numeroCompteSource &&
      this.montantNumber > 0 &&
      (this.operation.type !== TypeOperation.VIREMENT || this.operation.numeroCompteDestination)
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.operation.montant = this.montantNumber;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Utiliser le service admin pour exécuter l'opération
    this.adminService.executeOperationForClient(this.operation).subscribe({
      next: () => {
        this.successMessage = 'Opération effectuée avec succès!';
        this.loading = false;
        this.resetForm();
        // Recharger les comptes pour voir les nouveaux soldes
        this.loadComptes(this.clientId);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de l\'opération';
        this.loading = false;
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.montantNumber = 0;
    this.operation = {
      type: TypeOperation.DEPOT,
      montant: 0,
      numeroCompteSource: '',
      numeroCompteDestination: '',
      description: ''
    };
  }

  goBack(): void {
    this.router.navigate(['/admin/clients', this.clientId]);
  }
}