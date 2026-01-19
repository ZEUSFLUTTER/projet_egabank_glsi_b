import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../_services/admin.service';
import { AuthService } from '../../_services/auth.service';
import { Compte, Client, StatutCompte, User } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './admin-accounts.component.html',
})
export class AdminAccountsComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  comptes: Compte[] = [];
  filteredComptes: Compte[] = [];
  clients: Client[] = []; // ✅ Liste pour le select

  isLoading = true;
  searchTerm = '';
  isSidebarOpen = false;
  currentUser: User | null = null;

  // Modale
  showCreateModal = false;
  newAccountData = { clientId: null as number | null, typeCompte: 'COURANT' };

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.adminService.getAllComptes().subscribe({
      next: (data) => {
        console.log("Premier compte reçu :", data[0]);
        console.log("Client du premier compte :", data[0]?.client);

        this.comptes = data;
        this.filteredComptes = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
    // 1. Charger les CLIENTS (Indispensable pour la modale)
    this.adminService.getAllClients().subscribe({
        next: (data) => this.clients = data,

        error: (err) => console.error("Erreur chargement clients", err)
    });


    // 2. Charger les COMPTES
    this.adminService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.filteredComptes = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  submitCreateAccount() {
      if (!this.newAccountData.clientId) {
          Swal.fire('Erreur', 'Veuillez sélectionner un client.', 'warning');
          return;
      }

      this.adminService.creerCompte(this.newAccountData.clientId, this.newAccountData.typeCompte)
        .subscribe({
          next: (compteCree) => {
              this.showCreateModal = false;

              // ✅ ASTUCE EXPERT : On recrée le lien manuellement pour l'affichage immédiat
              // car le backend renvoie parfois un objet client partiel après création.
              const clientAssocie = this.clients.find(c => c.id == this.newAccountData.clientId);
              if (clientAssocie) {
                  compteCree.client = clientAssocie;
              }

              this.comptes.unshift(compteCree); // Ajout en haut
              this.filterComptes();

              Swal.fire('Succès', `Compte ${compteCree.numeroCompte} créé !`, 'success');
              this.newAccountData = { clientId: null, typeCompte: 'COURANT' };
          },
          error: (err) => Swal.fire('Erreur', err.error?.message || 'Erreur technique', 'error')
      });
  }

  filterComptes() {
    if (!this.searchTerm) {
      this.filteredComptes = this.comptes;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredComptes = this.comptes.filter(c =>
      c.numeroCompte.toLowerCase().includes(term) ||
      c.client?.nom?.toLowerCase().includes(term) ||
      c.client?.prenom?.toLowerCase().includes(term)
    );
  }

  changerStatut(compte: Compte, nouveauStatut: StatutCompte) {
    const action = nouveauStatut === StatutCompte.SUSPENDU ? 'suspendre' : 'activer';
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous ${action} ce compte ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9308C8',
      confirmButtonText: 'Oui'
    }).then((res) => {
        if(res.isConfirmed) {
            this.adminService.changerStatutCompte(compte.numeroCompte, nouveauStatut).subscribe({
                next: (updated) => {
                    // Mise à jour locale sécurisée (on garde le client existant)
                    const idx = this.comptes.findIndex(c => c.id === updated.id);
                    if(idx !== -1) {
                        updated.client = this.comptes[idx].client;
                        this.comptes[idx] = updated;
                        this.filterComptes();
                    }
                    Swal.fire('Succès', 'Statut mis à jour', 'success');
                }
            });
        }
    });
  }

  get StatutCompte() { return StatutCompte; }
  logout() { this.authService.logout(); }
}
