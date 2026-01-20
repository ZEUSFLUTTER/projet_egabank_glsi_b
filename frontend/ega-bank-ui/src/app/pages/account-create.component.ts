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
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Ouvrir un Nouveau Compte</h1>
        <p class="text-gray-500">Créer un nouveau compte bancaire pour un client existant.</p>
      </div>

      <div class="card p-6" style="max-width: 600px;">
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="alert alert-danger mb-4">
          <i class="ri-error-warning-line"></i> {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="alert alert-success mb-4">
          <i class="ri-checkbox-circle-line"></i> {{ successMessage }}
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <!-- Client Selection with Search -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-user-line text-primary"></i> Sélectionner Client *
            </label>

            <!-- Composant de recherche client amélioré -->
            <client-search-input
              formControlName="clientId"
              placeholder="Tapez le nom ou email du client..."
              [allowCreate]="true"
              [showAccountCount]="true"
              (clientSelected)="onClientSelected($event)"
              (createNewClient)="goToCreateClient()"
            ></client-search-input>

            <div *ngIf="form.get('clientId')?.touched && form.get('clientId')?.invalid"
                 class="text-danger text-sm mt-1">
              <i class="ri-error-warning-line"></i> Veuillez sélectionner un client
            </div>
          </div>

          <!-- Account Type -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-wallet-3-line text-primary"></i> Type de Compte *
            </label>
            <div class="grid gap-3" style="grid-template-columns: repeat(2, 1fr);">
              <label class="cursor-pointer">
                <input type="radio" formControlName="typeCompte" value="EPARGNE" class="sr-only peer">
                <div class="p-4 border rounded hover:bg-gray-50 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                  <div class="flex items-center gap-2">
                    <i class="ri-safe-2-line text-xl"></i>
                    <div>
                      <div class="font-medium">Épargne</div>
                      <div class="text-xs opacity-70">Savings</div>
                    </div>
                  </div>
                </div>
              </label>
              <label class="cursor-pointer">
                <input type="radio" formControlName="typeCompte" value="COURANT" class="sr-only peer">
                <div class="p-4 border rounded hover:bg-gray-50 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                  <div class="flex items-center gap-2">
                    <i class="ri-bank-card-line text-xl"></i>
                    <div>
                      <div class="font-medium">Courant</div>
                      <div class="text-xs opacity-70">Checking</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Initial Deposit Info -->
          <div class="p-4 bg-gray-50 rounded mb-6">
            <div class="flex items-start gap-2">
              <i class="ri-information-line text-lg text-info mt-0.5"></i>
              <div class="text-sm text-gray-600">
                <p class="font-medium">Le compte sera créé avec un solde à zéro.</p>
                <p class="mt-1">Pour ajouter des fonds, utilisez la fonction Dépôt après la création du compte.</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <a routerLink="/admin/accounts" class="btn btn-secondary flex-1">
              <i class="ri-arrow-left-line"></i> Annuler
            </a>
            <button type="submit"
                    [disabled]="form.invalid || isSubmitting"
                    class="btn btn-primary flex-1">
              <span *ngIf="isSubmitting">
                <i class="ri-loader-4-line spinner-icon"></i> Création...
              </span>
              <span *ngIf="!isSubmitting">
                <i class="ri-add-line"></i> Créer Compte
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
    .peer:checked + div {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    select:focus, input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary), transparent 80%);
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
