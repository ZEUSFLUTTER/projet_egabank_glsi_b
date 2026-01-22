import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header avec bouton retour -->
      <div class="flex items-center mb-8">
        <button (click)="goBack()" class="mr-4 p-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-all duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Détails du Client</h1>
          <p class="text-gray-400">Informations complètes du client et de ses comptes</p>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
        <p class="text-gray-400 mt-2">Chargement...</p>
      </div>

      <div *ngIf="!loading && client" class="space-y-8">
        <!-- Informations personnelles du client -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6">Informations Personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p class="text-gray-400 text-sm mb-1">Nom complet</p>
              <p class="text-white text-lg font-semibold">{{ client?.firstName }} {{ client?.lastName }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Email</p>
              <p class="text-white">{{ client?.email }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Téléphone</p>
              <p class="text-white">{{ client?.phone }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Date de naissance</p>
              <p class="text-white">{{ formatDate(client?.birthDate) }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Genre</p>
              <p class="text-white">{{ client?.gender === 'M' ? 'Masculin' : 'Féminin' }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Nationalité</p>
              <p class="text-white">{{ client?.nationality }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-gray-400 text-sm mb-1">Adresse</p>
              <p class="text-white">{{ client?.address }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">Date d'inscription</p>
              <p class="text-white">{{ formatDate(client?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Statistiques globales -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Nombre de Comptes</p>
            <p class="text-2xl font-bold text-white">{{ accounts.length }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Solde Total</p>
            <p class="text-2xl font-bold text-gold-400">$ {{ totalBalance.toLocaleString() }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Transactions</p>
            <p class="text-2xl font-bold text-white">{{ allTransactions.length }}</p>
          </div>
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Revenus Totaux</p>
            <p class="text-2xl font-bold text-green-400">$ {{ totalIncome.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Liste des comptes -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6">Comptes Bancaires</h2>
          <div *ngIf="accounts.length === 0" class="text-center py-8">
            <p class="text-gray-400">Aucun compte trouvé pour ce client</p>
          </div>
          <div *ngIf="accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let account of accounts" class="bg-dark-700 border border-dark-600 rounded-xl p-4 hover:border-gold-600 transition-all duration-200">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-white font-semibold">{{ getAccountTypeName(account?.type) }}</h3>
                  <p class="text-gray-400 text-sm font-mono">{{ account?.accountNumber }}</p>
                </div>
                <span class="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full">ACTIF</span>
              </div>
              <div class="mb-4">
                <p class="text-gray-400 text-sm mb-1">Solde</p>
                <p class="text-xl font-bold text-white">$ {{ account?.balance?.toLocaleString() || 0 }}</p>
              </div>
              <div class="flex justify-between text-sm text-gray-400">
                <span>Créé le {{ formatDate(account?.createdAt) }}</span>
                <button (click)="viewAccountDetails(account?.id)" class="text-gold-400 hover:text-gold-300">Voir détails →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Historique des transactions -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6">Historique Complet des Transactions</h2>
          <div *ngIf="allTransactions.length === 0" class="text-center py-8">
            <p class="text-gray-400">Aucune transaction trouvée pour ce client</p>
          </div>
          <div *ngIf="allTransactions.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-dark-600">
                  <th class="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-semibold">Compte</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-semibold">Montant</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-semibold">Source/Destination</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of allTransactions" class="border-b border-dark-700 hover:bg-dark-700 transition-colors">
                  <td class="py-3 px-4 text-white">{{ formatDate(transaction?.operationDate) }}</td>
                  <td class="py-3 px-4 text-gray-300 font-mono text-sm">{{ getAccountNumber(transaction?.accountId) }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="{
                            'bg-green-600 bg-opacity-20 text-green-400': transaction?.type === 'CREDIT' || transaction?.type === 'DEPOSIT',
                            'bg-red-600 bg-opacity-20 text-red-400': transaction?.type === 'DEBIT' || transaction?.type === 'WITHDRAWAL',
                            'bg-blue-600 bg-opacity-20 text-blue-400': transaction?.type === 'TRANSFER'
                          }">
                      {{ getTransactionTypeName(transaction?.type) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-semibold"
                      [ngClass]="{
                        'text-green-400': transaction?.type === 'CREDIT' || transaction?.type === 'DEPOSIT',
                        'text-red-400': transaction?.type === 'DEBIT' || transaction?.type === 'WITHDRAWAL',
                        'text-blue-400': transaction?.type === 'TRANSFER'
                      }">
                    {{ (transaction?.type === 'DEBIT' || transaction?.type === 'WITHDRAWAL' ? '-' : '+') + '$' + (transaction?.amount?.toLocaleString() || 0) }}
                  </td>
                  <td class="py-3 px-4 text-gray-300 font-mono text-sm">
                    {{ transaction?.sourceAccount || transaction?.destinationAccount || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !client" class="text-center py-8">
        <p class="text-gray-400">Client non trouvé</p>
      </div>
    </div>
  `,
  styles: []
})
export class ClientDetailsComponent implements OnInit {
  client: any = null;
  accounts: any[] = [];
  allTransactions: any[] = [];
  loading = true;
  totalBalance = 0;
  totalIncome = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClientDetails(+clientId);
    }
  }

  loadClientDetails(clientId: number): void {
    this.loading = true;

    this.clientService.getClientById(clientId).subscribe({
      next: client => {
        this.client = client;

        this.accountService.getAccountsByOwnerId(clientId).subscribe({
          next: accounts => {
            this.accounts = accounts || [];
            this.calculateTotalBalance();
            this.loadAllTransactions();
          },
          error: err => {
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadAllTransactions(): void {
    if (!this.accounts.length) {
      this.loading = false;
      return;
    }

    let completedRequests = 0;
    this.allTransactions = [];

    this.accounts.forEach(account => {
      this.transactionService.getTransactionsByAccountId(account?.id).subscribe({
        next: txs => {
          this.allTransactions = this.allTransactions.concat(txs || []);
          completedRequests++;
          if (completedRequests === this.accounts.length) {
            this.calculateTotalIncome();
            this.loading = false;
          }
        },
        error: err => {
          console.error(err);
          completedRequests++;
          if (completedRequests === this.accounts.length) {
            this.calculateTotalIncome();
            this.loading = false;
          }
        }
      });
    });
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.accounts.reduce((sum, acc) => sum + (acc?.balance || 0), 0);
  }

  calculateTotalIncome(): void {
    this.totalIncome = this.allTransactions
      .filter(t => t?.type === 'CREDIT' || t?.type === 'DEPOSIT')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
  }

  getAccountTypeName(type: string): string {
    return { CURRENT: 'Compte Courant', SAVINGS: 'Compte Épargne' }[type] || type;
  }

  getTransactionTypeName(type: string): string {
    return {
      CREDIT: 'Crédit',
      DEBIT: 'Débit',
      DEPOSIT: 'Dépôt',
      WITHDRAWAL: 'Retrait',
      TRANSFER: 'Virement'
    }[type] || type;
  }

  getAccountNumber(accountId: number): string {
    const account = this.accounts.find(a => a?.id === accountId);
    return account?.accountNumber || 'N/A';
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  viewAccountDetails(accountId: number): void {
    this.router.navigate(['/account-details', accountId]);
  }

  goBack(): void {
    this.router.navigate(['/admin-clients']);
  }
}
