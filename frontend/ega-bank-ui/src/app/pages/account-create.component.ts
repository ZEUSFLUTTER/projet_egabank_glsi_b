import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientResponse } from '../models/client.model';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { ClientSearchInputComponent } from '../shared/client-search-input.component';
import { AppStore } from '../stores/app.store';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ClientSearchInputComponent],
  template: `
    <div class="p-6">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold mb-2">Ouvrir un Nouveau Compte</h1>
        <p class="text-gray-500">Créez un nouveau compte bancaire pour un client existant en quelques secondes.</p>
      </div>

      <div class="card p-8" style="max-width: 650px; margin: 0 auto; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="alert alert-danger mb-6 animate-shake">
          <div class="flex items-center gap-3">
            <i class="ri-error-warning-fill text-xl"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="alert alert-success mb-6 animate-slide-in">
          <div class="flex items-center gap-3">
            <i class="ri-checkbox-circle-fill text-xl"></i>
            <span>{{ successMessage }}</span>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <!-- Client Selection -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="ri-user-search-line text-primary"></i> Sélectionner Client *
            </label>
            <client-search-input
              formControlName="clientId"
              placeholder="Rechercher par nom, email..."
              [allowCreate]="true"
              [showAccountCount]="true"
              (clientSelected)="onClientSelected($event)"
              (createNewClient)="goToCreateClient()"
            ></client-search-input>
            <div *ngIf="isInvalid('clientId')" class="text-danger text-xs mt-2 font-medium">
              <i class="ri-error-warning-line"></i> Ce champ est obligatoire. Veuillez sélectionner un client dans la liste.
            </div>
          </div>

          <!-- Account Type Selection -->
          <div class="mb-8">
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              <i class="ri-bank-card-2-line text-primary"></i> Type de Compte Souhaité *
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="account-type-option" [class.selected]="form.get('typeCompte')?.value === 'EPARGNE'">
                <input type="radio" formControlName="typeCompte" value="EPARGNE" class="hidden-radio">
                <div class="option-content">
                  <div class="icon-wrapper">
                    <i class="ri-safe-2-line text-2xl"></i>
                  </div>
                  <div class="details">
                    <span class="title">Épargne</span>
                    <span class="desc">Pour les économies</span>
                  </div>
                </div>
              </label>
              
              <label class="account-type-option" [class.selected]="form.get('typeCompte')?.value === 'COURANT'">
                <input type="radio" formControlName="typeCompte" value="COURANT" class="hidden-radio">
                <div class="option-content">
                  <div class="icon-wrapper">
                    <i class="ri-wallet-3-line text-2xl"></i>
                  </div>
                  <div class="details">
                    <span class="title">Courant</span>
                    <span class="desc">Pour les opérations</span>
                  </div>
                </div>
              </label>
            </div>
            <div *ngIf="isInvalid('typeCompte')" class="text-danger text-xs mt-2 font-medium">
               Choisissez un type de compte.
            </div>
          </div>

          <!-- Information Banner -->
          <div class="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8 flex items-start gap-4">
            <i class="ri-information-fill text-blue-500 text-xl mt-0.5"></i>
            <div>
              <p class="text-sm font-semibold text-blue-900">Solde Initial : 0,00 FCFA</p>
              <p class="text-xs text-blue-700 mt-1">Le compte sera activé immédiatement dès sa création. Vous pourrez effectuer votre premier dépôt dans la foulée.</p>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4 border-t border-gray-100">
            <a routerLink="/admin/accounts" class="btn btn-secondary flex-1">
              <i class="ri-close-line"></i> Annuler
            </a>
            <button type="submit"
                    [disabled]="form.invalid || isSubmitting"
                    class="btn btn-primary flex-1">
              <span *ngIf="!isSubmitting" class="flex items-center justify-center gap-2">
                <i class="ri-add-circle-line"></i> Créer le Compte
              </span>
              <span *ngIf="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="ri-loader-4-line spinner"></i> Traitement...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .account-type-option {
      cursor: pointer;
      border: 2px solid #f3f4f6;
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .account-type-option:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
    .account-type-option.selected {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.03);
    }
    .account-type-option.selected .icon-wrapper {
      background: var(--primary);
      color: white;
    }
    .hidden-radio {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .option-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.75rem;
    }
    .icon-wrapper {
      width: 50px;
      height: 50px;
      background: #f3f4f6;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s;
    }
    .details .title {
      display: block;
      font-weight: 700;
      color: #1f2937;
    }
    .details .desc {
      font-size: 0.75rem;
      color: #9ca3af;
    }
    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class AccountCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  selectedClient: ClientResponse | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private store: AppStore,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      clientId: [null, Validators.required],
      typeCompte: ['EPARGNE', Validators.required],
    });
  }

  ngOnInit(): void {
    // Vérifier que l'utilisateur est admin
    if (!this.authService.isAdmin()) {
      alert('Access denied: Admin only');
      this.router.navigate(['/client/dashboard']);
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClientSelected(client: ClientResponse) {
    this.selectedClient = client;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  goToCreateClient() {
    this.router.navigateByUrl('/admin/clients/new');
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      clientId: Number(this.form.value.clientId),
      typeCompte: this.form.value.typeCompte,
    };

    this.accountService.create(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (account) => {
        this.successMessage = `Account ${account.numeroCompte} created successfully!`;

        // Mettre à jour le store pour synchroniser tous les composants
        this.store.addAccount(account);
        this.store.triggerFullRefresh();

        // Navigate after a short delay to show success message
        setTimeout(() => {
          this.router.navigateByUrl('/admin/accounts');
        }, 1500);
      },
      error: (err) => {
        console.error('Create account failed', err);
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create account. Please try again.';
      },
    });
  }
}
