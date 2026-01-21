import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
  <!-- Partie gauche pour le média (image/vidéo) -->
  <div class="media-section">
    <div class="media-content">
      <!-- Vous pouvez remplacer cette div par une image, un carrousel ou une vidéo -->
      <div class="media-placeholder">
        <div class="placeholder-content">
          <div class="placeholder-icon"> <i class="fa-solid fa-building-columns"></i> </div>
          <h2> EGA BANK </h2>
          <p>Votre partenaire financier de confiance</p>
          <p class="subtitle">Solutions bancaires modernes et sécurisées</p>
        </div>
      </div>
      
      <!-- Exemple avec un carrousel d'images (à décommenter et configurer) -->
      <!--
      <div class="image-carousel">
        <img src="assets/images/bank1.jpg" alt="Service client">
        <img src="assets/images/bank2.jpg" alt="Solutions digitales">
        <img src="assets/images/bank3.jpg" alt="Sécurité">
      </div>
      -->
      
      <!-- Exemple avec une vidéo (à décommenter et configurer) -->
      <!--
      <video class="background-video" autoplay muted loop>
        <source src="assets/videos/bank-background.mp4" type="video/mp4">
      </video>
      -->
    </div>
  </div>

  <!-- Partie droite pour le formulaire de connexion -->
  <div class="form-section">
    <div class="auth-card">
      <div class="auth-header">
        <h1>CONNEXION</h1>
        <p>Accédez à votre espace Banque Ega</p>
      </div>
      
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              [class.error]="error"
              placeholder="Entrez votre nom d'utilisateur"
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
        
        <div class="form-footer">
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
        </div>
      </form>
      
      <div class="auth-footer">
        <p>Pas encore de compte ? <a routerLink="/register" class="register-link">S'inscrire</a></p>
        <p style="margin-top: 1rem;">Vous êtes un client ? <a routerLink="/client/login" class="register-link">Se connecter en tant que client</a></p>
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
  --color-accent: #000000; /* Noir pour les accents */
}

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Section média (gauche) */
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

/* Styles pour le carrousel d'images (exemple) */
.image-carousel {
  height: 100%;
  width: 100%;
  position: relative;
}

.image-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.image-carousel img.active {
  opacity: 1;
}

/* Styles pour la vidéo de fond (exemple) */
.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Section formulaire (droite) */
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

/* Styles du formulaire */
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
  background-color: var(--color-error);
}

/* Bouton de connexion */
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

/* Liens et footer */
.form-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.forgot-password {
  color: var(--color-gray);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-black);
  text-decoration: underline;
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

/* Message d'erreur */
.error-message {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
}

/* Responsive */
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
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}

