import { Component, OnInit, inject, signal } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client as ClientModel } from '../../../models/client.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Plus, Search, Edit, Trash2, LucideAngularModule, AlertTriangle, Wallet, Users, Mail, Phone, Globe } from 'lucide-angular';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [DatePipe, RouterLink, LucideAngularModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {

  readonly Plus = Plus;
  readonly Search = Search
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly AlertTriangle = AlertTriangle;
  readonly Wallet = Wallet;
  readonly Users = Users;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Globe = Globe;

  clients: ClientModel[] = [];
  clientsFiltres: ClientModel[] = [];

  clientToDelete: ClientModel | null = null;

  constructor(private snack: MatSnackBar) {}

  private clientService = inject(ClientService);

  showDeleteModal = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.clientsFiltres = data;
        console.log('Clients chargés:', data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement clients', err);
        this.loading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();

    if (!query) {
      this.clientsFiltres = this.clients;
      return;
    }

    this.clientsFiltres = this.clients.filter(c =>
      c.nom.toLowerCase().includes(query) ||
      c.prenom.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  }

  openDeleteModal(client: ClientModel): void {
    this.clientToDelete = client;
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.clientToDelete = null;
  }

  confirmDelete(): void {
    if (!this.clientToDelete?.id) return;

    const id = this.clientToDelete.id;

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.id !== id);
        this.clientsFiltres = this.clientsFiltres.filter(c => c.id !== id);

        this.closeDeleteModal();
        this.snack.open('Client supprimé', 'X', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (err) => {
        console.error('Erreur suppression client', err);
      }
    });
  }
}