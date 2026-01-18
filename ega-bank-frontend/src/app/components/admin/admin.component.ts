import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';
import { ClientService, ClientDTO } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h1 class="ml-3 text-2xl font-bold text-gray-900">EGA Bank - Administration</h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">Admin: {{ currentUser?.email }}</span>
              <button 
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Actions Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Clients</h2>
            <button 
              (click)="openCreateModal()"
              class="btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nouveau Client
            </button>
          </div>

          <!-- Clients Table -->
          <div class="card">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let client of clients" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span class="text-primary-600 font-medium text-sm">
                            {{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}
                          </span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ client.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ client.telephone }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ client.adresse }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-primary-600 hover:text-primary-900 mr-3">Modifier</button>
                      <button class="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                  
                  <tr *ngIf="clients.length === 0 && !isLoadingClients">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      Aucun client trouvé
                    </td>
                  </tr>
                  
                  <tr *ngIf="isLoadingClients">
                    <td colspan="5" class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement des clients...
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Client Modal -->
    <div *ngIf="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Nouveau Client</h3>
            <button 
              (click)="closeCreateModal()"
              class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form (ngSubmit)="createClient()" #clientForm="ngForm">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
                  <input 
                    type="text" 
                    id="prenom"
                    name="prenom"
                    [(ngModel)]="newClient.prenom"
                    required
                    class="input-field mt-1">
                </div>
                <div>
                  <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
                  <input 
                    type="text" 
                    id="nom"
                    name="nom"
                    [(ngModel)]="newClient.nom"
                    required
                    class="input-field mt-1">
                </div>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  [(ngModel)]="newClient.email"
                  required
                  class="input-field mt-1">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="telephone" class="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input 
                    type="tel" 
                    id="telephone"
                    name="telephone"
                    [(ngModel)]="newClient.telephone"
                    required
                    class="input-field mt-1">
                </div>
                <div>
                  <label for="dateNaissance" class="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input 
                    type="date" 
                    id="dateNaissance"
                    name="dateNaissance"
                    [(ngModel)]="newClient.dateNaissance"
                    class="input-field mt-1">
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="sexe" class="block text-sm font-medium text-gray-700">Sexe</label>
                  <select 
                    id="sexe"
                    name="sexe"
                    [(ngModel)]="newClient.sexe"
                    class="input-field mt-1">
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label for="nationalite" class="block text-sm font-medium text-gray-700">Nationalité</label>
                  <input 
                    type="text" 
                    id="nationalite"
                    name="nationalite"
                    [(ngModel)]="newClient.nationalite"
                    class="input-field mt-1">
                </div>
              </div>
              
              <div>
                <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse</label>
                <textarea 
                  id="adresse"
                  name="adresse"
                  [(ngModel)]="newClient.adresse"
                  required
                  rows="2"
                  class="input-field mt-1"></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="typeCompte" class="block text-sm font-medium text-gray-700">Type de compte</label>
                  <select 
                    id="typeCompte"
                    name="typeCompte"
                    [(ngModel)]="newClient.typeCompte"
                    required
                    class="input-field mt-1">
                    <option value="COURANT">Compte Courant</option>
                    <option value="EPARGNE">Compte Épargne</option>
                  </select>
                </div>
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    [(ngModel)]="newClient.password"
                    required
                    minlength="6"
                    class="input-field mt-1">
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                (click)="closeCreateModal()"
                class="btn-secondary">
                Annuler
              </button>
              <button 
                type="submit"
                [disabled]="!clientForm.valid || isCreatingClient"
                class="btn-primary">
                
                <svg *ngIf="isCreatingClient" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                
                {{ isCreatingClient ? 'Création...' : 'Créer le client' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  clients: ClientDTO[] = [];
  isLoadingClients = false;
  showCreateModal = false;
  isCreatingClient = false;
  
  newClient: ClientDTO = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: '',
    nationalite: 'Togolaise',
    password: '',
    typeCompte: 'COURANT'
  };

  testResult = '';

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private toastService: ToastService,
    private router: Router,
    private http: HttpClient
  ) {}

  testCors(): void {
    console.log('🧪 Test CORS...');
    this.testResult = 'Test CORS en cours...';
    
    this.http.get('http://localhost:8081/api/test/cors', { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('✅ CORS OK:', response);
        this.testResult = 'CORS OK: ' + response;
      },
      error: (error) => {
        console.error('❌ CORS Error:', error);
        this.testResult = 'CORS Error: ' + error.message;
      }
    });
  }

  testAdminEndpoint(): void {
    console.log('🧪 Test Admin Endpoint...');
    this.testResult = 'Test Admin en cours...';
    
    this.http.get('http://localhost:8081/api/admin/clients').subscribe({
      next: (response) => {
        console.log('✅ Admin OK:', response);
        this.testResult = 'Admin OK: ' + JSON.stringify(response);
      },
      error: (error) => {
        console.error('❌ Admin Error:', error);
        this.testResult = 'Admin Error: ' + error.message;
      }
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadClients();
  }

  loadClients(): void {
    console.log('🔄 Chargement des clients...');
    this.isLoadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        console.log('✅ Clients reçus:', clients);
        this.clients = clients;
      },
      error: (error) => {
        console.error('❌ Erreur chargement clients:', error);
        this.toastService.error('Erreur', 'Impossible de charger la liste des clients');
      },
      complete: () => {
        console.log('🏁 Chargement clients terminé');
        this.isLoadingClients = false;
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetNewClientForm();
  }

  createClient(): void {
    if (this.isCreatingClient) return;
    
    console.log('🔄 Création client:', this.newClient);
    this.isCreatingClient = true;
    
    this.clientService.createClient(this.newClient).subscribe({
      next: (client) => {
        console.log('✅ Client créé:', client);
        this.toastService.success('Client créé', `${client.prenom} ${client.nom} a été ajouté avec succès`);
        this.closeCreateModal();
        this.loadClients(); // Refresh the list
      },
      error: (error) => {
        console.error('❌ Erreur création client:', error);
        let errorMessage = 'Impossible de créer le client';
        
        if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez que l\'email n\'existe pas déjà.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.toastService.error('Erreur de création', errorMessage);
      },
      complete: () => {
        console.log('🏁 Création client terminée');
        this.isCreatingClient = false;
      }
    });
  }

  resetNewClientForm(): void {
    this.newClient = {
      nom: '',
      prenom: '',
      email: '', // Laisser vide pour forcer l'utilisateur à saisir un email unique
      telephone: '',
      adresse: '',
      dateNaissance: '',
      sexe: '',
      nationalite: 'Togolaise',
      password: '',
      typeCompte: 'COURANT'
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}