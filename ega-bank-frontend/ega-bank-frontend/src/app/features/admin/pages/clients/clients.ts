import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminClientService } from '../../services/admin-client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class AdminClientsPage implements OnInit {
  clients: Client[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private clientService: AdminClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // ===============================
  // LOAD CLIENTS
  // ===============================
  loadClients(): void {
    this.loading = true;
    this.errorMessage = null;

    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement clients', err);
        this.errorMessage = 'Impossible de charger la liste des clients';
        this.loading = false;
      },
    });
  }

  // ===============================
  // DELETE CLIENT
  // ===============================
  deleteClient(client: Client): void {
    const confirmed = confirm(`Supprimer le client ${client.prenom} ${client.nom} ?`);

    if (!confirmed) {
      return;
    }

    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        this.clients = this.clients.filter((c) => c.id !== client.id);
      },
      error: (err) => {
        console.error('Erreur suppression client', err);
        alert('Erreur lors de la suppression du client');
      },
    });
  }
}
