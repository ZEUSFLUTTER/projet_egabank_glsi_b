import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankService, Transaction, Client } from '../../../core/services/bank.service';

@Component({
  selector: 'app-admin-transactions-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Historique des Transactions</h2>
          <p class="text-sm text-slate-500">Consultez les transactions par client</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600">{{ getFilteredTransactions().length }} transaction(s)</span>
        </div>
      </div>

      <!-- Client Search -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <label class="block text-sm font-bold text-slate-700 mb-3">Sélectionner un client</label>
        <div class="relative">
          <input 
            type="text"
            [(ngModel)]="clientSearchQuery"
            (input)="onClientSearch()"
            placeholder="Rechercher par nom ou email..."
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div *ngIf="clientSearchQuery" class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
            <div *ngIf="getFilteredClients().length > 0" class="divide-y divide-slate-200">
              <button 
                *ngFor="let client of getFilteredClients()"
                (click)="selectClient(client)"
                class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors focus:outline-none focus:bg-indigo-50">
                <div class="font-semibold text-slate-800">{{ client.firstName }} {{ client.lastName }}</div>
                <div class="text-xs text-slate-500">{{ client.email }}</div>
              </button>
            </div>
            <div *ngIf="getFilteredClients().length === 0" class="px-4 py-4 text-center text-slate-500 text-sm">
              Aucun client trouvé
            </div>
          </div>
        </div>
        <div *ngIf="selectedClientId && selectedClient" class="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p class="text-sm text-indigo-700">
            <strong>Sélectionné:</strong> {{ selectedClient.firstName }} {{ selectedClient.lastName }}
            <button (click)="clearSelection()" class="ml-2 text-indigo-600 hover:text-indigo-800 text-xs font-semibold">✕</button>
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div *ngIf="selectedClientId" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div class="flex flex-wrap gap-3">
          <button 
            (click)="filterType = 'DEPOSIT'" 
            [class]="filterType === 'DEPOSIT' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-90">
            Dépôts
          </button>
          <button 
            (click)="filterType = 'WITHDRAWAL'" 
            [class]="filterType === 'WITHDRAWAL' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-90">
            Retraits
          </button>
          <button 
            (click)="filterType = 'TRANSFER'" 
            [class]="filterType === 'TRANSFER' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:opacity-90">
            Virements
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <!-- Transactions Table -->
      <div *ngIf="!loading" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" *ngIf="getFilteredTransactions().length > 0">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Compte Source</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Compte Destination</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr *ngFor="let tx of getFilteredTransactions()" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm text-slate-800">{{ (tx.transactionDate || tx.createdAt) | date:'dd/MM/yyyy' }}</div>
                  <div class="text-xs text-slate-500">{{ (tx.transactionDate || tx.createdAt) | date:'HH:mm:ss' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span [class]="getTypeClass(tx.transactionType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {{ getTypeLabel(tx.transactionType) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-slate-700">{{ tx.description || '-' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-mono text-slate-700">{{ tx.sourceAccount?.accountNumber || 'N/A' }}</div>
                  <div class="text-xs text-slate-500">{{ tx.sourceAccount?.owner?.firstName }} {{ tx.sourceAccount?.owner?.lastName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div *ngIf="tx.destinationAccount" class="text-sm font-mono text-slate-700">{{ tx.destinationAccount.accountNumber }}</div>
                  <div *ngIf="tx.destinationAccount" class="text-xs text-slate-500">{{ tx.destinationAccount?.owner?.firstName }} {{ tx.destinationAccount?.owner?.lastName }}</div>
                  <div *ngIf="!tx.destinationAccount" class="text-sm text-slate-400">-</div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div [class]="tx.transactionType === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'" class="text-sm font-bold">
                    {{ tx.transactionType === 'WITHDRAWAL' ? '-' : '+' }}{{ tx.amount | number:'1.2-2' }} FCFA
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="getFilteredTransactions().length === 0" class="p-16 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p class="text-slate-500 font-medium">Aucune transaction trouvée</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminTransactionsHistoryComponent implements OnInit {
  private bankService = inject(BankService);
  
  clients: Client[] = [];
  transactions: Transaction[] = [];
  selectedClientId: string = '';
  selectedClient: Client | null = null;
  clientSearchQuery: string = '';
  filterType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' = 'DEPOSIT';
  loading = false;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    console.log('Loading clients...');
    this.bankService.getAllClients().subscribe({
      next: (clients) => {
        console.log('Clients loaded:', clients);
        this.clients = clients;
      },
      error: (err) => {
        console.error('Error loading clients', err);
      }
    });
  }

  onClientChange(): void {
    if (this.selectedClientId) {
      this.loadTransactions();
    } else {
      this.transactions = [];
    }
  }

  getFilteredClients(): Client[] {
    if (!this.clientSearchQuery.trim()) {
      return [];
    }
    const query = this.clientSearchQuery.toLowerCase();
    return this.clients.filter(client => 
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  }

  onClientSearch(): void {
    // Search happens automatically via getFilteredClients()
  }

  selectClient(client: Client): void {
    this.selectedClientId = client.id.toString();
    this.selectedClient = client;
    this.clientSearchQuery = '';
    this.loadTransactions();
  }

  clearSelection(): void {
    this.selectedClientId = '';
    this.selectedClient = null;
    this.clientSearchQuery = '';
    this.transactions = [];
  }

  loadTransactions(): void {
    if (!this.selectedClientId) return;
    
    this.loading = true;
    this.bankService.getClientTransactions(+this.selectedClientId).subscribe({
      next: (txs) => {
        this.transactions = txs.sort((a, b) => {
          const dateA = new Date(a.transactionDate || a.createdAt || '').getTime();
          const dateB = new Date(b.transactionDate || b.createdAt || '').getTime();
          return dateB - dateA;
        });
        setTimeout(() => {
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error loading transactions', err);
        setTimeout(() => {
          this.loading = false;
        });
      }
    });
  }

  getFilteredTransactions(): Transaction[] {
    return this.transactions.filter(tx => tx.transactionType === this.filterType);
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-green-100 text-green-700';
      case 'WITHDRAWAL':
        return 'bg-orange-100 text-orange-700';
      case 'TRANSFER':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAWAL':
        return 'Retrait';
      case 'TRANSFER':
        return 'Virement';
      default:
        return type;
    }
  }
}
