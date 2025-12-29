import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page card">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Username</label>
        <input formControlName="username" />
        <label>Password</label>
        <input type="password" formControlName="password" />
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Sign in</button>
        </div>
      </form>
      <p class="muted">Don't have an account? <a routerLink="/register">Register</a></p>
    </div>
  `,
})
export class LoginComponent {
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    this.auth.login({ username, password }).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => console.error('Login failed', err),
    });
  }
}
