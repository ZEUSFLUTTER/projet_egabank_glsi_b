
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Client, Compte, Transaction } from '../../core/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Mon Espace Client</h1>
          <p class="text-sm text-gray-500 mt-1">Gérez vos comptes et opérations en toute simplicité.</p>
        </div>
        <div class="flex gap-4">
             <button (click)="logout()" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <span class="iconify text-gray-500" data-icon="lucide:log-out" data-width="18"></span>
                Déconnexion
            </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a routerLink="/client/operations" class="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
              <span class="iconify" data-icon="lucide:arrow-left-right" data-width="24"></span>
            </span>
            <span class="font-medium text-gray-900">Mes Opérations</span>
          </a>
          
          <a routerLink="/client/historique" class="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
            <span class="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
              <span class="iconify" data-icon="lucide:history" data-width="24"></span>
            </span>
            <span class="font-medium text-gray-900">Historique</span>
          </a>
          
          <a routerLink="/client/releves" class="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
            <span class="p-3 bg-green-100 rounded-full text-green-600 group-hover:scale-110 transition-transform">
              <span class="iconify" data-icon="lucide:file-text" data-width="24"></span>
            </span>
            <span class="font-medium text-gray-900">Mes Relevés</span>
          </a>
      </div>

      <!-- Mes Comptes -->
      <h2 class="text-lg font-semibold text-gray-900">Mes Comptes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a *ngFor="let compte of comptes" [routerLink]="['/client/comptes', compte.id]" 
           class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                     <div [ngClass]="compte.type === 'COURANT' ? 'bg-blue-600' : 'bg-green-600'" class="h-10 w-10 rounded-lg flex items-center justify-center text-white">
                        <span class="iconify" [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" data-width="20"></span>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">{{ compte.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne' }}</p>
                        <p class="text-sm text-gray-500 font-mono">{{ compte.numeroCompte }}</p>
                    </div>
                </div>
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Actif</span>
            </div>
            
            <div class="flex justify-between items-end">
                <div>
                     <p class="text-sm text-gray-500 mb-1">Solde disponible</p>
                     <p class="text-2xl font-bold text-gray-900">{{ compte.solde | number:'1.0-0' }} FCFA</p>
                </div>
                <span class="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Voir détails
                  <span class="iconify" data-icon="lucide:arrow-right" data-width="16"></span>
                </span>
            </div>
        </a>
        
        <div *ngIf="comptes.length === 0" class="col-span-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500">Vous n'avez pas encore de compte bancaire.</p>
        </div>
      </div>

      <!-- Historique des Transactions -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Historique des Transactions</h2>
          <span class="text-sm text-gray-500">{{ allTransactions.length }} transaction(s)</span>
        </div>

        <div *ngIf="loadingTransactions" class="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <span class="iconify animate-spin text-blue-600" data-icon="lucide:loader-2" data-width="32"></span>
          <p class="text-gray-500 mt-2">Chargement des transactions...</p>
        </div>

        <div *ngIf="!loadingTransactions && allTransactions.length > 0" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
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
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div *ngIf="allTransactions.length > transactionsPerPage" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Affichage de {{ (currentPage - 1) * transactionsPerPage + 1 }} à {{ Math.min(currentPage * transactionsPerPage, allTransactions.length) }} sur {{ allTransactions.length }}
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

        <div *ngIf="!loadingTransactions && allTransactions.length === 0" class="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
          <span class="iconify text-gray-300 mb-2" data-icon="lucide:inbox" data-width="48"></span>
          <p class="text-gray-500">Aucune transaction pour le moment.</p>
        </div>
      </div>
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  client: Client | null = null;
  comptes: Compte[] = [];
  allTransactions: Transaction[] = [];
  displayedTransactions: Transaction[] = [];
  loadingTransactions = false;

  // Pagination
  currentPage = 1;
  transactionsPerPage = 10;
  totalPages = 1;

  Math = Math; // Pour utiliser Math.min dans le template

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getMyProfile().subscribe(client => {
      this.client = client;
    });

    this.apiService.getMyAccounts().subscribe(comptes => {
      this.comptes = comptes;
      this.loadAllTransactions();
    });
  }

  loadAllTransactions() {
    if (this.comptes.length === 0) {
      this.allTransactions = [];
      this.updateDisplayedTransactions();
      return;
    }

    this.loadingTransactions = true;

    // Charger les transactions de tous les comptes
    const requests = this.comptes.map(compte =>
      this.apiService.getTransactionsByCompte(compte.id!)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        // Fusionner toutes les transactions
        this.allTransactions = results.flat();

        // Trier par date décroissante (plus récentes en premier)
        this.allTransactions.sort((a, b) =>
          new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
        );

        this.totalPages = Math.ceil(this.allTransactions.length / this.transactionsPerPage);
        this.updateDisplayedTransactions();
        this.loadingTransactions = false;
      },
      error: () => {
        this.loadingTransactions = false;
        this.allTransactions = [];
        this.updateDisplayedTransactions();
      }
    });
  }

  updateDisplayedTransactions() {
    const start = (this.currentPage - 1) * this.transactionsPerPage;
    const end = start + this.transactionsPerPage;
    this.displayedTransactions = this.allTransactions.slice(start, end);
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
    return compte ? compte.numeroCompte : 'N/A';
  }

  logout() {
    this.authService.logout();
  }
}
