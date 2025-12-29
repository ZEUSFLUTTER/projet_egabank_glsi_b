import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page card">
      <h2>Create Account</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Client ID</label>
        <input formControlName="clientId" />
        <label>Account Type</label>
        <select formControlName="typeCompte">
          <option value="SAVINGS">Savings</option>
          <option value="CHECKING">Checking</option>
        </select>
        <label>Initial balance (optional)</label>
        <input type="number" formControlName="initialBalance" />
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Create</button>
        </div>
      </form>
    </div>
  `,
})
export class AccountCreateComponent {
  form: any;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      typeCompte: ['SAVINGS', Validators.required],
      initialBalance: [0],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const payload = {
      clientId: Number(this.form.value.clientId),
      typeCompte: this.form.value.typeCompte,
    };
    this.accountService.create(payload).subscribe({
      next: () => this.router.navigateByUrl('/accounts'),
      error: (err) => console.error('Create account failed', err),
    });
  }
}
