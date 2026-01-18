import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Transaction, Compte } from '../../core/models';

@Component({
    selector: 'app-client-statistics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Statistiques</h1>
        <p class="text-sm text-gray-500 mt-1">Visualisez vos données bancaires</p>
      </div>

      <!-- Période -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex gap-2">
          <button *ngFor="let p of periodes" 
                  (click)="selectedPeriode = p.value; loadStatistics()"
                  [ngClass]="selectedPeriode === p.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-700 hover:text-white">
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="iconify" data-icon="lucide:wallet" data-width="24"></span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
          </div>
          <p class="text-sm opacity-90">Solde Total</p>
          <p class="text-3xl font-bold mt-1">{{ totalSolde | number:'1.0-0' }}</p>
          <p class="text-xs opacity-75 mt-1">FCFA</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="iconify" data-icon="lucide:trending-up" data-width="24"></span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded">Entrées</span>
          </div>
          <p class="text-sm opacity-90">Total Dépôts</p>
          <p class="text-3xl font-bold mt-1">{{ totalDepots | number:'1.0-0' }}</p>
          <p class="text-xs opacity-75 mt-1">FCFA</p>
        </div>

        <div class="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="iconify" data-icon="lucide:trending-down" data-width="24"></span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded">Sorties</span>
          </div>
          <p class="text-sm opacity-90">Total Retraits</p>
          <p class="text-3xl font-bold mt-1">{{ totalRetraits | number:'1.0-0' }}</p>
          <p class="text-xs opacity-75 mt-1">FCFA</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="iconify" data-icon="lucide:activity" data-width="24"></span>
            <span class="text-xs font-medium bg-white/20 px-2 py-1 rounded">Activité</span>
          </div>
          <p class="text-sm opacity-90">Transactions</p>
          <p class="text-3xl font-bold mt-1">{{ totalTransactions }}</p>
          <p class="text-xs opacity-75 mt-1">opérations</p>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Répartition par type -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Répartition par Type</h3>
          <div class="flex items-center justify-center h-64">
            <div class="text-center space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-green-500 rounded"></div>
                  <span class="text-sm text-gray-600">Dépôts: {{ countDepots }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-red-500 rounded"></div>
                  <span class="text-sm text-gray-600">Retraits: {{ countRetraits }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-blue-500 rounded"></div>
                  <span class="text-sm text-gray-600">Virements: {{ countVirements }}</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 mt-4">
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600">{{ percentDepots }}%</div>
                  <div class="text-xs text-gray-500">Dépôts</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-red-600">{{ percentRetraits }}%</div>
                  <div class="text-xs text-gray-500">Retraits</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600">{{ percentVirements }}%</div>
                  <div class="text-xs text-gray-500">Virements</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Évolution mensuelle -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Montant Moyen</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Dépôt moyen</span>
                <span class="font-semibold text-gray-900">{{ moyenneDepots | number:'1.0-0' }} FCFA</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" [style.width.%]="percentMoyenneDepots"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Retrait moyen</span>
                <span class="font-semibold text-gray-900">{{ moyenneRetraits | number:'1.0-0' }} FCFA</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" [style.width.%]="percentMoyenneRetraits"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Virement moyen</span>
                <span class="font-semibold text-gray-900">{{ moyenneVirements | number:'1.0-0' }} FCFA</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="percentMoyenneVirements"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions importantes -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Plus Grosses Transactions</h3>
        <div class="space-y-3">
          <div *ngFor="let transaction of topTransactions" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div [ngClass]="{
                'bg-green-100 text-green-600': transaction.typeTransaction === 'DEPOT',
                'bg-red-100 text-red-600': transaction.typeTransaction === 'RETRAIT',
                'bg-blue-100 text-blue-600': transaction.typeTransaction === 'VIREMENT'
              }" class="p-2 rounded-lg">
                <span class="iconify" [attr.data-icon]="getIconForType(transaction.typeTransaction)" data-width="20"></span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-xs text-gray-500">{{ transaction.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold" [ngClass]="transaction.typeTransaction === 'DEPOT' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.typeTransaction === 'DEPOT' ? '+' : '-' }} {{ transaction.montant | number:'1.0-0' }} FCFA
              </p>
            </div>
          </div>
          <div *ngIf="topTransactions.length === 0" class="text-center py-8 text-gray-500">
            Aucune transaction trouvée
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientStatisticsComponent implements OnInit {
    comptes: Compte[] = [];
    transactions: Transaction[] = [];

    periodes = [
        { label: '7 jours', value: 7 },
        { label: '30 jours', value: 30 },
        { label: '90 jours', value: 90 },
        { label: '1 an', value: 365 },
        { label: 'Tout', value: 0 }
    ];

    selectedPeriode = 30;

    // KPIs
    totalSolde = 0;
    totalDepots = 0;
    totalRetraits = 0;
    totalTransactions = 0;

    // Compteurs
    countDepots = 0;
    countRetraits = 0;
    countVirements = 0;

    // Pourcentages
    percentDepots = 0;
    percentRetraits = 0;
    percentVirements = 0;

    // Moyennes
    moyenneDepots = 0;
    moyenneRetraits = 0;
    moyenneVirements = 0;
    percentMoyenneDepots = 0;
    percentMoyenneRetraits = 0;
    percentMoyenneVirements = 0;

    // Top transactions
    topTransactions: Transaction[] = [];

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.apiService.getMyAccounts().subscribe(comptes => {
            this.comptes = comptes;
            this.totalSolde = comptes.reduce((sum, c) => sum + c.solde, 0);
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
                this.transactions = results.flat();
                this.loadStatistics();
            });
        });
    }

    loadStatistics() {
        let filtered = [...this.transactions];

        // Filtrer par période
        if (this.selectedPeriode > 0) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.selectedPeriode);
            filtered = filtered.filter(t => new Date(t.dateTransaction) >= cutoffDate);
        }

        this.totalTransactions = filtered.length;

        // Calculer les totaux
        const depots = filtered.filter(t => t.typeTransaction === 'DEPOT');
        const retraits = filtered.filter(t => t.typeTransaction === 'RETRAIT');
        const virements = filtered.filter(t => t.typeTransaction === 'VIREMENT');

        this.countDepots = depots.length;
        this.countRetraits = retraits.length;
        this.countVirements = virements.length;

        this.totalDepots = depots.reduce((sum, t) => sum + t.montant, 0);
        this.totalRetraits = retraits.reduce((sum, t) => sum + t.montant, 0) +
            virements.reduce((sum, t) => sum + t.montant, 0);

        // Calculer les pourcentages
        const total = this.countDepots + this.countRetraits + this.countVirements;
        this.percentDepots = total > 0 ? Math.round((this.countDepots / total) * 100) : 0;
        this.percentRetraits = total > 0 ? Math.round((this.countRetraits / total) * 100) : 0;
        this.percentVirements = total > 0 ? Math.round((this.countVirements / total) * 100) : 0;

        // Calculer les moyennes
        this.moyenneDepots = this.countDepots > 0 ? this.totalDepots / this.countDepots : 0;
        this.moyenneRetraits = this.countRetraits > 0 ?
            retraits.reduce((sum, t) => sum + t.montant, 0) / this.countRetraits : 0;
        this.moyenneVirements = this.countVirements > 0 ?
            virements.reduce((sum, t) => sum + t.montant, 0) / this.countVirements : 0;

        const maxMoyenne = Math.max(this.moyenneDepots, this.moyenneRetraits, this.moyenneVirements);
        this.percentMoyenneDepots = maxMoyenne > 0 ? (this.moyenneDepots / maxMoyenne) * 100 : 0;
        this.percentMoyenneRetraits = maxMoyenne > 0 ? (this.moyenneRetraits / maxMoyenne) * 100 : 0;
        this.percentMoyenneVirements = maxMoyenne > 0 ? (this.moyenneVirements / maxMoyenne) * 100 : 0;

        // Top 5 transactions
        this.topTransactions = [...filtered]
            .sort((a, b) => b.montant - a.montant)
            .slice(0, 5);
    }

    getIconForType(type: string): string {
        switch (type) {
            case 'DEPOT': return 'lucide:arrow-down-to-line';
            case 'RETRAIT': return 'lucide:arrow-up-from-line';
            case 'VIREMENT': return 'lucide:arrow-left-right';
            default: return 'lucide:circle';
        }
    }
}
