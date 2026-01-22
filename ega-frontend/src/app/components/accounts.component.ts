import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { DashboardService, FinancialStats } from '../services/dashboard.service';
import { ClientService } from '../services/client.service';
import { Account, AccountCreateRequest } from '../models/auth.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ isAdmin ? 'Gestion des Comptes' : 'Mes Comptes' }}</h1>
          <p class="text-gray-400">{{ isAdmin ? 'Gérez tous les comptes bancaires' : 'Gérez vos comptes bancaires' }}</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 flex items-center shadow-lg" (click)="toggleCreateForm()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouveau Compte
        </button>
      </div>

      <!-- Formulaire de création de compte -->
      <div *ngIf="showCreateForm" class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Créer un nouveau compte</h3>
        <form (ngSubmit)="submitCreateAccount()" class="space-y-4">
          <div *ngIf="isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Client</label>
              <select [(ngModel)]="newAccount.ownerId" name="ownerId" required class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none">
                <option value="">Sélectionner un client</option>
                <option *ngFor="let client of clients" [value]="client.id">
                  {{ client.firstName }} {{ client.lastName }} ({{ client.email }})
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Type de compte</label>
              <select [(ngModel)]="newAccount.type" name="type" required class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none">
                <option value="CURRENT">Compte Courant</option>
                <option value="SAVINGS">Compte Épargne</option>
              </select>
            </div>
            
            <div>
              <label class="block text-gray-400 text-sm mb-2">Solde initial (optionnel)</label>
              <input type="number" [(ngModel)]="newAccount.initialBalance" name="initialBalance" min="0" step="0.01" 
                     class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none" 
                     placeholder="0.00">
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button type="submit" class="px-6 py-2 bg-gold-600 text-black rounded-lg font-semibold hover:bg-gold-500 transition-all duration-200">
              Créer le compte
            </button>
            <button type="button" (click)="cancelCreateForm()" class="px-6 py-2 bg-dark-700 text-white rounded-lg font-semibold hover:bg-dark-600 transition-all duration-200">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gold-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Solde Total</p>
          <p class="text-2xl font-bold text-white">$ {{ totalBalance.toLocaleString() }}</p>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 003 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Comptes Actifs</p>
          <p class="text-2xl font-bold text-white">{{ accounts.length }}</p>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Revenus ce mois</p>
          <p class="text-2xl font-bold text-white">$ {{ monthlyIncome.toLocaleString() }}</p>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Dépenses ce mois</p>
          <p class="text-2xl font-bold text-white">$ {{ monthlyExpenses.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Accounts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let account of accounts" 
             class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-4 hover:border-gold-600 transition-all duration-200 group">
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-gold-600 to-gold-400 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 003 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-white">{{ getAccountTypeName(account.type) }}</h3>
                <p class="text-xs text-gray-400 font-mono">{{ account.accountNumber.slice(-8) }}</p>
              </div>
            </div>
            <span class="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full border border-green-600">
              ACTIF
            </span>
          </div>

          <!-- Balance -->
          <div class="mb-4">
            <p class="text-gray-400 text-xs mb-1">Solde disponible</p>
            <p class="text-xl font-bold text-white">$ {{ account.balance.toLocaleString() }}</p>
          </div>

          <!-- Account Details -->
          <div class="space-y-2 mb-6 pb-6 border-b border-dark-700">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">IBAN</span>
              <span class="text-white font-mono">{{ account.accountNumber }}</span>
            </div>
            <div class="flex justify-between text-sm" *ngIf="account.type === 'CURRENT'">
              <span class="text-gray-400">Découvert autorisé</span>
              <span class="text-white">$ {{ account.overdraft || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm" *ngIf="account.type === 'SAVINGS'">
              <span class="text-gray-400">Taux d'intérêt</span>
              <span class="text-green-400">{{ account.interestRate || 0 }}%</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-3 gap-1">
            <button class="px-2 py-1 bg-dark-700 text-white rounded-md hover:bg-blue-600 transition-all duration-200 text-xs font-medium flex items-center justify-center" (click)="viewAccountDetails(account.id); $event.stopPropagation()">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Détails
            </button>
            <button class="px-2 py-1 bg-dark-700 text-white rounded-md hover:bg-purple-600 transition-all duration-200 text-xs font-medium flex items-center justify-center" (click)="printAccountStatement(account.id); $event.stopPropagation()">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Relevé
            </button>
            <button class="px-2 py-1 bg-dark-700 text-white rounded-md hover:bg-green-600 transition-all duration-200 text-xs font-medium flex items-center justify-center" (click)="editAccount(account.id); $event.stopPropagation()">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Modifier
            </button>
            <button class="px-2 py-1 bg-dark-700 text-white rounded-md hover:bg-red-600 transition-all duration-200 text-xs font-medium flex items-center justify-center" (click)="deleteAccount(account.id); $event.stopPropagation()">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        <!-- Add New Account Card -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border-2 border-dashed border-dark-700 rounded-2xl p-6 hover:border-gold-600 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group" (click)="createNewAccount()">
          <div class="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-600 transition-all duration-200">
            <svg class="w-8 h-8 text-gray-400 group-hover:text-black transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Créer un nouveau compte</h3>
          <p class="text-gray-400 text-sm text-center">Ouvrez un compte courant ou épargne</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AccountsComponent implements OnInit, AfterViewInit, OnDestroy {
  accounts: any[] = [];
  clients: any[] = [];
  totalBalance = 0;
  monthlyIncome = 0;
  monthlyExpenses = 0;
  isAdmin = false;
  currentClientId: number | null = null;
  
  // Formulaire de création de compte
  showCreateForm = false;
  newAccount = {
    ownerId: null as number | null,
    type: 'CURRENT' as string,
    initialBalance: 0
  };

  constructor(
    private accountService: AccountService, 
    private authService: AuthService,
    private dashboardService: DashboardService,
    private clientService: ClientService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkUserRole();
    }
  }

  ngAfterViewInit(): void {
    // Forcer le rechargement des données quand on arrive sur la page
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.refreshAllData();
      }, 100);
      
      // Écouter l'événement de rechargement global
      window.addEventListener('refreshData', () => {
        this.refreshAllData();
      });
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les event listeners
    window.removeEventListener('refreshData', () => {});
  }

  refreshAllData(): void {
    this.checkUserRole();
  }

  checkUserRole(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (currentUser) {
          // Vérifier si l'utilisateur a le rôle ADMIN (cohérent avec les autres composants)
          this.isAdmin = currentUser.role === 'ADMIN';
          
          // Récupérer l'ID du client si c'est un client
          if (!this.isAdmin && currentUser.email) {
            this.getClientIdByEmail(currentUser.email);
          } else {
            // Charger les comptes selon le rôle
            this.loadAccountsByRole();
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        this.isAdmin = false;
        // Même en cas d'erreur, essayer de charger les données
        this.loadAccountsByRole();
      }
    });
  }

  loadAccountsByRole(): void {
    if (this.isAdmin) {
      // Admin: charger tous les comptes et tous les clients
      this.accountService.getAccountsAll().subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.calculateTotalBalance();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des comptes (admin):', error);
        }
      });
      
      // Charger la liste des clients pour le formulaire
      this.clientService.getAllClients().subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des clients:', error);
        }
      });
    } else {
      // Client: charger ses propres comptes et ses stats financières
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.calculateTotalBalance();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des comptes (client):', error);
        }
      });
      
      // Charger les stats financières pour le client
      this.dashboardService.getFinancialStats().subscribe({
        next: (stats: FinancialStats) => {
          this.monthlyIncome = stats.monthlyIncome;
          this.monthlyExpenses = stats.monthlyExpenses;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des stats financières:', error);
        }
      });
    }
  }

  getClientIdByEmail(email: string): void {
    // Récupérer l'ID du client via l'API
    this.clientService.getCurrentClient().subscribe({
      next: (client) => {
        if (client) {
          this.currentClientId = client.id;
          console.log('ID du client connecté:', this.currentClientId);
        }
        // Charger les comptes après avoir récupéré l'ID du client
        this.loadAccountsByRole();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du client:', error);
        // Charger les comptes même en cas d'erreur
        this.loadAccountsByRole();
      }
    });
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateTotalBalance();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
      }
    });
  }

  createNewAccount(): void {
    this.toggleCreateForm();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newAccount = {
      ownerId: null,
      type: 'CURRENT',
      initialBalance: 0
    };
  }

  cancelCreateForm(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  submitCreateAccount(): void {
    if (this.isAdmin && !this.newAccount.ownerId) {
      alert('Veuillez sélectionner un client');
      return;
    }

    const accountData: AccountCreateRequest = {
      type: this.newAccount.type || 'CURRENT',
      ownerId: this.isAdmin ? this.newAccount.ownerId : this.currentClientId,
      initialBalance: this.isAdmin ? (this.newAccount.initialBalance || 0) : 0
    };

    console.log('Données compte à envoyer:', accountData);

    // Vérifier que l'ownerId est défini
    if (!accountData.ownerId) {
      alert('Erreur: Impossible de déterminer le propriétaire du compte. Veuillez réessayer.');
      return;
    }

    this.accountService.createAccount(accountData).subscribe({
      next: (account) => {
        console.log('Compte créé avec succès:', account);
        alert('Compte créé avec succès !');
        this.loadAccountsByRole();
        this.cancelCreateForm();
      },
      error: (error) => {
        console.error('Erreur lors de la création du compte:', error);
        this.handleAccountCreationError(error);
      }
    });
  }

  createAccountForClient(): void {
    // Logique pour créer un compte pour un client spécifique (admin)
    const clientId = prompt('Entrez l\'ID du client pour lequel créer un compte:');
    const accountType = prompt('Type de compte (CURRENT ou SAVINGS):', 'CURRENT');
    
    if (clientId && accountType && (accountType === 'CURRENT' || accountType === 'SAVINGS')) {
      const newAccount: AccountCreateRequest = {
        ownerId: parseInt(clientId),
        type: accountType,
        initialBalance: 0
      };
      
      this.accountService.createAccount(newAccount).subscribe({
        next: (account) => {
          console.log('Compte créé avec succès:', account);
          alert('Compte créé avec succès !');
          // Recharger les comptes
          this.loadAccountsByRole();
        },
        error: (error) => {
          console.error('Erreur lors de la création du compte:', error);
          this.handleAccountCreationError(error);
        }
      });
    }
  }

  handleAccountCreationError(error: any): void {
    console.error('Status:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('Détails de l\'erreur:', error.error);
    
    if (error.status === 500 && error.error?.message?.includes('Client not found')) {
      alert('Erreur : Aucun client trouvé avec cet ID. Veuillez créer un client d\'abord.');
    } else if (error.status === 500 && error.error?.message?.includes('Country code is not supported')) {
      alert('Erreur : Configuration du code pays incorrecte. Veuillez contacter l\'administrateur.');
    } else if (error.status === 403) {
      alert('Erreur : Vous n\'avez pas les permissions nécessaires pour créer un compte.');
    } else if (error.status === 401) {
      alert('Erreur : Vous devez être connecté pour créer un compte.');
    } else {
      alert('Erreur lors de la création du compte. Veuillez réessayer plus tard.');
    }
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    // TODO: Calculer les revenus et dépenses mensuels à partir des transactions
    this.calculateMonthlyStats();
  }

  calculateMonthlyStats(): void {
    // Pour l'instant, valeurs par défaut
    // TODO: Implémenter le calcul basé sur les transactions du mois
    this.monthlyIncome = 0;
    this.monthlyExpenses = 0;
  }

  getAccountTypeName(type: string): string {
    const types: any = {
      'CURRENT': 'Compte Courant',
      'SAVINGS': 'Compte Épargne'
    };
    return types[type] || type;
  }

  editAccount(accountId: number): void {
    console.log('Modifier le compte:', accountId);
    // TODO: Implémenter la modification de compte
    alert('Fonctionnalité de modification en cours de développement');
  }

  deleteAccount(accountId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.')) {
      this.accountService.deleteAccount(accountId).subscribe({
        next: () => {
          console.log('Compte supprimé avec succès');
          alert('Compte supprimé avec succès !');
          this.loadAccountsByRole();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du compte:', error);
          alert('Erreur lors de la suppression du compte. Veuillez réessayer.');
        }
      });
    }
  }

  viewAccountDetails(accountId: number): void {
    console.log('Navigation vers les détails du compte:', accountId);
    // Utiliser setTimeout pour s'assurer que l'événement de clic est complètement traité
    setTimeout(() => {
      this.router.navigate(['/account-details', accountId]).then(
        (success) => {
          if (success) {
            console.log('Navigation réussie vers account-details');
          } else {
            console.error('Échec de la navigation vers account-details');
            // Fallback: essayer avec window.location
            window.location.href = `/account-details/${accountId}`;
          }
        }
      ).catch(error => {
        console.error('Erreur lors de la navigation:', error);
        // Fallback: essayer avec window.location
        window.location.href = `/account-details/${accountId}`;
      });
    }, 0);
  }

  printAccountStatement(accountId: number): void {
    console.log('Impression du relevé pour le compte:', accountId);
    
    if (!accountId) {
      console.error('ID de compte manquant pour l\'impression du relevé');
      alert('Erreur: ID de compte manquant');
      return;
    }

    try {
      // Ouvrir le relevé dans une nouvelle fenêtre pour impression
      const printUrl = `http://localhost:8080/api/accounts/${accountId}/statement?print=true`;
      const printWindow = window.open(printUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!printWindow) {
        // Fallback si le popup est bloqué - demander à l'utilisateur
        const userConfirm = confirm('Les popups sont bloqués. Voulez-vous ouvrir le relevé dans un nouvel onglet ?');
        if (userConfirm) {
          window.open(printUrl, '_blank');
        }
      } else {
        // Optionnel: fermer la fenêtre après impression
        printWindow.onafterprint = () => {
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du relevé:', error);
      alert('Erreur lors de l\'ouverture du relevé. Veuillez réessayer.');
    }
  }
}
