import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService, ClientCreationDTO } from '../../../services/client.service';

interface FieldError {
  [key: string]: string;
}

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>{{ isEdit ? 'Modifier' : 'Nouveau' }} Client</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Nom *</label>
          <input
            type="text"
            [(ngModel)]="client.nom"
            name="nom"
            (blur)="validateNom()"
            placeholder="Exemple: Dupont"
            required>
          <span class="error-message" *ngIf="fieldErrors['nom']">
            {{ fieldErrors['nom'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Prénom *</label>
          <input
            type="text"
            [(ngModel)]="client.prenom"
            name="prenom"
            (blur)="validatePrenom()"
            placeholder="Exemple: Jean"
            required>
          <span class="error-message" *ngIf="fieldErrors['prenom']">
            {{ fieldErrors['prenom'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Date de naissance *</label>
          <input
            type="date"
            [(ngModel)]="client.dateNaissance"
            name="dateNaissance"
            (blur)="validateDateNaissance()"
            required>
          <span class="error-message" *ngIf="fieldErrors['dateNaissance']">
            {{ fieldErrors['dateNaissance'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Sexe *</label>
          <select [(ngModel)]="client.sexe" name="sexe" required>
            <option value="">Sélectionner...</option>
            <option value="MASCULIN">Masculin</option>
            <option value="FEMININ">Féminin</option>
          </select>
          <span class="error-message" *ngIf="fieldErrors['sexe']">
            {{ fieldErrors['sexe'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Adresse *</label>
          <input
            type="text"
            [(ngModel)]="client.adresse"
            name="adresse"
            (blur)="validateAdresse()"
            placeholder="Exemple: 123 Rue de la Paix"
            required>
          <span class="error-message" *ngIf="fieldErrors['adresse']">
            {{ fieldErrors['adresse'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Numéro de téléphone *</label>
          <input
            type="text"
            [(ngModel)]="client.numeroTelephone"
            name="numeroTelephone"
            (blur)="validateTelephone()"
            placeholder="Exemple: +212612345678"
            required>
          <span class="error-message" *ngIf="fieldErrors['numeroTelephone']">
            {{ fieldErrors['numeroTelephone'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Courriel *</label>
          <input
            type="email"
            [(ngModel)]="client.courriel"
            name="courriel"
            (blur)="validateCourriel()"
            placeholder="Exemple: email@example.com"
            required>
          <span class="error-message" *ngIf="fieldErrors['courriel']">
            {{ fieldErrors['courriel'] }}
          </span>
        </div>

        <div class="form-group">
          <label>Nationalité *</label>
          <input
            type="text"
            [(ngModel)]="client.nationalite"
            name="nationalite"
            (blur)="validateNationalite()"
            placeholder="Exemple: Marocaine"
            required>
          <span class="error-message" *ngIf="fieldErrors['nationalite']">
            {{ fieldErrors['nationalite'] }}
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
            {{ isSubmitting ? 'Traitement...' : (isEdit ? 'Modifier' : 'Créer') }}
          </button>
          <a routerLink="/clients" class="btn btn-cancel">Annuler</a>
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
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    label {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 0.95em;
    }

    input[type="text"],
    input[type="email"],
    input[type="date"],
    select {
      padding: 12px;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1em;
      font-family: inherit;
      transition: all 0.3s;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="date"]:focus,
    select:focus {
      outline: none;
      border-color: #34495e;
      box-shadow: 0 0 0 3px rgba(52, 73, 94, 0.1);
    }

    input[type="text"].error,
    input[type="email"].error,
    input[type="date"].error,
    select.error {
      border-color: #e74c3c;
      background-color: #fadbd8;
    }

    .error-message {
      color: #c0392b;
      font-size: 0.85em;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
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
export class ClientFormComponent implements OnInit {
  client: ClientCreationDTO = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'MASCULIN',
    adresse: '',
    numeroTelephone: '',
    courriel: '',
    nationalite: ''
  };

  fieldErrors: FieldError = {};
  isEdit = false;
  clientId?: number;
  error = '';
  success = '';
  isSubmitting = false;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clientId = +id;
      this.loadClient();
    }
  }

  loadClient(): void {
    if (this.clientId) {
      this.clientService.getById(this.clientId).subscribe({
        next: (data) => {
          const dateString = typeof data.dateNaissance === 'string'
            ? data.dateNaissance.split('T')[0]
            : data.dateNaissance;
          this.client = {
            nom: data.nom,
            prenom: data.prenom,
            dateNaissance: dateString,
            sexe: data.sexe,
            adresse: data.adresse,
            numeroTelephone: data.numeroTelephone,
            courriel: data.courriel,
            nationalite: data.nationalite
          };
        },
        error: (err) => {
          console.error('Erreur lors du chargement', err);
          this.error = 'Erreur lors du chargement du client';
        }
      });
    }
  }

  // Validations
  validateNom(): void {
    this.fieldErrors['nom'] = '';
    const nom = this.client.nom?.trim() || '';

    if (!nom) {
      this.fieldErrors['nom'] = 'Le nom est requis';
    } else if (nom.length < 2) {
      this.fieldErrors['nom'] = 'Le nom doit contenir au moins 2 caractères';
    } else if (/\d/.test(nom)) {
      this.fieldErrors['nom'] = '❌ Le nom ne doit pas contenir de chiffres';
    } else if (!/^[a-zA-Zàâäæçéèêëïîôùûüœ\s\-']+$/.test(nom)) {
      this.fieldErrors['nom'] = '❌ Le nom contient des caractères non autorisés';
    }
  }

  validatePrenom(): void {
    this.fieldErrors['prenom'] = '';
    const prenom = this.client.prenom?.trim() || '';

    if (!prenom) {
      this.fieldErrors['prenom'] = 'Le prénom est requis';
    } else if (prenom.length < 2) {
      this.fieldErrors['prenom'] = 'Le prénom doit contenir au moins 2 caractères';
    } else if (/\d/.test(prenom)) {
      this.fieldErrors['prenom'] = '❌ Le prénom ne doit pas contenir de chiffres';
    } else if (!/^[a-zA-Zàâäæçéèêëïîôùûüœ\s\-']+$/.test(prenom)) {
      this.fieldErrors['prenom'] = '❌ Le prénom contient des caractères non autorisés';
    }
  }

  validateDateNaissance(): void {
    this.fieldErrors['dateNaissance'] = '';
    const date = this.client.dateNaissance;

    if (!date) {
      this.fieldErrors['dateNaissance'] = 'La date de naissance est requise';
    } else {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 18) {
        this.fieldErrors['dateNaissance'] = '❌ Le client doit être majeur (minimum 18 ans)';
      } else if (age > 120) {
        this.fieldErrors['dateNaissance'] = '❌ La date de naissance semble invalide';
      }
    }
  }

  validateAdresse(): void {
    this.fieldErrors['adresse'] = '';
    const adresse = this.client.adresse?.trim() || '';

    if (!adresse) {
      this.fieldErrors['adresse'] = 'L\'adresse est requise';
    } else if (adresse.length < 5) {
      this.fieldErrors['adresse'] = 'L\'adresse doit contenir au moins 5 caractères';
    }
  }

  validateTelephone(): void {
    this.fieldErrors['numeroTelephone'] = '';
    const phone = this.client.numeroTelephone?.trim() || '';

    if (!phone) {
      this.fieldErrors['numeroTelephone'] = 'Le numéro de téléphone est requis';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(phone)) {
      this.fieldErrors['numeroTelephone'] = '❌ Le numéro de téléphone contient des caractères non valides';
    } else if (phone.replace(/\D/g, '').length < 10) {
      this.fieldErrors['numeroTelephone'] = '❌ Le numéro de téléphone doit contenir au moins 10 chiffres';
    }
  }

  validateCourriel(): void {
    this.fieldErrors['courriel'] = '';
    const email = this.client.courriel?.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.fieldErrors['courriel'] = 'Le courriel est requis';
    } else if (!emailRegex.test(email)) {
      this.fieldErrors['courriel'] = '❌ Le format du courriel est invalide';
    }
  }

  validateNationalite(): void {
    this.fieldErrors['nationalite'] = '';
    const nationalite = this.client.nationalite?.trim() || '';

    if (!nationalite) {
      this.fieldErrors['nationalite'] = 'La nationalité est requise';
    } else if (nationalite.length < 2) {
      this.fieldErrors['nationalite'] = 'La nationalité doit contenir au moins 2 caractères';
    } else if (/\d/.test(nationalite)) {
      this.fieldErrors['nationalite'] = '❌ La nationalité ne doit pas contenir de chiffres';
    } else if (!/^[a-zA-Zàâäæçéèêëïîôùûüœ\s\-]+$/.test(nationalite)) {
      this.fieldErrors['nationalite'] = '❌ La nationalité contient des caractères non autorisés';
    }
  }

  isFormValid(): boolean {
    this.validateNom();
    this.validatePrenom();
    this.validateDateNaissance();
    this.validateAdresse();
    this.validateTelephone();
    this.validateCourriel();
    this.validateNationalite();

    return (
      !this.fieldErrors['nom'] &&
      !this.fieldErrors['prenom'] &&
      !this.fieldErrors['dateNaissance'] &&
      !this.fieldErrors['adresse'] &&
      !this.fieldErrors['numeroTelephone'] &&
      !this.fieldErrors['courriel'] &&
      !this.fieldErrors['nationalite'] &&
      !!this.client.sexe
    );
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.isFormValid()) {
      this.error = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    this.isSubmitting = true;

    if (this.isEdit && this.clientId) {
      this.clientService.update(this.clientId, this.client).subscribe({
        next: () => {
          this.success = 'Client modifié avec succès';
          setTimeout(() => this.router.navigate(['/clients']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.handleBackendError(err);
        }
      });
    } else {
      this.clientService.create(this.client).subscribe({
        next: () => {
          this.success = 'Client créé avec succès';
          setTimeout(() => this.router.navigate(['/clients']), 1500);
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
      // Erreurs de validation du Backend
      const messages = err.error.messages;
      this.error = `Validation échouée: ${Object.values(messages).join(', ')}`;
    } else if (err.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (err.status === 403) {
      this.error = 'Vous n\'avez pas les permissions pour cette action.';
    } else if (err.status >= 500) {
      this.error = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      this.error = err.error?.erreur || 'Erreur lors de l\'opération';
    }
  }
}
