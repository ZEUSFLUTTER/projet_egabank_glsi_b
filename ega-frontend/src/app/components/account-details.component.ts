import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-dark-900 p-8">
      <!-- Header avec bouton retour -->
      <div class="flex items-center mb-8">
        <button
          (click)="goBack()"
          class="mr-4 p-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Détails du Compte</h1>
          <p class="text-gray-400">Informations complètes du compte bancaire</p>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
        <p class="text-gray-400 mt-2">Chargement...</p>
      </div>

      <div *ngIf="!loading && account" class="space-y-8">
        <!-- Informations du compte -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Informations du Compte</h2>
            <button 
              (click)="printStatement()" 
              class="px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg font-semibold hover:from-gold-500 hover:to-gold-400 transition-all duration-200 flex items-center shadow-lg">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Imprimer Relevé
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p class="text-gray-400 text-sm mb-1">Numéro de compte</p>
              <p class="text-white font-mono text-lg">{{ account?.accountNumber }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Type de compte</p>
              <p class="text-white text-lg">{{ getAccountTypeName(account?.type) }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Solde actuel</p>
              <p class="text-2xl font-bold text-gold-400">
                $ {{ account?.balance?.toLocaleString() || '0' }}
              </p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Date de création</p>
              <p class="text-white">{{ formatDate(account?.createdAt) }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Statut</p>
              <span
                class="px-3 py-1 bg-green-600 bg-opacity-20 text-green-400 text-sm font-semibold rounded-full border border-green-600">
                ACTIF
              </span>
            </div>
          </div>
        </div>

        <!-- Informations du propriétaire -->
        <div *ngIf="owner" class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6">Propriétaire du Compte</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p class="text-gray-400 text-sm mb-1">Nom complet</p>
              <p class="text-white text-lg">{{ owner?.firstName }} {{ owner?.lastName }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Email</p>
              <p class="text-white">{{ owner?.email }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Téléphone</p>
              <p class="text-white">{{ owner?.phone }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Adresse</p>
              <p class="text-white">{{ owner?.address }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Nationalité</p>
              <p class="text-white">{{ owner?.nationality }}</p>
            </div>

            <div>
              <p class="text-gray-400 text-sm mb-1">Date de naissance</p>
              <p class="text-white">{{ formatDate(owner?.birthDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Transactions</p>
            <p class="text-2xl font-bold text-white">{{ transactions.length }}</p>
          </div>

          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Crédits</p>
            <p class="text-2xl font-bold text-green-400">
              $ {{ totalCredits.toLocaleString() }}
            </p>
          </div>

          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Total Débits</p>
            <p class="text-2xl font-bold text-red-400">
              $ {{ totalDebits.toLocaleString() }}
            </p>
          </div>

          <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
            <p class="text-gray-400 text-sm mb-1">Solde Net</p>
            <p class="text-2xl font-bold text-white">
              $ {{ (totalCredits - totalDebits).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Historique -->
        <div class="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-6">Historique des Transactions</h2>

          <div *ngIf="transactions.length === 0" class="text-center py-8">
            <p class="text-gray-400">Aucune transaction trouvée</p>
          </div>

          <div *ngIf="transactions.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-dark-600">
                  <th class="text-left py-3 px-4 text-gray-400">Date</th>
                  <th class="text-left py-3 px-4 text-gray-400">Type</th>
                  <th class="text-left py-3 px-4 text-gray-400">Montant</th>
                  <th class="text-left py-3 px-4 text-gray-400">Source</th>
                  <th class="text-left py-3 px-4 text-gray-400">Destination</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions"
                  class="border-b border-dark-700 hover:bg-dark-700">
                  <td class="py-3 px-4 text-white">
                    {{ formatDate(transaction?.operationDate) }}
                  </td>
                  <td class="py-3 px-4 text-white">
                    {{ getTransactionTypeName(transaction?.type) }}
                  </td>
                  <td class="py-3 px-4 font-semibold">
                    {{ getTransactionAmount(transaction) }}
                  </td>
                  <td class="py-3 px-4 text-gray-300 font-mono text-sm">
                    {{ transaction?.sourceAccount || '-' }}
                  </td>
                  <td class="py-3 px-4 text-gray-300 font-mono text-sm">
                    {{ transaction?.destinationAccount || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !account" class="text-center py-8">
        <p class="text-gray-400">Compte non trouvé</p>
      </div>
    </div>
  `,
  styles: []
})
export class AccountDetailsComponent implements OnInit {
  account: any = null;
  owner: any = null;
  transactions: any[] = [];
  loading = true;
  totalCredits = 0;
  totalDebits = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccountDetails(+accountId);
    }
  }

  loadAccountDetails(accountId: number): void {
    this.loading = true;

    this.accountService.getAccountById(accountId).subscribe({
      next: account => {
        this.account = account;

        // Utiliser les informations du propriétaire directement depuis l'account
        if (account) {
          this.owner = {
            id: account.ownerId,
            firstName: account.ownerFirstName,
            lastName: account.ownerLastName,
            email: account.ownerEmail,
            birthDate: '',
            gender: '',
            address: '',
            phone: '',
            nationality: ''
          };
        }

        this.transactionService.getTransactionsByAccountId(accountId).subscribe({
          next: txs => {
            this.transactions = txs || [];
            this.calculateTransactionStats();
            this.loading = false;
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

  calculateTransactionStats(): void {
    this.totalCredits = this.transactions
      .filter(t => t?.type === 'CREDIT' || t?.type === 'DEPOSIT')
      .reduce((s, t) => s + (t?.amount || 0), 0);

    this.totalDebits = this.transactions
      .filter(t => t?.type === 'DEBIT' || t?.type === 'WITHDRAWAL')
      .reduce((s, t) => s + (t?.amount || 0), 0);
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

  getTransactionAmount(t: any): string {
    const sign = t?.type === 'DEBIT' || t?.type === 'WITHDRAWAL' ? '-' : '+';
    return `${sign}$${(t?.amount || 0).toLocaleString()}`;
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  printStatement(): void {
    if (!this.account?.id) {
      console.error('Aucun compte sélectionné pour l\'impression');
      return;
    }

    // Ouvrir le relevé dans une nouvelle fenêtre pour impression
    const printUrl = `http://localhost:8080/api/accounts/${this.account.id}/statement?print=true`;
    const printWindow = window.open(printUrl, '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      // Fallback si le popup est bloqué
      window.location.href = printUrl;
    }
  }
}
