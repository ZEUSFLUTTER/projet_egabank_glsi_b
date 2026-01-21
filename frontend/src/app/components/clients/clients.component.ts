import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Gestion des Clients</h1>
        <button class="btn btn-primary" (click)="openModal()">+ Nouveau Client</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && clients.length === 0" class="empty-state">
        <p>Aucun client trouvé</p>
        <button class="btn btn-primary" (click)="openModal()">Créer le premier client</button>
      </div>

      <div *ngIf="!loading && clients.length > 0" class="card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Courriel</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Date de naissance</th>
              <th>Sexe</th>
              <th>Nationalité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients">
              <td>{{ client.id }}</td>
              <td>{{ client.nom }}</td>
              <td>{{ client.prenom }}</td>
              <td>{{ client.courriel }}</td>
              <td>{{ client.numTelephone }}</td>
              <td>{{ client.adresse }}</td>
              <td>{{ formatDate(client.dateNaissance) }}</td>
              <td>{{ client.sexe }}</td>
              <td>{{ client.nationalite }}</td>
              <td>
                <button class="btn btn-secondary" (click)="editClient(client)"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-danger" (click)="deleteClient(client.id!)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal" [class.show]="showModal" (click)="closeModalOnBackdrop($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingClient ? 'Modifier le client' : 'Nouveau client' }}</h3>
            <button class="close" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveClient()" #clientForm="ngForm">
            <div class="form-group">
              <label for="nom">Nom *</label>
              <input type="text" id="nom" name="nom" [(ngModel)]="currentClient.nom" required />
            </div>
            <div class="form-group">
              <label for="prenom">Prénom *</label>
              <input type="text" id="prenom" name="prenom" [(ngModel)]="currentClient.prenom" required />
            </div>
            <div class="form-group">
              <label for="courriel">Courriel *</label>
              <input type="email" id="courriel" name="courriel" [(ngModel)]="currentClient.courriel" required />
            </div>
            <div class="form-group">
              <label for="numTelephone">Numéro de téléphone *</label>
              <input type="text" id="numTelephone" name="numTelephone" [(ngModel)]="currentClient.numTelephone" required />
            </div>
            <div class="form-group">
              <label for="adresse">Adresse *</label>
              <input type="text" id="adresse" name="adresse" [(ngModel)]="currentClient.adresse" required />
            </div>
            <div class="form-group">
              <label for="dateNaissance">Date de naissance *</label>
              <input type="date" id="dateNaissance" name="dateNaissance" [(ngModel)]="currentClient.dateNaissance" required />
            </div>
            <div class="form-group">
              <label for="sexe">Sexe *</label>
              <select id="sexe" name="sexe" [(ngModel)]="currentClient.sexe" required>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div class="form-group">
              <label for="nationalite">Nationalité *</label>
              <input type="text" id="nationalite" name="nationalite" [(ngModel)]="currentClient.nationalite" required />
            </div>
            <div *ngIf="error" class="error-message">{{ error }}</div>
            <div *ngIf="success" class="success-message">{{ success }}</div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: var(--color-black);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .table {
      font-size: 14px;
    }

    .table td {
      font-size: 13px;
    }

    .table .btn {
      padding: 5px 10px;
      font-size: 12px;
      margin-right: 5px;
    }
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  showModal = false;
  editingClient: Client | null = null;
  currentClient: Client = {
    nom: '',
    prenom: '',
    courriel: '',
    numTelephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: '',
    nationalite: ''
  };
  error = '';
  success = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.editingClient = null;
    this.currentClient = {
      nom: '',
      prenom: '',
      courriel: '',
      numTelephone: '',
      adresse: '',
      dateNaissance: '',
      sexe: '',
      nationalite: ''
    };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  editClient(client: Client): void {
    this.editingClient = client;
    this.currentClient = { ...client };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingClient = null;
  }

  closeModalOnBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  saveClient(): void {
    this.error = '';
    this.success = '';

    if (this.editingClient) {
      this.clientService.updateClient(this.editingClient.id!, this.currentClient).subscribe({
        next: () => {
          this.success = 'Client modifié avec succès';
          this.loadClients();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.clientService.createClient(this.currentClient).subscribe({
        next: (createdClient) => {
          if (createdClient.password) {
            this.success = `Client créé avec succès. Mot de passe généré: ${createdClient.password}`;
          } else {
            this.success = 'Client créé avec succès';
          }
          this.loadClients();
          setTimeout(() => {
            this.closeModal();
          }, 4999); 
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          alert(err.error?.message || 'Erreur lors de la suppression');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}

