import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientAuthService } from '../../../services/client-auth.service';

@Component({
  selector: 'app-login-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="media-section">
        <div class="media-content">
          <div class="media-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon"> <i class="fa-solid fa-user"></i> </div>
              <h2> EGA BANK </h2>
              <p>Espace Client</p>
              <p class="subtitle">Accédez à vos comptes en toute sécurité</p>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="auth-card">
          <div class="auth-header">
            <h1>CONNEXION CLIENT</h1>
            <p>Accédez à votre espace client</p>
          </div>
          
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="courriel">Courriel</label>
              <div class="input-wrapper">
                <input
                  type="email"
                  id="courriel"
                  name="courriel"
                  [(ngModel)]="credentials.courriel"
                  required
                  [class.error]="error"
                  placeholder="Entrez votre courriel"
                />
                <div class="input-line"></div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="credentials.password"
                  required
                  [class.error]="error"
                  placeholder="Entrez votre mot de passe"
                />
                <div class="input-line"></div>
              </div>
            </div>
            
            <div *ngIf="error" class="error-message">{{ error }}</div>
            
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Connexion...' : 'SE CONNECTER' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Vous êtes un employé ? <a routerLink="/login" class="register-link">Se connecter en tant qu'employé</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --color-black: #000000;
      --color-white: #ffffff;
      --color-gray: #808080;
      --color-light-gray: #f5f5f5;
      --color-medium-gray: #e0e0e0;
      --color-dark-gray: #333333;
    }

    .login-container {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    .media-section {
      flex: 1;
      background-color: var(--color-black);
      position: relative;
      overflow: hidden;
    }

    .media-content {
      height: 100%;
      width: 100%;
      position: relative;
    }

    .media-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-black) 0%, var(--color-dark-gray) 100%);
      color: var(--color-white);
    }

    .placeholder-content {
      text-align: center;
      padding: 2rem;
      max-width: 500px;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .placeholder-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--color-white);
      font-weight: 700;
    }

    .placeholder-content p {
      font-size: 1.1rem;
      color: var(--color-medium-gray);
      margin-bottom: 0.5rem;
    }

    .placeholder-content .subtitle {
      font-size: 0.9rem;
      color: var(--color-gray);
      font-style: italic;
    }

    .form-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-white);
      padding: 2rem;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 0 1rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .auth-header h1 {
      color: var(--color-black);
      font-size: 2rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .auth-header p {
      color: var(--color-gray);
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--color-black);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-wrapper {
      position: relative;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 0;
      background-color: transparent;
      border: none;
      color: var(--color-black);
      font-size: 1rem;
      outline: none;
    }

    .form-group input::placeholder {
      color: var(--color-gray);
      opacity: 0.7;
    }

    .input-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-medium-gray);
      transition: all 0.3s ease;
    }

    .form-group input:focus + .input-line {
      height: 2px;
      background-color: var(--color-black);
    }

    .form-group input.error + .input-line {
      background-color: #ff0000;
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      background-color: var(--color-black);
      color: var(--color-white);
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-dark-gray);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-message {
      color: #ff0000;
      font-size: 0.85rem;
      margin-top: 1rem;
      text-align: center;
    }

    .auth-footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-medium-gray);
    }

    .auth-footer p {
      color: var(--color-gray);
      font-size: 0.9rem;
    }

    .register-link {
      color: var(--color-black);
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .register-link:hover {
      text-decoration: underline;
      color: var(--color-dark-gray);
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      
      .media-section {
        height: 40vh;
        min-height: 300px;
      }
      
      .form-section {
        padding: 2rem 1rem;
      }
      
      .auth-card {
        padding: 0;
      }
    }
  `]
})
export class LoginClientComponent {
  credentials = {
    courriel: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private clientAuthService: ClientAuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';

    this.clientAuthService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/client/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}
