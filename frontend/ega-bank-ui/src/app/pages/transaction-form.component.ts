import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page card">
      <h2>New Transaction</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Type</label>
        <select formControlName="type">
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="TRANSFER">Transfer</option>
        </select>

        <label>Account Number</label>
        <input formControlName="accountNumber" />

        <label *ngIf="form.value.type === 'TRANSFER'">Target Account</label>
        <input *ngIf="form.value.type === 'TRANSFER'" formControlName="targetAccountNumber" />

        <label>Amount</label>
        <input type="number" formControlName="amount" />

        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Submit</button>
        </div>
      </form>
    </div>
  `,
})
export class TransactionFormComponent {
  form: any;

  constructor(private fb: FormBuilder, private txService: TransactionService, private router: Router) {
    this.form = this.fb.group({
      type: ['DEPOSIT', Validators.required],
      accountNumber: ['', Validators.required],
      targetAccountNumber: [''],
      amount: [0, [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    if (v.type === 'TRANSFER') {
      this.txService.transfer({ compteSource: String(v.accountNumber), compteDestination: String(v.targetAccountNumber), montant: Number(v.amount) })
        .subscribe({ next: () => this.router.navigateByUrl('/transactions'), error: (e) => console.error(e) });
    } else if (v.type === 'DEPOSIT') {
      this.txService.deposit(String(v.accountNumber), { montant: Number(v.amount) })
        .subscribe({ next: () => this.router.navigateByUrl('/transactions'), error: (e) => console.error(e) });
    } else {
      this.txService.withdraw(String(v.accountNumber), { montant: Number(v.amount) })
        .subscribe({ next: () => this.router.navigateByUrl('/transactions'), error: (e) => console.error(e) });
    }
  }
}
