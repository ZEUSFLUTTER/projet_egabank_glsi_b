import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page card">
      <h2>Register</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Username</label>
        <input formControlName="username" />
        <label>Password</label>
        <input type="password" formControlName="password" />
        <label>Full name</label>
        <input formControlName="fullName" />
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Create account</button>
        </div>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      fullName: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (err) => console.error('Register failed', err),
    });
  }
}
