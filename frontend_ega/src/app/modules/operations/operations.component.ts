import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Client, Compte } from '../../core/models';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Nouvelle Opération</h1>
        <p class="text-sm text-gray-500 mt-1">Effectuez un dépôt, un retrait ou un virement.</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-1 m-5 bg-gray-100 rounded-lg flex border">
          <button (click)="type = 'VIREMENT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': type === 'VIREMENT'}" class="flex-1 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 text-center transition-all">Virement</button>
          <button (click)="type = 'DEPOT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': type === 'DEPOT'}" class="flex-1 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 text-center transition-all">Dépôt</button>
          <button (click)="type = 'RETRAIT'" [ngClass]="{'bg-white text-gray-900 shadow-sm': type === 'RETRAIT'}" class="flex-1 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 text-center transition-all">Retrait</button>
        </div>

        <form (ngSubmit)="submit()" class="p-6 space-y-6">
          <!-- Compte Source/Principal avec recherche IBAN -->
          <div class="space-y-3">
             <div class="flex justify-between items-center">
                <label class="block text-sm font-medium text-gray-700">ID du Compte {{ type === 'DEPOT' ? 'Bénéficiaire' : 'Débiteur' }}</label>
                <button type="button" (click)="showIbanSearch = !showIbanSearch" class="text-xs text-blue-600 hover:text-blue-500 font-medium">
                  {{ showIbanSearch ? 'Masquer recherche IBAN' : 'Trouver par IBAN' }}
                </button>
             </div>
             
             <div *ngIf="showIbanSearch" class="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-1 duration-300">
                <div class="flex gap-2">
                   <input type="text" [(ngModel)]="ibanQuery" name="ibanQuery" placeholder="Saisir IBAN complet..." class="flex-1 px-3 py-1.5 text-xs border-gray-300 rounded focus:ring-blue-900 focus:border-blue-900 border">
                   <button type="button" (click)="searchByIban('SOURCE')" class="px-3 py-1.5 bg-blue-900 text-white text-xs font-medium rounded hover:bg-blue-800">Chercher</button>
                </div>
                <p *ngIf="searchError" class="text-[10px] text-rose-600 mt-1">{{ searchError }}</p>
             </div>

             <input type="text" [(ngModel)]="compteId" name="compteId" placeholder="Ex: 1" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-blue-900 focus:border-blue-900 border shadow-sm">
             <p class="text-xs text-gray-500">L'identifiant numérique du compte est requis pour la validation.</p>
          </div>

          <!-- Compte Destinataire (pour virement) -->
          <div *ngIf="type === 'VIREMENT'" class="space-y-3">
            <div class="flex justify-between items-center">
                <label class="block text-sm font-medium text-gray-700">ID du Compte Destinataire</label>
                <button type="button" (click)="showDestIbanSearch = !showDestIbanSearch" class="text-xs text-blue-600 hover:text-blue-500 font-medium">
                  Trouver par IBAN
                </button>
            </div>

            <div *ngIf="showDestIbanSearch" class="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-1 duration-300">
                <div class="flex gap-2">
                   <input type="text" [(ngModel)]="destIbanQuery" name="destIbanQuery" placeholder="Saisir IBAN bénéficiaire..." class="flex-1 px-3 py-1.5 text-xs border-gray-300 rounded focus:ring-blue-900 focus:border-blue-900 border">
                   <button type="button" (click)="searchByIban('DEST')" class="px-3 py-1.5 bg-blue-900 text-white text-xs font-medium rounded hover:bg-blue-800">Chercher</button>
                </div>
            </div>

            <input type="text" [(ngModel)]="destCompteId" name="destCompteId" placeholder="Ex: 2" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-blue-900 focus:border-blue-900 border shadow-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Montant</label>
            <div class="relative rounded-md shadow-sm">
              <input type="number" [(ngModel)]="montant" name="montant" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-blue-900 focus:border-blue-900 border pr-10" placeholder="0.00">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-xs">FCFA</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Description / Motif</label>
            <textarea [(ngModel)]="description" name="description" rows="3" class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-blue-900 focus:border-blue-900 border shadow-sm"></textarea>
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="submitting" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition-all disabled:opacity-50">
               <span *ngIf="submitting" class="iconify animate-spin mr-2" data-icon="lucide:loader-2" data-width="18"></span>
               {{ type === 'VIREMENT' ? 'Exécuter le virement' : type === 'DEPOT' ? 'Effectuer le dépôt' : 'Valider le retrait' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class OperationsComponent implements OnInit {
  type: 'VIREMENT' | 'DEPOT' | 'RETRAIT' = 'VIREMENT';

  compteId: string = '';
  destCompteId: string = '';
  montant = 0;
  description = '';

  showIbanSearch = false;
  ibanQuery = '';
  showDestIbanSearch = false;
  destIbanQuery = '';
  searchError = '';
  submitting = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() { }

  searchByIban(target: 'SOURCE' | 'DEST') {
    const query = target === 'SOURCE' ? this.ibanQuery : this.destIbanQuery;
    if (!query) return;

    this.searchError = '';
    this.apiService.getCompteByNumero(query).subscribe({
      next: (compte) => {
        if (target === 'SOURCE') {
          this.compteId = compte.id!.toString();
          this.showIbanSearch = false;
        } else {
          this.destCompteId = compte.id!.toString();
          this.showDestIbanSearch = false;
        }
      },
      error: () => {
        this.searchError = 'Compte non trouvé avec cet IBAN.';
      }
    });
  }

  submit() {
    if (!this.compteId || this.montant <= 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.submitting = true;
    const sourceId = Number(this.compteId);
    const targetId = this.destCompteId ? Number(this.destCompteId) : undefined;

    if (this.type === 'DEPOT') {
      this.apiService.effectuerDepot(sourceId, this.montant, this.description).subscribe({
        next: () => {
          alert('Dépôt effectué !');
          this.reset();
        },
        error: (err) => { this.submitting = false; alert(err.error?.message || 'Erreur lors du dépôt'); }
      });
    } else if (this.type === 'RETRAIT') {
      this.apiService.effectuerRetrait(sourceId, this.montant, this.description).subscribe({
        next: () => {
          alert('Retrait effectué !');
          this.reset();
        },
        error: (err) => { this.submitting = false; alert(err.error?.message || 'Erreur lors du retrait'); }
      });
    } else if (this.type === 'VIREMENT') {
      if (!targetId) {
        this.submitting = false;
        alert('Veuillez saisir l\'ID du compte destinataire.');
        return;
      }
      this.apiService.effectuerVirement(sourceId, targetId, this.montant, this.description).subscribe({
        next: () => {
          alert('Virement effectué !');
          this.reset();
        },
        error: (err) => { this.submitting = false; alert(err.error?.message || 'Erreur lors du virement'); }
      });
    }
  }

  reset() {
    this.compteId = '';
    this.destCompteId = '';
    this.montant = 0;
    this.description = '';
    this.submitting = false;
    this.ibanQuery = '';
    this.destIbanQuery = '';
  }
}
