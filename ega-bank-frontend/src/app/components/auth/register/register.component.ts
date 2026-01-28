import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Client, Sexe, Role } from '../../../models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">🏦 EGA Bank</h1>
          <p class="auth-subtitle">Créez votre compte</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input
                type="text"
                [(ngModel)]="client.nom"
                name="nom"
                class="form-control"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input
                type="text"
                [(ngModel)]="client.prenom"
                name="prenom"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Date de naissance</label>
              <input
                type="date"
                [(ngModel)]="client.dateNaissance"
                name="dateNaissance"
                class="form-control"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Sexe</label>
              <select
                [(ngModel)]="client.sexe"
                name="sexe"
                class="form-select"
                required
              >
                <option value="">Sélectionner</option>
                <option [value]="Sexe.MASCULIN">Masculin</option>
                <option [value]="Sexe.FEMININ">Féminin</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              [(ngModel)]="client.courriel"
              name="courriel"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input
              type="password"
              [(ngModel)]="client.password"
              name="password"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Téléphone</label>
            <input
              type="tel"
              [(ngModel)]="client.telephone"
              name="telephone"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              type="text"
              [(ngModel)]="client.adresse"
              name="adresse"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Nationalité</label>
            <input
              type="text"
              [(ngModel)]="client.nationalite"
              name="nationalite"
              class="form-control"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            [disabled]="loading"
          >
            <span *ngIf="!loading">S'inscrire</span>
            <span *ngIf="loading">Inscription...</span>
          </button>

          <div class="auth-footer">
            <p>Déjà un compte ?</p>
            <a routerLink="/login" class="link">Se connecter</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 48px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-height: 90vh;
      overflow-y: auto;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-title {
      font-size: 32px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .auth-subtitle {
      color: #6B7280;
      font-size: 16px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .w-full {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      color: #6B7280;
    }

    .link {
      color: var(--primary-purple);
      text-decoration: none;
      font-weight: 600;
      margin-left: 8px;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .auth-card {
        padding: 32px 24px;
      }

      .grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  Sexe = Sexe;
  
  client: Client = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: Sexe.MASCULIN,
    adresse: '',
    telephone: '',
    courriel: '',
    nationalite: '',
    password: '',
    role: Role.CLIENT
  };

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.authService.register(this.client).subscribe({
      next: (response) => {
        this.successMessage = 'Inscription réussie ! Redirection vers la connexion...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}
