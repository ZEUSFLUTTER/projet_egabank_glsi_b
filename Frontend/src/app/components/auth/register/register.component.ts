import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface FieldError {
  [key: string]: string;
}

interface PasswordStrength {
  score: number;
  level: string;
  color: string;
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>📝 Inscription</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              [(ngModel)]="user.nomUtilisateur"
              name="nomUtilisateur"
              (blur)="validateUsername()"
              placeholder="Exemple: john_doe"
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
                [(ngModel)]="user.motDePasse"
                name="motDePasse"
                (blur)="validatePassword()"
                (input)="calculatePasswordStrength()"
                placeholder="Minimum 8 caractères requis"
                required>
              <button
                type="button"
                class="toggle-password"
                (click)="togglePasswordVisibility()"
                title="Afficher/Masquer le mot de passe">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <div class="password-strength" *ngIf="user.motDePasse">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  [ngClass]="'strength-' + passwordStrength.level"
                  [style.width.%]="passwordStrength.score * 25">
                </div>
              </div>
              <span class="strength-text" [ngClass]="'text-' + passwordStrength.level">
                Force: {{ passwordStrength.message }}
              </span>
            </div>

            <div class="password-requirements" [class.active]="user.motDePasse">
              <h4>Exigences du mot de passe:</h4>
              <ul>
                <li [class.met]="hasMinLength">
                  ✓ Au moins 8 caractères
                </li>
                <li [class.met]="hasUppercase">
                  ✓ Au moins une majuscule (A-Z)
                </li>
                <li [class.met]="hasLowercase">
                  ✓ Au moins une minuscule (a-z)
                </li>
                <li [class.met]="hasNumber">
                  ✓ Au moins un chiffre (0-9)
                </li>
                <li [class.met]="hasSpecialChar">
                  ✓ Au moins un caractère spécial (!&#64;#$%^&*)
                </li>
              </ul>
            </div>

            <span class="error-message" *ngIf="fieldErrors['motDePasse']">
              {{ fieldErrors['motDePasse'] }}
            </span>
          </div>

          <div class="form-group">
            <label>Confirmer le mot de passe *</label>
            <input
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              (blur)="validateConfirmPassword()"
              placeholder="Répétez le mot de passe"
              required>
            <span class="error-message" *ngIf="fieldErrors['confirmPassword']">
              {{ fieldErrors['confirmPassword'] }}
            </span>
          </div>

          <div class="form-group">
            <label>Rôle *</label>
            <select [(ngModel)]="user.role" name="role" required>
              <option value="">Sélectionner un rôle...</option>
              <option value="USER">👤 Utilisateur</option>
              <option value="ADMIN">🔐 Administrateur</option>
            </select>
            <span class="error-message" *ngIf="fieldErrors['role']">
              {{ fieldErrors['role'] }}
            </span>
          </div>

          <div *ngIf="error" class="alert alert-error">
            <strong>❌ Erreur:</strong> {{ error }}
          </div>
          <div *ngIf="success" class="alert alert-success">
            <strong>✅ Succès:</strong> {{ success }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="isSubmitting">
            {{ isSubmitting ? "Inscription en cours..." : "S'inscrire" }}
          </button>

          <p class="login-link">
            Déjà un compte ?
            <a routerLink="/login" class="link">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 450px;
    }

    .register-card h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
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

    input[type="text"],
    input[type="password"],
    select {
      padding: 12px;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1em;
      font-family: inherit;
      transition: all 0.3s;
    }

    input[type="text"]:focus,
    input[type="password"]:focus,
    select:focus {
      outline: none;
      border-color: #34495e;
      box-shadow: 0 0 0 3px rgba(52, 73, 94, 0.1);
    }

    input[type="text"].error,
    input[type="password"].error,
    select.error {
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

    .password-strength {
      margin-top: 10px;
    }

    .strength-bar {
      height: 6px;
      background: #ecf0f1;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 3px;
    }

    .strength-weak { background: #e74c3c; }
    .strength-fair { background: #f39c12; }
    .strength-good { background: #3498db; }
    .strength-strong { background: #27ae60; }

    .strength-text {
      font-size: 0.85em;
      font-weight: 600;
      display: inline-block;
    }

    .text-weak { color: #e74c3c; }
    .text-fair { color: #f39c12; }
    .text-good { color: #3498db; }
    .text-strong { color: #27ae60; }

    .password-requirements {
      background: #f8f9fa;
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      padding: 15px;
      margin-top: 10px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .password-requirements.active {
      max-height: 300px;
    }

    .password-requirements h4 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 0.9em;
    }

    .password-requirements ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .password-requirements li {
      font-size: 0.85em;
      color: #e74c3c;
      padding: 4px 0;
      transition: color 0.3s;
    }

    .password-requirements li.met {
      color: #27ae60;
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

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #7f8c8d;
    }

    .login-link .link {
      color: #34495e;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .login-link .link:hover {
      color: #2c3e50;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .register-card {
        padding: 25px;
      }

      .register-card h2 {
        font-size: 1.5em;
      }
    }
  `]
})
export class RegisterComponent {
  user = {
    nomUtilisateur: '',
    motDePasse: '',
    role: 'USER'
  };
  confirmPassword = '';
  fieldErrors: FieldError = {};
  passwordStrength: PasswordStrength = {
    score: 0,
    level: 'weak',
    color: '#e74c3c',
    message: 'Faible'
  };
  error = '';
  success = '';
  isSubmitting = false;
  showPassword = false;

  // Propriétés pour les exigences du mot de passe
  hasMinLength = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  hasSpecialChar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  calculatePasswordStrength(): void {
    const password = this.user.motDePasse;
    let score = 0;

    // Vérifier les exigences - simplifié pour être compatible avec login
    this.hasMinLength = password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasLowercase = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Calculer le score - seulement basé sur la longueur minimale
    if (this.hasMinLength) {
      score = 4; // Au moins 8 caractères = suffisant
      if (this.hasUppercase || this.hasNumber || this.hasSpecialChar) {
        score = 5; // Augmenter si caractères supplémentaires
      }
    } else {
      score = 0;
    }

    // Déterminer le niveau - simplifié
    if (score === 0) {
      this.passwordStrength = {
        score: 0,
        level: 'weak',
        color: '#e74c3c',
        message: 'Trop court'
      };
    } else if (score <= 2) {
      this.passwordStrength = {
        score: 2,
        level: 'fair',
        color: '#f39c12',
        message: 'Acceptable'
      };
    } else if (score <= 3) {
      this.passwordStrength = {
        score: 3,
        level: 'good',
        color: '#3498db',
        message: 'Bon'
      };
    } else {
      this.passwordStrength = {
        score: 4,
        level: 'strong',
        color: '#27ae60',
        message: 'Très bon'
      };
    }
  }

  validateUsername(): void {
    this.fieldErrors['nomUtilisateur'] = '';
    const username = this.user.nomUtilisateur?.trim() || '';

    if (!username) {
      this.fieldErrors['nomUtilisateur'] = 'Le nom d\'utilisateur est requis';
    } else if (username.length < 3) {
      this.fieldErrors['nomUtilisateur'] = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (username.length > 20) {
      this.fieldErrors['nomUtilisateur'] = 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      this.fieldErrors['nomUtilisateur'] = '❌ Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores';
    }
  }

  validatePassword(): void {
    this.fieldErrors['motDePasse'] = '';
    const password = this.user.motDePasse || '';

    if (!password) {
      this.fieldErrors['motDePasse'] = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      this.fieldErrors['motDePasse'] = '❌ Le mot de passe doit contenir au moins 8 caractères';
    }
  }

  validateConfirmPassword(): void {
    this.fieldErrors['confirmPassword'] = '';

    if (!this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Confirmez le mot de passe';
    } else if (this.confirmPassword !== this.user.motDePasse) {
      this.fieldErrors['confirmPassword'] = '❌ Les mots de passe ne correspondent pas';
    }
  }

  isFormValid(): boolean {
    // Au chargement initial, permettre le formulaire vide
    const isEmpty = !this.user.nomUtilisateur && !this.user.motDePasse && !this.user.role;
    if (isEmpty) {
      return true; // Permettre l'interaction initiale
    }

    // Une fois qu'il y a du contenu, valider strictement
    this.fieldErrors = {};

    this.validateUsername();
    this.validatePassword();

    if (this.user.motDePasse) {
      this.validateConfirmPassword();
    } else {
      this.fieldErrors['confirmPassword'] = '';
    }

    if (!this.user.role) {
      this.fieldErrors['role'] = 'Veuillez sélectionner un rôle';
    }

    // Vérifier qu'il n'y a pas d'erreurs de validation
    return Object.keys(this.fieldErrors).length === 0;
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    // Validation basique
    if (!this.user.nomUtilisateur?.trim()) {
      this.error = 'Veuillez entrer un nom d\'utilisateur';
      return;
    }

    if (!this.user.motDePasse) {
      this.error = 'Veuillez entrer un mot de passe';
      return;
    }

    if (this.user.motDePasse !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.user.role) {
      this.error = 'Veuillez sélectionner un rôle';
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.user).subscribe({
      next: () => {
        this.success = 'Inscription réussie ! Redirection vers la connexion...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur inscription:', err);

        if (err.status === 400) {
          // Vérifier s'il y a des messages de validation du serveur
          if (err.error?.messages && typeof err.error.messages === 'object') {
            const messages = Object.entries(err.error.messages as Record<string, string>)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
            this.error = '❌ ' + messages;
          } else {
            this.error = err.error?.message || 'Le nom d\'utilisateur existe déjà';
          }
        } else if (err.status === 409) {
          this.error = '❌ Ce nom d\'utilisateur est déjà pris';
        } else if (err.status >= 500) {
          this.error = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          this.error = err.error?.message || err.error?.erreur || 'Erreur lors de l\'inscription';
        }
      }
    });
  }
}
