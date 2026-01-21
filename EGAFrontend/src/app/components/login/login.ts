import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  form = { username: '', password: '' };
  loading = signal(false);
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true); // Active le spinner
    this.errorMessage = ''; // Efface l'ancienne erreur

    this.authService.login(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false); // <--- IMPORTANT : On arrête le chargement pour pouvoir réessayer
        this.errorMessage = "Identifiants invalides ou erreur serveur";
        console.error(err);
      }
    });
  }
}