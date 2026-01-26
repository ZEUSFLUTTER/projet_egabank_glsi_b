import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../services/client.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card p-6" style="max-width: 600px; margin: 0 auto;">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Modifier Client' : 'Créer Client' }}</h2>

      <!-- Alerts -->
      <div *ngIf="errorMessage" class="alert alert-danger mb-4">
        <i class="ri-error-warning-line"></i> {{ errorMessage }}
      </div>
      <div *ngIf="successMessage" class="alert alert-success mb-4">
        <i class="ri-checkbox-circle-line"></i> {{ successMessage }}
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input formControlName="nom" class="form-input" [class.error-border]="isInvalid('nom')" placeholder="Entrez le nom" />
            <div *ngIf="isInvalid('nom')" class="text-danger text-xs mt-1">Le nom est obligatoire (min 2 caractères)</div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
            <input formControlName="prenom" class="form-input" [class.error-border]="isInvalid('prenom')" placeholder="Entrez le prénom" />
            <div *ngIf="isInvalid('prenom')" class="text-danger text-xs mt-1">Le prénom est obligatoire (min 2 caractères)</div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
            <input type="date" formControlName="dateNaissance" class="form-input" [class.error-border]="isInvalid('dateNaissance')" />
            <div *ngIf="isInvalid('dateNaissance')" class="text-danger text-xs mt-1">
              {{ form.get('dateNaissance')?.errors?.['pastDate'] ? 'La date doit être dans le passé' : 'La date de naissance est obligatoire' }}
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
            <select formControlName="sexe" class="form-input" [class.error-border]="isInvalid('sexe')">
                <option value="MASCULIN">Masculin</option>
                <option value="FEMININ">Féminin</option>
            </select>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input formControlName="telephone" class="form-input" [class.error-border]="isInvalid('telephone')" placeholder="+228 00 00 00 00" />
            <div *ngIf="isInvalid('telephone')" class="text-danger text-xs mt-1">Format de téléphone invalide (+228...)</div>
        </div>
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input type="email" formControlName="courriel" class="form-input" [class.error-border]="isInvalid('courriel')" placeholder="client@exemple.com" />
            <div *ngIf="isInvalid('courriel')" class="text-danger text-xs mt-1">Un email valide est obligatoire</div>
        </div>

        <div *ngIf="!isEditMode" class="border-t border-gray-200 pt-4 mt-4">
          <h3 class="text-lg font-semibold mb-3">Identifiants de Connexion</h3>
          <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur *</label>
              <input formControlName="username" class="form-input" [class.error-border]="isInvalid('username')" placeholder="nom d'utilisateur client" />
              <div *ngIf="isInvalid('username')" class="text-danger text-xs mt-1">Nom d'utilisateur obligatoire</div>
          </div>
          <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe temporaire *</label>
              <input type="password" formControlName="password" class="form-input" [class.error-border]="isInvalid('password')" placeholder="mot de passe temporaire" />
              <div *ngIf="isInvalid('password')" class="text-danger text-xs mt-1">Le mot de passe doit contenir au moins 6 caractères</div>
              <p class="text-xs text-gray-500 mt-1">Le client devra changer son mot de passe à la première connexion.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button type="button" routerLink="/admin/clients" class="btn btn-secondary flex-1">Annuler</button>
          <button type="submit" [disabled]="form.invalid || isLoading" class="btn btn-primary flex-1">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      background-color: #ffffff;
    }
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .error-border { border-color: #dc2626 !important; }
    .spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ClientCreateComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  clientId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', [Validators.required, this.pastDateValidator]],
      sexe: ['MASCULIN', Validators.required],
      telephone: ['', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      courriel: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Vérifier que l'utilisateur est admin
    if (!this.authService.isAdmin()) {
      alert('Access denied: Admin only');
      this.router.navigate(['/client/dashboard']);
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.clientId = +id;

        // Disable username/password validators in edit mode
        this.form.get('username')?.clearValidators();
        this.form.get('password')?.clearValidators();
        this.form.get('username')?.updateValueAndValidity();
        this.form.get('password')?.updateValueAndValidity();

        this.loadClientData(this.clientId);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  loadClientData(id: number) {
    this.isLoading = true;
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.form.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          dateNaissance: client.dateNaissance,
          sexe: client.sexe,
          telephone: client.telephone,
          courriel: client.courriel
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données du client';
        this.isLoading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.form.value;

    if (this.isEditMode && this.clientId) {
      this.clientService.update(this.clientId, payload).subscribe({
        next: () => {
          this.successMessage = 'Client mis à jour avec succès !';
          setTimeout(() => this.router.navigateByUrl('/admin/clients'), 1500);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
          this.isLoading = false;
        }
      });
    } else {
      const clientPayload = {
        nom: payload.nom,
        prenom: payload.prenom,
        dateNaissance: payload.dateNaissance,
        sexe: payload.sexe,
        telephone: payload.telephone?.trim() || null,
        courriel: payload.courriel?.trim() || null,
        nationalite: payload.nationalite?.trim() || null
      };

      // Ensure email for user account is the same as client courriel
      const createPayload = {
        username: payload.username.trim(),
        email: payload.courriel.trim(), // Backend requires email in AdminCreateUserRequest
        password: payload.password,
        client: clientPayload
      };

      console.log('[ClientCreate] Sending create payload:', createPayload);

      this.authService.createClientUser(createPayload).subscribe({
        next: (res) => {
          console.log('[ClientCreate] Create success:', res);
          this.successMessage = 'Client et compte utilisateur créés avec succès !';
          this.isLoading = false;
          setTimeout(() => this.router.navigateByUrl('/admin/clients'), 2000);
        },
        error: (err) => {
          console.error('[ClientCreate] Create failed:', err);
          this.isLoading = false;

          if (err.status === 409) {
            this.errorMessage = 'Erreur : Cet email ou nom d\'utilisateur est déjà utilisé.';
          } else if (err.status === 400 && err.error?.validationErrors) {
            const firstError = Object.values(err.error.validationErrors)[0];
            this.errorMessage = `Erreur de validation : ${firstError}`;
          } else {
            this.errorMessage = err.error?.message || 'Erreur lors de la création du client. Vérifiez les données.';
          }
        }
      });
    }
  }

  private pastDateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today ? null : { pastDate: true };
  }
}
