import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountResponse } from '../models/account.model';
import { TransactionResponse } from '../models/transaction.model';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  transactions: TransactionResponse[] = [];
  selectedAccount: AccountResponse | null = null;
  accountId: string | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private txService: TransactionService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((map) => {
      this.accountId = map.get('accountId');
      if (this.accountId) {
        this.loadAccountAndTransactions(this.accountId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Please select an account to view transactions.';
      }
    });
  }

  private loadAccountAndTransactions(numeroCompte: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load account details
    this.accountService.getByNumber(numeroCompte).subscribe({
      next: (account) => {
        this.selectedAccount = account;
      },
      error: (err) => {
        console.error('Failed to load account', err);
      },
    });

    // Load transactions
    this.txService.getAllByAccount(numeroCompte).subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort(
          (a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.errorMessage = 'Failed to load transactions.';
        this.isLoading = false;
      },
    });
  }

  getTypeDisplay(type: string) {
    const types: Record<string, string> = {
      DEPOT: 'Deposit',
      RETRAIT: 'Withdrawal',
      VIREMENT_ENTRANT: 'Transfer In',
      VIREMENT_SORTANT: 'Transfer Out',
    };
    return types[type] || type;
  }

  getTxnAmountClass(type: string) {
    if (type === 'DEPOT' || type === 'VIREMENT_ENTRANT') {
      return 'text-success';
    }
    return 'text-danger';
  }

  getTxnSign(type: string) {
    if (type === 'DEPOT' || type === 'VIREMENT_ENTRANT') {
      return '+';
    }
    return '-';
  }

  getAccountTypeDisplay(typeCompte: string) {
    const types: Record<string, string> = {
      EPARGNE: 'Savings',
      COURANT: 'Checking',
    };
    return types[typeCompte] || typeCompte;
  }
}
