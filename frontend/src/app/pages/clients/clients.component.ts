import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'telephone', 'actions'];
  clients: Client[] = [];
  loading = false;
  showForm = false;
  editingClient: Client | null = null;

  clientForm: Partial<Client> = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    nationalite: '',
    sexe: '',
    dateNaissance: ''
  };

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

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
      error: (err) => {
        console.error('Erreur chargement clients', err);
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingClient = null;
    this.clientForm = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      nationalite: '',
      sexe: '',
      dateNaissance: ''
    };
    this.showForm = true;
  }

  openEditForm(client: Client): void {
    this.editingClient = client;
    this.clientForm = { ...client };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingClient = null;
    this.clientForm = {};
  }

  saveClient(): void {
    if (!this.clientForm.nom || !this.clientForm.prenom || !this.clientForm.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editingClient) {
      this.clientService.updateClient(this.editingClient.id!, this.clientForm).subscribe({
        next: () => {
          this.loadClients();
          this.cancelForm();
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour: ' + (err.error?.message || 'Erreur inconnue'));
        }
      });
    } else {
      this.clientService.createClient(this.clientForm as Client).subscribe({
        next: () => {
          this.loadClients();
          this.cancelForm();
        },
        error: (err) => {
          alert('Erreur lors de la création: ' + (err.error?.message || 'Erreur inconnue'));
        }
      });
    }
  }

  deleteClient(client: Client): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom}?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          alert('Erreur lors de la suppression: ' + (err.error?.message || 'Erreur inconnue'));
        }
      });
    }
  }

  navigateToComptes(): void {
    this.router.navigate(['/comptes']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
