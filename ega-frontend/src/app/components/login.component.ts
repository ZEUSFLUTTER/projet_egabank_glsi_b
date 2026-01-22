import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';
import { LoginRequest } from '../models/auth.model';

@Component({
  selector: 'app-login',
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
          <p class="text-gray-300">Connexion à votre espace bancaire</p>
        </div>

        <!-- Login Card -->
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
                [(ngModel)]="credentials.username"
                name="username"
                required
                class="input-gold w-full"
                placeholder="Entrez votre nom d'utilisateur"
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
                [(ngModel)]="credentials.password"
                name="password"
                required
                class="input-gold w-full"
                placeholder="Entrez votre mot de passe"
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="btn-gold w-full flex items-center justify-center space-x-2"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading">Connexion en cours...</span>
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-300">
              Pas encore de compte ?
              <a routerLink="/register" class="text-gold-400 hover:text-gold-300 font-medium">
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Vérifier si l'utilisateur a un profil client complet
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            console.log('Utilisateur récupéré:', user);
            // Si c'est un client, vérifier si son profil est complet
            if (user.role === 'CLIENT') {
              console.log('Utilisateur CLIENT détecté, vérification du profil...');
              this.clientService.getCurrentClient().subscribe({
                next: (client) => {
                  console.log('Profil client trouvé:', client);
                  // Profil client existe, rediriger vers le dashboard et forcer le rechargement
                  this.router.navigate(['/dashboard']).then(() => {
                    // Déclencher le rechargement des données après la navigation
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('refreshData'));
                    }, 200);
                  });
                },
                error: (error) => {
                  console.log('Profil client non trouvé:', error);
                  // Profil client n'existe pas, rediriger vers le formulaire de complétion
                  this.router.navigate(['/complete-profile']);
                }
              });
            } else {
              console.log('Utilisateur ADMIN détecté');
              // Admin, rediriger vers le dashboard admin et forcer le rechargement
              this.router.navigate(['/dashboard']).then(() => {
                // Déclencher le rechargement des données après la navigation
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('refreshData'));
                }, 200);
              });
            }
          },
          error: (error) => {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            // En cas d'erreur, rediriger vers le dashboard par défaut et forcer le rechargement
            this.router.navigate(['/dashboard']).then(() => {
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('refreshData'));
              }, 200);
            });
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
