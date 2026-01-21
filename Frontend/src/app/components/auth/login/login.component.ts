import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface FieldError {
  [key: string]: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>🔐 Connexion</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              [(ngModel)]="credentials.nomUtilisateur"
              name="nomUtilisateur"
              (blur)="validateUsername()"
              placeholder="Entrez votre nom d'utilisateur"
              required>
            <span class="error-message" *ngIf="fieldErrors['nomUtilisateur']">
              {{ fieldErrors['nomUtilisateur'] }}
            </span>
          </div>

          <div class="form-group">
            <label>Mot de passe *</label>
            <div class="password-input-wrapper">
              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="credentials.motDePasse"
                name="motDePasse"
                (blur)="validatePassword()"
                placeholder="Entrez votre mot de passe"
                required>
              <button
                type="button"
                class="toggle-password"
                (click)="togglePasswordVisibility()"
                title="Afficher/Masquer le mot de passe">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span class="error-message" *ngIf="fieldErrors['motDePasse']">
              {{ fieldErrors['motDePasse'] }}
            </span>
          </div>

          <div *ngIf="error" class="alert alert-error">
            <strong>❌ Erreur:</strong> {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="isSubmitting">
            {{ isSubmitting ? 'Connexion en cours...' : 'Se connecter' }}
          </button>

          <p class="register-link">
            Pas encore de compte ?
            <a routerLink="/register" class="link">S'inscrire</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
    }

    .login-card h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
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
    input[type="password"] {
      padding: 12px;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1em;
      font-family: inherit;
      transition: all 0.3s;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-color: #34495e;
      box-shadow: 0 0 0 3px rgba(52, 73, 94, 0.1);
    }

    input[type="text"].error,
    input[type="password"].error {
      border-color: #e74c3c;
      background-color: #fadbd8;
    }

    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input-wrapper input {
      flex: 1;
      padding-right: 45px;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .toggle-password:hover {
      background: #ecf0f1;
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
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #34495e, #2c3e50);
      color: white;
      margin-top: 10px;
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

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: #7f8c8d;
    }

    .register-link .link {
      color: #34495e;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .register-link .link:hover {
      color: #2c3e50;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 25px;
      }

      .login-card h2 {
        font-size: 1.5em;
      }
    }
  `]
})
export class LoginComponent {
  credentials = {
    nomUtilisateur: '',
    motDePasse: ''
  };
  fieldErrors: FieldError = {};
  error = '';
  isSubmitting = false;
  showPassword = false;
  attemptCount = 0;
  lastAttemptTime = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  validateUsername(): void {
    this.fieldErrors['nomUtilisateur'] = '';
    const username = this.credentials.nomUtilisateur?.trim() || '';

    if (!username) {
      this.fieldErrors['nomUtilisateur'] = 'Le nom d\'utilisateur est requis';
    }
  }

  validatePassword(): void {
    this.fieldErrors['motDePasse'] = '';
    const password = this.credentials.motDePasse || '';

    if (!password) {
      this.fieldErrors['motDePasse'] = 'Le mot de passe est requis';
    }
  }

  isFormValid(): boolean {
    this.fieldErrors = {};
    
    // Validation du nom d'utilisateur
    const username = this.credentials.nomUtilisateur?.trim() || '';
    if (!username) {
      this.fieldErrors['nomUtilisateur'] = 'Le nom d\'utilisateur est requis';
    }
    
    // Validation du mot de passe
    const password = this.credentials.motDePasse || '';
    if (!password) {
      this.fieldErrors['motDePasse'] = 'Le mot de passe est requis';
    }
    
    return Object.keys(this.fieldErrors).length === 0;
  }

  onSubmit(): void {
    this.error = '';

    // Validation simple
    if (!this.credentials.nomUtilisateur?.trim()) {
      this.error = 'Veuillez entrer un nom d\'utilisateur';
      return;
    }

    if (!this.credentials.motDePasse) {
      this.error = 'Veuillez entrer un mot de passe';
      return;
    }

    // Protection contre les attaques par brute force
    const now = Date.now();
    if (this.attemptCount >= 3 && now - this.lastAttemptTime < 60000) {
      this.error = '❌ Trop de tentatives. Veuillez attendre 1 minute avant de réessayer.';
      return;
    }

    this.isSubmitting = true;
    this.lastAttemptTime = now;
    this.attemptCount++;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.attemptCount = 0;
        // Petit délai pour s'assurer que le token est sauvegardé
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 100);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur connexion:', err);

        if (err.status === 401) {
          this.error = '❌ Identifiants incorrects. Vérifiez votre nom d\'utilisateur et votre mot de passe.';
        } else if (err.status === 400) {
          // Vérifier s'il y a des messages de validation
          if (err.error?.messages && typeof err.error.messages === 'object') {
            const messages = Object.values(err.error.messages).join(', ');
            this.error = '❌ ' + messages;
          } else {
            this.error = err.error?.message || '❌ Requête invalide. Veuillez vérifier vos données.';
          }
        } else if (err.status === 403) {
          this.error = '❌ Accès refusé. Votre compte n\'est peut-être pas actif.';
        } else if (err.status >= 500) {
          this.error = '❌ Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          this.error = err.error?.message || err.error?.erreur || '❌ Erreur de connexion';
        }
      }
    });
  }
}
