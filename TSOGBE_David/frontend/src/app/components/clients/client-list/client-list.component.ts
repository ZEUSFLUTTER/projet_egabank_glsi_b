import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
 import { AuthService } from '../../../services/auth.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  errorMessage: string = '';

  constructor(
    private clientService: ClientService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Ne charger les clients que si l'utilisateur est admin
    if (this.authService.isAdmin()) {
      this.loadClients();
    } else {
      this.loading = false;
    }
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des clients';
        this.loading = false;
      }
    });
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }
}

