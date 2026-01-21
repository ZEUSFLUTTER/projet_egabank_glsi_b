import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService, Client } from '../../../services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Liste des Clients</h2>
        <a routerLink="/clients/new" class="btn btn-primary">Nouveau Client</a>
      </div>

      <div *ngIf="errorMessage" style="color: red; padding: 10px; background-color: #ffe6e6; border-radius: 4px; margin-bottom: 20px;">
        {{ errorMessage }}
      </div>

      <div *ngIf="isLoading" style="text-align: center; padding: 20px;">
        Chargement en cours...
      </div>

      <div *ngIf="!isLoading && clients.length > 0" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <thead style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
            <tr>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">ID</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Adresse</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Email</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Date de Création</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Date de Naissance</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Nationalité</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Nom</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Téléphone</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Prénom</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Sexe</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients" style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px;">{{ client.id }}</td>
              <td style="padding: 12px;">{{ client.adresse }}</td>
              <td style="padding: 12px;">{{ client.courriel }}</td>
              <td style="padding: 12px;">{{ client.dateCreation | date:'short' }}</td>
              <td style="padding: 12px;">{{ client.dateNaissance | date:'short' }}</td>
              <td style="padding: 12px;">{{ client.nationalite }}</td>
              <td style="padding: 12px;">{{ client.nom }}</td>
              <td style="padding: 12px;">{{ client.numeroTelephone }}</td>
              <td style="padding: 12px;">{{ client.prenom }}</td>
              <td style="padding: 12px;">{{ client.sexe }}</td>
              <td style="padding: 12px;">
                <a [routerLink]="['/clients/edit', client.id]" class="btn btn-primary" style="padding: 5px 10px; font-size: 14px; text-decoration: none; background-color: #007bff; color: white; border-radius: 3px; margin-right: 5px;">Éditer</a>
                <button (click)="deleteClient(client.id!)" class="btn btn-danger" style="padding: 5px 10px; font-size: 14px; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!isLoading && clients.length === 0" style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
        Aucun client trouvé
      </div>
    </div>
  `,
  styles: []
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
        } else if (err.status === 403) {
          this.errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le Backend est en cours d\'exécution sur le port 8081.';
        } else {
          this.errorMessage = `Erreur lors du chargement des clients: ${err.message}`;
        }
      }
    });
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}
