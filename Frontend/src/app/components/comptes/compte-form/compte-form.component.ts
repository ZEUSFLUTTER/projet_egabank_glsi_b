import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompteService, CompteCourantCreationDTO, CompteEpargneCreationDTO } from '../../../services/compte.service';
import { ClientService, Client } from '../../../services/client.service';

interface FieldError {
  [key: string]: string;
}

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>Nouveau Compte Bancaire</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Type de compte *</label>
          <select
            [(ngModel)]="typeCompte"
            name="typeCompte"
            (change)="onTypeChange()"
            required>
            <option value="">Sélectionner un type...</option>
            <option value="COURANT">💼 Compte Courant</option>
            <option value="EPARGNE">🏦 Compte Épargne</option>
          </select>
          <span class="error-message" *ngIf="fieldErrors['typeCompte']">
            {{ fieldErrors['typeCompte'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Client *</label>
          <select
            [(ngModel)]="idClient"
            name="idClient"
            (change)="validateClient()"
            required>
            <option value="">Sélectionner un client...</option>
            <option *ngFor="let client of clients" [value]="client.id">
              {{ client.nom }} {{ client.prenom }} (ID: {{ client.id }})
            </option>
          </select>
          <span class="error-message" *ngIf="fieldErrors['idClient']">
            {{ fieldErrors['idClient'] }}
          </span>
        </div>

        <div class="form-group" *ngIf="typeCompte === 'COURANT'">
          <label>Découvert autorisé (€) *</label>
          <input
            type="number"
            [(ngModel)]="decouvertAutorise"
            name="decouvertAutorise"
            min="0"
            step="0.01"
            (blur)="validateDecouvert()"
            placeholder="0.00"
            required>
          <small class="help-text">Montant maximum autorisé en négatif</small>
          <span class="error-message" *ngIf="fieldErrors['decouvertAutorise']">
            {{ fieldErrors['decouvertAutorise'] }}
          </span>
        </div>

        <div class="form-group" *ngIf="typeCompte === 'EPARGNE'">
          <label>Taux d'intérêt (%) *</label>
          <input
            type="number"
            [(ngModel)]="tauxInteret"
            name="tauxInteret"
            min="0"
            max="100"
            step="0.01"
            (blur)="validateTaux()"
            placeholder="0.00"
            required>
          <small class="help-text">Taux annuel en pourcentage</small>
          <span class="error-message" *ngIf="fieldErrors['tauxInteret']">
            {{ fieldErrors['tauxInteret'] }}
          </span>
        </div>

        <div *ngIf="error" class="alert alert-error">
          <strong>❌ Erreur:</strong> {{ error }}
        </div>
        <div *ngIf="success" class="alert alert-success">
          <strong>✅ Succès:</strong> {{ success }}
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="!isFormValid() || isSubmitting">
            {{ isSubmitting ? 'Traitement...' : 'Créer le Compte' }}
          </button>
          <a routerLink="/comptes" class="btn btn-cancel">Annuler</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
      font-size: 1.8em;
    }

    .form-group {
      margin-bottom: 25px;
      display: flex;
      flex-direction: column;
    }

    label {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 0.95em;
    }

    input[type="number"],
    select {
      padding: 12px;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1em;
      font-family: inherit;
      transition: all 0.3s;
    }

    input[type="number"]:focus,
    select:focus {
      outline: none;
      border-color: #34495e;
      box-shadow: 0 0 0 3px rgba(52, 73, 94, 0.1);
    }

    input[type="number"].error,
    select.error {
      border-color: #e74c3c;
      background-color: #fadbd8;
    }

    .help-text {
      color: #7f8c8d;
      font-size: 0.85em;
      margin-top: 5px;
      display: block;
    }

    .error-message {
      color: #c0392b;
      font-size: 0.85em;
      margin-top: 5px;
      font-weight: 500;
    }

    .alert {
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.5;
    }

    .alert-error {
      background: #fadbd8;
      border: 1px solid #f5b7b1;
      color: #c0392b;
    }

    .alert-success {
      background: #d5f4e6;
      border: 1px solid #a9dfbf;
      color: #27ae60;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    button,
    .btn {
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      font-size: 1em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #34495e, #2c3e50);
      color: white;
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #2c3e50, #1a252f);
      box-shadow: 0 4px 12px rgba(52, 73, 94, 0.3);
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #ecf0f1;
      color: #2c3e50;
      flex: 0.5;
    }

    .btn-cancel:hover {
      background: #bdc3c7;
    }
  `]
})
export class CompteFormComponent implements OnInit {
  typeCompte = '';
  idClient: string = '';
  decouvertAutorise = 0;
  tauxInteret = 0;
  clients: Client[] = [];
  fieldErrors: FieldError = {};
  error = '';
  success = '';
  isSubmitting = false;

  constructor(
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
        this.error = 'Erreur lors du chargement des clients';
      }
    });
  }

  onTypeChange(): void {
    this.decouvertAutorise = 0;
    this.tauxInteret = 0;
    this.fieldErrors['decouvertAutorise'] = '';
    this.fieldErrors['tauxInteret'] = '';
  }

  validateClient(): void {
    this.fieldErrors['idClient'] = '';
    if (!this.idClient) {
      this.fieldErrors['idClient'] = 'Veuillez sélectionner un client';
    }
  }

  validateDecouvert(): void {
    this.fieldErrors['decouvertAutorise'] = '';

    if (this.decouvertAutorise === undefined || this.decouvertAutorise === null) {
      this.fieldErrors['decouvertAutorise'] = 'Le découvert autorisé est requis';
    } else if (this.decouvertAutorise < 0) {
      this.fieldErrors['decouvertAutorise'] = '❌ Le découvert ne peut pas être négatif';
    } else if (this.decouvertAutorise > 1000000) {
      this.fieldErrors['decouvertAutorise'] = '❌ Le montant dépasse la limite maximale';
    }
  }

  validateTaux(): void {
    this.fieldErrors['tauxInteret'] = '';

    if (this.tauxInteret === undefined || this.tauxInteret === null) {
      this.fieldErrors['tauxInteret'] = 'Le taux d\'intérêt est requis';
    } else if (this.tauxInteret < 0) {
      this.fieldErrors['tauxInteret'] = '❌ Le taux ne peut pas être négatif';
    } else if (this.tauxInteret > 100) {
      this.fieldErrors['tauxInteret'] = '❌ Le taux ne peut pas dépasser 100%';
    }
  }

  isFormValid(): boolean {
    this.fieldErrors = {};

    if (!this.typeCompte) {
      this.fieldErrors['typeCompte'] = 'Veuillez sélectionner un type de compte';
    }

    if (!this.idClient) {
      this.fieldErrors['idClient'] = 'Veuillez sélectionner un client';
    }

    if (this.typeCompte === 'COURANT') {
      this.validateDecouvert();
    } else if (this.typeCompte === 'EPARGNE') {
      this.validateTaux();
    }

    return Object.keys(this.fieldErrors).length === 0;
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.isFormValid()) {
      this.error = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    this.isSubmitting = true;

    const clientId = Number(this.idClient);
    if (isNaN(clientId)) {
      this.error = '❌ ID client invalide';
      this.isSubmitting = false;
      return;
    }

    if (this.typeCompte === 'COURANT') {
      const dto: CompteCourantCreationDTO = {
        idClient: clientId,
        decouvertAutorise: this.decouvertAutorise
      };
      this.compteService.createCourant(dto).subscribe({
        next: () => {
          this.success = '✅ Compte courant créé avec succès';
          setTimeout(() => this.router.navigate(['/comptes']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.handleBackendError(err);
        }
      });
    } else if (this.typeCompte === 'EPARGNE') {
      const dto: CompteEpargneCreationDTO = {
        idClient: clientId,
        tauxInteret: this.tauxInteret
      };
      this.compteService.createEpargne(dto).subscribe({
        next: () => {
          this.success = '✅ Compte épargne créé avec succès';
          setTimeout(() => this.router.navigate(['/comptes']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.handleBackendError(err);
        }
      });
    }
  }

  handleBackendError(err: any): void {
    console.error('Erreur Backend:', err);

    if (err.status === 400 && err.error?.messages) {
      const messages = err.error.messages;
      const errorList = Object.values(messages).join(', ');
      this.error = `❌ Validation échouée: ${errorList}`;
    } else if (err.status === 401) {
      this.error = '❌ Session expirée. Veuillez vous reconnecter.';
    } else if (err.status === 403) {
      this.error = '❌ Vous n\'avez pas les permissions pour cette action.';
    } else if (err.status === 404) {
      this.error = '❌ Client non trouvé.';
    } else if (err.status >= 500) {
      this.error = '❌ Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      this.error = `❌ ${err.error?.erreur || 'Erreur lors de la création du compte'}`;
    }
  }
}
