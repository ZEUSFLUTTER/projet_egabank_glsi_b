import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Compte, Transaction } from '../../core/models';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Relevés Bancaires</h1>
        <p class="text-sm text-gray-500 mt-1">Consultez et exportez l'historique de vos comptes.</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Compte</label>
            <select [(ngModel)]="selectedCompteId" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border">
              <option *ngFor="let acc of comptes" [value]="acc.id">{{ acc.type }} - {{ acc.numeroCompte }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Type de relevé</label>
            <div class="p-1 m-0 bg-gray-100 rounded-lg flex border">
              <button (click)="viewType = 'MONTHLY'" [ngClass]="{'bg-white text-gray-900 shadow-sm': viewType === 'MONTHLY'}" class="px-4 py-1.5 text-xs font-medium rounded-md text-gray-500 transition-all">Mensuel</button>
              <button (click)="viewType = 'YEARLY'" [ngClass]="{'bg-white text-gray-900 shadow-sm': viewType === 'YEARLY'}" class="px-4 py-1.5 text-xs font-medium rounded-md text-gray-500 transition-all">Annuel</button>
            </div>
          </div>

          <div *ngIf="viewType === 'MONTHLY'">
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Mois</label>
            <select [(ngModel)]="mois" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border">
              <option *ngFor="let m of months; let i = index" [value]="i + 1">{{ m }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Année</label>
            <input type="number" [(ngModel)]="annee" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 border w-24">
          </div>

          <button (click)="loadReleve()" [disabled]="loading" class="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2">
            <span *ngIf="loading" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="16"></span>
            {{ loading ? 'Chargement...' : 'Consulter' }}
          </button>
        </div>
      </div>

      <div *ngIf="transactions.length > 0" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Synthèse du relevé</h3>
            <p class="text-xs text-gray-500">{{ viewType === 'MONTHLY' ? months[mois-1] : '' }} {{ annee }}</p>
          </div>
          <div class="flex items-center gap-3">
             <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
               {{ transactions.length }} Opérations
             </span>
             <!-- Bouton téléchargement PDF -->
             <button (click)="downloadPdf()" [disabled]="downloadingPdf" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50">
               <span *ngIf="!downloadingPdf" class="iconify" data-icon="lucide:download" data-width="14"></span>
               <span *ngIf="downloadingPdf" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="14"></span>
               {{ downloadingPdf ? 'Génération...' : 'Télécharger PDF' }}
             </button>
          </div>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let tr of transactions" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{{ tr.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ tr.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold" [ngClass]="tr.typeTransaction === 'DEPOT' ? 'text-emerald-600' : 'text-rose-600'">
                {{ tr.typeTransaction === 'DEPOT' ? '+' : '-' }} {{ tr.montant | number:'1.0-0' }} FCFA
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="searched && transactions.length === 0" class="bg-white border border-dashed border-gray-300 rounded-xl py-12 flex flex-col items-center">
        <span class="iconify text-gray-300 mb-2" data-icon="lucide:search-x" data-width="48"></span>
        <p class="text-gray-500 text-sm">Aucune transaction trouvée pour cette période.</p>
        <button (click)="downloadPdf()" [disabled]="downloadingPdf" class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50">
          <span *ngIf="!downloadingPdf" class="iconify" data-icon="lucide:download" data-width="16"></span>
          <span *ngIf="downloadingPdf" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="16"></span>
          {{ downloadingPdf ? 'Génération...' : 'Télécharger PDF vide' }}
        </button>
      </div>
    </div>
  `,
})
export class StatementComponent implements OnInit {
  comptes: Compte[] = [];
  selectedCompteId?: number;
  viewType: 'MONTHLY' | 'YEARLY' = 'MONTHLY';
  mois = new Date().getMonth() + 1;
  annee = new Date().getFullYear();
  transactions: Transaction[] = [];
  searched = false;
  loading = false;
  downloadingPdf = false;

  months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getComptes().subscribe((comptes) => {
      this.comptes = comptes;
      if (comptes.length > 0) this.selectedCompteId = comptes[0].id;
    });
  }

  loadReleve() {
    if (!this.selectedCompteId) return;

    this.loading = true;
    this.searched = false;
    this.transactions = [];

    const request = this.viewType === 'MONTHLY'
      ? this.apiService.getReleveMensuel(this.selectedCompteId, this.annee, this.mois)
      : this.apiService.getReleveAnnuel(this.selectedCompteId, this.annee);

    request.subscribe({
      next: (tr) => {
        this.transactions = tr;
        this.searched = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erreur lors de la récupération du relevé.');
      }
    });
  }

  downloadPdf() {
    if (!this.selectedCompteId) return;

    this.downloadingPdf = true;

    const request = this.viewType === 'MONTHLY'
      ? this.apiService.downloadReleveMensuelPdf(this.selectedCompteId, this.annee, this.mois)
      : this.apiService.downloadReleveAnnuelPdf(this.selectedCompteId, this.annee);

    request.subscribe({
      next: (blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const filename = this.viewType === 'MONTHLY'
          ? `releve_${this.selectedCompteId}_${this.annee}_${String(this.mois).padStart(2, '0')}.pdf`
          : `releve_${this.selectedCompteId}_${this.annee}.pdf`;

        link.download = filename;
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

