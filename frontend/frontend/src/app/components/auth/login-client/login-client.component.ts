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
  <div class="form-section">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-container">
          <div class="bank-logo">BC</div>
        </div>
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
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L13.06 12.34C12.41 12.75 11.59 12.75 10.94 12.34L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z" fill="#000080"/>
              </svg>
            </div>
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
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#000080"/>
              </svg>
            </div>
            <div class="input-line"></div>
          </div>
        </div>
        
        <div *ngIf="error" class="error-message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF0000"/>
          </svg>
          {{ error }}
        </div>
        
        <button type="submit" class="btn btn-primary" [disabled]="loading">
          <span *ngIf="!loading">SE CONNECTER</span>
          <span *ngIf="loading" class="loading-spinner"></span>
          <span *ngIf="loading">Connexion...</span>
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Vous êtes un employé ? <a routerLink="/login" class="register-link">Se connecter en tant qu'employé</a></p>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`:host {
  --color-navy: #000080;
  --color-white: #ffffff;
  --color-navy-light: rgba(0, 0, 128, 0.1);
  --color-navy-medium: rgba(0, 0, 128, 0.3);
  --color-error: #FF0000;
}

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, var(--color-navy) 0%, #000066 100%);
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-section {
  width: 100%;
  max-width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  background-color: var(--color-white);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 128, 0.2);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-navy) 0%, #000066 100%);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.bank-logo {
  width: 60px;
  height: 60px;
  background-color: var(--color-navy);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
}

.auth-header h1 {
  color: var(--color-navy);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.auth-header p {
  color: #666;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.form-group {
  margin-bottom: 2rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--color-navy);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 1rem 2.5rem 1rem 0.75rem;
  background-color: var(--color-white);
  border: 2px solid var(--color-navy-medium);
  border-radius: 8px;
  color: var(--color-navy);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #999;
  font-size: 0.9rem;
}

.form-group input:focus {
  border-color: var(--color-navy);
  box-shadow: 0 0 0 3px var(--color-navy-light);
}

.form-group input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-navy);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.form-group input:focus ~ .input-line {
  transform: scaleX(1);
}

.btn-primary {
  width: 100%;
  padding: 1.1rem;
  background: linear-gradient(135deg, var(--color-navy) 0%, #000066 100%);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 128, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-white);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-navy-light);
}

.auth-footer p {
  color: #666;
  font-size: 0.9rem;
}

.register-link {
  color: var(--color-navy);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-navy);
  transition: width 0.3s ease;
}

.register-link:hover::after {
  width: 100%;
}

.register-link:hover {
  color: #000066;
  text-decoration: none;
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--color-error);
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  border-left: 4px solid var(--color-error);
}

/* Styles spécifiques pour les écrans mobiles */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    background: var(--color-navy);
  }
  
  .auth-card {
    padding: 2rem;
    border-radius: 15px;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
  
  .bank-logo {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.3rem;
  }
  
  .form-group input {
    padding: 0.875rem 2.25rem 0.875rem 0.75rem;
  }
  
  .btn-primary {
    padding: 1rem;
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
      next: (response: any) => {
        this.router.navigate(['/client/dashboard']);
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}
