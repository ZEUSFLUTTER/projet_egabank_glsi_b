import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center bg-light py-5 min-vh-100">
      <div class="card border-0 p-4 p-md-5 my-5" style="max-width: 600px; width: 100%;">
        <div class="text-center mb-5">
          <h1 class="fw-bold text-success mb-2">Devenir Client EgaBank</h1>
          <p class="text-muted">Ouvrez votre compte en quelques minutes</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold small text-dark">Nom</label>
              <input type="text" formControlName="nom" class="form-control" placeholder="Nom"
                     [class.is-invalid]="submitted && f['nom'].errors">
              <div *ngIf="submitted && f['nom'].errors" class="invalid-feedback">Le nom est requis.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold small text-dark">Prénom</label>
              <input type="text" formControlName="prenom" class="form-control" placeholder="Prénom"
                     [class.is-invalid]="submitted && f['prenom'].errors">
              <div *ngIf="submitted && f['prenom'].errors" class="invalid-feedback">Le prénom est requis.</div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold small text-dark">Adresse E-mail</label>
            <input type="email" formControlName="email" class="form-control" placeholder="exemple@mail.com"
                   [class.is-invalid]="submitted && f['email'].errors">
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">E-mail valide requis.</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold small text-dark">Identifiant (Username)</label>
            <input type="text" formControlName="username" class="form-control" placeholder="Choisissez un identifiant"
                   [class.is-invalid]="submitted && f['username'].errors">
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">Identifiant requis.</div>
          </div>

          <div class="row g-3">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold small text-dark">Mot de passe</label>
              <input type="password" formControlName="password" class="form-control" placeholder="Minimum 6 caractères"
                     [class.is-invalid]="submitted && f['password'].errors">
              <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">Min 6 caractères requis.</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold small text-dark">Confirmer le mot de passe</label>
              <input type="password" formControlName="confirmPassword" class="form-control" placeholder="Confirmez"
                     [class.is-invalid]="submitted && f['confirmPassword'].errors">
              <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
                {{ f['confirmPassword'].errors['mismatch'] ? 'Les mots de passe ne correspondent pas' : 'Confirmation requise' }}
              </div>
            </div>
          </div>

          <div class="mb-4 form-check mt-3">
            <input type="checkbox" class="form-check-input" id="terms" formControlName="terms">
            <label class="form-check-label small text-muted" for="terms">
              J'accepte les <a href="#" class="text-success fw-bold text-decoration-none">Conditions Générales d'Utilisation</a>
            </label>
            <div *ngIf="submitted && f['terms'].errors" class="text-danger small mt-1">Vous devez accepter les conditions.</div>
          </div>

          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-success btn-lg fw-bold shadow-sm p-3" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              Créer mon compte
            </button>
          </div>
        </form>

        <div class="text-center mt-5 pt-3 border-top">
          <p class="text-muted small mb-0">Déjà client ? 
            <a routerLink="/auth/login" class="text-success fw-bold text-decoration-none">Connectez-vous ici</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() { }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (pass !== confirm) {
      g.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return null;
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          alert("Compte créé avec succès ! Bienvenue chez Egabank.");
          this.router.navigate(['/client/dashboard']);
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
