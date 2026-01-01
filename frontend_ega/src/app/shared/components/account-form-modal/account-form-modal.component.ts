import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-account-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity" (click)="closeModal()">
          <div class="absolute inset-0 bg-gray-900/75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-200 relative z-10">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">Ouvrir un Compte</h3>
              <button (click)="closeModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <span class="iconify" data-icon="lucide:x" data-width="20"></span>
              </button>
            </div>

            <form (submit)="createAccount()" class="space-y-5">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Client</label>
                <select [(ngModel)]="clientId" name="clientId" required [disabled]="!!preselectedClientId" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm disabled:opacity-75 disabled:bg-gray-100">
                  <option [value]="0" disabled>Sélectionner un client</option>
                  <option *ngFor="let c of clients" [value]="c.id">{{ c.prenom }} {{ c.nom }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type de Compte</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button" (click)="accountType = 'COURANT'" [ngClass]="accountType === 'COURANT' ? 'border-gray-900 bg-gray-100 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-300'" class="p-4 rounded-xl border-2 transition-all text-center">
                    <span class="iconify mx-auto text-gray-900" data-icon="lucide:credit-card" data-width="24"></span>
                    <p class="text-sm font-medium text-gray-900 mt-2">Courant</p>
                  </button>
                  <button type="button" (click)="accountType = 'EPARGNE'" [ngClass]="accountType === 'EPARGNE' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600' : 'border-gray-200 hover:border-gray-300'" class="p-4 rounded-xl border-2 transition-all text-center">
                    <span class="iconify mx-auto text-brand-600" data-icon="lucide:piggy-bank" data-width="24"></span>
                    <p class="text-sm font-medium text-gray-900 mt-2">Épargne</p>
                  </button>
                </div>
              </div>

              <div *ngIf="accountType === 'COURANT'">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Découvert Autorisé (FCFA)</label>
                <input type="number" [(ngModel)]="decouvert" name="decouvert" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm" placeholder="50000">
              </div>

              <div *ngIf="accountType === 'EPARGNE'">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Taux d'intérêt (%)</label>
                <input type="number" [(ngModel)]="taux" name="taux" step="0.1" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:bg-white transition-all text-sm" placeholder="2.5">
              </div>

              <div class="mt-8 flex gap-3">
                <button type="button" (click)="closeModal()" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" [disabled]="saving || clientId === 0" class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <span *ngIf="saving" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="18"></span>
                  {{ saving ? 'Ouverture...' : 'Ouvrir le compte' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() preselectedClientId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  saving = false;
  clients: Client[] = [];

  clientId = 0;
  accountType: 'COURANT' | 'EPARGNE' = 'COURANT';
  decouvert = 50000;
  taux = 2.5;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadClients();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      if (!this.clients.length) {
        this.loadClients();
      }
      this.resetForm();
      if (this.preselectedClientId) {
        this.clientId = this.preselectedClientId;
      }
    }
  }

  loadClients() {
    this.apiService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  resetForm() {
    this.clientId = this.preselectedClientId || 0;
    this.accountType = 'COURANT';
    this.decouvert = 50000;
    this.taux = 2.5;
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

  createAccount() {
    if (this.clientId === 0) return;

    this.saving = true;
    const request = this.accountType === 'COURANT'
      ? this.apiService.createCompteCourant(this.clientId, this.decouvert)
      : this.apiService.createCompteEpargne(this.clientId, this.taux);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.save.emit();
        this.closeModal();
      },
      error: (err) => {
        this.saving = false;
        let errorMessage = 'Erreur lors de la création du compte.';
        if (err.error?.message) {
          errorMessage = err.error.message;
        }
        alert(errorMessage);
      }
    });
  }
}
