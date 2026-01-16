import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div class="card border-0 p-4 p-md-5" style="max-width: 450px; width: 100%;">
        <div class="text-center mb-5">
          <h1 class="fw-bold text-success mb-2">EgaBank</h1>
          <p class="text-muted">Accédez à votre espace sécurisé</p>
        </div>

        <div *ngIf="error" class="alert alert-danger border-0 small mb-4">
          <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="form-label fw-bold small text-dark">Identifiant</label>
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-person text-muted"></i></span>
              <input type="text" 
                     formControlName="username" 
                     class="form-control border-start-0" 
                     placeholder="Votre identifiant"
                     [class.is-invalid]="submitted && f['username'].errors">
            </div>
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback d-block">
              L'identifiant est requis.
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label fw-bold small text-dark mb-0">Mot de passe</label>
              <a href="#" class="text-success small text-decoration-none">Oublié ?</a>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-lock text-muted"></i></span>
              <input type="password" 
                     formControlName="password" 
                     class="form-control border-start-0" 
                     placeholder="Votre mot de passe"
                     [class.is-invalid]="submitted && f['password'].errors">
            </div>
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback d-block">
              Le mot de passe est requis.
            </div>
          </div>

          <div class="mb-4 form-check">
            <input type="checkbox" class="form-check-input" id="remember">
            <label class="form-check-label small text-muted" for="remember">Se souvenir de moi</label>
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-success btn-lg fw-bold shadow-sm p-3" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              Se connecter
            </button>
          </div>
        </form>

        <div class="text-center mt-5">
          <p class="text-muted small">Vous n'avez pas de compte ? 
            <a routerLink="/auth/register" class="text-success fw-bold text-decoration-none">Ouvrir un compte</a>
          </p>
        </div>

        <!-- Infos de test (Astuce pédagogique) -->
        <div class="mt-4 p-3 bg-light rounded-3 border">
          <p class="small fw-bold mb-1 text-dark">Identifiants de test :</p>
          <ul class="small text-muted mb-0 ps-3">
            <li>Admin : admin / admin123</li>
            <li>Client : client / client123</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    .input-group-text {
      color: #00a86b;
      font-size: 1.1rem;
    }
    .form-control:focus {
      border-color: #00a86b;
      box-shadow: none;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Si déjà connecté, rediriger
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      this.router.navigate([role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: (user) => {
          const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard';
          this.router.navigate([redirectPath]);
        },
        error: (err) => {
          this.error = err.message || 'Échec de la connexion';
          this.loading = false;
        }
      });
  }
}
