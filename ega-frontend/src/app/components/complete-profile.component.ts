import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { AuthService } from '../services/auth.service';
import { Client, ClientCreateRequest } from '../models/auth.model';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div class="relative z-10 w-full max-w-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
            Compléter votre profil
          </h1>
          <p class="text-gray-300">Veuillez compléter vos informations pour accéder à toutes les fonctionnalités</p>
        </div>

        <!-- Profile Form Card -->
        <div class="bg-dark-800 border border-dark-700 rounded-2xl p-8 backdrop-blur-sm bg-opacity-90">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Prénom *</label>
                <input type="text" [(ngModel)]="clientProfile.firstName" name="firstName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
                <input type="text" [(ngModel)]="clientProfile.lastName" name="lastName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input type="email" [(ngModel)]="clientProfile.email" name="email" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Téléphone *</label>
                <input type="tel" [(ngModel)]="clientProfile.phone" name="phone" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Adresse *</label>
                <input type="text" [(ngModel)]="clientProfile.address" name="address" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nationalité *</label>
                <input type="text" [(ngModel)]="clientProfile.nationality" name="nationality" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance *</label>
                <input type="date" [(ngModel)]="clientProfile.birthDate" name="birthDate" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Genre *</label>
                <select [(ngModel)]="clientProfile.gender" name="gender" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
                  <option value="">Sélectionner</option>
                  <option value="MALE">Homme</option>
                  <option value="FEMALE">Femme</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button type="submit" [disabled]="isLoading" class="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 disabled:opacity-50">
              <span *ngIf="!isLoading">Enregistrer et continuer</span>
              <span *ngIf="isLoading">Enregistrement en cours...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompleteProfileComponent implements OnInit {
  clientProfile: Partial<ClientCreateRequest> = {};
  errorMessage = '';
  isLoading = false;
  userEmail = '';

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'email de l'utilisateur connecté
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userEmail = user.email;
        this.clientProfile.email = this.userEmail;
        console.log('Email utilisateur récupéré:', this.userEmail);
        
        // Si pas d'email, afficher une erreur
        if (!this.userEmail) {
          this.errorMessage = 'Impossible de récupérer votre email. Veuillez vous reconnecter.';
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        this.errorMessage = 'Erreur lors de la récupération de vos informations.';
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Vérifier que tous les champs requis sont présents
    if (!this.clientProfile.firstName || !this.clientProfile.lastName || 
        !this.clientProfile.birthDate || !this.clientProfile.gender ||
        !this.clientProfile.address || !this.clientProfile.phone ||
        !this.clientProfile.email || !this.clientProfile.nationality) {
      this.errorMessage = 'Tous les champs sont requis.';
      this.isLoading = false;
      return;
    }

    // Créer l'objet ClientCreateRequest
    const clientRequest: ClientCreateRequest = {
      firstName: this.clientProfile.firstName,
      lastName: this.clientProfile.lastName,
      birthDate: this.clientProfile.birthDate,
      gender: this.clientProfile.gender as 'MALE' | 'FEMALE' | 'OTHER',
      address: this.clientProfile.address,
      phone: this.clientProfile.phone,
      email: this.clientProfile.email,
      nationality: this.clientProfile.nationality
    };

    console.log('Données client à envoyer:', clientRequest);

    // Créer le client avec les informations complétées
    this.clientService.createClient(clientRequest).subscribe({
      next: (client) => {
        console.log('Client créé avec succès:', client);
        // Rediriger vers le dashboard après la création
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du profil:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création du profil. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}

