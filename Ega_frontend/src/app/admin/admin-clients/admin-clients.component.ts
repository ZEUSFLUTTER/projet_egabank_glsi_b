import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../_services/admin.service';
import { AuthService } from '../../_services/auth.service';
import { Client, User } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe], // Ajout DatePipe et FormsModule
  templateUrl: 'admin-clients.component.html',
})
export class AdminClientsComponent implements OnInit {
  adminService = inject(AdminService);
  authService = inject(AuthService);

  clients: Client[] = [];
  filteredClients: Client[] = [];
  isLoading = true;
  searchTerm = '';
  isSidebarOpen = false;
  currentUser: User | null = null;

  // Gestion Modale et Formulaire
  showModal = false;
  isEditing = false; // true si modification, false si création

  // Objet Formulaire (initialisé vide)
  clientForm: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaiss: '',
    nationalite: 'Togolaise',
    sexe: 'Masculin'
  };

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.adminService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  filterClients() {
    if (!this.searchTerm) {
      this.filteredClients = this.clients;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c =>
      c.nom.toLowerCase().includes(term) ||
      c.prenom.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  }

  // --- ACTIONS ---

  // 1. Ouvrir modale en mode CRÉATION
  openCreateModal() {
    this.isEditing = false;
    this.clientForm = {
      nom: '', prenom: '', email: '', telephone: '',
      adresse: '', dateNaiss: '', nationalite: 'Togolaise', sexe: 'Masculin'
    };
    this.showModal = true;
  }

  // 2. Ouvrir modale en mode ÉDITION
  openEditModal(client: Client) {
    this.isEditing = true;
    // Copie profonde pour ne pas modifier le tableau directement avant sauvegarde
    this.clientForm = { ...client };
    this.showModal = true;
  }

  // 3. Soumettre le formulaire (Create ou Update)
  onSubmit() {
    if (!this.clientForm.nom || !this.clientForm.email) {
      Swal.fire('Erreur', 'Veuillez remplir les champs obligatoires', 'warning');
      return;
    }

    if (!this.isEditing) {
        this.clientForm.password = 'Ega2026';
    }

    const observable$ = this.isEditing && this.clientForm.id
      ? this.adminService.updateClient(this.clientForm.id, this.clientForm)
      : this.adminService.createClient(this.clientForm);

    observable$.subscribe({
      next: () => {
        this.showModal = false;
        this.loadClients(); // Recharger la liste
        Swal.fire('Succès', `Client ${this.isEditing ? 'modifié' : 'créé'} avec succès`, 'success');
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Une erreur est survenue', 'error');
      }
    });
  }

  // 4. Supprimer un client
  deleteClient(client: Client) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Suppression définitive du client ${client.nom} ${client.prenom}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed && client.id) {
        this.adminService.deleteClient(client.id).subscribe({
          next: () => {
            this.loadClients();
            Swal.fire('Supprimé!', 'Le dossier client a été supprimé.', 'success');
          },
          error: (err) => Swal.fire('Erreur', err.error?.message || 'Impossible de supprimer (comptes actifs ?)', 'error')
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
