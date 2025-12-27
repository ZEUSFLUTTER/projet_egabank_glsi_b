import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Account, AccountRequest, Client } from '../../../core/models';
import { AccountService } from '../../../core/services/account.service';
import { ClientService } from '../../../core/services/client.service';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <a routerLink="/clients" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à la liste
        </a>
      </div>

      @if (client()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Client Info -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
                <div class="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
                  {{ client()!.prenom.charAt(0) }}{{ client()!.nom.charAt(0) }}
                </div>
                <h2 class="text-xl font-bold text-white">{{ client()!.nomComplet }}</h2>
                <p class="text-blue-200">{{ client()!.sexe === 'MASCULIN' ? 'Homme' : 'Femme' }}</p>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-700">{{ client()!.courriel || 'Non renseigné' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-gray-700">{{ client()!.telephone || 'Non renseigné' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-gray-700">{{ client()!.adresse || 'Non renseigné' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                  </svg>
                  <span class="text-gray-700">{{ client()!.nationalite || 'Non renseigné' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-700">{{ client()!.dateNaissance }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Accounts -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg">
              <div class="px-6 py-4 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-900">Comptes ({{ accounts().length }})</h3>
                <button (click)="showAccountModal.set(true)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Nouveau compte
                </button>
              </div>
              <div class="p-6">
                @if (accounts().length === 0) {
                  <div class="text-center py-8 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    <p>Aucun compte pour ce client</p>
                  </div>
                } @else {
                  <div class="space-y-4">
                    @for (account of accounts(); track account.id) {
                      <div class="border rounded-lg p-4 hover:shadow-md transition">
                        <div class="flex justify-between items-start">
                          <div>
                            <div class="flex items-center gap-2 mb-1">
                              <span class="px-2 py-1 text-xs font-semibold rounded"
                                [class]="account.typeCompte === 'EPARGNE' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'">
                                {{ account.typeCompteLibelle }}
                              </span>
                              @if (!account.actif) {
                                <span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">Inactif</span>
                              }
                            </div>
                            <p class="font-mono text-sm text-gray-600">{{ account.numeroCompte }}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-2xl font-bold text-gray-900">{{ account.solde | number:'1.2-2' }} XOF</p>
                            <p class="text-xs text-gray-500">Créé le {{ account.dateCreation | date:'dd/MM/yyyy' }}</p>
                          </div>
                        </div>
                        <div class="mt-4 pt-4 border-t flex gap-2">
                          <a [routerLink]="['/accounts', account.numeroCompte]" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Voir détails
                          </a>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Account Modal -->
      @if (showAccountModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div class="p-6 border-b">
              <h2 class="text-xl font-bold">Créer un nouveau compte</h2>
            </div>
            <form [formGroup]="accountForm" (ngSubmit)="createAccount()" class="p-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de compte</label>
                <select formControlName="typeCompte" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="EPARGNE">Compte Épargne</option>
                  <option value="COURANT">Compte Courant</option>
                </select>
              </div>
              <div class="flex justify-end gap-4">
                <button type="button" (click)="showAccountModal.set(false)" class="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ClientDetailComponent implements OnInit {
    client = signal<Client | null>(null);
    accounts = signal<Account[]>([]);
    showAccountModal = signal(false);
    accountForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private accountService: AccountService,
        private fb: FormBuilder
    ) {
        this.accountForm = this.fb.group({
            typeCompte: ['EPARGNE', Validators.required]
        });
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadClient(id);
        this.loadAccounts(id);
    }

    loadClient(id: number): void {
        this.clientService.getById(id).subscribe({
            next: (client) => this.client.set(client)
        });
    }

    loadAccounts(clientId: number): void {
        this.accountService.getByClient(clientId).subscribe({
            next: (accounts) => this.accounts.set(accounts)
        });
    }

    createAccount(): void {
        const request: AccountRequest = {
            typeCompte: this.accountForm.value.typeCompte,
            clientId: this.client()!.id
        };

        this.accountService.create(request).subscribe({
            next: () => {
                this.showAccountModal.set(false);
                this.loadAccounts(this.client()!.id);
            }
        });
    }
}
