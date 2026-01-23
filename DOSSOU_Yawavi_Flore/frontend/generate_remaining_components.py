#!/usr/bin/env python3
import os

BASE = "/home/claude/ega-bank-app/src/app/features"

files = {
    # ACCOUNTS COMPONENT
    f"{BASE}/accounts/accounts.component.ts": '''import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ClientService } from '../../core/services/client.service';
import { Account, AccountType, AccountDto, AccountDtoCreateOld } from '../../shared/models/account.model';
import { Client } from '../../shared/models/client.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FaIconComponent],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  showNewClientModal = false;
  showExistingClientModal = false;
  newClientForm: FormGroup;
  existingClientForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  filterStatus: 'active' | 'inactive' = 'active';
  searchTerm = '';
  AccountType = AccountType;
  
  faPlus = faPlus;
  faTrash = faTrash;
  faSearch = faSearch;
  faEye = faEye;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private clientService: ClientService
  ) {
    this.newClientForm = this.fb.group({
      accountType: [AccountType.COURANT, Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nationality: ['', Validators.required]
    });

    this.existingClientForm = this.fb.group({
      accountType: [AccountType.COURANT, Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    const service = this.filterStatus === 'active' 
      ? this.accountService.getAllActiveAccounts()
      : this.accountService.getAllInactiveAccounts();

    service.subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredAccounts = this.accounts.filter(account => {
      const search = this.searchTerm.toLowerCase();
      return account.accountNumber.toLowerCase().includes(search);
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.loadAccounts();
  }

  openNewClientModal(): void {
    this.showNewClientModal = true;
    this.newClientForm.reset({ accountType: AccountType.COURANT });
  }

  openExistingClientModal(): void {
    this.showExistingClientModal = true;
    this.existingClientForm.reset({ accountType: AccountType.COURANT });
  }

  closeModals(): void {
    this.showNewClientModal = false;
    this.showExistingClientModal = false;
  }

  createAccountNewClient(): void {
    if (this.newClientForm.valid) {
      this.loading = true;
      const formValue = this.newClientForm.value;
      const accountDto: AccountDto = {
        accountType: formValue.accountType,
        client: {
          lastName: formValue.lastName,
          firstName: formValue.firstName,
          dateOfBirth: formValue.dateOfBirth,
          gender: formValue.gender,
          address: formValue.address,
          phoneNumber: formValue.phoneNumber,
          email: formValue.email,
          nationality: formValue.nationality
        }
      };

      this.accountService.createAccountForNewClient(accountDto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  createAccountExistingClient(): void {
    if (this.existingClientForm.valid) {
      this.loading = true;
      const formValue = this.existingClientForm.value;
      const accountDto: AccountDtoCreateOld = {
        accountType: formValue.accountType,
        client: { email: formValue.clientEmail }
      };

      this.accountService.createAccountForExistingClient(accountDto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  deleteAccount(account: Account): void {
    if (confirm(`Supprimer le compte ${account.accountNumber} ?`)) {
      this.accountService.deleteAccount(account.accountNumber).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
''',

    f"{BASE}/accounts/accounts.component.html": '''<div class="container mx-auto">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des Comptes</h1>
    <p class="text-gray-600">Créer et gérer les comptes bancaires</p>
  </div>

  <div *ngIf="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
    {{ successMessage }}
  </div>
  
  <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
    {{ errorMessage }}
  </div>

  <div class="card mb-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex-1 min-w-[300px]">
        <div class="relative">
          <fa-icon [icon]="faSearch" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa-icon>
          <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Rechercher..." class="input-field pl-10">
        </div>
      </div>
      <select [(ngModel)]="filterStatus" (change)="onFilterChange()" class="input-field w-auto">
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
      <div class="flex gap-2">
        <button (click)="openNewClientModal()" class="btn-primary flex items-center gap-2">
          <fa-icon [icon]="faPlus"></fa-icon>
          <span>Nouveau Client</span>
        </button>
        <button (click)="openExistingClientModal()" class="btn-secondary flex items-center gap-2">
          <fa-icon [icon]="faPlus"></fa-icon>
          <span>Client Existant</span>
        </button>
      </div>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro de Compte</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de Création</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let account of filteredAccounts" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-mono">{{ account.accountNumber }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-2 py-1 rounded text-xs" [class.bg-blue-100]="account.accountType === 'COURANT'" [class.bg-green-100]="account.accountType === 'EPARGNE'">
                {{ account.accountType }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-primary-600">{{ account.balance | number:'1.2-2' }} FCFA</td>
            <td class="px-6 py-4 text-sm">{{ account.createdAt | date:'short' }}</td>
            <td class="px-6 py-4 text-sm">
              <button (click)="deleteAccount(account)" class="text-red-600 hover:text-red-800">
                <fa-icon [icon]="faTrash"></fa-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Modal Nouveau Client -->
<div *ngIf="showNewClientModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div class="px-6 py-4 border-b flex justify-between">
      <h3 class="text-xl font-bold">Créer un Compte pour Nouveau Client</h3>
      <button (click)="closeModals()" class="text-2xl">&times;</button>
    </div>
    <div class="p-6">
      <form [formGroup]="newClientForm" (ngSubmit)="createAccountNewClient()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Type de Compte</label>
          <select formControlName="accountType" class="input-field">
            <option [value]="AccountType.COURANT">Courant</option>
            <option [value]="AccountType.EPARGNE">Épargne</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nom</label>
            <input type="text" formControlName="lastName" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Prénom</label>
            <input type="text" formControlName="firstName" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date de Naissance</label>
            <input type="date" formControlName="dateOfBirth" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Genre</label>
            <select formControlName="gender" class="input-field">
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Nationalité</label>
            <input type="text" formControlName="nationality" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Téléphone</label>
            <input type="tel" formControlName="phoneNumber" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Adresse</label>
            <input type="text" formControlName="address" class="input-field">
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" (click)="closeModals()" class="btn-secondary">Annuler</button>
          <button type="submit" [disabled]="!newClientForm.valid || loading" class="btn-primary">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal Client Existant -->
<div *ngIf="showExistingClientModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div class="px-6 py-4 border-b flex justify-between">
      <h3 class="text-xl font-bold">Créer un Compte pour Client Existant</h3>
      <button (click)="closeModals()" class="text-2xl">&times;</button>
    </div>
    <div class="p-6">
      <form [formGroup]="existingClientForm" (ngSubmit)="createAccountExistingClient()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Type de Compte</label>
          <select formControlName="accountType" class="input-field">
            <option [value]="AccountType.COURANT">Courant</option>
            <option [value]="AccountType.EPARGNE">Épargne</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email du Client</label>
          <input type="email" formControlName="clientEmail" class="input-field" placeholder="email@example.com">
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" (click)="closeModals()" class="btn-secondary">Annuler</button>
          <button type="submit" [disabled]="!existingClientForm.valid || loading" class="btn-primary">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
''',

    # TRANSACTIONS COMPONENT
    f"{BASE}/transactions/transactions.component.ts": '''import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { AccountService } from '../../core/services/account.service';
import { TransactionDepWithDto, TransferDto } from '../../shared/models/transaction.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMoneyBillWave, faExchangeAlt, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent {
  activeTab: 'depot' | 'retrait' | 'transfer' = 'depot';
  depotForm: FormGroup;
  retraitForm: FormGroup;
  transferForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  faMoneyBillWave = faMoneyBillWave;
  faExchangeAlt = faExchangeAlt;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {
    this.depotForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.retraitForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.transferForm = this.fb.group({
      sourceAccount: ['', Validators.required],
      destAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  setActiveTab(tab: 'depot' | 'retrait' | 'transfer'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onDeposit(): void {
    if (this.depotForm.valid) {
      this.loading = true;
      const dto: TransactionDepWithDto = {
        amount: this.depotForm.value.amount,
        accountNumber: { accountNumber: this.depotForm.value.accountNumber }
      };

      this.transactionService.deposit(dto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.depotForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors du dépôt';
          this.loading = false;
        }
      });
    }
  }

  onWithdraw(): void {
    if (this.retraitForm.valid) {
      this.loading = true;
      const dto: TransactionDepWithDto = {
        amount: this.retraitForm.value.amount,
        accountNumber: { accountNumber: this.retraitForm.value.accountNumber }
      };

      this.transactionService.withdraw(dto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.retraitForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors du retrait';
          this.loading = false;
        }
      });
    }
  }

  onTransfer(): void {
    if (this.transferForm.valid) {
      this.loading = true;
      const dto: TransferDto = {
        amount: this.transferForm.value.amount,
        compteSource: { accountNumber: this.transferForm.value.sourceAccount },
        compteDest: { accountNumber: this.transferForm.value.destAccount }
      };

      this.transactionService.transfer(dto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.transferForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors du transfert';
          this.loading = false;
        }
      });
    }
  }
}
''',

    f"{BASE}/transactions/transactions.component.html": '''<div class="container mx-auto max-w-4xl">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Transactions</h1>
    <p class="text-gray-600">Effectuer des dépôts, retraits et transferts</p>
  </div>

  <div *ngIf="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
    {{ successMessage }}
  </div>
  
  <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
    {{ errorMessage }}
  </div>

  <!-- Tabs -->
  <div class="card mb-6">
    <div class="flex border-b">
      <button 
        (click)="setActiveTab('depot')"
        [class.border-primary-600]="activeTab === 'depot'"
        [class.text-primary-600]="activeTab === 'depot'"
        class="px-6 py-3 font-medium border-b-2 border-transparent hover:text-primary-600 flex items-center gap-2"
      >
        <fa-icon [icon]="faArrowDown"></fa-icon>
        Dépôt
      </button>
      <button 
        (click)="setActiveTab('retrait')"
        [class.border-primary-600]="activeTab === 'retrait'"
        [class.text-primary-600]="activeTab === 'retrait'"
        class="px-6 py-3 font-medium border-b-2 border-transparent hover:text-primary-600 flex items-center gap-2"
      >
        <fa-icon [icon]="faArrowUp"></fa-icon>
        Retrait
      </button>
      <button 
        (click)="setActiveTab('transfer')"
        [class.border-primary-600]="activeTab === 'transfer'"
        [class.text-primary-600]="activeTab === 'transfer'"
        class="px-6 py-3 font-medium border-b-2 border-transparent hover:text-primary-600 flex items-center gap-2"
      >
        <fa-icon [icon]="faExchangeAlt"></fa-icon>
        Transfert
      </button>
    </div>

    <!-- Depot Form -->
    <div *ngIf="activeTab === 'depot'" class="p-6">
      <form [formGroup]="depotForm" (ngSubmit)="onDeposit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Numéro de Compte</label>
          <input type="text" formControlName="accountNumber" class="input-field" placeholder="FR76...">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Montant (FCFA)</label>
          <input type="number" formControlName="amount" class="input-field" placeholder="0.00">
        </div>
        <button type="submit" [disabled]="!depotForm.valid || loading" class="btn-primary w-full">
          {{ loading ? 'En cours...' : 'Effectuer le Dépôt' }}
        </button>
      </form>
    </div>

    <!-- Retrait Form -->
    <div *ngIf="activeTab === 'retrait'" class="p-6">
      <form [formGroup]="retraitForm" (ngSubmit)="onWithdraw()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Numéro de Compte</label>
          <input type="text" formControlName="accountNumber" class="input-field" placeholder="FR76...">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Montant (FCFA)</label>
          <input type="number" formControlName="amount" class="input-field" placeholder="0.00">
        </div>
        <button type="submit" [disabled]="!retraitForm.valid || loading" class="btn-danger w-full">
          {{ loading ? 'En cours...' : 'Effectuer le Retrait' }}
        </button>
      </form>
    </div>

    <!-- Transfer Form -->
    <div *ngIf="activeTab === 'transfer'" class="p-6">
      <form [formGroup]="transferForm" (ngSubmit)="onTransfer()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Compte Source</label>
          <input type="text" formControlName="sourceAccount" class="input-field" placeholder="FR76...">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Compte Destination</label>
          <input type="text" formControlName="destAccount" class="input-field" placeholder="FR76...">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Montant (FCFA)</label>
          <input type="number" formControlName="amount" class="input-field" placeholder="0.00">
        </div>
        <button type="submit" [disabled]="!transferForm.valid || loading" class="btn-primary w-full">
          {{ loading ? 'En cours...' : 'Effectuer le Transfert' }}
        </button>
      </form>
    </div>
  </div>
</div>
''',

    # REPORTS COMPONENT
    f"{BASE}/reports/reports.component.ts": '''import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { ReportService } from '../../core/services/report.service';
import { HistoriqueTransactionDto, DemandeHistoriqueDto } from '../../shared/models/transaction.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  historyForm: FormGroup;
  transactions: HistoriqueTransactionDto[] = [];
  loading = false;
  errorMessage = '';

  faFilePdf = faFilePdf;
  faSearch = faSearch;
  faDownload = faDownload;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private reportService: ReportService
  ) {
    this.historyForm = this.fb.group({
      accountNumber: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
  }

  searchHistory(): void {
    if (this.historyForm.valid) {
      this.loading = true;
      const formValue = this.historyForm.value;
      const dto: DemandeHistoriqueDto = {
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        accountNumberDto: { accountNumber: formValue.accountNumber }
      };

      this.transactionService.getTransactionHistory(dto).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la recherche';
          this.loading = false;
        }
      });
    }
  }

  downloadPdf(): void {
    if (this.historyForm.valid) {
      this.loading = true;
      const formValue = this.historyForm.value;

      this.reportService.generatePdfReport(
        formValue.accountNumber,
        formValue.dateDebut,
        formValue.dateFin
      ).subscribe({
        next: (blob) => {
          this.reportService.downloadPdf(blob, 'releve-bancaire.pdf');
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la génération du PDF';
          this.loading = false;
        }
      });
    }
  }
}
''',

    f"{BASE}/reports/reports.component.html": '''<div class="container mx-auto">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Rapports et Historique</h1>
    <p class="text-gray-600">Consulter l'historique et générer des relevés PDF</p>
  </div>

  <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
    {{ errorMessage }}
  </div>

  <div class="card mb-6">
    <h3 class="text-xl font-semibold mb-4">Rechercher l'Historique</h3>
    <form [formGroup]="historyForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Numéro de Compte</label>
          <input type="text" formControlName="accountNumber" class="input-field" placeholder="FR76...">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date Début</label>
          <input type="date" formControlName="dateDebut" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date Fin</label>
          <input type="date" formControlName="dateFin" class="input-field">
        </div>
      </div>
      <div class="flex gap-3">
        <button type="button" (click)="searchHistory()" [disabled]="!historyForm.valid || loading" class="btn-primary flex items-center gap-2">
          <fa-icon [icon]="faSearch"></fa-icon>
          Rechercher
        </button>
        <button type="button" (click)="downloadPdf()" [disabled]="!historyForm.valid || loading" class="btn-secondary flex items-center gap-2">
          <fa-icon [icon]="faFilePdf"></fa-icon>
          Télécharger PDF
        </button>
      </div>
    </form>
  </div>

  <div *ngIf="transactions.length > 0" class="card overflow-hidden">
    <h3 class="text-xl font-semibold mb-4">Historique des Transactions</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let transaction of transactions" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ transaction.transactionDate | date:'short' }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-2 py-1 rounded text-xs" 
                [class.bg-green-100]="transaction.transactionType === 'DEPOT' || transaction.transactionType === 'TRANSFERT_ENTRANT'"
                [class.bg-red-100]="transaction.transactionType === 'RETRAIT' || transaction.transactionType === 'TRANSFERT_SORTANT'">
                {{ transaction.transactionType }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-semibold">{{ transaction.amount | number:'1.2-2' }} FCFA</td>
            <td class="px-6 py-4 text-sm">{{ transaction.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
'''
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ {path}")

print("\n✓ Tous les composants créés!")
