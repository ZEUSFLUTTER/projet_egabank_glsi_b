import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
        <p class="text-gray-400 mt-2">Chargement du profil...</p>
      </div>

      <!-- Content -->
      <div *ngIf="!loading">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Mon Profile</h1>
            <p class="text-gray-400">Gérez vos informations personnelles et préférences</p>
          </div>
          <button (click)="saveProfile()" 
                  class="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 flex items-center shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Sauvegarder
          </button>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 text-center">
            <!-- Avatar -->
            <div class="relative mb-6">
              <div class="w-32 h-32 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-4xl font-bold text-black">{{ getInitials() }}</span>
              </div>
              <button class="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors">
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>

            <h2 class="text-2xl font-bold text-white mb-2">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="text-gold-400 mb-4">{{ profile.email }}</p>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-dark-700">
              <div>
                <p class="text-2xl font-bold text-white">{{ accountsCount }}</p>
                <p class="text-sm text-gray-400">Comptes</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ transactionsCount }}</p>
                <p class="text-sm text-gray-400">Transactions</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 mt-6">
            <h3 class="text-lg font-semibold text-white mb-4">Actions rapides</h3>
            <div class="space-y-3">
              <button class="w-full flex items-center px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-gold-600 hover:text-black transition-all duration-200">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Changer le mot de passe
              </button>
              <button class="w-full flex items-center px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-gold-600 hover:text-black transition-all duration-200">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Télécharger relevé
              </button>
              <button class="w-full flex items-center px-4 py-3 bg-dark-700 text-white rounded-lg hover:bg-gold-600 hover:text-black transition-all duration-200">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Support client
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <h3 class="text-xl font-semibold text-white mb-6">Informations personnelles</h3>
            
            <form class="space-y-6">
              <!-- Personal Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Prénom</label>
                  <input type="text" [(ngModel)]="profile.firstName" name="firstName"
                         class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Nom</label>
                  <input type="text" [(ngModel)]="profile.lastName" name="lastName"
                         class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" [(ngModel)]="profile.email" name="email"
                       class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                  <input type="tel" [(ngModel)]="profile.phone" name="phone"
                         class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Date de naissance</label>
                  <input type="date" [(ngModel)]="profile.birthDate" name="birthDate"
                         class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                </div>
              </div>

              <!-- Address -->
              <div class="pt-6 border-t border-dark-700">
                <h4 class="text-lg font-semibold text-white mb-4">Adresse</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Adresse complète</label>
                    <textarea [(ngModel)]="profile.address" name="address" rows="3"
                           class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Nationalité</label>
                      <input type="text" [(ngModel)]="profile.nationality" name="nationality"
                             class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                      <select [(ngModel)]="profile.gender" name="gender"
                              class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                        <option value="MALE">Masculin</option>
                        <option value="FEMALE">Féminin</option>
                        <option value="OTHER">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preferences -->
              <div class="pt-6 border-t border-dark-700">
                <h4 class="text-lg font-semibold text-white mb-4">Préférences</h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-white font-medium">Notifications par email</p>
                      <p class="text-sm text-gray-400">Recevoir des notifications pour les transactions</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" [(ngModel)]="profile.preferences.emailNotifications" name="emailNotifications" class="sr-only peer">
                      <div class="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-white font-medium">Notifications SMS</p>
                      <p class="text-sm text-gray-400">Recevoir des SMS pour les transactions importantes</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" [(ngModel)]="profile.preferences.smsNotifications" name="smsNotifications" class="sr-only peer">
                      <div class="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-white font-medium">Authentification à deux facteurs</p>
                      <p class="text-sm text-gray-400">Sécurité renforcée pour votre compte</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" [(ngModel)]="profile.preferences.twoFactorAuth" name="twoFactorAuth" class="sr-only peer">
                      <div class="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Security Section -->
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 mt-6">
            <h3 class="text-xl font-semibold text-white mb-6">Sécurité</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-white font-medium">Mot de passe</p>
                    <p class="text-sm text-gray-400">Dernière modification il y a 30 jours</p>
                  </div>
                </div>
                <button class="px-4 py-2 bg-gold-600 text-black rounded-lg font-medium hover:bg-gold-500 transition-colors">
                  Modifier
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gold-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-white font-medium">Sessions actives</p>
                    <p class="text-sm text-gray-400">2 appareils connectés</p>
                  </div>
                </div>
                <button class="px-4 py-2 bg-dark-600 text-gray-300 rounded-lg font-medium hover:bg-dark-500 transition-colors">
                  Gérer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  profile: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    nationality: '',
    gender: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      twoFactorAuth: true
    }
  };

  userAccount: any = null;
  clientData: any = null;
  accountsCount = 0;
  transactionsCount = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    
    // Charger les informations de l'utilisateur connecté
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userAccount = user;
        this.profile.email = user.email;
        
        // Si c'est un client, charger ses données client
        if (user.role === 'CLIENT') {
          this.clientService.getCurrentClient().subscribe({
            next: (client) => {
              this.clientData = client;
              this.profile = {
                ...this.profile,
                firstName: client.firstName,
                lastName: client.lastName,
                phone: client.phone,
                birthDate: client.birthDate,
                address: client.address,
                nationality: client.nationality,
                gender: client.gender
              };
              
              // Charger les comptes et transactions
              this.loadAccountsAndTransactions();
            },
            error: (error) => {
              console.error('Erreur lors du chargement des données client:', error);
              this.loading = false;
            }
          });
        } else {
          // Pour les admins, utiliser les données de base
          this.profile.firstName = user.username;
          this.profile.lastName = 'Admin';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        this.loading = false;
      }
    });
  }

  loadAccountsAndTransactions(): void {
    // Charger les comptes
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accountsCount = accounts.length;
        
        // Charger les transactions
        this.transactionService.getTransactions().subscribe({
          next: (transactions) => {
            this.transactionsCount = transactions.length;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des transactions:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.loading = false;
      }
    });
  }

  getInitials(): string {
    return (this.profile.firstName.charAt(0) + this.profile.lastName.charAt(0)).toUpperCase();
  }

  saveProfile(): void {
    if (this.clientData && this.userAccount.role === 'CLIENT') {
      // Mettre à jour les données client
      const updatedClient = {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        phone: this.profile.phone,
        birthDate: this.profile.birthDate,
        address: this.profile.address,
        nationality: this.profile.nationality,
        gender: this.profile.gender
      };
      
      this.clientService.updateClient(this.clientData.id, updatedClient).subscribe({
        next: (client) => {
          console.log('Profil mis à jour avec succès:', client);
          alert('Profil mis à jour avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          alert('Erreur lors de la mise à jour du profil');
        }
      });
    } else {
      console.log('Sauvegarde du profil admin:', this.profile);
      alert('Fonctionnalité de sauvegarde admin en cours de développement');
    }
  }
}