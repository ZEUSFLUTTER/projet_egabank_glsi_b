#!/usr/bin/env python3
import os

BASE = "/home/claude/ega-bank-app/src/app/features"

components = {
    # HOME COMPONENT
    f"{BASE}/dashboard/home/home.component.ts": '''import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUsers, faBuilding, faCreditCard, faChartLine, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  currentUser: any;
  faUsers = faUsers;
  faBuilding = faBuilding;
  faCreditCard = faCreditCard;
  faChartLine = faChartLine;
  faMoneyBillWave = faMoneyBillWave;

  stats = [
    { title: 'Utilisateurs Actifs', value: '0', icon: this.faUsers, color: 'bg-blue-500' },
    { title: 'Clients', value: '0', icon: this.faBuilding, color: 'bg-green-500' },
    { title: 'Comptes', value: '0', icon: this.faCreditCard, color: 'bg-purple-500' },
    { title: 'Transactions', value: '0', icon: this.faMoneyBillWave, color: 'bg-yellow-500' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
''',
    
    f"{BASE}/dashboard/home/home.component.html": '''<div class="space-y-6">
  <div class="mb-8">
    <h2 class="text-3xl font-bold text-gray-800">Tableau de Bord</h2>
    <p class="text-gray-600 mt-2">Bienvenue {{ currentUser?.nom }}</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div *ngFor="let stat of stats" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-sm">{{ stat.title }}</p>
          <p class="text-3xl font-bold text-gray-800 mt-2">{{ stat.value }}</p>
        </div>
        <div [class]="stat.color + ' p-4 rounded-lg'">
          <fa-icon [icon]="stat.icon" class="text-white text-2xl"></fa-icon>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Activités Récentes</h3>
      <p class="text-gray-500 text-center py-8">Aucune activité récente</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Statistiques</h3>
      <p class="text-gray-500 text-center py-8">Chargement...</p>
    </div>
  </div>
</div>
''',

    # CLIENTS COMPONENT - Version complète avec toutes les fonctionnalités
    f"{BASE}/clients/clients.component.ts": '''import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { AccountService } from '../../core/services/account.service';
import { Client, ClientUpdateDto } from '../../shared/models/client.model';
import { Account } from '../../shared/models/account.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faEdit, faTrash, faSearch, faEye, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FaIconComponent],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  clientAccounts: Account[] = [];
  showUpdateModal = false;
  showDetailsModal = false;
  updateForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  filterStatus: 'active' | 'inactive' = 'active';
  searchTerm = '';

  faUserPlus = faUserPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faEye = faEye;
  faCreditCard = faCreditCard;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private accountService: AccountService
  ) {
    this.updateForm = this.fb.group({
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    const service = this.filterStatus === 'active' 
      ? this.clientService.getAllActiveClients()
      : this.clientService.getAllInactiveClients();

    service.subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(client => {
      const search = this.searchTerm.toLowerCase();
      return client.lastName.toLowerCase().includes(search) ||
             client.firstName.toLowerCase().includes(search) ||
             client.email.toLowerCase().includes(search) ||
             client.codeClient?.toLowerCase().includes(search);
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.loadClients();
  }

  viewDetails(client: Client): void {
    this.selectedClient = client;
    this.showDetailsModal = true;
    this.loadClientAccounts(client.email);
  }

  loadClientAccounts(email: string): void {
    this.accountService.getActiveAccountsByClient(email).subscribe({
      next: (accounts) => {
        this.clientAccounts = accounts;
      },
      error: () => {
        this.clientAccounts = [];
      }
    });
  }

  openUpdateModal(client: Client): void {
    this.selectedClient = client;
    this.updateForm.patchValue({
      address: client.address,
      phoneNumber: client.phoneNumber,
      email: client.email
    });
    this.showUpdateModal = true;
  }

  closeModals(): void {
    this.showUpdateModal = false;
    this.showDetailsModal = false;
    this.selectedClient = null;
  }

  onUpdate(): void {
    if (this.updateForm.valid && this.selectedClient) {
      this.loading = true;
      const updateData: ClientUpdateDto = this.updateForm.value;

      this.clientService.updateClient(this.selectedClient.codeClient!, updateData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadClients();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
          this.loading = false;
        }
      });
    }
  }

  deleteClient(client: Client): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.firstName} ${client.lastName} ?`)) {
      this.clientService.deleteClient(client.codeClient!).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
            this.loadClients();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
''',

    f"{BASE}/clients/clients.component.html": '''<div class="container mx-auto">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des Clients</h1>
    <p class="text-gray-600">Consulter et gérer les clients</p>
  </div>

  <div *ngIf="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
    {{ successMessage }}
  </div>
  
  <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
    {{ errorMessage }}
  </div>

  <div class="card mb-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex-1 min-w-[300px]">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <fa-icon [icon]="faSearch" class="text-gray-400"></fa-icon>
          </div>
          <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Rechercher..." class="input-field pl-10">
        </div>
      </div>
      <select [(ngModel)]="filterStatus" (change)="onFilterChange()" class="input-field w-auto">
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
    </div>
  </div>

  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let client of filteredClients" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ client.codeClient }}</td>
            <td class="px-6 py-4 text-sm">{{ client.lastName }}</td>
            <td class="px-6 py-4 text-sm">{{ client.firstName }}</td>
            <td class="px-6 py-4 text-sm">{{ client.email }}</td>
            <td class="px-6 py-4 text-sm">{{ client.phoneNumber }}</td>
            <td class="px-6 py-4 text-sm space-x-2">
              <button (click)="viewDetails(client)" class="text-blue-600 hover:text-blue-800">
                <fa-icon [icon]="faEye"></fa-icon>
              </button>
              <button (click)="openUpdateModal(client)" class="text-yellow-600 hover:text-yellow-800">
                <fa-icon [icon]="faEdit"></fa-icon>
              </button>
              <button (click)="deleteClient(client)" class="text-red-600 hover:text-red-800">
                <fa-icon [icon]="faTrash"></fa-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Update Modal -->
<div *ngIf="showUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
    <div class="px-6 py-4 border-b">
      <h3 class="text-xl font-bold">Modifier le Client</h3>
    </div>
    <div class="p-6">
      <form [formGroup]="updateForm" (ngSubmit)="onUpdate()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Adresse</label>
          <input type="text" formControlName="address" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Téléphone</label>
          <input type="tel" formControlName="phoneNumber" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email" class="input-field">
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" (click)="closeModals()" class="btn-secondary">Annuler</button>
          <button type="submit" [disabled]="!updateForm.valid" class="btn-primary">Mettre à jour</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Details Modal -->
<div *ngIf="showDetailsModal && selectedClient" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div class="px-6 py-4 border-b flex justify-between items-center">
      <h3 class="text-xl font-bold">Détails du Client</h3>
      <button (click)="closeModals()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
    </div>
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div><strong>Code:</strong> {{ selectedClient.codeClient }}</div>
        <div><strong>Nom:</strong> {{ selectedClient.lastName }}</div>
        <div><strong>Prénom:</strong> {{ selectedClient.firstName }}</div>
        <div><strong>Date de naissance:</strong> {{ selectedClient.dateOfBirth }}</div>
        <div><strong>Genre:</strong> {{ selectedClient.gender }}</div>
        <div><strong>Nationalité:</strong> {{ selectedClient.nationality }}</div>
        <div><strong>Email:</strong> {{ selectedClient.email }}</div>
        <div><strong>Téléphone:</strong> {{ selectedClient.phoneNumber }}</div>
        <div class="col-span-2"><strong>Adresse:</strong> {{ selectedClient.address }}</div>
      </div>

      <div>
        <h4 class="text-lg font-semibold mb-3">Comptes du Client</h4>
        <div class="space-y-2">
          <div *ngFor="let account of clientAccounts" class="p-4 border rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">{{ account.accountNumber }}</p>
                <p class="text-sm text-gray-600">{{ account.accountType }}</p>
              </div>
              <p class="text-xl font-bold text-primary-600">{{ account.balance | number:'1.2-2' }} FCFA</p>
            </div>
          </div>
          <p *ngIf="clientAccounts.length === 0" class="text-gray-500 text-center py-4">Aucun compte</p>
        </div>
      </div>
    </div>
  </div>
</div>
''',
}

for path, content in components.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Créé: {path}")

print("\n✓ Composants créés avec succès!")
