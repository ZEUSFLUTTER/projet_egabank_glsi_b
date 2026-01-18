import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Client } from '../../core/models';

@Component({
    selector: 'app-client-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Mon Profil</h1>
        <p class="text-sm text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      <!-- Informations personnelles -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Informations Personnelles</h2>
        </div>
        <div class="p-6">
          <div *ngIf="!editMode" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Prénom</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.prenom }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nom</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.nom }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.email }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Téléphone</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.telephone }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date de naissance</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.dateNaissance | date:'dd/MM/yyyy' }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Nationalité</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.nationalite }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Adresse</label>
                <p class="text-sm font-medium text-gray-900">{{ client?.adresse }}</p>
              </div>
            </div>
            <div class="pt-4">
              <button (click)="enableEditMode()" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Modifier mes informations
              </button>
            </div>
          </div>

          <form *ngIf="editMode" (submit)="saveProfile()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-2">Prénom</label>
                <input type="text" [(ngModel)]="editedClient.prenom" name="prenom" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-2">Nom</label>
                <input type="text" [(ngModel)]="editedClient.nom" name="nom" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-2">Email</label>
                <input type="email" [(ngModel)]="editedClient.email" name="email" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-2">Téléphone</label>
                <input type="text" [(ngModel)]="editedClient.telephone" name="telephone" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-700 mb-2">Adresse</label>
                <input type="text" [(ngModel)]="editedClient.adresse" name="adresse" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" [disabled]="saving" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
              <button type="button" (click)="cancelEdit()" 
                      class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Sécurité -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Sécurité</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-2">Changer le mot de passe</h3>
              <p class="text-xs text-gray-500 mb-4">Pour des raisons de sécurité, contactez votre agence pour modifier votre mot de passe.</p>
              <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Contacter l'agence
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques du compte -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Mes Comptes</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-xs font-medium text-blue-600 uppercase tracking-wider">Nombre de comptes</p>
              <p class="text-3xl font-bold text-blue-700 mt-2">{{ nombreComptes }}</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-xs font-medium text-green-600 uppercase tracking-wider">Client depuis</p>
              <p class="text-3xl font-bold text-green-700 mt-2">{{ getClientAge() }}</p>
              <p class="text-xs text-green-600 mt-1">jours</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-xs font-medium text-purple-600 uppercase tracking-wider">Statut</p>
              <p class="text-xl font-bold text-purple-700 mt-2">Actif</p>
            </div>
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
export class ClientProfileComponent implements OnInit {
    client: Client | null = null;
    nombreComptes = 0;
    editedClient: any = {};
    editMode = false;
    saving = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.loadProfile();
        this.loadComptes();
    }

    loadProfile() {
        this.apiService.getMyProfile().subscribe({
            next: (client) => {
                this.client = client;
            },
            error: () => {
                this.showMessage('Erreur lors du chargement du profil', 'error');
            }
        });
    }

    loadComptes() {
        this.apiService.getMyAccounts().subscribe({
            next: (comptes) => {
                this.nombreComptes = comptes.length;
            },
            error: () => { }
        });
    }

    enableEditMode() {
        this.editMode = true;
        this.editedClient = { ...this.client };
    }

    cancelEdit() {
        this.editMode = false;
        this.editedClient = {};
    }

    saveProfile() {
        if (!this.client?.id) return;

        this.saving = true;
        this.apiService.updateClient(this.client.id, this.editedClient).subscribe({
            next: (updated) => {
                this.client = updated;
                this.editMode = false;
                this.saving = false;
                this.showMessage('Profil mis à jour avec succès !', 'success');
            },
            error: () => {
                this.saving = false;
                this.showMessage('Erreur lors de la mise à jour du profil', 'error');
            }
        });
    }

    getClientAge(): number {
        if (!this.client) return 0;
        // Simuler - en production, utiliser la date de création du client
        return 45;
    }

    showMessage(msg: string, type: 'success' | 'error') {
        this.message = msg;
        this.messageType = type;
        setTimeout(() => {
            this.message = '';
        }, 5000);
    }
}
