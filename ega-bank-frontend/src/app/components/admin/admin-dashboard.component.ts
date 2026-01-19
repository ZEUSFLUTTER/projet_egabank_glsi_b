import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ClientService, ClientDTO, CompteInfo, TransactionInfo, DashboardStats } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h1 class="ml-3 text-2xl font-bold text-gray-900">EGA Bank - Administration</h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                (click)="showHelpModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                ℹ️ Aide
              </button>
              <span class="text-sm text-gray-700">Admin: {{ currentUser?.email }}</span>
              <button 
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Navigation Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button 
                (click)="activeTab = 'dashboard'"
                [class]="activeTab === 'dashboard' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                📊 Dashboard
              </button>
              <button 
                (click)="activeTab = 'clients'"
                [class]="activeTab === 'clients' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                👥 Clients
              </button>
              <button 
                (click)="activeTab = 'transactions'"
                [class]="activeTab === 'transactions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                💳 Transactions
              </button>
            </nav>
          </div>

          <!-- Dashboard Tab -->
          <div *ngIf="activeTab === 'dashboard'">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-blue-100">Total Clients</p>
                    <p class="text-2xl font-bold">{{ dashboardStats?.totalClients || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="card bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-green-100">Total Comptes</p>
                    <p class="text-2xl font-bold">{{ dashboardStats?.totalComptes || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-yellow-100">Solde Total</p>
                    <p class="text-2xl font-bold">{{ dashboardStats?.soldeTotal | number:'1.0-0' }} FCFA</p>
                  </div>
                </div>
              </div>

              <div class="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-purple-100">Transactions</p>
                    <p class="text-2xl font-bold">{{ dashboardStats?.totalTransactions || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="card">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Clients Récents</h3>
                <div class="space-y-3">
                  <div *ngFor="let client of recentClients" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-primary-600 font-medium text-sm">
                          {{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</p>
                        <p class="text-xs text-gray-500">{{ client.email }}</p>
                      </div>
                    </div>
                    <span class="text-xs text-gray-400">{{ formatDate(client.dateCreation) }}</span>
                  </div>
                </div>
              </div>

              <div class="card">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
                <div class="space-y-3">
                  <button 
                    (click)="openCreateModal(); activeTab = 'clients'"
                    class="w-full flex items-center p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                    <svg class="h-5 w-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span class="text-primary-700 font-medium">Nouveau Client</span>
                  </button>
                  
                  <button 
                    (click)="refreshDashboard()"
                    class="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <svg class="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span class="text-green-700 font-medium">Actualiser les données</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Clients Tab -->
          <div *ngIf="activeTab === 'clients'">
            <!-- Actions Header -->
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Gestion des Clients</h2>
              <button 
                (click)="openCreateModal()"
                class="btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nouveau Client
              </button>
            </div>

            <!-- Clients Table -->
            <div class="card">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Informations</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date création</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let client of clients" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span class="text-primary-600 font-medium text-sm">
                              {{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}
                            </span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</div>
                            <div class="text-sm text-gray-500">ID: {{ client.id }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ client.email }}</div>
                        <div class="text-sm text-gray-500">{{ client.telephone }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div *ngIf="client.comptes && client.comptes.length > 0; else noAccount">
                          <div class="text-sm text-gray-900 font-mono">{{ client.comptes[0].numeroCompte }}</div>
                          <div class="text-sm text-gray-500">{{ client.comptes[0].solde | number:'1.0-0' }} FCFA</div>
                        </div>
                        <ng-template #noAccount>
                          <div class="text-sm text-gray-500">Aucun compte</div>
                        </ng-template>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ client.sexe || 'N/A' }} - {{ client.nationalite || 'N/A' }}</div>
                        <div class="text-sm text-gray-500">{{ client.adresse }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(client.dateCreation) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          (click)="viewClientDetails(client)"
                          class="text-blue-600 hover:text-blue-900">
                          👁️ Voir
                        </button>
                        <button 
                          (click)="editClient(client)"
                          class="text-primary-600 hover:text-primary-900">
                          ✏️ Modifier
                        </button>
                        <button 
                          (click)="deleteClient(client)"
                          class="text-red-600 hover:text-red-900">
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                    
                    <tr *ngIf="clients.length === 0 && !isLoadingClients">
                      <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        Aucun client trouvé
                      </td>
                    </tr>
                    
                    <tr *ngIf="isLoadingClients">
                      <td colspan="5" class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center">
                          <svg class="animate-spin h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement des clients...
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Transactions Tab -->
          <div *ngIf="activeTab === 'transactions'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Historique des Transactions</h2>
              <button 
                (click)="loadTransactions()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                🔄 Actualiser
              </button>
            </div>
            
            <div class="card">
              <div *ngIf="transactions.length > 0; else noTransactions" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let transaction of transactions" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(transaction.dateTransaction) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="getTransactionTypeClass(transaction.typeTransaction)" 
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ getTransactionTypeLabel(transaction.typeTransaction) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ transaction.montant | number:'1.0-0' }} FCFA
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ getTransactionClient(transaction) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ transaction.description || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="getStatusClass(transaction.statut)" 
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ transaction.statut }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <ng-template #noTransactions>
                <div class="text-center py-8 text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
                  <p class="mt-1 text-sm text-gray-500">Les transactions apparaîtront ici une fois que les clients commenceront à effectuer des opérations.</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Client Modal -->
    <div *ngIf="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditMode ? 'Modifier le Client' : 'Nouveau Client' }}
            </h3>
            <button 
              (click)="closeCreateModal()"
              class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form (ngSubmit)="saveClient()" #clientForm="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom *</label>
                <input 
                  type="text" 
                  id="prenom"
                  name="prenom"
                  [(ngModel)]="currentClient.prenom"
                  required
                  class="input-field mt-1">
              </div>
              <div>
                <label for="nom" class="block text-sm font-medium text-gray-700">Nom *</label>
                <input 
                  type="text" 
                  id="nom"
                  name="nom"
                  [(ngModel)]="currentClient.nom"
                  required
                  class="input-field mt-1">
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  [(ngModel)]="currentClient.email"
                  required
                  class="input-field mt-1">
              </div>
              
              <div>
                <label for="telephone" class="block text-sm font-medium text-gray-700">Téléphone *</label>
                <input 
                  type="tel" 
                  id="telephone"
                  name="telephone"
                  [(ngModel)]="currentClient.telephone"
                  required
                  class="input-field mt-1">
              </div>
              
              <div>
                <label for="dateNaissance" class="block text-sm font-medium text-gray-700">Date de naissance *</label>
                <input 
                  type="date" 
                  id="dateNaissance"
                  name="dateNaissance"
                  [(ngModel)]="currentClient.dateNaissance"
                  required
                  class="input-field mt-1">
              </div>
              
              <div>
                <label for="sexe" class="block text-sm font-medium text-gray-700">Sexe *</label>
                <select 
                  id="sexe"
                  name="sexe"
                  [(ngModel)]="currentClient.sexe"
                  required
                  class="input-field mt-1">
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              
              <div>
                <label for="nationalite" class="block text-sm font-medium text-gray-700">Nationalité *</label>
                <input 
                  type="text" 
                  id="nationalite"
                  name="nationalite"
                  [(ngModel)]="currentClient.nationalite"
                  required
                  class="input-field mt-1"
                  placeholder="Togolaise">
              </div>
              
              <div *ngIf="!isEditMode">
                <label for="typeCompte" class="block text-sm font-medium text-gray-700">Type de compte *</label>
                <select 
                  id="typeCompte"
                  name="typeCompte"
                  [(ngModel)]="currentClient.typeCompte"
                  required
                  class="input-field mt-1">
                  <option value="COURANT">Compte Courant</option>
                  <option value="EPARGNE">Compte Épargne</option>
                </select>
              </div>
              
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  {{ isEditMode ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *' }}
                </label>
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  [(ngModel)]="currentClient.password"
                  [required]="!isEditMode"
                  minlength="6"
                  class="input-field mt-1">
              </div>
            </div>
            
            <div class="mt-4">
              <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse *</label>
              <textarea 
                id="adresse"
                name="adresse"
                [(ngModel)]="currentClient.adresse"
                required
                rows="2"
                class="input-field mt-1"></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                (click)="closeCreateModal()"
                class="btn-secondary">
                Annuler
              </button>
              <button 
                type="submit"
                [disabled]="!clientForm.valid || isProcessing"
                class="btn-primary">
                
                <svg *ngIf="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                
                {{ isProcessing ? (isEditMode ? 'Modification...' : 'Création...') : (isEditMode ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div *ngIf="showDetailsModal && selectedClient" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Détails du Client - {{ selectedClient.prenom }} {{ selectedClient.nom }}
            </h3>
            <button 
              (click)="closeDetailsModal()"
              class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informations personnelles -->
            <div class="card">
              <h4 class="text-md font-medium text-gray-900 mb-3">Informations Personnelles</h4>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Nom complet:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.prenom }} {{ selectedClient.nom }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Email:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.email }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Téléphone:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.telephone }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Date de naissance:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.dateNaissance || 'Non renseignée' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Sexe:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.sexe || 'Non renseigné' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Nationalité:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.nationalite || 'Non renseignée' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Adresse:</dt>
                  <dd class="text-sm text-gray-900">{{ selectedClient.adresse }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Date de création:</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(selectedClient.dateCreation) }}</dd>
                </div>
              </dl>
              
              <!-- Informations de connexion -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 class="text-sm font-medium text-blue-900 mb-2">🔑 Informations de connexion</h5>
                <div class="space-y-1">
                  <p class="text-xs text-blue-700"><strong>Email:</strong> {{ selectedClient.email }}</p>
                  <p class="text-xs text-blue-700"><strong>Mot de passe par défaut:</strong> client123</p>
                  <p class="text-xs text-blue-600 italic">Le client peut se connecter avec ces identifiants</p>
                </div>
              </div>
            </div>

            <!-- Comptes -->
            <div class="card">
              <h4 class="text-md font-medium text-gray-900 mb-3">Comptes Bancaires</h4>
              <div *ngIf="clientComptes.length > 0; else noComptes">
                <div *ngFor="let compte of clientComptes" class="p-3 bg-gray-50 rounded-lg mb-2">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ compte.typeCompte }}</p>
                      <p class="text-xs text-gray-500">{{ compte.numeroCompte }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold text-green-600">{{ compte.solde | number:'1.0-0' }} FCFA</p>
                      <p class="text-xs text-gray-500">{{ formatDate(compte.dateCreation) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noComptes>
                <p class="text-sm text-gray-500 text-center py-4">Aucun compte trouvé</p>
              </ng-template>
            </div>
          </div>

          <!-- Transactions récentes -->
          <div class="card mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-3">Transactions Récentes</h4>
            <div *ngIf="clientTransactions.length > 0; else noTransactions">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr *ngFor="let transaction of clientTransactions.slice(0, 5)">
                      <td class="px-4 py-2 text-sm text-gray-900">{{ formatDate(transaction.dateTransaction) }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900">{{ transaction.typeTransaction }}</td>
                      <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ transaction.montant | number:'1.0-0' }} FCFA</td>
                      <td class="px-4 py-2 text-sm text-gray-500">{{ transaction.description || 'N/A' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <ng-template #noTransactions>
              <p class="text-sm text-gray-500 text-center py-4">Aucune transaction trouvée</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div *ngIf="showHelpModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              📚 Guide d'utilisation - EGA Bank Admin
            </h3>
            <button 
              (click)="showHelpModal = false"
              class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Connexion clients -->
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 class="font-medium text-blue-900 mb-2">🔑 Connexion des clients</h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p><strong>Mot de passe par défaut:</strong> <code class="bg-blue-100 px-2 py-1 rounded">client123</code></p>
                <p><strong>Email:</strong> L'email saisi lors de la création</p>
                <p class="italic">Les clients peuvent se connecter immédiatement après création</p>
              </div>
            </div>

            <!-- Gestion des comptes -->
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 class="font-medium text-green-900 mb-2">🏦 Types de comptes</h4>
              <div class="text-sm text-green-800 space-y-1">
                <p><strong>Compte Courant:</strong> Pour les opérations quotidiennes</p>
                <p><strong>Compte Épargne:</strong> Pour l'épargne et les placements</p>
                <p class="italic">Un compte est automatiquement créé lors de l'ajout d'un client</p>
              </div>
            </div>

            <!-- Champs obligatoires -->
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 class="font-medium text-yellow-900 mb-2">📝 Champs obligatoires</h4>
              <div class="text-sm text-yellow-800">
                <p>Tous les champs marqués d'un <strong>*</strong> sont obligatoires :</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Nom et Prénom</li>
                  <li>Email (unique)</li>
                  <li>Téléphone</li>
                  <li>Date de naissance</li>
                  <li>Sexe</li>
                  <li>Nationalité</li>
                  <li>Adresse</li>
                  <li>Type de compte</li>
                </ul>
              </div>
            </div>

            <!-- Actions disponibles -->
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 class="font-medium text-purple-900 mb-2">⚡ Actions disponibles</h4>
              <div class="text-sm text-purple-800 space-y-1">
                <p><strong>👁️ Voir:</strong> Consulter les détails, comptes et transactions</p>
                <p><strong>✏️ Modifier:</strong> Mettre à jour les informations client</p>
                <p><strong>🗑️ Supprimer:</strong> Supprimer définitivement un client</p>
                <p class="italic">La suppression supprime aussi tous les comptes associés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: 'dashboard' | 'clients' | 'transactions' = 'dashboard';
  
  // Dashboard data
  dashboardStats: DashboardStats | null = null;
  recentClients: ClientDTO[] = [];
  
  // Clients data
  clients: ClientDTO[] = [];
  isLoadingClients = false;
  
  // Transactions data
  transactions: TransactionInfo[] = [];
  isLoadingTransactions = false;
  
  // Modal states
  showCreateModal = false;
  showDetailsModal = false;
  showHelpModal = false;
  isEditMode = false;
  isProcessing = false;
  
  // Current client for create/edit/view
  currentClient: ClientDTO = this.getEmptyClient();
  selectedClient: ClientDTO | null = null;
  clientComptes: CompteInfo[] = [];
  clientTransactions: TransactionInfo[] = [];

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadDashboardStats();
    this.loadClients();
    this.loadTransactions();
  }

  loadDashboardStats(): void {
    this.clientService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Erreur chargement stats:', error);
      }
    });
  }

  loadClients(): void {
    this.isLoadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.recentClients = clients.slice(-5).reverse(); // 5 derniers clients
      },
      error: (error) => {
        console.error('Erreur chargement clients:', error);
        this.toastService.error('Erreur', 'Impossible de charger la liste des clients');
      },
      complete: () => {
        this.isLoadingClients = false;
      }
    });
  }

  loadTransactions(): void {
    this.isLoadingTransactions = true;
    this.clientService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Erreur chargement transactions:', error);
        this.toastService.error('Erreur', 'Impossible de charger les transactions');
      },
      complete: () => {
        this.isLoadingTransactions = false;
      }
    });
  }

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'bg-green-100 text-green-800';
      case 'RETRAIT':
        return 'bg-red-100 text-red-800';
      case 'VIREMENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOT':
        return '💰 Dépôt';
      case 'RETRAIT':
        return '💸 Retrait';
      case 'VIREMENT':
        return '🔄 Virement';
      default:
        return type;
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'VALIDE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTransactionClient(transaction: TransactionInfo): string {
    // Essayer de récupérer le nom du client depuis le compte source ou destination
    if (transaction.compteSource?.proprietaire) {
      return `${transaction.compteSource.proprietaire.prenom} ${transaction.compteSource.proprietaire.nom}`;
    } else if (transaction.compteDestination?.proprietaire) {
      return `${transaction.compteDestination.proprietaire.prenom} ${transaction.compteDestination.proprietaire.nom}`;
    }
    return 'N/A';
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.toastService.success('Actualisation', 'Données mises à jour');
  }
  openCreateModal(): void {
    this.isEditMode = false;
    this.currentClient = this.getEmptyClient();
    this.showCreateModal = true;
  }

  editClient(client: ClientDTO): void {
    this.isEditMode = true;
    this.currentClient = { ...client, password: '' }; // Don't load password
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.currentClient = this.getEmptyClient();
  }

  saveClient(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    const operation = this.isEditMode 
      ? this.clientService.updateClient(this.currentClient.id!, this.currentClient)
      : this.clientService.createClient(this.currentClient);
    
    operation.subscribe({
      next: (client) => {
        const action = this.isEditMode ? 'modifié' : 'créé';
        let message = `${client.prenom} ${client.nom} a été ${action} avec succès`;
        
        // Ajouter info sur le mot de passe pour les nouveaux clients
        if (!this.isEditMode) {
          message += `\n\n🔑 Mot de passe par défaut: client123\n📧 Email: ${client.email}`;
          // Rediriger vers l'onglet clients après création
          this.activeTab = 'clients';
        }
        
        this.toastService.success(`Client ${action}`, message);
        this.closeCreateModal();
        this.loadClients();
      },
      error: (error) => {
        const action = this.isEditMode ? 'modification' : 'création';
        let errorMessage = `Impossible de ${action === 'création' ? 'créer' : 'modifier'} le client`;
        
        if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez que l\'email n\'existe pas déjà.';
        }
        
        this.toastService.error(`Erreur de ${action}`, errorMessage);
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  deleteClient(client: ClientDTO): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.toastService.success('Client supprimé', `${client.prenom} ${client.nom} a été supprimé`);
          this.loadClients();
        },
        error: (error) => {
          this.toastService.error('Erreur de suppression', 'Impossible de supprimer le client');
        }
      });
    }
  }

  viewClientDetails(client: ClientDTO): void {
    this.selectedClient = client;
    this.showDetailsModal = true;
    
    // Load client comptes and transactions
    this.clientService.getClientComptes(client.id!).subscribe({
      next: (comptes) => {
        this.clientComptes = comptes;
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
        this.clientComptes = [];
      }
    });
    
    this.clientService.getClientTransactions(client.id!).subscribe({
      next: (transactions) => {
        this.clientTransactions = transactions;
      },
      error: (error) => {
        console.error('Erreur chargement transactions:', error);
        this.clientTransactions = [];
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedClient = null;
    this.clientComptes = [];
    this.clientTransactions = [];
  }

  // Utility methods
  getEmptyClient(): ClientDTO {
    return {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      sexe: '',
      nationalite: 'Togolaise',
      password: 'client123', // Mot de passe par défaut
      typeCompte: 'COURANT'
    };
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}