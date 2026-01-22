import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Account, Transaction } from '../models/auth.model';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { DashboardService } from '../services/dashboard.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p class="text-gray-400">Vue d'ensemble</p>
        </div>
        <button (click)="refreshDashboard()" class="px-4 py-2 bg-gold-600 text-black rounded-lg font-semibold hover:bg-gold-500 transition-colors">
          Actualiser
        </button>
      </div>

      <div *ngIf="isLoading" class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white text-lg">Chargement...</p>
        </div>
      </div>

      <div *ngIf="!isLoading">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Solde Total</p>
            <p class="text-2xl font-bold text-white">\${{ totalBalance.toLocaleString() }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Comptes</p>
            <p class="text-2xl font-bold text-white">{{ stats.accounts }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Revenus</p>
            <p class="text-2xl font-bold text-white">\${{ stats.earnings.toLocaleString() }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Dépenses</p>
            <p class="text-2xl font-bold text-white">\${{ stats.expenses.toLocaleString() }}</p>
          </div>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h3 class="text-white font-semibold text-lg mb-6">Transactions Récentes</h3>
          
          <div *ngIf="recentTransactions.length > 0" class="space-y-3">
            <div *ngFor="let transaction of recentTransactions" 
                 class="flex items-center justify-between p-4 bg-dark-800 bg-opacity-50 rounded-xl">
              <div>
                <p class="text-white font-medium">{{ transaction.category }}</p>
                <p class="text-gray-400 text-sm">{{ transaction.date | date:'d MMM, h:mm a' }}</p>
              </div>
              <div class="text-right">
                <p class="text-white font-semibold">
                  {{ transaction.amount > 0 ? '+' : '' }}\${{ getAbsoluteValue(transaction.amount) }}
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="recentTransactions.length === 0" class="text-center py-8">
            <p class="text-gray-400">Aucune transaction récente</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser = 'George';
  accounts: Account[] = [];
  totalBalance = 0;
  isAdmin = false;
  recentClients: any[] = [];
  isLoading = true;
  
  // Initialiser toutes les stats à 0 au lieu de valeurs par défaut
  stats = {
    clients: 0,
    sales: 0,
    performance: 0,
    transactions: 0,
    accounts: 0,
    earnings: 0,
    expenses: 0,
    totalClients: 0,
    activeClients: 0,
    totalAccounts: 0,
    activeAccounts: 0,
    newAccountsThisMonth: 0
  };
  
  // Pas de transactions par défaut - sera chargé depuis l'API
  recentTransactions: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private dashboardService: DashboardService,
    private clientService: ClientService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Forcer le chargement immédiat des données
      this.loadUserAndDashboard();
      
      // Écouter l'événement de rechargement global
      window.addEventListener('refreshData', () => {
        this.loadUserAndDashboard();
      });
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les event listeners
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('refreshData', () => {});
    }
  }

  loadUserAndDashboard(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user.username;
        this.isAdmin = user.role === 'ADMIN';
        
        // Charger les données selon le rôle
        this.loadDashboardData();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        // Fallback: charger comme client
        this.isAdmin = false;
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    if (this.isAdmin) {
      this.loadAdminDashboardData();
    } else {
      this.loadClientDashboardData();
    }
    
    // Marquer le chargement comme terminé après un délai
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  loadAdminDashboardData(): void {
    // Charger les stats dashboard
    this.dashboardService.getAdminDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.totalBalance = dashboardStats.totalBalance || 0;
        this.stats.totalAccounts = dashboardStats.totalAccounts || 0;
        this.stats.activeAccounts = dashboardStats.activeAccounts || 0;
        this.stats.newAccountsThisMonth = dashboardStats.newAccountsThisMonth || 0;
        this.stats.transactions = dashboardStats.totalTransactions || 0;
        this.stats.totalClients = dashboardStats.totalClients || 0;
        this.stats.activeClients = dashboardStats.activeClients || 0;
        
        console.log('Stats admin chargées:', this.stats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats admin:', error);
        // Initialiser à 0 en cas d'erreur
        this.totalBalance = 0;
        this.stats.totalAccounts = 0;
        this.stats.activeAccounts = 0;
        this.stats.newAccountsThisMonth = 0;
        this.stats.transactions = 0;
        this.stats.totalClients = 0;
        this.stats.activeClients = 0;
        this.loadAdminDataFallback();
      }
    });

    // Charger les stats financières
    this.dashboardService.getFinancialStats().subscribe({
      next: (financialStats) => {
        this.stats.earnings = financialStats.monthlyIncome || 0;
        this.stats.expenses = financialStats.monthlyExpenses || 0;
        console.log('Stats financières admin chargées:', financialStats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats financières admin:', error);
        // Initialiser à 0 en cas d'erreur
        this.stats.earnings = 0;
        this.stats.expenses = 0;
      }
    });

    // Charger TOUTES les transactions pour l'admin
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        console.log('Transactions admin récupérées:', transactions.length);
        this.recentTransactions = transactions
          .sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime())
          .slice(0, 5)
          .map((t) => ({
            id: t.id,
            category: this.getTransactionDescription(t),
            cardLast4: this.getAccountLastDigits(t.destinationAccount || t.sourceAccount),
            date: new Date(t.operationDate),
            amount: t.type === 'CREDIT' || t.type === 'DEPOSIT' ? t.amount : -t.amount,
            type: t.type,
            clientName: this.getClientNameFromTransaction(t)
          }));
        
        console.log('Transactions formatées pour admin:', this.recentTransactions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions admin:', error);
      }
    });

    // Charger les clients récents
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.recentClients = clients.slice(0, 5);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }

  loadAdminDataFallback(): void {
    // Méthode de fallback si l'endpoint admin/stats ne fonctionne pas
    this.accountService.getAccountsAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateTotalBalance();
        this.stats.totalAccounts = accounts.length;
        this.stats.activeAccounts = accounts.filter(a => a.balance > 0).length;
      }
    });

    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.stats.totalClients = clients.length;
        this.stats.activeClients = clients.filter(c => c.email && c.email !== '').length;
        this.stats.newAccountsThisMonth = Math.floor(clients.length * 0.1);
      }
    });
  }

  loadClientDashboardData(): void {
    // Charger les stats dashboard
    this.dashboardService.getDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.totalBalance = dashboardStats.totalBalance || 0;
        this.stats.accounts = dashboardStats.totalAccounts || 0;
        this.stats.transactions = dashboardStats.totalTransactions || 0;
        console.log('Stats client chargées:', dashboardStats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats client:', error);
        // Initialiser à 0 en cas d'erreur
        this.totalBalance = 0;
        this.stats.accounts = 0;
        this.stats.transactions = 0;
        this.loadAccounts();
        this.loadTransactions();
      }
    });

    // Charger les stats financières
    this.dashboardService.getFinancialStats().subscribe({
      next: (financialStats) => {
        this.stats.earnings = financialStats.monthlyIncome || 0;
        this.stats.expenses = financialStats.monthlyExpenses || 0;
        console.log('Stats financières client chargées:', financialStats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats financières client:', error);
        // Initialiser à 0 en cas d'erreur
        this.stats.earnings = 0;
        this.stats.expenses = 0;
      }
    });

    // Charger les comptes et transactions pour les détails
    this.loadAccounts();
    this.loadTransactions();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateTotalBalance();
        this.stats.accounts = accounts.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
      }
    });
  }

  loadTransactions(): void {
    // Utiliser la bonne méthode selon le rôle
    const transactionObservable = this.isAdmin 
      ? this.transactionService.getAllTransactions()
      : this.transactionService.getTransactions();

    transactionObservable.subscribe({
      next: (transactions) => {
        if (transactions && transactions.length > 0) {
          this.stats.transactions = transactions.length;
          this.recentTransactions = transactions
            .sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime())
            .slice(0, 5)
            .map((t: any) => ({
              id: t.id,
              category: this.getTransactionDescription(t),
              cardLast4: this.getAccountLastDigits(t),
              date: new Date(t.operationDate),
              amount: t.type === 'CREDIT' || t.type === 'DEPOSIT' ? t.amount : -t.amount,
              type: t.type,
              clientName: this.isAdmin ? this.getClientNameFromTransaction(t) : ''
            }));
        } else {
          // Aucune transaction trouvée
          this.stats.transactions = 0;
          this.recentTransactions = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
        // Initialiser à 0 en cas d'erreur
        this.stats.transactions = 0;
        this.recentTransactions = [];
      }
    });
  }

  calculateTotalBalance(): void {
    if (this.accounts && this.accounts.length > 0) {
      this.totalBalance = this.accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    } else {
      this.totalBalance = 0;
    }
  }

  getAbsoluteValue(amount: number): string {
    return Math.abs(amount).toLocaleString();
  }

  refreshDashboard(): void {
    console.log('Rafraîchissement du dashboard...');
    this.loadDashboardData();
  }

  getTransactionDescription(transaction: any): string {
    switch (transaction.type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAWAL':
        return 'Retrait';
      case 'TRANSFER':
        return 'Virement';
      case 'CREDIT':
        return 'Crédit';
      case 'DEBIT':
        return 'Débit';
      default:
        return transaction.type || 'Transaction';
    }
  }

  getAccountLastDigits(transaction: any): string {
    const account = transaction.destinationAccount || transaction.sourceAccount;
    if (account && account.length >= 4) {
      return account.slice(-4);
    }
    return '0000';
  }

  getClientNameFromTransaction(transaction: any): string {
    // Pour l'instant, simulation. Dans un vrai système, il faudrait 
    // joindre avec les données client via l'account
    return 'Client ' + (transaction.id % 100);
  }
}