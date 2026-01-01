import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Compte } from '../../core/models';
import { AccountFormModalComponent } from '../../shared/components/account-form-modal/account-form-modal.component';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AccountFormModalComponent],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Comptes Bancaires</h1>
          <p class="text-sm text-gray-500 mt-1">Vue d'ensemble de tous les comptes de la banque.</p>
        </div>
        <button (click)="showModal = true" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all">
          <span class="iconify mr-2" data-icon="lucide:plus-circle" data-width="18"></span>
          Ouvrir Compte
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Comptes</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ comptes.length }}</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Comptes Courants</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ comptesCourants }}</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Comptes Épargne</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{{ comptesEpargne }}</p>
        </div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Solde Total</p>
          <p class="text-2xl font-semibold text-emerald-600 mt-1">{{ totalSolde | number:'1.0-0' }} <span class="text-sm">FCFA</span></p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <span class="iconify" data-icon="lucide:search" data-width="18"></span>
            </span>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterComptes()" placeholder="Rechercher par IBAN..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-all">
          </div>
          <select [(ngModel)]="filterType" (ngModelChange)="filterComptes()" class="px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:ring-gray-900 focus:border-gray-900">
            <option value="">Tous les types</option>
            <option value="COURANT">Compte Courant</option>
            <option value="EPARGNE">Compte Épargne</option>
          </select>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let compte of filteredComptes" class="hover:bg-gray-50 transition-colors cursor-pointer" (click)="goToDetail(compte)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div [ngClass]="compte.type === 'COURANT' ? 'bg-gray-900' : 'bg-blue-100'" class="h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center">
                    <span class="iconify" [ngClass]="compte.type === 'COURANT' ? 'text-white' : 'text-blue-600'" [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" data-width="16"></span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-mono text-gray-900">{{ compte.numeroCompte }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="compte.type === 'COURANT' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'">
                  {{ compte.type === 'COURANT' ? 'Courant' : 'Épargne' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a [routerLink]="['/clients', compte.clientId]" (click)="$event.stopPropagation()" class="text-sm text-brand-600 hover:text-brand-700 hover:underline">
                  {{ compte.clientPrenom }} {{ compte.clientNom }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-sm font-semibold" [ngClass]="compte.solde >= 0 ? 'text-gray-900' : 'text-red-600'">
                  {{ compte.solde | number:'1.0-0' }} FCFA
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ compte.dateCreation | date:'dd/MM/yyyy' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-1">
                  <button (click)="goToDetail(compte); $event.stopPropagation()" class="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded" title="Détails">
                    <span class="iconify" data-icon="lucide:eye" data-width="16"></span>
                  </button>
                  <button (click)="onDelete($event, compte)" class="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Supprimer">
                    <span class="iconify" data-icon="lucide:trash-2" data-width="16"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredComptes.length === 0" class="p-12 text-center">
          <span class="iconify text-gray-300 mb-2" data-icon="lucide:wallet" data-width="48"></span>
          <p class="text-gray-500 text-sm">Aucun compte trouvé.</p>
        </div>
      </div>
    </div>

    <!-- Shared Account Modal -->
    <app-account-form-modal
      [isVisible]="showModal"
      (close)="showModal = false"
      (save)="loadComptes()">
    </app-account-form-modal>
  `,
})
export class ComptesComponent implements OnInit {
  comptes: Compte[] = [];
  filteredComptes: Compte[] = [];
  searchTerm = '';
  filterType = '';
  showModal = false;

  get comptesCourants() {
    return this.comptes.filter(c => c.type === 'COURANT').length;
  }

  get comptesEpargne() {
    return this.comptes.filter(c => c.type === 'EPARGNE').length;
  }

  get totalSolde() {
    return this.comptes.reduce((sum, c) => sum + (c.solde || 0), 0);
  }

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadComptes();
  }

  loadComptes() {
    this.apiService.getComptes().subscribe((comptes) => {
      this.comptes = comptes;
      this.filterComptes();
    });
  }

  filterComptes() {
    let result = this.comptes;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c =>
        c.numeroCompte.toLowerCase().includes(term) ||
        (c.clientNom && c.clientNom.toLowerCase().includes(term)) ||
        (c.clientPrenom && c.clientPrenom.toLowerCase().includes(term))
      );
    }

    if (this.filterType) {
      result = result.filter(c => c.type === this.filterType);
    }

    this.filteredComptes = result;
  }

  goToDetail(compte: Compte) {
    this.router.navigate(['/comptes', compte.id]);
  }

  onDelete(event: Event, compte: Compte) {
    event.stopPropagation();
    if (compte.solde && compte.solde !== 0) {
      alert('Impossible de supprimer un compte avec un solde non nul.');
      return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer le compte ${compte.numeroCompte} ?`)) {
      this.apiService.deleteCompte(compte.id!).subscribe({
        next: () => this.loadComptes(),
        error: (err) => alert(err.error?.message || 'Erreur lors de la suppression.')
      });
    }
  }
}

