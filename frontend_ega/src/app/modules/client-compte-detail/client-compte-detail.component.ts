import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Compte, Transaction } from '../../core/models';

@Component({
    selector: 'app-client-compte-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header avec bouton retour -->
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span class="iconify text-gray-600" data-icon="lucide:arrow-left" data-width="24"></span>
        </button>
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Détails du compte</h1>
          <p class="text-sm text-gray-500 mt-1">Consultez l'historique de vos transactions</p>
        </div>
      </div>

      <!-- Informations du compte -->
      <div *ngIf="compte" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div [ngClass]="compte.type === 'COURANT' ? 'bg-blue-500' : 'bg-green-500'" 
                     class="h-12 w-12 rounded-lg flex items-center justify-center">
                  <span class="iconify" 
                        [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" 
                        data-width="24"></span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold">{{ compte.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne' }}</h2>
                  <p class="text-blue-100 text-sm font-mono">{{ compte.numeroCompte }}</p>
                </div>
              </div>
              <div>
                <p class="text-blue-100 text-sm mb-1">Solde disponible</p>
                <p class="text-3xl font-bold">{{ compte.solde | number:'1.0-0' }} FCFA</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              Actif
            </span>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Transactions</p>
            <p class="text-xl font-semibold text-gray-900">{{ transactions.length }}</p>
          </div>
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Dépôts</p>
            <p class="text-xl font-semibold text-green-600">{{ countByType('DEPOT') }}</p>
          </div>
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Retraits/Virements</p>
            <p class="text-xl font-semibold text-red-600">{{ countByType('RETRAIT') + countByType('VIREMENT') }}</p>
          </div>
        </div>
      </div>

      <!-- Historique des transactions -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Historique des transactions</h3>
        </div>

        <div *ngIf="loading" class="p-8 text-center">
          <span class="iconify animate-spin text-blue-600" data-icon="lucide:loader-2" data-width="32"></span>
          <p class="text-gray-500 mt-2">Chargement...</p>
        </div>

        <div *ngIf="!loading && transactions.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde après</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let transaction of displayedTransactions; let i = index" 
                  class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                  {{ transaction.dateTransaction | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-green-100 text-green-800': transaction.typeTransaction === 'DEPOT',
                    'bg-red-100 text-red-800': transaction.typeTransaction === 'RETRAIT',
                    'bg-blue-100 text-blue-800': transaction.typeTransaction === 'VIREMENT'
                  }" class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ transaction.typeTransaction }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold" 
                    [ngClass]="transaction.typeTransaction === 'DEPOT' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ transaction.typeTransaction === 'DEPOT' ? '+' : '-' }} {{ transaction.montant | number:'1.0-0' }} FCFA
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-mono">
                  {{ calculateBalance(i) | number:'1.0-0' }} FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && transactions.length > transactionsPerPage" 
             class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Affichage de {{ (currentPage - 1) * transactionsPerPage + 1 }} à {{ Math.min(currentPage * transactionsPerPage, transactions.length) }} sur {{ transactions.length }}
          </div>
          <div class="flex gap-2">
            <button (click)="previousPage()" [disabled]="currentPage === 1" 
                    class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Précédent
            </button>
            <button (click)="nextPage()" [disabled]="currentPage >= totalPages" 
                    class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Suivant
            </button>
          </div>
        </div>

        <div *ngIf="!loading && transactions.length === 0" 
             class="p-12 text-center border-t border-gray-200">
          <span class="iconify text-gray-300 mb-2" data-icon="lucide:inbox" data-width="48"></span>
          <p class="text-gray-500">Aucune transaction pour ce compte.</p>
        </div>
      </div>
    </div>
  `
})
export class ClientCompteDetailComponent implements OnInit {
    compte: Compte | null = null;
    transactions: Transaction[] = [];
    displayedTransactions: Transaction[] = [];
    loading = false;

    currentPage = 1;
    transactionsPerPage = 10;
    totalPages = 1;

    Math = Math;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        const compteId = this.route.snapshot.paramMap.get('id');
        if (compteId) {
            this.loadCompteDetails(Number(compteId));
        }
    }

    loadCompteDetails(compteId: number) {
        this.loading = true;

        // Charger les détails du compte
        this.apiService.getMyAccounts().subscribe({
            next: (comptes) => {
                this.compte = comptes.find(c => c.id === compteId) || null;
                if (!this.compte) {
                    this.router.navigate(['/client-dashboard']);
                    return;
                }
                this.loadTransactions(compteId);
            },
            error: () => {
                this.loading = false;
                this.router.navigate(['/client-dashboard']);
            }
        });
    }

    loadTransactions(compteId: number) {
        this.apiService.getTransactionsByCompte(compteId).subscribe({
            next: (transactions) => {
                this.transactions = transactions.sort((a, b) =>
                    new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
                );
                this.totalPages = Math.ceil(this.transactions.length / this.transactionsPerPage);
                this.updateDisplayedTransactions();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    updateDisplayedTransactions() {
        const start = (this.currentPage - 1) * this.transactionsPerPage;
        const end = start + this.transactionsPerPage;
        this.displayedTransactions = this.transactions.slice(start, end);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedTransactions();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedTransactions();
        }
    }

    countByType(type: string): number {
        return this.transactions.filter(t => t.typeTransaction === type).length;
    }

    calculateBalance(index: number): number {
        if (!this.compte) return 0;

        // Calculer le solde après cette transaction
        let balance = this.compte.solde;

        // Parcourir les transactions depuis la plus récente jusqu'à celle-ci
        for (let i = 0; i <= index; i++) {
            const transaction = this.displayedTransactions[i];
            if (transaction.typeTransaction === 'DEPOT') {
                balance -= transaction.montant;
            } else {
                balance += transaction.montant;
            }
        }

        return balance;
    }

    goBack() {
        this.router.navigate(['/client-dashboard']);
    }
}
