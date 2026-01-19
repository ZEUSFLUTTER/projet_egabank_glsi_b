import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Identifiants incorrects';
        console.error('Login error:', err);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}