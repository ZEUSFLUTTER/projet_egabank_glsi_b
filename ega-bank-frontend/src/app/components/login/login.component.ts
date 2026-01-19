import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EGA Bank
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>
        
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                [(ngModel)]="credentials.email"
                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                placeholder="Adresse email">
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                [(ngModel)]="credentials.password"
                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                placeholder="Mot de passe">
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              [disabled]="isLoading || !loginForm.valid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
              
              <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Comptes de test :<br>
              <span class="font-mono text-xs">admin@ega.tg / admin123</span><br>
              <span class="font-mono text-xs">client@ega.tg / client123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    console.log('🔐 Tentative de connexion avec:', this.credentials);
    this.isLoading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Connexion réussie:', response);
        this.toastService.success('Connexion réussie', `Bienvenue ${response.email}`);
        
        // Redirection selon le rôle
        if (response.premiereConnexion && response.role === 'CLIENT') {
          console.log('🔄 Redirection vers /change-password (première connexion)');
          this.router.navigate(['/change-password']);
        } else if (response.role === 'ADMIN') {
          console.log('🔄 Redirection vers /admin');
          this.router.navigate(['/admin']);
        } else {
          console.log('🔄 Redirection vers /dashboard');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('❌ Erreur de connexion:', error);
        this.toastService.error('Erreur de connexion', 'Email ou mot de passe incorrect');
        this.isLoading = false;
      },
      complete: () => {
        console.log('🏁 Requête terminée');
        this.isLoading = false;
      }
    });
  }
}