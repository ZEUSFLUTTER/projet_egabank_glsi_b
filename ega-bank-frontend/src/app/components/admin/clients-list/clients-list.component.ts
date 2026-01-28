import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Client } from '../../../models/models';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700;">Liste des Clients</h1>
        <a routerLink="/admin/clients/new" class="btn btn-primary">+ Nouveau Client</a>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Nationalité</th>
              <th style="width: 300px; min-width: 300px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients">
              <td>{{ client.prenom }} {{ client.nom }}</td>
              <td>{{ client.courriel }}</td>
              <td>{{ client.telephone }}</td>
              <td>{{ client.nationalite }}</td>
              <td>
                <div class="client-actions-row">
                  <a [routerLink]="['/admin/clients', client.id]" class="btn btn-sm btn-outline" title="Voir les détails">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Voir
                  </a>
                  <a [routerLink]="['/admin/clients', client.id, 'edit']" class="btn btn-sm btn-secondary" title="Modifier le client">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    </svg>
                    Modifier
                  </a>
                  <button (click)="deleteClient(client.id!)" class="btn btn-sm btn-danger" title="Supprimer le client">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadClients();
  }
  loadClients(): void {
    this.adminService.listClients().subscribe(clients => this.clients = clients);
  }
  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.adminService.deleteClient(id).subscribe(() => this.loadClients());
    }
  }
}
