import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/models';
import { Subject, takeUntil, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">🏦 EGA Bank</h1>
          <p class="auth-subtitle">Connectez-vous à votre compte</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form" #loginForm="ngForm">
          <!-- Messages d'erreur améliorés -->
          <div *ngIf="errorMessage" class="alert alert-error">
            <div class="error-header">
              <span class="error-icon">⚠️</span>
              <span class="error-title">Erreur de connexion</span>
            </div>
            <div class="error-message">{{ errorMessage }}</div>
            <div *ngIf="errorDetails" class="error-details">
              <details>
                <summary>Détails techniques</summary>
                <pre>{{ errorDetails }}</pre>
              </details>
            </div>
          </div>

          <!-- Messages de succès -->
          <div *ngIf="successMessage" class="alert alert-success">
            <span class="success-icon">✅</span>
            {{ successMessage }}
          </div>

          <!-- Messages d'information -->
          <div *ngIf="infoMessage" class="alert alert-info">
            <span class="info-icon">ℹ️</span>
            {{ infoMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              [(ngModel)]="courriel"
              name="courriel"
              class="form-control"
              [class.error]="courrielError"
              placeholder="votre@email.com"
              required
              #courrielInput="ngModel"
              (blur)="validateCourriel()"
            />
            <div *ngIf="courrielError" class="field-error">
              {{ courrielError }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="password-input-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                class="form-control"
                [class.error]="passwordError"
                placeholder="••••••••"
                required
                #passwordInput="ngModel"
                (blur)="validatePassword()"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                tabindex="-1"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div *ngIf="passwordError" class="field-error">
              {{ passwordError }}
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            [disabled]="loading || !isFormValid()"
          >
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading" class="loading-content">
              <span class="spinner"></span>
              Connexion en cours...
            </span>
          </button>

          <div class="auth-footer">
            <p>Pas encore de compte ?</p>
            <a routerLink="/register" class="link">Créer un compte</a>
          </div>

          <!-- Toggle debug mode -->
          <div class="debug-toggle" (click)="toggleDebugMode()">
            {{ showDebugInfo ? '🔧' : '🔧' }}
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
      max-width: 450px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .form-control {
      padding: 12px 16px;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-purple);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    .form-control.error {
      border-color: #EF4444;
    }

    .field-error {
      color: #EF4444;
      font-size: 12px;
      margin-top: 4px;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 16px;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .alert-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #DC2626;
    }

    .alert-success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: #16A34A;
    }

    .alert-info {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #2563EB;
    }

    .status-ok { color: #16A34A; }
    .status-error { color: #DC2626; }

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

    .debug-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #6B7280;
      color: white;
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
    }

    @media (max-width: 640px) {
      .auth-card {
        padding: 32px 24px;
      }
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  // Propriétés de base
  courriel = '';
  password = '';
  errorMessage = '';
  loading = false;

  // Propriétés pour la validation
  showPassword = false;
  showDebugInfo = false;
  
  // Messages
  successMessage = '';
  infoMessage = '';
  errorDetails = '';
  
  // Validation
  courrielError = '';
  passwordError = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialisation du composant
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateCourriel(): void {
    if (!this.courriel) {
      this.courrielError = 'Email requis';
    } else if (!this.courriel.includes('@')) {
      this.courrielError = 'Format email invalide';
    } else {
      this.courrielError = '';
    }
  }

  validatePassword(): void {
    if (!this.password) {
      this.passwordError = 'Mot de passe requis';
    } else if (this.password.length < 3) {
      this.passwordError = 'Mot de passe trop court';
    } else {
      this.passwordError = '';
    }
  }

  isFormValid(): boolean {
    return !!(this.courriel && this.password && !this.courrielError && !this.passwordError);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleDebugMode(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }

  onSubmit(): void {
    // Validation des champs
    if (!this.courriel || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.courriel.includes('@')) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    console.log('🔐 === DÉBUT CONNEXION ===');
    console.log('Courriel:', this.courriel);
    console.log('Password length:', this.password.length);

    // Enregistrer la tentative de connexion pour le debug
    const attemptStart = Date.now();

    this.authService.login(this.courriel, this.password).subscribe({
      next: (token) => {
        const duration = Date.now() - attemptStart;
        console.log('📥 Réponse brute du serveur:', token);
        console.log('Type de réponse:', typeof token);
        console.log('Longueur:', token?.length);
        console.log('Durée de la requête:', duration + 'ms');
        
        if (token && typeof token === 'string' && !token.includes('Invalid')) {
          console.log('✅ Token considéré comme valide');
          
          // Attendre un peu pour que le token soit traité
          setTimeout(() => {
            // Vérifier immédiatement après le traitement du token
            const role = this.authService.getRole();
            const email = this.authService.getEmail();
            const isAuth = this.authService.isAuthenticated();
            
            console.log('📊 État après traitement du token:');
            console.log('  - Rôle récupéré:', role, typeof role);
            console.log('  - Email récupéré:', email);
            console.log('  - Authentifié:', isAuth);
            console.log('  - Role.ADMIN:', Role.ADMIN, typeof Role.ADMIN);
            console.log('  - Role.CLIENT:', Role.CLIENT, typeof Role.CLIENT);
            console.log('  - Comparaison role === Role.ADMIN:', role === Role.ADMIN);
            console.log('  - Comparaison role === Role.CLIENT:', role === Role.CLIENT);
            
            // Vérifier le localStorage directement
            console.log('📦 Contenu localStorage:');
            console.log('  - auth_token:', !!localStorage.getItem('auth_token'));
            console.log('  - user_role:', localStorage.getItem('user_role'));
            console.log('  - user_email:', localStorage.getItem('user_email'));
            
            // Redirection basée sur le rôle - AMÉLIORATION ICI
            if (role === Role.ADMIN) {
              console.log('➡️ Redirection vers admin dashboard');
              this.successMessage = `Connexion admin réussie ! Bienvenue ${email}`;
              this.router.navigate(['/admin/dashboard']).then(success => {
                console.log('Navigation admin réussie:', success);
                if (!success) {
                  console.error('❌ Navigation échouée - vérifier AuthGuard');
                  this.errorMessage = 'Erreur de redirection. Vérifiez vos permissions.';
                  this.loading = false;
                }
              }).catch(err => {
                console.error('Erreur navigation admin:', err);
                this.errorMessage = 'Erreur de navigation: ' + err.message;
                this.loading = false;
              });
            } else if (role === Role.CLIENT) {
              console.log('➡️ Redirection vers client dashboard');
              this.successMessage = `Connexion client réussie ! Bienvenue ${email}`;
              this.router.navigate(['/client/dashboard']).then(success => {
                console.log('Navigation client réussie:', success);
                if (!success) {
                  console.error('❌ Navigation échouée - vérifier AuthGuard');
                  this.errorMessage = 'Erreur de redirection. Vérifiez vos permissions.';
                  this.loading = false;
                }
              }).catch(err => {
                console.error('Erreur navigation client:', err);
                this.errorMessage = 'Erreur de navigation: ' + err.message;
                this.loading = false;
              });
            } else {
              console.error('❌ Rôle non reconnu ou null:', role);
              console.error('Valeurs possibles:', Object.values(Role));
              this.errorMessage = `Rôle utilisateur non reconnu: ${role}. Contactez l'administrateur.`;
              this.loading = false;
            }
            
          }, 100); // Petit délai pour s'assurer que le token est traité
          
        } else {
          console.error('❌ Token invalide ou contient "Invalid":', token);
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.loading = false;
        }
      },
      error: (error) => {
        const duration = Date.now() - attemptStart;
        console.error('❌ === ERREUR DE CONNEXION ===');
        console.error('Erreur complète:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Body:', error.error);
        
        // Messages d'erreur améliorés selon le code de statut
        if (error.status === 500) {
          this.errorMessage = 'Erreur serveur. Vérifiez que le serveur backend est démarré.';
          this.errorDetails = 'Le serveur a rencontré une erreur interne. Consultez les logs backend.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          this.errorDetails = 'Vérifiez vos identifiants. Si vous êtes admin, assurez-vous que votre compte a bien le rôle ADMIN.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 8080.';
          this.errorDetails = 'Erreur de connectivité réseau. Le serveur Spring Boot est-il démarré ?';
        } else if (error.status === 404) {
          this.errorMessage = 'Service de connexion non trouvé. Vérifiez la configuration du serveur.';
          this.errorDetails = 'L\'endpoint /api/auth/login n\'est pas accessible.';
        } else {
          this.errorMessage = `Erreur de connexion (${error.status}). Veuillez réessayer.`;
          this.errorDetails = `Détails: ${error.message}`;
        }
        this.loading = false;
      }
    });
  }
}
