import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mockAccounts, mockTransactions } from '../mock-data';

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h1 style="font-size:24px;margin-bottom:8px">Transaction History</h1>
      <p style="color:#6b7280;margin-bottom:12px;">A complete record of banking activities.</p>

      <div *ngIf="selectedAccount" style="margin-bottom:12px;display:flex;gap:12px;">
        <div style="border:1px solid #e5e7eb;padding:12px;border-radius:8px;">
          <div style="font-size:12px;color:#6b7280">Current Balance</div>
          <div style="font-weight:700">{{selectedAccount.balance | currency:selectedAccount.currency}}</div>
        </div>
        <div style="border:1px solid #e5e7eb;padding:12px;border-radius:8px;">
          <div style="font-size:12px;color:#6b7280">Account Type</div>
          <div style="font-weight:700;text-transform:capitalize">{{selectedAccount.accountType}}</div>
        </div>
      </div>

      <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div *ngFor="let txn of filteredTransactions" style="display:flex;justify-content:space-between;padding:12px;border-top:1px solid #f3f4f6;">
          <div>
            <div style="font-weight:600">{{txn.description}}</div>
            <div style="font-size:12px;color:#6b7280">{{txn.transactionId}} • {{txn.date}} <span *ngIf="!accountId">• {{txn.accountId}}</span></div>
          </div>
          <div style="text-align:right">
            <div [style.color]="txn.type === 'withdrawal' || txn.type === 'payment' || txn.type === 'fee' ? '#dc2626' : '#16a34a'" style="font-family:monospace;font-weight:700">
              {{txn.type === 'withdrawal' || txn.type === 'payment' || txn.type === 'fee' ? '-' : '+'}}{{txn.amount | currency:txn.currency}}
            </div>
            <div style="font-size:11px;color:#6b7280">Balance: {{txn.balanceAfter | currency:txn.currency}}</div>
          </div>
        </div>
        <div *ngIf="filteredTransactions.length === 0" style="padding:24px;color:#6b7280;text-align:center">No transactions found for this account.</div>
      </div>
    </div>
  `,
})
export class TransactionsComponent {
  transactions = mockTransactions;
  accounts = mockAccounts;
  filteredTransactions = this.transactions;
  selectedAccount: any = null;
  accountId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((map) => {
      this.accountId = map.get('accountId');
      this.filteredTransactions = this.accountId ? this.transactions.filter((t) => t.accountId === this.accountId) : this.transactions;
      this.selectedAccount = this.accountId ? this.accounts.find((a) => a.accountId === this.accountId) : null;
      // simple sort newest first
      this.filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }
}
