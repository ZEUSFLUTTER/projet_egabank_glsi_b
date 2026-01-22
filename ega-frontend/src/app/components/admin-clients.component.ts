import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { Client, Account, ClientCreateRequest, AccountCreateRequest } from '../models/auth.model';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Gestion des Clients</h1>
          <p class="text-gray-400">Créez et gérez les clients du système</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 flex items-center shadow-lg" (click)="showCreateForm = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouveau Client
        </button>
      </div>

      <!-- Create Client Form -->
      <div *ngIf="showCreateForm && !editingClient" class="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
        <h2 class="text-xl font-bold text-white mb-6">Créer un nouveau client</h2>
        <form (ngSubmit)="createClient()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
              <input type="text" [(ngModel)]="newClient.firstName" name="firstName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nom</label>
              <input type="text" [(ngModel)]="newClient.lastName" name="lastName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" [(ngModel)]="newClient.email" name="email" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
              <input type="tel" [(ngModel)]="newClient.phone" name="phone" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Adresse</label>
              <input type="text" [(ngModel)]="newClient.address" name="address" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nationalité</label>
              <input type="text" [(ngModel)]="newClient.nationality" name="nationality" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance</label>
              <input type="date" [(ngModel)]="newClient.birthDate" name="birthDate" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select [(ngModel)]="newClient.gender" name="gender" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" (click)="showCreateForm = false" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Annuler
            </button>
            <button type="submit" class="px-6 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition-colors font-semibold">
              Créer le client
            </button>
          </div>
        </form>
      </div>

      <!-- Edit Client Form -->
      <div *ngIf="editingClient" class="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
        <h2 class="text-xl font-bold text-white mb-6">Modifier le client</h2>
        <form (ngSubmit)="updateClient()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
              <input type="text" [(ngModel)]="editingClient.firstName" name="editFirstName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nom</label>
              <input type="text" [(ngModel)]="editingClient.lastName" name="editLastName" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" [(ngModel)]="editingClient.email" name="editEmail" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
              <input type="tel" [(ngModel)]="editingClient.phone" name="editPhone" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Adresse</label>
              <input type="text" [(ngModel)]="editingClient.address" name="editAddress" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nationalité</label>
              <input type="text" [(ngModel)]="editingClient.nationality" name="editNationality" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance</label>
              <input type="date" [(ngModel)]="editingClient.birthDate" name="editBirthDate" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select [(ngModel)]="editingClient.gender" name="editGender" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" (click)="cancelEdit()" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Annuler
            </button>
            <button type="submit" class="px-6 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition-colors font-semibold">
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      <!-- Clients List -->
      <div class="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-700">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comptes</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-700">
              <tr *ngFor="let client of clients" class="hover:bg-dark-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ client.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ client.firstName }} {{ client.lastName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ client.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ client.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ client.accountCount || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span *ngIf="client.active" class="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 rounded-full text-xs font-semibold">Actif</span>
                  <span *ngIf="!client.active" class="px-2 py-1 bg-red-600 bg-opacity-20 text-red-400 rounded-full text-xs font-semibold">Inactif</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <!-- Bouton Modifier -->
                    <button 
                      class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" 
                      (click)="editClient(client); $event.stopPropagation()"
                      title="Modifier le client">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    
                    <!-- Bouton Créer Compte -->
                    <button 
                      class="p-2 bg-gold-600 text-black rounded-lg hover:bg-gold-700 transition-colors" 
                      (click)="showCreateAccountModal(client); $event.stopPropagation()"
                      title="Créer un compte">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 003 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </button>
                    
                    <!-- Bouton Supprimer -->
                    <button 
                      class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" 
                      (click)="deleteClient(client.id); $event.stopPropagation()"
                      title="Supprimer le client">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Account Modal -->
      <div *ngIf="showAccountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full mx-4">
          <h2 class="text-xl font-bold text-white mb-4">Créer un compte pour {{ selectedClient?.firstName }} {{ selectedClient?.lastName }}</h2>
          <form (ngSubmit)="createAccountForClient()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Type de compte</label>
              <select [(ngModel)]="newAccount.type" name="accountType" class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500" required>
                <option value="CURRENT">Compte Courant</option>
                <option value="SAVINGS">Compte Épargne</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" (click)="showAccountModal = false; selectedClient = null" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Annuler
              </button>
              <button type="submit" class="px-6 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition-colors font-semibold">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminClientsComponent implements OnInit {
  clients: Client[] = [];
  showCreateForm = false;
  editingClient: Client | null = null;
  newClient: Partial<Client> = {};
  showAccountModal = false;
  selectedClient: Client | null = null;
  newAccount: Partial<Account> = { type: 'CURRENT' };

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }

  createClient(): void {
    // Créer l'objet ClientCreateRequest avec validation
    const clientRequest: ClientCreateRequest = {
      firstName: this.newClient.firstName || '',
      lastName: this.newClient.lastName || '',
      birthDate: this.newClient.birthDate || '',
      gender: (this.newClient.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
      address: this.newClient.address || '',
      phone: this.newClient.phone || '',
      email: this.newClient.email || '',
      nationality: this.newClient.nationality || ''
    };

    this.clientService.createClient(clientRequest).subscribe({
      next: (client: Client) => {
        this.clients.push(client);
        this.showCreateForm = false;
        this.newClient = {};
        alert('Client créé avec succès !');
        this.loadClients(); // Recharger pour obtenir les nouvelles données
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du client:', error);
        alert('Erreur lors de la création du client');
      }
    });
  }

  editClient(client: Client): void {
    this.editingClient = { ...client };
    this.showCreateForm = false;
  }

  cancelEdit(): void {
    this.editingClient = null;
  }

  updateClient(): void {
    if (!this.editingClient) return;
    
    this.clientService.updateClient(this.editingClient.id, this.editingClient).subscribe({
      next: (updatedClient: Client) => {
        const index = this.clients.findIndex(c => c.id === updatedClient.id);
        if (index !== -1) {
          this.clients[index] = updatedClient;
        }
        this.editingClient = null;
        alert('Client mis à jour avec succès !');
        this.loadClients(); // Recharger pour obtenir les nouvelles données
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour du client:', error);
        alert('Erreur lors de la mise à jour du client');
      }
    });
  }

  deleteClient(clientId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c.id !== clientId);
          alert('Client supprimé avec succès !');
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression du client:', error);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  showCreateAccountModal(client: Client): void {
    this.selectedClient = client;
    this.showAccountModal = true;
    this.newAccount = { type: 'CURRENT', ownerId: client.id };
  }

  createAccountForClient(): void {
    if (!this.selectedClient) return;

    const accountData: AccountCreateRequest = {
      ownerId: this.selectedClient.id,
      type: this.newAccount.type || 'CURRENT',
      initialBalance: 0
    };

    this.accountService.createAccount(accountData).subscribe({
      next: (account: Account) => {
        alert('Compte créé avec succès !');
        this.showAccountModal = false;
        this.selectedClient = null;
        this.newAccount = { type: 'CURRENT' };
        this.loadClients(); // Recharger pour mettre à jour le nombre de comptes
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du compte:', error);
        alert('Erreur lors de la création du compte');
      }
    });
  }
}
