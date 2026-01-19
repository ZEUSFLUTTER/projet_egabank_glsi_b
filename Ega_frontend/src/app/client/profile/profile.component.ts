import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ClientService } from '../../_services/client.service';
import { User, Client } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  clientService = inject(ClientService);
  router = inject(Router);

  user: User | null = null;
  client: Client | null = null;

  isSidebarOpen = false;
  isLoading = true;
  isSaving = false;

  // Données pour le changement de mot de passe
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.loadClientData();
  }

  loadClientData() {
    if (this.user && this.user.email) {
        this.isLoading = true;
        this.clientService.searchClients(this.user.email).subscribe({
            next: (clients) => {
                if (clients && clients.length > 0) {
                    this.client = clients[0];
                    console.log('Client trouvé via email:', this.client);
                } else {
                    Swal.fire('Erreur', 'Aucune fiche client associée à cet email.', 'error');
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }
  }
 updateProfile() {
    if (!this.client || !this.client.id) return;

    this.isSaving = true;
    const clientToSend = { ...this.client };
    delete clientToSend.password; // On ne touche pas au mdp ici

    // On utilise l'ID du CLIENT récupéré par la recherche
    this.clientService.updateClient(this.client.id, clientToSend).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient; // Mise à jour de l'affichage
        this.isSaving = false;
        Swal.fire({
            icon: 'success',
            title: 'Profil mis à jour',
            confirmButtonColor: '#9308C8'
        });
      },
      error: (err) => {
        this.isSaving = false;
        Swal.fire('Erreur', "Échec de la mise à jour.", 'error');
      }
    });
  }
  // 2. Changer le mot de passe
  updatePassword() {
    if (!this.client || !this.client.id) return;

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        Swal.fire('Erreur', 'Les mots de passe ne correspondent pas.', 'warning');
        return;
    }
    if (this.passwordData.newPassword.length < 4) {
        Swal.fire('Erreur', 'Le mot de passe est trop court.', 'warning');
        return;
    }

    this.isSaving = true;

    // On prépare l'objet Client avec le NOUVEAU mot de passe
    // Le backend devra détecter la présence du champ "password" et le hasher
    const clientWithPassword = {
        ...this.client,
        password: this.passwordData.newPassword
    };

    this.clientService.updateClient(this.client.id, clientWithPassword).subscribe({
        next: () => {
            this.isSaving = false;
            // Reset des champs
            this.passwordData = { newPassword: '', confirmPassword: '' };

            Swal.fire({
                icon: 'success',
                title: 'Sécurité',
                text: 'Votre mot de passe a été modifié.',
                confirmButtonColor: '#9308C8'
            });
        },
        error: (err) => {
            this.isSaving = false;
            Swal.fire('Erreur', 'Impossible de modifier le mot de passe.', 'error');
        }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
