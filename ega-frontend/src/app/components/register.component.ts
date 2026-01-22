import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      
      <div class="relative z-10 w-full max-w-md">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            EGA Bank
          </h1>
          <p class="text-gray-300">Créer votre compte bancaire</p>
        </div>

        <!-- Register Card -->
        <div class="card-gold p-8 backdrop-blur-sm bg-opacity-90">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gold-400 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                [(ngModel)]="userData.username"
                name="username"
                required
                minlength="3"
                class="input-gold w-full"
                placeholder="Choisissez un nom d'utilisateur"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gold-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                [(ngModel)]="userData.email"
                name="email"
                required
                class="input-gold w-full"
                placeholder="Entrez votre email"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gold-400 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                [(ngModel)]="userData.password"
                name="password"
                required
                minlength="6"
                class="input-gold w-full"
                placeholder="Choisissez un mot de passe"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gold-400 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                class="input-gold w-full"
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading || !isFormValid()"
              class="btn-gold w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Créer mon compte</span>
              <span *ngIf="isLoading">Création en cours...</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-300">
              Déjà un compte ?
              <a routerLink="/login" class="text-gold-400 hover:text-gold-300 font-medium">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  userData: RegisterRequest = { username: '', email: '', password: '' };
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  isFormValid(): boolean {
    return this.userData.username.length >= 3 &&
           this.userData.email.includes('@') &&
           this.userData.password.length >= 6 &&
           this.userData.password === this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        // Le register ne retourne pas de token, rediriger vers login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création du compte. Veuillez réessayer.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
