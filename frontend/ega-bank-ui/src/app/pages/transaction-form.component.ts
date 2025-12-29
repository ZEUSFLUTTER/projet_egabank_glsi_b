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
          <option value="DEPOT">Deposit (Dépôt)</option>
          <option value="RETRAIT">Withdrawal (Retrait)</option>
          <option value="VIREMENT">Transfer (Virement)</option>
        </select>

        <label>Account Number</label>
        <input formControlName="accountNumber" />

        <label *ngIf="form.value.type === 'VIREMENT'">Target Account</label>
        <input *ngIf="form.value.type === 'VIREMENT'" formControlName="targetAccountNumber" />

        <label>Amount</label>
        <input type="number" formControlName="amount" />

        <label>Description (optional)</label>
        <input formControlName="description" />

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
      type: ['DEPOT', Validators.required],
      accountNumber: ['', Validators.required],
      targetAccountNumber: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    if (v.type === 'VIREMENT') {
      this.txService.transfer({
        compteSource: String(v.accountNumber),
        compteDestination: String(v.targetAccountNumber),
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: () => this.router.navigateByUrl('/transactions'),
        error: (e) => console.error(e)
      });
    } else if (v.type === 'DEPOT') {
      this.txService.deposit(String(v.accountNumber), {
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: () => this.router.navigateByUrl('/transactions'),
        error: (e) => console.error(e)
      });
    } else {
      this.txService.withdraw(String(v.accountNumber), {
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: () => this.router.navigateByUrl('/transactions'),
        error: (e) => console.error(e)
      });
    }
  }
}
