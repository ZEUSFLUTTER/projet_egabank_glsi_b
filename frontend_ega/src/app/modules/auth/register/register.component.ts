import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="flex justify-center mb-6">
          <span class="iconify text-blue-600" data-icon="lucide:hexagon" data-width="48"></span>
        </div>
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">Ega<span class="text-blue-500">Bank</span></h2>
        <p class="mt-2 text-sm text-gray-600">Créez votre compte gestionnaire</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          <form (submit)="onSubmit()" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span class="iconify" data-icon="lucide:user" data-width="18"></span>
                </div>
                <input id="username" name="username" type="text" required [(ngModel)]="userData.username"
                  class="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Adresse Email</label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span class="iconify" data-icon="lucide:mail" data-width="18"></span>
                </div>
                <input id="email" name="email" type="email" required [(ngModel)]="userData.email"
                  class="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span class="iconify" data-icon="lucide:lock" data-width="18"></span>
                </div>
                <input id="password" name="password" type="password" required [(ngModel)]="userData.password"
                  class="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
            </div>

            <div *ngIf="error" class="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-2">
              <span class="iconify" data-icon="lucide:alert-circle" data-width="16"></span>
              {{ error }}
            </div>

            <div>
              <button type="submit" [disabled]="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50">
                <span *ngIf="loading" class="iconify animate-spin mr-2" data-icon="lucide:loader-2" data-width="18"></span>
                Créer mon compte
              </button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-xs text-gray-600">
              Déjà un compte ? 
              <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  userData: RegisterRequest = { username: '', email: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (err: any) => {
        if (err.error && err.error.details) {
          this.error = err.error.details.join(', ');
        } else if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Erreur lors de la création du compte. Veuillez réessayer.';
        }
        this.loading = false;
      }
    });
  }
}
