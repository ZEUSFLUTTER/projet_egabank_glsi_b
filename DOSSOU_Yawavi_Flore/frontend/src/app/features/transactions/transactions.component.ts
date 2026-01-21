import { Component } from '@angular/core';
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
