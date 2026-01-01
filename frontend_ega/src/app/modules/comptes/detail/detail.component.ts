import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Compte, Transaction } from '../../../core/models';

@Component({
  selector: 'app-compte-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header avec retour -->
      <div class="flex items-center gap-4">
        <a routerLink="/comptes" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span class="iconify text-gray-500" data-icon="lucide:arrow-left" data-width="20"></span>
        </a>
        <div class="flex-1">
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Détail du Compte</h1>
          <p class="text-sm text-gray-500 mt-0.5" *ngIf="compte">{{ compte.numeroCompte }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="!compte" class="text-center py-12">
        <span class="iconify animate-spin text-gray-400" data-icon="lucide:loader-2" data-width="32"></span>
        <p class="text-gray-500 mt-2 text-sm">Chargement...</p>
      </div>

      <!-- Compte Details -->
      <div *ngIf="compte" class="space-y-6">
        <!-- Carte principale -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div [ngClass]="compte.type === 'COURANT' ? 'bg-gray-900' : 'bg-blue-100'" class="h-14 w-14 flex-shrink-0 rounded-xl flex items-center justify-center">
                <span class="iconify" [ngClass]="compte.type === 'COURANT' ? 'text-white' : 'text-blue-600'" [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" data-width="28"></span>
              </div>
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1"
                      [ngClass]="compte.type === 'COURANT' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'">
                  {{ compte.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne' }}
                </span>
                <p class="text-lg font-mono text-gray-900">{{ compte.numeroCompte }}</p>
                <p class="text-sm text-gray-500">Créé le {{ compte.dateCreation | date:'dd/MM/yyyy' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 uppercase tracking-wider">Solde actuel</p>
              <p class="text-3xl font-bold" [ngClass]="compte.solde >= 0 ? 'text-gray-900' : 'text-red-600'">
                {{ compte.solde | number:'1.0-0' }} <span class="text-lg">FCFA</span>
              </p>
            </div>
          </div>

          <!-- Infos supplémentaires -->
          <div class="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider">Propriétaire</p>
              <a [routerLink]="['/clients', compte.clientId]" class="text-sm font-medium text-brand-600 hover:underline">
                {{ compte.clientPrenom }} {{ compte.clientNom }}
              </a>
            </div>
            <div *ngIf="compte.type === 'COURANT'">
              <p class="text-xs text-gray-500 uppercase tracking-wider">Découvert Autorisé</p>
              <p class="text-sm font-medium text-gray-900">{{ compte.decouvertAutorise | number:'1.0-0' }} FCFA</p>
            </div>
            <div *ngIf="compte.type === 'EPARGNE'">
              <p class="text-xs text-gray-500 uppercase tracking-wider">Taux d'intérêt</p>
              <p class="text-sm font-medium text-gray-900">{{ compte.tauxInteret }}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider">Nb. Transactions</p>
              <p class="text-sm font-medium text-gray-900">{{ transactions.length }}</p>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-3 gap-3">
          <button (click)="openOperationModal('DEPOT')" class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all text-center group">
            <span class="iconify mx-auto text-emerald-500 group-hover:scale-110 transition-transform" data-icon="lucide:plus-circle" data-width="24"></span>
            <p class="text-sm font-medium text-gray-700 mt-2">Dépôt</p>
          </button>
          <button (click)="openOperationModal('RETRAIT')" class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all text-center group">
            <span class="iconify mx-auto text-orange-500 group-hover:scale-110 transition-transform" data-icon="lucide:minus-circle" data-width="24"></span>
            <p class="text-sm font-medium text-gray-700 mt-2">Retrait</p>
          </button>
          <button (click)="openOperationModal('VIREMENT')" class="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all text-center group">
            <span class="iconify mx-auto text-blue-500 group-hover:scale-110 transition-transform" data-icon="lucide:send" data-width="24"></span>
            <p class="text-sm font-medium text-gray-700 mt-2">Virement</p>
          </button>
        </div>

        <!-- Historique -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-sm font-semibold text-gray-900">Historique des transactions</h3>
            <button (click)="downloadPdf()" [disabled]="downloadingPdf" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50">
              <span *ngIf="!downloadingPdf" class="iconify" data-icon="lucide:download" data-width="14"></span>
              <span *ngIf="downloadingPdf" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="14"></span>
              {{ downloadingPdf ? 'Génération...' : 'Télécharger PDF' }}
            </button>
          </div>

          <table *ngIf="transactions.length > 0" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let tr of transactions" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{{ tr.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-800': tr.typeTransaction === 'DEPOT',
                          'bg-orange-100 text-orange-800': tr.typeTransaction === 'RETRAIT',
                          'bg-blue-100 text-blue-800': tr.typeTransaction === 'VIREMENT'
                        }">
                    {{ tr.typeTransaction }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ tr.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold"
                    [ngClass]="tr.typeTransaction === 'DEPOT' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ tr.typeTransaction === 'DEPOT' ? '+' : '-' }}{{ tr.montant | number:'1.0-0' }} FCFA
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="transactions.length === 0" class="p-12 text-center">
            <span class="iconify text-gray-300 mb-2" data-icon="lucide:receipt" data-width="48"></span>
            <p class="text-gray-500 text-sm">Aucune transaction pour ce compte.</p>
          </div>
        </div>
      </div>

      <!-- Modal Opération -->
      <div *ngIf="showOperationModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ operationType === 'DEPOT' ? 'Effectuer un dépôt' : (operationType === 'RETRAIT' ? 'Effectuer un retrait' : 'Effectuer un virement') }}
              </h3>
              <button (click)="showOperationModal = false" class="p-1 hover:bg-gray-100 rounded-lg">
                <span class="iconify text-gray-400" data-icon="lucide:x" data-width="20"></span>
              </button>
            </div>
          </div>
          <form (ngSubmit)="executeOperation()" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Montant (FCFA)</label>
              <input type="number" [(ngModel)]="opAmount" name="amount" required min="1" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-lg font-semibold">
            </div>

            <div *ngIf="operationType === 'VIREMENT'">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Compte Destination (ID)</label>
              <input type="number" [(ngModel)]="opDestinationId" name="destinationId" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
              <input type="text" [(ngModel)]="opDescription" name="description" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" (click)="showOperationModal = false" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">Annuler</button>
              <button type="submit" [disabled]="executingOp" class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50">
                {{ executingOp ? 'En cours...' : 'Confirmer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class CompteDetailComponent implements OnInit {
  compte?: Compte;
  transactions: Transaction[] = [];
  downloadingPdf = false;

  // Modal opération
  showOperationModal = false;
  operationType: 'DEPOT' | 'RETRAIT' | 'VIREMENT' = 'DEPOT';
  opAmount = 0;
  opDestinationId?: number;
  opDescription = '';
  executingOp = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCompte(id);
      this.loadTransactions(id);
    }
  }

  loadCompte(id: number) {
    this.apiService.getCompteById(id).subscribe((compte) => {
      this.compte = compte;
    });
  }

  loadTransactions(id: number) {
    this.apiService.getTransactionsByCompte(id).subscribe((transactions) => {
      this.transactions = transactions;
    });
  }

  openOperationModal(type: 'DEPOT' | 'RETRAIT' | 'VIREMENT') {
    this.operationType = type;
    this.opAmount = 0;
    this.opDestinationId = undefined;
    this.opDescription = '';
    this.showOperationModal = true;
  }

  executeOperation() {
    if (!this.compte || this.opAmount <= 0) return;

    this.executingOp = true;
    let request;

    switch (this.operationType) {
      case 'DEPOT':
        request = this.apiService.effectuerDepot(this.compte.id!, this.opAmount, this.opDescription || 'Dépôt');
        break;
      case 'RETRAIT':
        request = this.apiService.effectuerRetrait(this.compte.id!, this.opAmount, this.opDescription || 'Retrait');
        break;
      case 'VIREMENT':
        if (!this.opDestinationId) {
          alert('Veuillez spécifier le compte destination.');
          this.executingOp = false;
          return;
        }
        request = this.apiService.effectuerVirement(this.compte.id!, this.opDestinationId, this.opAmount, this.opDescription || 'Virement');
        break;
    }

    request.subscribe({
      next: () => {
        this.executingOp = false;
        this.showOperationModal = false;
        // Recharger les données
        this.loadCompte(this.compte!.id!);
        this.loadTransactions(this.compte!.id!);
      },
      error: (err) => {
        this.executingOp = false;
        alert(err.error?.message || 'Erreur lors de l\'opération.');
      }
    });
  }

  downloadPdf() {
    if (!this.compte) return;

    this.downloadingPdf = true;
    const annee = new Date().getFullYear();
    const mois = new Date().getMonth() + 1;

    this.apiService.downloadReleveMensuelPdf(this.compte.id!, annee, mois).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${this.compte!.id}_${annee}_${String(mois).padStart(2, '0')}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingPdf = false;
      },
      error: () => {
        this.downloadingPdf = false;
        alert('Erreur lors du téléchargement du relevé PDF.');
      }
    });
  }
}
