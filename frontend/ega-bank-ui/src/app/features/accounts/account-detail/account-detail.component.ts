import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Account, OperationRequest, Transaction } from '../../../core/models';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
    selector: 'app-account-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a routerLink="/accounts" class="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour aux comptes
      </a>

      @if (account()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Account Card -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="h-3" [class]="account()!.typeCompte === 'EPARGNE' ? 'bg-purple-500' : 'bg-orange-500'"></div>
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <span class="px-3 py-1 text-sm font-semibold rounded-full"
                    [class]="account()!.typeCompte === 'EPARGNE' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'">
                    {{ account()!.typeCompteLibelle }}
                  </span>
                </div>
                <p class="font-mono text-sm text-gray-500 mb-2">{{ account()!.numeroCompte }}</p>
                <p class="text-4xl font-bold text-gray-900 mb-4">{{ account()!.solde | number:'1.2-2' }} <span class="text-xl">XOF</span></p>
                <p class="text-sm text-gray-600">Client: <span class="font-medium">{{ account()!.clientNomComplet }}</span></p>
                <p class="text-sm text-gray-500">Créé le {{ account()!.dateCreation | date:'dd/MM/yyyy' }}</p>

                <!-- Operations -->
                <div class="mt-6 space-y-3">
                  <button (click)="openOperation('deposit')" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Dépôt
                  </button>
                  <button (click)="openOperation('withdraw')" class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                    Retrait
                  </button>
                  <button (click)="downloadStatement()" class="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Télécharger Relevé
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Transactions -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg">
              <div class="px-6 py-4 border-b">
                <h3 class="text-xl font-bold text-gray-900">Historique des transactions</h3>
              </div>
              <div class="divide-y">
                @for (tx of transactions(); track tx.id) {
                  <div class="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center"
                        [class]="tx.type.includes('DEPOT') || tx.type.includes('ENTRANT') ? 'bg-green-100' : 'bg-red-100'">
                        @if (tx.type.includes('DEPOT') || tx.type.includes('ENTRANT')) {
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                          </svg>
                        } @else {
                          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                          </svg>
                        }
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ tx.typeLibelle }}</p>
                        <p class="text-sm text-gray-500">{{ tx.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</p>
                        @if (tx.description) {
                          <p class="text-sm text-gray-400">{{ tx.description }}</p>
                        }
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold" [class]="tx.type.includes('DEPOT') || tx.type.includes('ENTRANT') ? 'text-green-600' : 'text-red-600'">
                        {{ tx.type.includes('DEPOT') || tx.type.includes('ENTRANT') ? '+' : '-' }}{{ tx.montant | number:'1.2-2' }} XOF
                      </p>
                      <p class="text-sm text-gray-500">Solde: {{ tx.soldeApres | number:'1.2-2' }}</p>
                    </div>
                  </div>
                } @empty {
                  <div class="p-12 text-center text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p>Aucune transaction</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Operation Modal -->
      @if (showOperationModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div class="p-6 border-b">
              <h2 class="text-xl font-bold">{{ operationType() === 'deposit' ? 'Dépôt' : 'Retrait' }}</h2>
            </div>
            <form [formGroup]="operationForm" (ngSubmit)="executeOperation()" class="p-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant (XOF) *</label>
                <input type="number" formControlName="montant" min="1" step="0.01"
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="0.00">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" formControlName="description" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              </div>
              @if (operationError()) {
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {{ operationError() }}
                </div>
              }
              <div class="flex justify-end gap-4">
                <button type="button" (click)="closeOperationModal()" class="px-6 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" [disabled]="operationForm.invalid"
                  class="px-6 py-2 text-white rounded-lg disabled:opacity-50"
                  [class]="operationType() === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class AccountDetailComponent implements OnInit {
    account = signal<Account | null>(null);
    transactions = signal<Transaction[]>([]);
    showOperationModal = signal(false);
    operationType = signal<'deposit' | 'withdraw'>('deposit');
    operationError = signal<string | null>(null);
    operationForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService,
        private transactionService: TransactionService,
        private fb: FormBuilder
    ) {
        this.operationForm = this.fb.group({
            montant: ['', [Validators.required, Validators.min(1)]],
            description: ['']
        });
    }

    ngOnInit(): void {
        const numero = this.route.snapshot.paramMap.get('numero')!;
        this.loadAccount(numero);
        this.loadTransactions(numero);
    }

    loadAccount(numero: string): void {
        this.accountService.getByNumber(numero).subscribe({
            next: (account) => this.account.set(account)
        });
    }

    loadTransactions(numero: string): void {
        this.transactionService.getAllByAccount(numero).subscribe({
            next: (txs) => this.transactions.set(txs)
        });
    }

    openOperation(type: 'deposit' | 'withdraw'): void {
        this.operationType.set(type);
        this.operationForm.reset();
        this.operationError.set(null);
        this.showOperationModal.set(true);
    }

    closeOperationModal(): void {
        this.showOperationModal.set(false);
    }

    executeOperation(): void {
        if (this.operationForm.invalid) return;

        const request: OperationRequest = {
            montant: this.operationForm.value.montant,
            description: this.operationForm.value.description
        };

        const numero = this.account()!.numeroCompte;
        const operation = this.operationType() === 'deposit'
            ? this.transactionService.deposit(numero, request)
            : this.transactionService.withdraw(numero, request);

        operation.subscribe({
            next: () => {
                this.closeOperationModal();
                this.loadAccount(numero);
                this.loadTransactions(numero);
            },
            error: (err) => {
                this.operationError.set(err.error?.message || 'Erreur lors de l\'opération');
            }
        });
    }

    downloadStatement(): void {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const debut = monthAgo.toISOString().split('T')[0];
        const fin = today.toISOString().split('T')[0];

        this.transactionService.downloadStatement(this.account()!.numeroCompte, debut, fin).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `releve_${this.account()!.numeroCompte.substring(0, 8)}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => alert('Erreur lors du téléchargement')
        });
    }
}
