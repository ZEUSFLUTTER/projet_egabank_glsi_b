import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ isAdmin ? 'Toutes les Transactions' : 'Mes Transactions' }}</h1>
          <p class="text-gray-400">{{ isAdmin ? 'Historique de toutes les opérations du système' : 'Historique de vos opérations bancaires' }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-dark-800 text-gray-400 rounded-lg text-sm font-medium border border-dark-700 hover:border-gold-600 transition-colors flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Filtrer
          </button>
          <button (click)="openNewTransactionForm()" class="px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 flex items-center shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nouvelle Transaction
          </button>
        </div>
      </div>

      <!-- Formulaire de nouvelle transaction -->
      <div *ngIf="showTransactionForm" class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Nouvelle Transaction</h3>
        <form (ngSubmit)="submitTransaction()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Type de transaction</label>
              <select [(ngModel)]="newTransaction.type" name="type" required class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none">
                <option value="">Sélectionner un type</option>
                <option value="DEPOSIT">Dépôt</option>
                <option value="WITHDRAWAL">Retrait</option>
                <option value="TRANSFER">Virement</option>
              </select>
            </div>
            
            <div>
              <label class="block text-gray-400 text-sm mb-2">Montant</label>
              <input type="number" [(ngModel)]="newTransaction.amount" name="amount" required min="0.01" step="0.01" 
                     class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none" 
                     placeholder="0.00">
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngIf="newTransaction.type === 'WITHDRAWAL' || newTransaction.type === 'TRANSFER'">
              <label class="block text-gray-400 text-sm mb-2">Compte source</label>
              <select [(ngModel)]="newTransaction.sourceAccountNumber" name="sourceAccountNumber" 
                      [required]="newTransaction.type === 'WITHDRAWAL' || newTransaction.type === 'TRANSFER'"
                      class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none">
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let account of userAccounts" [value]="account.accountNumber">
                  {{ account.accountNumber }} - {{ getAccountTypeName(account.type) }} ({{ account.balance }}€)
                </option>
              </select>
            </div>
            
            <div *ngIf="newTransaction.type === 'TRANSFER'">
              <label class="block text-gray-400 text-sm mb-2">Compte destination</label>
              <input type="text" [(ngModel)]="newTransaction.destinationAccountNumber" name="destinationAccountNumber" 
                     [required]="newTransaction.type === 'TRANSFER'"
                     class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none" 
                     placeholder="Numéro de compte IBAN">
            </div>
            
            <div *ngIf="newTransaction.type === 'DEPOSIT' || newTransaction.type === 'WITHDRAWAL'">
              <label class="block text-gray-400 text-sm mb-2">{{ newTransaction.type === 'DEPOSIT' ? 'Compte de destination' : 'Compte source' }}</label>
              <select [(ngModel)]="newTransaction.destinationAccountNumber" name="destinationAccountNumber" 
                      [required]="newTransaction.type === 'DEPOSIT' || newTransaction.type === 'WITHDRAWAL'"
                      class="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-gold-500 focus:outline-none">
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let account of userAccounts" [value]="account.accountNumber">
                  {{ account.accountNumber }} - {{ getAccountTypeName(account.type) }} ({{ account.balance }}€)
                </option>
              </select>
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button type="submit" class="px-6 py-2 bg-gold-600 text-black rounded-lg font-semibold hover:bg-gold-500 transition-all duration-200">
              Effectuer la transaction
            </button>
            <button type="button" (click)="cancelTransactionForm()" class="px-6 py-2 bg-dark-700 text-white rounded-lg font-semibold hover:bg-dark-600 transition-all duration-200">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Total Crédits</p>
          <p class="text-2xl font-bold text-green-400">\$ {{ totalCredits.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ creditCount }} transactions</p>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Total Débits</p>
          <p class="text-2xl font-bold text-red-400">\$ {{ totalDebits.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-2">{{ debitCount }} transactions</p>
        </div>

        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gold-600 bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-1">Solde Net</p>
          <p class="text-2xl font-bold text-white">\$ {{ (totalCredits - totalDebits).toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-2">Ce mois</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Type</label>
            <select [(ngModel)]="filterType" (change)="applyFilters()" 
                    class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500">
              <option value="">Tous</option>
              <option value="CREDIT">Crédit</option>
              <option value="DEBIT">Débit</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Date début</label>
            <input type="date" [(ngModel)]="filterDateStart" (change)="applyFilters()"
                   class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Date fin</label>
            <input type="date" [(ngModel)]="filterDateEnd" (change)="applyFilters()"
                   class="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500">
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" 
                    class="w-full px-4 py-2 bg-dark-700 text-gray-400 rounded-lg hover:bg-dark-600 transition-colors">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-dark-700">
          <h2 class="text-xl font-semibold text-white">Historique des transactions</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-800">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Compte</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-700">
              <tr *ngFor="let transaction of filteredTransactions" 
                  class="hover:bg-dark-800 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ transaction.operationDate | date:'dd/MM/yyyy' }}</div>
                  <div class="text-xs text-gray-400">{{ transaction.operationDate | date:'HH:mm' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                         [ngClass]="{
                           'bg-green-600 bg-opacity-20': transaction.originalType === 'CREDIT' || transaction.originalType === 'DEPOSIT',
                           'bg-red-600 bg-opacity-20': transaction.originalType === 'DEBIT' || transaction.originalType === 'WITHDRAWAL',
                           'bg-blue-600 bg-opacity-20': transaction.originalType === 'TRANSFER'
                         }">
                      <svg class="w-5 h-5" 
                           [ngClass]="{
                             'text-green-400': transaction.originalType === 'CREDIT' || transaction.originalType === 'DEPOSIT',
                             'text-red-400': transaction.originalType === 'DEBIT' || transaction.originalType === 'WITHDRAWAL',
                             'text-blue-400': transaction.originalType === 'TRANSFER'
                           }"
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              [attr.d]="getTransactionIcon(transaction.originalType)"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-white">{{ transaction.description || 'Transaction' }}</div>
                      <div class="text-xs text-gray-400">ID: {{ transaction.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-600 bg-opacity-20 text-green-400 border border-green-600': transaction.originalType === 'CREDIT' || transaction.originalType === 'DEPOSIT',
                          'bg-red-600 bg-opacity-20 text-red-400 border border-red-600': transaction.originalType === 'DEBIT' || transaction.originalType === 'WITHDRAWAL',
                          'bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600': transaction.originalType === 'TRANSFER'
                        }">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ transaction.accountNumber || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="text-lg font-bold"
                       [ngClass]="{
                         'text-green-400': transaction.originalType === 'CREDIT' || transaction.originalType === 'DEPOSIT',
                         'text-red-400': transaction.originalType === 'DEBIT' || transaction.originalType === 'WITHDRAWAL',
                         'text-blue-400': transaction.originalType === 'TRANSFER'
                       }">
                    $ {{ transaction.amount.toLocaleString() }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-dark-700 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            Affichage de {{ filteredTransactions.length }} transactions
          </div>
          <div class="flex items-center space-x-2">
            <button class="px-3 py-1 bg-dark-700 text-gray-400 rounded hover:bg-dark-600 transition-colors">
              Précédent
            </button>
            <button class="px-3 py-1 bg-gold-600 text-black rounded font-medium">
              1
            </button>
            <button class="px-3 py-1 bg-dark-700 text-gray-400 rounded hover:bg-dark-600 transition-colors">
              2
            </button>
            <button class="px-3 py-1 bg-dark-700 text-gray-400 rounded hover:bg-dark-600 transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  userAccounts: any[] = [];
  isAdmin = false;
  
  totalCredits = 0;
  totalDebits = 0;
  creditCount = 0;
  debitCount = 0;

  filterType = '';
  filterDateStart = '';
  filterDateEnd = '';

  // Formulaire de nouvelle transaction
  showTransactionForm = false;
  newTransaction = {
    type: '',
    amount: 0,
    sourceAccountNumber: '',
    destinationAccountNumber: ''
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
  }

  ngAfterViewInit(): void {
    // Forcer le rechargement des données quand on arrive sur la page
    setTimeout(() => {
      this.refreshAllData();
    }, 100);
    
    // Écouter l'événement de rechargement global
    window.addEventListener('refreshData', () => {
      this.refreshAllData();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer les subscriptions et event listeners
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('refreshData', () => {});
  }

  checkUserRole(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isAdmin = user.role === 'ADMIN';
        this.loadTransactions();
        this.loadUserAccounts();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du rôle:', error);
        this.isAdmin = false;
        // Même en cas d'erreur, essayer de charger les données
        this.loadTransactions();
        this.loadUserAccounts();
      }
    });
  }

  loadUserAccounts(): void {
    if (!this.isAdmin) {
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          this.userAccounts = accounts;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des comptes:', error);
        }
      });
    }
  }

  refreshAllData(): void {
    this.loadTransactions();
    this.loadUserAccounts();
  }

  loadTransactions(): void {
    const transactionObservable = this.isAdmin 
      ? this.transactionService.getAllTransactions()
      : this.transactionService.getTransactions();

    transactionObservable.subscribe({
      next: (transactions) => {
        // Map backend response fields to what the component expects
        this.transactions = transactions.map((t: any) => ({
          id: t.id,
          type: this.getTransactionTypeName(t.type),
          originalType: t.type, // Garder le type original pour les calculs
          amount: t.amount,
          operationDate: t.operationDate,
          // choose account number to display: destination for credits, source for debits
          accountNumber: t.type === 'CREDIT' || t.type === 'DEPOSIT' ? t.destinationAccount : t.sourceAccount,
          description: this.getTransactionDescription(t.type)
        }));
        this.filteredTransactions = this.transactions;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
      }
    });
  }

  calculateStats(): void {
    this.totalCredits = this.transactions
      .filter(t => t.originalType === 'CREDIT' || t.originalType === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalDebits = this.transactions
      .filter(t => t.originalType === 'DEBIT' || t.originalType === 'WITHDRAWAL')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.creditCount = this.transactions.filter(t => t.originalType === 'CREDIT' || t.originalType === 'DEPOSIT').length;
    this.debitCount = this.transactions.filter(t => t.originalType === 'DEBIT' || t.originalType === 'WITHDRAWAL').length;
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      let matches = true;

      if (this.filterType && transaction.type !== this.filterType) {
        matches = false;
      }

      if (this.filterDateStart) {
        const transDate = new Date(transaction.operationDate);
        const startDate = new Date(this.filterDateStart);
        if (transDate < startDate) matches = false;
      }

      if (this.filterDateEnd) {
        const transDate = new Date(transaction.operationDate);
        const endDate = new Date(this.filterDateEnd);
        if (transDate > endDate) matches = false;
      }

      return matches;
    });
  }

  resetFilters(): void {
    this.filterType = '';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.filteredTransactions = this.transactions;
  }

  openNewTransactionForm(): void {
    this.showTransactionForm = true;
    this.resetTransactionForm();
  }

  cancelTransactionForm(): void {
    this.showTransactionForm = false;
    this.resetTransactionForm();
  }

  resetTransactionForm(): void {
    this.newTransaction = {
      type: '',
      amount: 0,
      sourceAccountNumber: '',
      destinationAccountNumber: ''
    };
  }

  submitTransaction(): void {
    if (!this.newTransaction.type || !this.newTransaction.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    let transactionData: any = {
      amount: this.newTransaction.amount
    };

    switch (this.newTransaction.type) {
      case 'DEPOSIT':
        if (!this.newTransaction.destinationAccountNumber) {
          alert('Veuillez sélectionner un compte de destination');
          return;
        }
        transactionData.accountNumber = this.newTransaction.destinationAccountNumber;
        this.transactionService.deposit(transactionData).subscribe({
          next: (result) => {
            console.log('Dépôt effectué avec succès:', result);
            alert('Dépôt effectué avec succès !');
            this.refreshAllData();
            this.cancelTransactionForm();
          },
          error: (error) => {
            console.error('Erreur lors du dépôt:', error);
            alert('Erreur lors du dépôt. Veuillez réessayer.');
          }
        });
        break;

      case 'WITHDRAWAL':
        if (!this.newTransaction.destinationAccountNumber) {
          alert('Veuillez sélectionner un compte');
          return;
        }
        transactionData.accountNumber = this.newTransaction.destinationAccountNumber;
        this.transactionService.withdraw(transactionData).subscribe({
          next: (result) => {
            console.log('Retrait effectué avec succès:', result);
            alert('Retrait effectué avec succès !');
            this.refreshAllData();
            this.cancelTransactionForm();
          },
          error: (error) => {
            console.error('Erreur lors du retrait:', error);
            alert('Erreur lors du retrait. Veuillez vérifier le solde disponible.');
          }
        });
        break;

      case 'TRANSFER':
        if (!this.newTransaction.sourceAccountNumber || !this.newTransaction.destinationAccountNumber) {
          alert('Veuillez sélectionner un compte source et saisir le compte de destination');
          return;
        }
        transactionData.fromAccount = this.newTransaction.sourceAccountNumber;
        transactionData.toAccount = this.newTransaction.destinationAccountNumber;
        this.transactionService.transfer(transactionData).subscribe({
          next: (result) => {
            console.log('Virement effectué avec succès:', result);
            alert('Virement effectué avec succès !');
            this.refreshAllData();
            this.cancelTransactionForm();
          },
          error: (error) => {
            console.error('Erreur lors du virement:', error);
            alert('Erreur lors du virement. Veuillez vérifier les informations saisies.');
          }
        });
        break;

      default:
        alert('Type de transaction non supporté');
    }
  }

  getAccountTypeName(type: string): string {
    const types: any = {
      'CURRENT': 'Compte Courant',
      'SAVINGS': 'Compte Épargne'
    };
    return types[type] || type;
  }

  getTransactionTypeName(type: string): string {
    const types: any = {
      'DEPOSIT': 'Dépôt',
      'WITHDRAWAL': 'Retrait',
      'TRANSFER': 'Virement',
      'CREDIT': 'Crédit',
      'DEBIT': 'Débit'
    };
    return types[type] || type;
  }

  getTransactionDescription(type: string): string {
    const descriptions: any = {
      'DEPOSIT': 'Dépôt d\'espèces',
      'WITHDRAWAL': 'Retrait d\'espèces',
      'TRANSFER': 'Virement bancaire',
      'CREDIT': 'Crédit',
      'DEBIT': 'Débit'
    };
    return descriptions[type] || 'Transaction';
  }

  getTransactionIcon(type: string): string {
    const icons: any = {
      'DEPOSIT': 'M7 11l5-5m0 0l5 5m-5-5v12', // Flèche vers le haut
      'WITHDRAWAL': 'M17 13l-5 5m0 0l-5-5m5 5V6', // Flèche vers le bas
      'TRANSFER': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', // Flèches échange
      'CREDIT': 'M7 11l5-5m0 0l5 5m-5-5v12',
      'DEBIT': 'M17 13l-5 5m0 0l-5-5m5 5V6'
    };
    return icons[type] || 'M7 11l5-5m0 0l5 5m-5-5v12';
  }
}
