import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Client, CompteRequestAdmin, TypeCompte } from '../../../models/models';

@Component({
  selector: 'app-create-compte',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div class="header-section">
        <h1>Créer un compte bancaire</h1>
        <div *ngIf="client" class="client-info">
          <h3>Pour le client : {{ client.prenom }} {{ client.nom }}</h3>
          <p>{{ client.courriel }} | {{ client.telephone }}</p>
        </div>
      </div>

      <div class="card" style="max-width: 600px; margin: 0 auto;">
        <form (ngSubmit)="onSubmit()" #compteForm="ngForm">
          <div class="form-group">
            <label for="type">Type de compte *</label>
            <select 
              id="type" 
              name="type" 
              [(ngModel)]="compteRequest.type" 
              class="form-control" 
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="COURANT">Compte Courant</option>
              <option value="EPARGNE">Compte Épargne</option>
            </select>
          </div>

          <div class="form-group">
            <label for="soldeInitial">Solde initial (FCFA)</label>
            <input 
              type="number" 
              id="soldeInitial" 
              name="soldeInitial" 
              [(ngModel)]="compteRequest.soldeInitial" 
              class="form-control"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <small class="form-text">Laissez vide pour un solde initial de 0 FCFA</small>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              (click)="goBack()" 
              class="btn btn-outline"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!compteForm.valid || loading"
            >
              {{ loading ? 'Création...' : 'Créer le compte' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Messages -->
      <div *ngIf="successMessage" class="alert alert-success" style="margin-top: 20px;">
        {{ successMessage }}
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-danger" style="margin-top: 20px;">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .header-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--primary-purple);
      margin-bottom: 16px;
    }

    .client-info {
      background: var(--gradient-light);
      padding: 20px;
      border-radius: 12px;
      margin: 20px auto;
      max-width: 500px;
    }

    .client-info h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-purple);
      margin-bottom: 8px;
    }

    .client-info p {
      color: #666;
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .alert {
      padding: 16px;
      border-radius: 8px;
      margin: 16px auto;
      max-width: 600px;
    }

    .alert-success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CreateCompteComponent implements OnInit {
  clientId!: number;
  client: Client | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  compteRequest: CompteRequestAdmin = {
    type: TypeCompte.COURANT,
    proprietaireId: 0,
    soldeInitial: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clientId) {
      this.compteRequest.proprietaireId = this.clientId;
      this.loadClient();
    }
  }

  loadClient(): void {
    this.adminService.getClient(this.clientId).subscribe({
      next: (client) => {
        this.client = client;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client:', error);
        this.errorMessage = 'Impossible de charger les informations du client';
      }
    });
  }

  onSubmit(): void {
    if (!this.compteRequest.type) {
      this.errorMessage = 'Veuillez sélectionner un type de compte';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.createCompteForClient(this.clientId, this.compteRequest).subscribe({
      next: (compte) => {
        console.log('Compte créé avec succès:', compte);
        this.successMessage = `Compte ${compte.type} créé avec succès ! Numéro : ${compte.numeroCompte}`;
        this.loading = false;
        
        // Rediriger vers les détails du client après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/admin/clients', this.clientId]);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la création du compte:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/clients', this.clientId]);
  }
}