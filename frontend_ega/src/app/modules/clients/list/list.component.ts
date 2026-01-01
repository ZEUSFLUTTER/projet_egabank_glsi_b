import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Client } from '../../../core/models';
import { ClientFormModalComponent } from '../../../shared/components/client-form-modal/client-form-modal.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ClientFormModalComponent],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Clients</h1>
          <p class="text-sm text-gray-500 mt-1">Gérez la base de données des clients de la banque.</p>
        </div>
        <button (click)="openCreateModal()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all">
          <span class="iconify mr-2" data-icon="lucide:user-plus" data-width="18"></span>
          Nouveau Client
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <span class="iconify" data-icon="lucide:search" data-width="18"></span>
            </span>
            <input type="text" placeholder="Rechercher un client..." class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-all">
          </div>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let client of clients" class="hover:bg-gray-50 transition-colors cursor-pointer" [routerLink]="['/clients', client.id]">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {{ client.nom[0] }}{{ client.prenom[0] }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</div>
                    <div class="text-xs text-gray-500">ID: #{{ client.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ client.email }}</div>
                <div class="text-xs">{{ client.telephone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.adresse }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="onEdit($event, client)" class="text-gray-400 hover:text-gray-600 mr-3 p-1 hover:bg-gray-100 rounded">
                  <span class="iconify" data-icon="lucide:edit-2" data-width="16"></span>
                </button>
                <button (click)="onDelete($event, client)" class="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded">
                  <span class="iconify" data-icon="lucide:trash-2" data-width="16"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Shared Client Modal -->
    <app-client-form-modal
      [isVisible]="showModal"
      [clientToEdit]="currentClient!"
      (close)="closeModal()"
      (save)="loadClients()">
    </app-client-form-modal>
  `,
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  showModal = false;
  currentClient: Client | null = null; // Changed to full Client object or null

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.apiService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  openCreateModal() {
    this.currentClient = null;
    this.showModal = true;
  }

  onEdit(event: Event, client: Client) {
    event.stopPropagation();
    this.currentClient = client;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentClient = null;
  }

  onDelete(event: Event, client: Client) {
    event.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?`)) {
      this.apiService.deleteClient(client.id!).subscribe(() => {
        this.loadClients();
      });
    }
  }
}
