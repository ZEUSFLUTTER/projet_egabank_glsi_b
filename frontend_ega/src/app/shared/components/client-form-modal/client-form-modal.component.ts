import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-client-form-modal',
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

        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 relative z-10">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Modifier le Client' : 'Nouveau Client' }}</h3>
              <button (click)="closeModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <span class="iconify" data-icon="lucide:x" data-width="20"></span>
              </button>
            </div>

            <form (submit)="saveClient()" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Prénom</label>
                  <input type="text" [(ngModel)]="currentClient.prenom" name="prenom" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nom</label>
                  <input type="text" [(ngModel)]="currentClient.nom" name="nom" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Genre</label>
                  <select [(ngModel)]="currentClient.sexe" name="sexe" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nationalité</label>
                  <select [(ngModel)]="currentClient.nationalite" name="nationalite" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
                    <option *ngFor="let nat of nationalities" [value]="nat">{{ nat }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                <input type="email" [(ngModel)]="currentClient.email" name="email" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Téléphone</label>
                <input type="text" [(ngModel)]="currentClient.telephone" name="telephone" required placeholder="+221771234567" class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
                <p class="text-xs text-gray-400 mt-1">Format: +221771234567 (sans espaces)</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Adresse</label>
                <input type="text" [(ngModel)]="currentClient.adresse" name="adresse" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date de Naissance</label>
                <input type="date" [(ngModel)]="currentClient.dateNaissance" name="dateNaissance" required class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm">
              </div>

              <div class="mt-8 flex gap-3">
                <button type="button" (click)="closeModal()" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" [disabled]="submitting" class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <span *ngIf="submitting" class="iconify animate-spin" data-icon="lucide:loader-2" data-width="18"></span>
                  {{ submitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer Client') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientFormModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() clientToEdit: Client | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>(); // Emits when save is successful

  submitting = false;
  isEdit = false;
  currentClient: Partial<Client> = this.getEmptyClient();

  nationalities = [
    'Sénégalaise', 'Malienne', 'Ivoirienne', 'Française', 'Américaine',
    'Gambienne', 'Guinéenne', 'Mauritanienne', 'Marocaine', 'Autre'
  ];

  constructor(private apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      if (this.clientToEdit) {
        this.isEdit = true;
        this.currentClient = { ...this.clientToEdit };
      } else {
        this.isEdit = false;
        this.currentClient = this.getEmptyClient();
      }
    }
  }

  getEmptyClient(): Partial<Client> {
    return {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      nationalite: 'Sénégalaise',
      dateNaissance: '',
      sexe: 'M'
    };
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

  saveClient() {
    this.submitting = true;

    // Clean phone number
    const clientData = { ...this.currentClient };
    if (clientData.telephone) {
      clientData.telephone = clientData.telephone.replace(/[\s\-\.\(\)]/g, '');
    }

    const request = this.isEdit
      ? this.apiService.updateClient(clientData.id!, clientData as Client)
      : this.apiService.createClient(clientData as Client);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.save.emit();
        this.closeModal();
      },
      error: (err) => {
        this.submitting = false;
        let errorMessage = 'Erreur lors de l\'enregistrement du client.';
        if (err.error?.details && Array.isArray(err.error.details)) {
          errorMessage = err.error.details.join('\n');
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        alert(errorMessage);
      }
    });
  }
}
