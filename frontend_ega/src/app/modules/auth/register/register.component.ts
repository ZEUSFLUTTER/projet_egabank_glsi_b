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
        <p class="mt-2 text-sm text-gray-600">Ouvrez votre compte en ligne</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div class="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-xl sm:px-10">
          <form (submit)="onSubmit()" class="space-y-4">
            
            <div class="grid grid-cols-2 gap-4">
               <div>
                <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
                <input id="nom" name="nom" type="text" required [(ngModel)]="userData.nom"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
              <div>
                <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
                <input id="prenom" name="prenom" type="text" required [(ngModel)]="userData.prenom"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="dateNaissance" class="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input id="dateNaissance" name="dateNaissance" type="date" required [(ngModel)]="userData.dateNaissance"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
              </div>
              <div>
                <label for="sexe" class="block text-sm font-medium text-gray-700">Sexe</label>
                <select id="sexe" name="sexe" required [(ngModel)]="userData.sexe"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>

            <div>
              <label for="nationalite" class="block text-sm font-medium text-gray-700">Nationalité</label>
              <input id="nationalite" name="nationalite" type="text" required [(ngModel)]="userData.nationalite"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
            </div>

            <div>
              <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse complète</label>
              <textarea id="adresse" name="adresse" rows="2" required [(ngModel)]="userData.adresse"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"></textarea>
            </div>

            <div>
              <label for="telephone" class="block text-sm font-medium text-gray-700">Téléphone</label>
              <input id="telephone" name="telephone" type="tel" required [(ngModel)]="userData.telephone"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
            </div>

            <div class="relative py-2">
                <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center">
                    <span class="bg-white px-2 text-sm text-gray-500">Identifiants de connexion</span>
                </div>
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input id="username" name="username" type="text" required [(ngModel)]="userData.username"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Adresse Email</label>
              <input id="email" name="email" type="email" required [(ngModel)]="userData.email"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input id="password" name="password" type="password" required [(ngModel)]="userData.password"
                  class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm">
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
  userData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M',
    adresse: '',
    telephone: '',
    nationalite: ''
  };
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
      next: (response) => {
        if (response.role === 'ROLE_ADMIN') {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/client-dashboard'], { replaceUrl: true });
        }
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
