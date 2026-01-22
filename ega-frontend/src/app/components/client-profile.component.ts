import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { AccountService } from '../services/account.service';
import { Client, Account, AccountCreateRequest } from '../models/auth.model';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p class="text-gray-400">Gérez vos informations personnelles et vos comptes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Client Profile Form -->
        <div class="lg:col-span-1">
          <div class="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h2 class="text-xl font-bold text-white mb-6">Mes Informations</h2>
            
            <!-- Profile Completion Alert -->
            <div *ngIf="!isProfileComplete" class="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h.138V9a2 2 0 012-2h6.938a2 2 0 012 2v6.138a2 2 0 01-2.138 2.138H9a2 2 0 00-2 2V9z"></path>
                </svg>
                <div>
                  <p class="text-yellow-300 font-semibold">Profil incomplet</p>
                  <p class="text-yellow-400 text-sm">Veuillez compléter vos informations pour accéder à toutes les fonctionnalités</p>
                </div>
              </div>
            </div>

            <form (ngSubmit)="updateProfile()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                <input type="text" [(ngModel)]="clientProfile.firstName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input type="text" [(ngModel)]="clientProfile.lastName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" [(ngModel)]="clientProfile.email" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" disabled>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                <input type="tel" [(ngModel)]="clientProfile.phone" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Adresse</label>
                <input type="text" [(ngModel)]="clientProfile.address" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nationalité</label>
                <input type="text" [(ngModel)]="clientProfile.nationality" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance</label>
                <input type="date" [(ngModel)]="clientProfile.birthDate" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <select [(ngModel)]="clientProfile.gender" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" [disabled]="!isEditingProfile">
                  <option value="MALE">Homme</option>
                  <option value="FEMALE">Femme</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div class="flex justify-end space-x-4 mt-6">
                <button type="button" *ngIf="!isEditingProfile" (click)="enableEditProfile()" class="px-6 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition-colors font-semibold">
                  Modifier
                </button>
                <button type="button" *ngIf="isEditingProfile" (click)="cancelEditProfile()" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Annuler
                </button>
                <button type="submit" *ngIf="isEditingProfile" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Accounts Section -->
        <div class="lg:col-span-2">
          <div class="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-white">Mes Comptes</h2>
              <button class="px-4 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition-colors text-sm font-semibold" (click)="createNewAccount()">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nouveau Compte
              </button>
            </div>

            <!-- Account Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-xl p-4">
                <div class="text-center">
                  <p class="text-gray-400 text-sm mb-1">Total Comptes</p>
                  <p class="text-2xl font-bold text-white">{{ accounts.length }}</p>
                </div>
              </div>
              <div class="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-xl p-4">
                <div class="text-center">
                  <p class="text-gray-400 text-sm mb-1">Solde Total</p>
                  <p class="text-2xl font-bold text-white">$ {{ totalBalance.toLocaleString() }}</p>
                </div>
              </div>
              <div class="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-xl p-4">
                <div class="text-center">
                  <p class="text-gray-400 text-sm mb-1">Comptes Actifs</p>
                  <p class="text-2xl font-bold text-green-400">{{ activeAccounts }}</p>
                </div>
              </div>
            </div>

            <!-- Accounts List -->
            <div class="space-y-4">
              <div *ngFor="let account of accounts" class="bg-dark-700 border border-dark-600 rounded-xl p-4 hover:border-gold-500 transition-all duration-200">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-lg font-semibold text-white">{{ getAccountTypeName(account.type) }}</h3>
                    <p class="text-sm text-gray-400">{{ account.accountNumber }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm" (click)="editAccount(account)">
                      Modifier
                    </button>
                    <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm" (click)="deleteAccount(account.id)">
                      Supprimer
                    </button>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Solde:</span>
                  <span class="text-xl font-bold text-white">$ {{ account.balance.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Créé le:</span>
                  <span class="text-sm text-gray-300">{{ formatDate(account.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ClientProfileComponent implements OnInit {
  clientProfile: Partial<Client> = {};
  accounts: Account[] = [];
  totalBalance = 0;
  activeAccounts = 0;
  isProfileComplete = false;
  isEditingProfile = false;

  constructor(
    private clientService: ClientService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadClientProfile();
    this.loadAccounts();
  }

  loadClientProfile(): void {
    this.clientService.getCurrentClient().subscribe({
      next: (client) => {
        this.clientProfile = client || {};
        this.checkProfileCompleteness();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        // En cas d'erreur, initialiser avec un profil vide à compléter
        this.clientProfile = {};
        this.isProfileComplete = false;
      }
    });
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
      }
    });
  }

  checkProfileCompleteness(): void {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'nationality', 'birthDate', 'gender'];
    this.isProfileComplete = requiredFields.every(field => 
      this.clientProfile[field as keyof Client] && this.clientProfile[field as keyof Client] !== ''
    );
  }

  enableEditProfile(): void {
    this.isEditingProfile = true;
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.loadClientProfile(); // Recharger les données originales
  }

  updateProfile(): void {
    this.clientService.updateClient(this.clientProfile.id!, this.clientProfile).subscribe({
      next: (updatedClient) => {
        this.clientProfile = updatedClient;
        this.isEditingProfile = false;
        this.checkProfileCompleteness();
        alert('Profil mis à jour avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        alert('Erreur lors de la mise à jour du profil');
      }
    });
  }

  createNewAccount(): void {
    if (!this.isProfileComplete) {
      alert('Veuillez compléter votre profil avant de créer un compte.');
      return;
    }

    const newAccount: AccountCreateRequest = {
      ownerId: this.clientProfile.id || null,
      type: 'CURRENT',
      initialBalance: 0
    };

    this.accountService.createAccount(newAccount).subscribe({
      next: (account) => {
        this.accounts.push(account);
        this.calculateStats();
        alert('Compte créé avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la création du compte:', error);
        alert('Erreur lors de la création du compte');
      }
    });
  }

  editAccount(account: Account): void {
    console.log('Modifier le compte:', account);
    // Implémenter la logique de modification de compte
  }

  deleteAccount(accountId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.accountService.deleteAccount(accountId).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(a => a.id !== accountId);
          this.calculateStats();
          alert('Compte supprimé avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du compte:', error);
          alert('Erreur lors de la suppression du compte');
        }
      });
    }
  }

  calculateStats(): void {
    this.totalBalance = this.accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    this.activeAccounts = this.accounts.length;
  }

  getAccountTypeName(type: string): string {
    const types: any = {
      'CURRENT': 'Compte Courant',
      'SAVINGS': 'Compte Épargne'
    };
    return types[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}
