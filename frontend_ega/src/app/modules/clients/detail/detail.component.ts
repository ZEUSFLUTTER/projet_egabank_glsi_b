import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Client, Compte, Transaction } from '../../../core/models';
import { ClientFormModalComponent } from '../../../shared/components/client-form-modal/client-form-modal.component';
import { AccountFormModalComponent } from '../../../shared/components/account-form-modal/account-form-modal.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientFormModalComponent, AccountFormModalComponent],
  template: `
    <div class="max-w-6xl mx-auto space-y-8" *ngIf="client">
      <!-- Client Profile Header -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div class="flex items-start gap-5">
          <div class="h-16 w-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-medium text-gray-500 flex-shrink-0">
            {{ client.nom[0] }}{{ client.prenom[0] }}
          </div>
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-gray-900">{{ client.prenom }} {{ client.nom }}</h1>
            <div class="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span class="flex items-center gap-1.5"><span class="iconify" data-icon="lucide:map-pin" data-width="14"></span> {{ client.adresse }}</span>
              <span class="flex items-center gap-1.5"><span class="iconify" data-icon="lucide:phone" data-width="14"></span> {{ client.telephone }}</span>
              <span class="flex items-center gap-1.5"><span class="iconify" data-icon="lucide:mail" data-width="14"></span> {{ client.email }}</span>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                Né le {{ client.dateNaissance | date }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {{ client.nationalite }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {{ client.sexe === 'M' ? 'Masculin' : 'Féminin' }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button (click)="onEditClient()" class="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all">
            <span class="iconify mr-2" data-icon="lucide:edit-2" data-width="14"></span>
            Modifier
          </button>
          <button (click)="onDeleteClient()" class="inline-flex items-center px-3 py-2 border border-rose-200 shadow-sm text-sm font-medium rounded-md text-rose-700 bg-white hover:bg-rose-50 transition-all">
            <span class="iconify mr-2" data-icon="lucide:trash-2" data-width="14"></span>
            Supprimer
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Accounts & Operations -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Accounts Section -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-medium text-gray-900">Comptes Bancaires</h2>
              <button (click)="showCreateAccountModal = true" class="text-sm text-gray-900 hover:text-black font-semibold flex items-center gap-1">
                <span class="iconify" data-icon="lucide:plus-circle" data-width="16"></span>
                Créer un compte
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let compte of accounts" 
                   (click)="selectAccount(compte)"
                   [ngClass]="{'bg-gray-900 border-gray-800': compte.type === 'COURANT', 'bg-white border-gray-200': compte.type === 'EPARGNE'}"
                   class="group relative p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border">
                
                <!-- Delete Button for Account -->
                <button (click)="onDeleteAccount($event, compte)" 
                        class="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        [ngClass]="compte.type === 'COURANT' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-rose-600 hover:bg-gray-100'">
                  <span class="iconify" data-icon="lucide:trash-2" data-width="14"></span>
                </button>

                <div *ngIf="compte.type === 'COURANT'" class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
                <div class="flex justify-between items-start">
                  <div>
                    <p [ngClass]="compte.type === 'COURANT' ? 'text-gray-400' : 'text-gray-500'" class="text-xs font-medium uppercase tracking-wider">
                      {{ compte.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne' }}
                    </p>
                    <p [ngClass]="compte.type === 'COURANT' ? 'text-white' : 'text-gray-900'" class="text-2xl font-semibold tracking-tight mt-1">{{ compte.solde | number:'1.0-0' }} FCFA</p>
                  </div>
                  <div [ngClass]="compte.type === 'COURANT' ? 'bg-gray-800' : 'bg-gray-100'" class="p-1.5 rounded-md">
                    <span class="iconify" [ngClass]="compte.type === 'COURANT' ? 'text-white' : 'text-gray-600'" [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" data-width="20"></span>
                  </div>
                </div>
                <div class="mt-6">
                  <p [ngClass]="compte.type === 'COURANT' ? 'text-gray-500' : 'text-gray-400'" class="text-xs">IBAN</p>
                  <p [ngClass]="compte.type === 'COURANT' ? 'text-gray-300' : 'text-gray-600'" class="text-sm font-mono tracking-wide mt-0.5">{{ compte.numeroCompte }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Transaction History Table -->
          <section *ngIf="selectedAccount">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-medium text-gray-900">Historique des transactions - {{ selectedAccount.numeroCompte }}</h2>
            </div>
            
            <div class="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let tr of transactions" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tr.dateTransaction | date:'dd MMM yyyy' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ tr.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-800': tr.typeTransaction === 'DEPOT',
                          'bg-orange-100 text-orange-800': tr.typeTransaction === 'RETRAIT',
                          'bg-blue-100 text-blue-800': tr.typeTransaction === 'VIREMENT'
                        }">
                        {{ tr.typeTransaction }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        [ngClass]="tr.typeTransaction === 'DEPOT' ? 'text-green-600' : 'text-gray-900'">
                      {{ tr.typeTransaction === 'DEPOT' ? '+' : '-' }} {{ tr.montant | number:'1.0-0' }} FCFA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Right Column: Operation Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div class="p-5 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Nouvelle Opération</h3>
            </div>
            
            <div class="p-1 mx-5 mt-5 bg-gray-100 rounded-lg flex">
              <button (click)="opType = 'VIREMENT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': opType === 'VIREMENT'}" class="flex-1 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-700 text-center">Virement</button>
              <button (click)="opType = 'DEPOT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': opType === 'DEPOT'}" class="flex-1 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-700 text-center">Dépôt</button>
              <button (click)="opType = 'RETRAIT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': opType === 'RETRAIT'}" class="flex-1 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-700 text-center">Retrait</button>
            </div>

            <div class="p-5 space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Compte</label>
                <div class="relative">
                  <select [(ngModel)]="opCompteId" class="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 rounded-md bg-white border shadow-sm appearance-none">
                    <option *ngFor="let acc of accounts" [value]="acc.id">{{ acc.type }} (...{{acc.numeroCompte.slice(-4)}}) - {{ acc.solde | number:'1.0-0' }} FCFA</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <span class="iconify" data-icon="lucide:chevron-down" data-width="14"></span>
                  </div>
                </div>
              </div>

              <div *ngIf="opType === 'VIREMENT'">
                <label class="block text-xs font-medium text-gray-700 mb-1.5">IBAN Bénéficiaire</label>
                <input type="text" [(ngModel)]="opIbanDest" placeholder="SN76 ..." class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border shadow-sm placeholder-gray-400">
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Montant</label>
                <div class="relative rounded-md shadow-sm">
                  <input type="number" [(ngModel)]="opAmount" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border pr-14" placeholder="0">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-xs">FCFA</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Motif (Optionnel)</label>
                <input type="text" [(ngModel)]="opDescription" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border shadow-sm">
              </div>

              <button (click)="executeOperation()" [disabled]="executingOp" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 transition-colors">
                <span *ngIf="executingOp" class="iconify animate-spin mr-2" data-icon="lucide:loader-2" data-width="16"></span>
                {{ executingOp ? 'Traitement...' : 'Exécuter' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shared Modals -->
    <app-client-form-modal
      [isVisible]="showEditModal"
      [clientToEdit]="client!"
      (close)="showEditModal = false"
      (save)="reloadClient()">
    </app-client-form-modal>

    <app-account-form-modal
      [isVisible]="showCreateAccountModal"
      [preselectedClientId]="client?.id || null"
      (close)="showCreateAccountModal = false"
      (save)="reloadAccounts()">
    </app-account-form-modal>
  `,
})
export class ClientDetailComponent implements OnInit {
  client?: Client;
  accounts: Compte[] = [];
  selectedAccount?: Compte;
  transactions: Transaction[] = [];

  // Operation fields
  opType: 'VIREMENT' | 'DEPOT' | 'RETRAIT' = 'DEPOT';
  opCompteId = '';
  opAmount = 0;
  opDescription = '';
  opIbanDest = '';
  executingOp = false;

  showEditModal = false;
  showCreateAccountModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(Number(id));
    }
  }

  loadClient(id: number) {
    this.apiService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
        this.loadAccounts(id);
      },
      error: () => this.router.navigate(['/clients'])
    });
  }

  reloadClient() {
    if (this.client?.id) {
      this.loadClient(this.client.id);
    }
  }

  loadAccounts(clientId: number) {
    this.apiService.getClientAccounts(clientId).subscribe(accounts => {
      this.accounts = accounts;
      if (this.accounts.length > 0) {
        if (!this.selectedAccount) {
          this.selectAccount(this.accounts[0]);
          this.opCompteId = this.accounts[0].id?.toString() || '';
        }
        else {
          const stillExists = this.accounts.find(a => a.id === this.selectedAccount?.id);
          if (!stillExists) this.selectAccount(this.accounts[0]);
        }
      } else {
        this.selectedAccount = undefined;
        this.transactions = [];
      }
    });
  }

  reloadAccounts() {
    if (this.client?.id) {
      this.loadAccounts(this.client.id);
    }
  }

  onEditClient() {
    if (this.client) {
      this.showEditModal = true;
    }
  }

  executeOperation() {
    if (!this.opCompteId || this.opAmount <= 0) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    this.executingOp = true;
    const accountId = Number(this.opCompteId);

    let observer = {
      next: () => {
        this.executingOp = false;
        this.opAmount = 0;
        this.opDescription = '';
        this.opIbanDest = '';
        if (this.client) this.loadAccounts(this.client.id!);
      },
      error: (err: any) => {
        this.executingOp = false;
        alert(err.error?.message || 'Erreur lors de l’opération.');
      }
    };

    if (this.opType === 'DEPOT') {
      this.apiService.effectuerDepot(accountId, this.opAmount, this.opDescription).subscribe(observer);
    } else if (this.opType === 'RETRAIT') {
      this.apiService.effectuerRetrait(accountId, this.opAmount, this.opDescription).subscribe(observer);
    } else if (this.opType === 'VIREMENT') {
      if (!this.opIbanDest) {
        alert('IBAN destinataire requis pour un virement.');
        this.executingOp = false;
        return;
      }
      this.apiService.getCompteByNumero(this.opIbanDest).subscribe({
        next: (destAcc) => {
          this.apiService.effectuerVirement(accountId, destAcc.id!, this.opAmount, this.opDescription).subscribe(observer);
        },
        error: () => {
          this.executingOp = false;
          alert('IBAN destinataire introuvable.');
        }
      });
    }
  }

  selectAccount(account: Compte) {
    this.selectedAccount = account;
    this.loadTransactions(account.id!);
  }

  loadTransactions(compteId: number) {
    this.apiService.getTransactionsByCompte(compteId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  onDeleteClient() {
    if (this.client && confirm(`Supprimer définitivement le client ${this.client.prenom} ${this.client.nom} ?`)) {
      this.apiService.deleteClient(this.client.id!).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    }
  }

  onDeleteAccount(event: Event, compte: Compte) {
    event.stopPropagation();
    if (confirm(`Supprimer le compte ${compte.numeroCompte} ?`)) {
      this.apiService.deleteCompte(compte.id!).subscribe(() => {
        if (this.client) this.loadAccounts(this.client.id!);
      });
    }
  }
}
