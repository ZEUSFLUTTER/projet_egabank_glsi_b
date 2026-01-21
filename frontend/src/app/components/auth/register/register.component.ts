import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Inscription</h1>
          <p>Créez votre compte Banque Ega</p>
        </div>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="userData.username"
              required
              [class.error]="error"
            />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              [class.error]="error"
            />
          </div>
          <div *ngIf="error" class="error-message">{{ error }}</div>
          <div *ngIf="success" class="success-message">{{ success }}</div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-gray-light);
    }

    .auth-card {
      background-color: var(--color-white);
      border: 2px solid var(--color-black);
      padding: 40px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h1 {
      color: var(--color-black);
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .auth-header p {
      color: var(--color-gray);
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: var(--color-black);
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 2px solid var(--color-border);
      background-color: var(--color-white);
      color: var(--color-black);
      font-size: 14px;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-black);
    }

    .form-group input.error {
      border-color: var(--color-error);
    }

    .btn {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border);
    }

    .auth-footer p {
      color: var(--color-gray);
      font-size: 14px;
    }

    .auth-footer a {
      color: var(--color-black);
      font-weight: 600;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  userData = {
    username: '',
    password: ''
  };
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.success = 'Inscription réussie ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}

