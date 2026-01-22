import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { AccountListDto2 } from '../../../dto/AccountListDto2';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {

  // Formulaires de recherche
  public depositSearchForm!: FormGroup;
  public withdrawalSearchForm!: FormGroup;

  // Formulaires de transaction
  public depositForm!: FormGroup;
  public withdrawalForm!: FormGroup;
  public transferForm!: FormGroup;

  // États des comptes trouvés
  public depositAccountFound = false;
  public withdrawalAccountFound = false;
  public depositAccount: AccountListDto2 | null = null;
  public withdrawalAccount: AccountListDto2 | null = null;

  // États généraux
  public activeTab: 'deposit' | 'withdrawal' | 'transfer' = 'deposit';
  public isSearching = false;
  public isSubmitting = false;
  public successMessage = '';
  public errorMessage = '';

  // Services
  private readonly transactionService = inject(TransactionService);
  private readonly accountService = inject(AccountService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Formulaires de recherche
    this.depositSearchForm = this.fb.group({
      accountNumber: ['', [Validators.required]]
    });

    this.withdrawalSearchForm = this.fb.group({
      accountNumber: ['', [Validators.required]]
    });

    // Formulaires de transaction
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.withdrawalForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.transferForm = this.fb.group({
      compteSource: ['', [Validators.required]],
      compteDest: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  /**
   * Change l'onglet actif et réinitialise tout
   */
  switchTab(tab: 'deposit' | 'withdrawal' | 'transfer'): void {
    this.activeTab = tab;
    this.resetAll();
  }

  /**
   * Recherche le compte pour dépôt
   */
  searchDepositAccount(): void {
    if (this.depositSearchForm.invalid) {
      this.depositSearchForm.markAllAsTouched();
      return;
    }

    this.isSearching = true;
    this.resetMessages();
    const accountNumber = this.depositSearchForm.value.accountNumber;

    this.accountService.getAccountClientDetail2(accountNumber).subscribe({
      next: (account) => {
        console.log('Compte trouvé :', account);
        this.depositAccount = account;
        this.depositAccountFound = true;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.isSearching = false;
        if (err.status === 404) {
          this.errorMessage = 'Compte introuvable.';
        } else {
          this.errorMessage = 'Erreur lors de la recherche du compte.';
        }
      }
    });
  }

  /**
   * Recherche le compte pour retrait
   */
  searchWithdrawalAccount(): void {
    if (this.withdrawalSearchForm.invalid) {
      this.withdrawalSearchForm.markAllAsTouched();
      return;
    }

    this.isSearching = true;
    this.resetMessages();
    const accountNumber = this.withdrawalSearchForm.value.accountNumber;

    this.accountService.getAccountClientDetail2(accountNumber).subscribe({
      next: (account) => {
        console.log('Compte trouvé :', account);
        this.withdrawalAccount = account;
        this.withdrawalAccountFound = true;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.isSearching = false;
        if (err.status === 404) {
          this.errorMessage = 'Compte introuvable.';
        } else {
          this.errorMessage = 'Erreur lors de la recherche du compte.';
        }
      }
    });
  }

  /**
   * Effectue un dépôt
   */
  onDeposit(): void {
    if (this.depositForm.invalid || !this.depositAccount) {
      this.depositForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.resetMessages();

    const formValue = this.depositForm.value;
    const amount = new Decimal(formValue.amount);
    const accountNumber = this.depositAccount.accountNumber;

    // Convertir Decimal en number pour l'envoi
    this.transactionService.deposit(amount.toNumber(), accountNumber).subscribe({
      next: (response) => {
        console.log('Dépôt effectué :', response);
        this.successMessage = `Dépôt de ${formValue.amount} FCFA effectué avec succès sur le compte de ${this.depositAccount?.client.firstName} ${this.depositAccount?.client.lastName}.`;
        this.isSubmitting = false;
        this.resetDeposit();
      },
      error: (err) => {
        console.error('Erreur lors du dépôt :', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Effectue un retrait
   */
  onWithdrawal(): void {
    if (this.withdrawalForm.invalid || !this.withdrawalAccount) {
      this.withdrawalForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.resetMessages();

    const formValue = this.withdrawalForm.value;
    const amount = new Decimal(formValue.amount);
    const accountNumber = this.withdrawalAccount.accountNumber;

    // Convertir Decimal en number pour l'envoi
    this.transactionService.withdrawal(amount.toNumber(), accountNumber).subscribe({
      next: (response) => {
        console.log('Retrait effectué :', response);
        this.successMessage = `Retrait de ${formValue.amount} FCFA effectué avec succès sur le compte de ${this.withdrawalAccount?.client.firstName} ${this.withdrawalAccount?.client.lastName}.`;
        this.isSubmitting = false;
        this.resetWithdrawal();
      },
      error: (err) => {
        console.error('Erreur lors du retrait :', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Effectue un transfert
   */
  onTransfer(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.resetMessages();

    const formValue = this.transferForm.value;
    const amount = new Decimal(formValue.amount);

    // Convertir Decimal en number pour l'envoi
    this.transactionService.transfer(
      amount.toNumber(), 
      formValue.compteSource, 
      formValue.compteDest
    ).subscribe({
      next: (response) => {
        console.log('Transfert effectué :', response);
        this.successMessage = `Transfert de ${formValue.amount} FCFA effectué avec succès du compte ${formValue.compteSource} vers ${formValue.compteDest}.`;
        this.isSubmitting = false;
        this.transferForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors du transfert :', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Réinitialise le dépôt
   */
  resetDeposit(): void {
    this.depositAccountFound = false;
    this.depositAccount = null;
    this.depositSearchForm.reset();
    this.depositForm.reset();
  }

  /**
   * Réinitialise le retrait
   */
  resetWithdrawal(): void {
    this.withdrawalAccountFound = false;
    this.withdrawalAccount = null;
    this.withdrawalSearchForm.reset();
    this.withdrawalForm.reset();
  }

  /**
   * Réinitialise tout
   */
  private resetAll(): void {
    this.resetDeposit();
    this.resetWithdrawal();
    this.transferForm.reset();
    this.resetMessages();
  }

  /**
   * Gestion des erreurs
   */
  private handleError(err: any): void {
    if (err.status === 400) {
      this.errorMessage = err.error?.message || 'Données invalides. Veuillez vérifier les informations.';
    } else if (err.status === 404) {
      this.errorMessage = 'Compte introuvable.';
    } else if (err.status === 403) {
      this.errorMessage = 'Solde insuffisant pour effectuer cette opération.';
    } else if (err.status === 500) {
      this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la transaction.';
    }
  }

  /**
   * Réinitialise les messages
   */
  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}