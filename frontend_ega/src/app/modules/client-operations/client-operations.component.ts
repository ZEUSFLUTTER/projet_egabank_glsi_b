import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Compte } from '../../core/models';

type OperationType = 'virement' | 'depot' | 'retrait';

@Component({
  selector: 'app-client-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Mes Opérations</h1>
        <p class="text-sm text-gray-500 mt-1">Effectuez vos opérations bancaires en toute sécurité.</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              (click)="activeTab = 'virement'"
              [ngClass]="{
                'border-blue-600 text-blue-600': activeTab === 'virement',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'virement'
              }"
              class="flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              <span class="iconify inline-block mr-2" data-icon="lucide:arrow-left-right" data-width="18"></span>
              Virement
            </button>
            <button
              (click)="activeTab = 'depot'"
              [ngClass]="{
                'border-blue-600 text-blue-600': activeTab === 'depot',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'depot'
              }"
              class="flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              <span class="iconify inline-block mr-2" data-icon="lucide:arrow-down-to-line" data-width="18"></span>
              Dépôt
            </button>
            <button
              (click)="activeTab = 'retrait'"
              [ngClass]="{
                'border-blue-600 text-blue-600': activeTab === 'retrait',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'retrait'
              }"
              class="flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              <span class="iconify inline-block mr-2" data-icon="lucide:arrow-up-from-line" data-width="18"></span>
              Retrait
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Virement Tab -->
          <div *ngIf="activeTab === 'virement'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Compte source</label>
              <select [(ngModel)]="virementData.compteSourceId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionnez un compte</option>
                <option *ngFor="let compte of myAccounts" [value]="compte.id">
                  {{ compte.type }} - {{ compte.numeroCompte }} ({{ compte.solde | number:'1.0-0' }} FCFA)
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Compte destinataire (Numéro de compte)</label>
              <input
                type="text"
                [(ngModel)]="virementData.compteDestinationNumero"
                placeholder="Ex: 1234567890123456789012345678"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Montant (FCFA)</label>
              <input
                type="number"
                [(ngModel)]="virementData.montant"
                placeholder="0"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                [(ngModel)]="virementData.description"
                placeholder="Ex: Paiement facture"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <button
              (click)="executeVirement()"
              [disabled]="loading || !virementData.compteSourceId || !virementData.compteDestinationNumero || !virementData.montant"
              class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="loading" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="20"></span>
              <span>{{ loading ? 'Traitement...' : 'Effectuer le virement' }}</span>
            </button>
          </div>

          <!-- Dépôt Tab -->
          <div *ngIf="activeTab === 'depot'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Compte à créditer</label>
              <select [(ngModel)]="depotData.compteId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option [value]="0">Sélectionnez un compte</option>
                <option *ngFor="let compte of myAccounts" [value]="compte.id">
                  {{ compte.type }} - {{ compte.numeroCompte }} ({{ compte.solde | number:'1.0-0' }} FCFA)
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Montant à déposer (FCFA)</label>
              <input
                type="number"
                [(ngModel)]="depotData.montant"
                placeholder="0"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                [(ngModel)]="depotData.description"
                placeholder="Ex: Dépôt espèces"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <button
              (click)="executeDepot()"
              [disabled]="loading || !depotData.compteId || !depotData.montant"
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="loading" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="20"></span>
              <span>{{ loading ? 'Traitement...' : 'Effectuer le dépôt' }}</span>
            </button>
          </div>

          <!-- Retrait Tab -->
          <div *ngIf="activeTab === 'retrait'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Compte à débiter</label>
              <select [(ngModel)]="retraitData.compteId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option [value]="0">Sélectionnez un compte</option>
                <option *ngFor="let compte of myAccounts" [value]="compte.id">
                  {{ compte.type }} - {{ compte.numeroCompte }} ({{ compte.solde | number:'1.0-0' }} FCFA)
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Montant à retirer (FCFA)</label>
              <input
                type="number"
                [(ngModel)]="retraitData.montant"
                placeholder="0"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                [(ngModel)]="retraitData.description"
                placeholder="Ex: Retrait espèces"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <button
              (click)="executeRetrait()"
              [disabled]="loading || !retraitData.compteId || !retraitData.montant"
              class="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="loading" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="20"></span>
              <span>{{ loading ? 'Traitement...' : 'Effectuer le retrait' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Message de succès/erreur -->
      <div *ngIf="message" [ngClass]="{
        'bg-green-50 border-green-200 text-green-800': messageType === 'success',
        'bg-red-50 border-red-200 text-red-800': messageType === 'error'
      }" class="p-4 rounded-lg border flex items-start gap-3">
        <span class="iconify flex-shrink-0 mt-0.5" 
              [attr.data-icon]="messageType === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" 
              data-width="20"></span>
        <p class="text-sm">{{ message }}</p>
      </div>
    </div>
  `
})
export class ClientOperationsComponent implements OnInit {
  activeTab: OperationType = 'virement';
  myAccounts: Compte[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  virementData = {
    compteSourceId: '',
    compteDestinationNumero: '',
    montant: 0,
    description: ''
  };

  depotData = {
    compteId: '',
    montant: 0,
    description: ''
  };

  retraitData = {
    compteId: '',
    montant: 0,
    description: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadMyAccounts();
  }

  loadMyAccounts() {
    console.log('🔍 Chargement des comptes du client...');
    this.apiService.getMyAccounts().subscribe({
      next: (accounts) => {
        console.log('✅ Comptes récupérés:', accounts);
        this.myAccounts = accounts;

        // Auto-sélection du premier compte
        if (accounts.length > 0) {
          const firstId = accounts[0].id!.toString();
          this.virementData.compteSourceId = firstId;
          this.depotData.compteId = firstId;
          this.retraitData.compteId = firstId;
        }

        if (accounts.length === 0) {
          this.showMessage('Vous n\'avez pas encore de compte bancaire. Contactez votre agence.', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des comptes:', err);
        this.showMessage('Erreur lors du chargement de vos comptes', 'error');
      }
    });
  }

  executeVirement() {
    if (!this.virementData.compteSourceId || !this.virementData.compteDestinationNumero || !this.virementData.montant) {
      return;
    }

    this.loading = true;
    this.message = '';

    // First, lookup the destination account by numero to get its ID
    this.apiService.getCompteByNumero(this.virementData.compteDestinationNumero).subscribe({
      next: (compteDestination) => {
        // Now execute the virement with the account ID
        this.apiService.effectuerVirement(
          Number(this.virementData.compteSourceId),
          compteDestination.id!,
          this.virementData.montant,
          this.virementData.description
        ).subscribe({
          next: () => {
            this.showMessage('Virement effectué avec succès !', 'success');
            this.resetVirementForm();
            this.loadMyAccounts();
            this.loading = false;
          },
          error: (error) => {
            this.showMessage(error.error?.message || 'Erreur lors du virement', 'error');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Compte destinataire introuvable', 'error');
        this.loading = false;
      }
    });
  }

  executeDepot() {
    if (!this.depotData.compteId || !this.depotData.montant) {
      return;
    }

    this.loading = true;
    this.message = '';

    this.apiService.effectuerDepot(
      Number(this.depotData.compteId),
      this.depotData.montant,
      this.depotData.description
    ).subscribe({
      next: () => {
        this.showMessage('Dépôt effectué avec succès !', 'success');
        this.resetDepotForm();
        this.loadMyAccounts();
        this.loading = false;
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Erreur lors du dépôt', 'error');
        this.loading = false;
      }
    });
  }

  executeRetrait() {
    if (!this.retraitData.compteId || !this.retraitData.montant) {
      return;
    }

    this.loading = true;
    this.message = '';

    this.apiService.effectuerRetrait(
      Number(this.retraitData.compteId),
      this.retraitData.montant,
      this.retraitData.description
    ).subscribe({
      next: () => {
        this.showMessage('Retrait effectué avec succès !', 'success');
        this.resetRetraitForm();
        this.loadMyAccounts();
        this.loading = false;
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Erreur lors du retrait', 'error');
        this.loading = false;
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  resetVirementForm() {
    this.virementData = {
      compteSourceId: '',
      compteDestinationNumero: '',
      montant: 0,
      description: ''
    };
  }

  resetDepotForm() {
    this.depotData = {
      compteId: '',
      montant: 0,
      description: ''
    };
  }

  resetRetraitForm() {
    this.retraitData = {
      compteId: '',
      montant: 0,
      description: ''
    };
  }
}
