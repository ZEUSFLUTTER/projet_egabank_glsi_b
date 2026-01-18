import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Transaction, Compte } from '../../core/models';

@Component({
    selector: 'app-client-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Historique des Transactions</h1>
        <p class="text-sm text-gray-500 mt-1">Consultez l'historique complet de toutes vos transactions</p>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Filtres</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Type de transaction</label>
            <select [(ngModel)]="filters.type" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tous</option>
              <option value="DEPOT">Dépôt</option>
              <option value="RETRAIT">Retrait</option>
              <option value="VIREMENT">Virement</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Compte</label>
            <select [(ngModel)]="filters.compteId" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tous les comptes</option>
              <option *ngFor="let compte of comptes" [value]="compte.id">{{ compte.numeroCompte }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Date début</label>
            <input type="date" [(ngModel)]="filters.dateDebut" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Date fin</label>
            <input type="date" [(ngModel)]="filters.dateFin" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button (click)="resetFilters()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Réinitialiser
          </button>
          <button (click)="exportToPDF()" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span class="iconify" data-icon="lucide:download" data-width="16"></span>
            Exporter PDF
          </button>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transactions</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ filteredTransactions.length }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dépôts</p>
          <p class="text-2xl font-semibold text-green-600 mt-1">{{ totalDepots | number:'1.0-0' }} FCFA</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Retraits</p>
          <p class="text-2xl font-semibold text-red-600 mt-1">{{ totalRetraits | number:'1.0-0' }} FCFA</p>
        </div>
      </div>

      <!-- Liste des transactions -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('dateTransaction')">
                  Date
                  <span class="iconify ml-1" data-icon="lucide:chevrons-up-down" data-width="14"></span>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('montant')">
                  Montant
                  <span class="iconify ml-1" data-icon="lucide:chevrons-up-down" data-width="14"></span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let transaction of displayedTransactions" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                  {{ transaction.dateTransaction | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="font-mono text-xs">{{ getCompteNumero(transaction.compteId) }}</span>
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
              </tr>
              <tr *ngIf="displayedTransactions.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  Aucune transaction trouvée avec ces filtres
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredTransactions.length > itemsPerPage" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} sur {{ filteredTransactions.length }}
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
      </div>
    </div>
  `
})
export class ClientHistoryComponent implements OnInit {
    allTransactions: Transaction[] = [];
    filteredTransactions: Transaction[] = [];
    displayedTransactions: Transaction[] = [];
    comptes: Compte[] = [];

    filters = {
        type: '',
        compteId: '',
        dateDebut: '',
        dateFin: ''
    };

    currentPage = 1;
    itemsPerPage = 20;
    totalPages = 1;
    Math = Math;

    totalDepots = 0;
    totalRetraits = 0;

    sortField: 'dateTransaction' | 'montant' = 'dateTransaction';
    sortDirection: 'asc' | 'desc' = 'desc';

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.apiService.getMyAccounts().subscribe(comptes => {
            this.comptes = comptes;
            this.loadAllTransactions();
        });
    }

    loadAllTransactions() {
        if (this.comptes.length === 0) return;

        const requests = this.comptes.map(compte =>
            this.apiService.getTransactionsByCompte(compte.id!)
        );

        import('rxjs').then(({ forkJoin }) => {
            forkJoin(requests).subscribe(results => {
                this.allTransactions = results.flat();
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        let filtered = [...this.allTransactions];

        if (this.filters.type) {
            filtered = filtered.filter(t => t.typeTransaction === this.filters.type);
        }

        if (this.filters.compteId) {
            filtered = filtered.filter(t => t.compteId === Number(this.filters.compteId));
        }

        if (this.filters.dateDebut) {
            const debut = new Date(this.filters.dateDebut);
            filtered = filtered.filter(t => new Date(t.dateTransaction) >= debut);
        }

        if (this.filters.dateFin) {
            const fin = new Date(this.filters.dateFin);
            fin.setHours(23, 59, 59);
            filtered = filtered.filter(t => new Date(t.dateTransaction) <= fin);
        }

        this.filteredTransactions = filtered;
        this.calculateStats();
        this.sortTransactions();
        this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updateDisplayedTransactions();
    }

    calculateStats() {
        this.totalDepots = this.filteredTransactions
            .filter(t => t.typeTransaction === 'DEPOT')
            .reduce((sum, t) => sum + t.montant, 0);

        this.totalRetraits = this.filteredTransactions
            .filter(t => t.typeTransaction === 'RETRAIT' || t.typeTransaction === 'VIREMENT')
            .reduce((sum, t) => sum + t.montant, 0);
    }

    sortBy(field: 'dateTransaction' | 'montant') {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'desc';
        }
        this.sortTransactions();
        this.updateDisplayedTransactions();
    }

    sortTransactions() {
        this.filteredTransactions.sort((a, b) => {
            let comparison = 0;
            if (this.sortField === 'dateTransaction') {
                comparison = new Date(a.dateTransaction).getTime() - new Date(b.dateTransaction).getTime();
            } else {
                comparison = a.montant - b.montant;
            }
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    resetFilters() {
        this.filters = {
            type: '',
            compteId: '',
            dateDebut: '',
            dateFin: ''
        };
        this.applyFilters();
    }

    updateDisplayedTransactions() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.displayedTransactions = this.filteredTransactions.slice(start, end);
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

    getCompteNumero(compteId: number): string {
        const compte = this.comptes.find(c => c.id === compteId);
        return compte ? compte.numeroCompte.substring(0, 20) + '...' : 'N/A';
    }

    exportToPDF() {
        alert('Fonctionnalité d\'export PDF à venir');
    }
}
