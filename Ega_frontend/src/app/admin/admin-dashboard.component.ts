import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AdminService } from '../_services/admin.service';
import { User, DemandeCompte, DashboardStats } from '../_models/models';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  adminService = inject(AdminService);
  router = inject(Router);

  user: User | null = null;
  isSidebarOpen = false;
  showDetailModal = false;
  selectedDemande: DemandeCompte | null = null;
  isLoading = true;
  loadError = false;

  // Stats par défaut
  stats: DashboardStats = {
    totalClients: 0,
    demandesTraitees: 0,
    volumeTransactions: 0
  };

  demandesEnAttente: DemandeCompte[] = [];

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    // Vérification de l'authentification
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // Chargement automatique des données
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.loadError = false;

    // Chargement parallèle des demandes et des stats avec forkJoin
    forkJoin({
      demandes: this.adminService.getDemandesEnAttente(),
      stats: this.adminService.getDashboardStats()
    }).subscribe({
      next: (result) => {
        this.demandesEnAttente = result.demandes;
        this.stats = result.stats;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des données:", err);
        this.loadError = true;
        this.isLoading = false;

        // Afficher un message d'erreur à l'utilisateur
        Swal.fire({
          title: 'Erreur de chargement',
          text: 'Impossible de charger les données du tableau de bord. Vérifiez que le backend est démarré.',
          icon: 'error',
          confirmButtonColor: '#9308C8',
          confirmButtonText: 'Réessayer'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadDashboardData();
          }
        });
      }
    });
  }

  openDetailModal(demande: DemandeCompte) {
    this.selectedDemande = demande;
    this.showDetailModal = true;
  }

  closeModals() {
    this.showDetailModal = false;
    this.selectedDemande = null;
  }

  onValider(demande: DemandeCompte) {
    Swal.fire({
      title: 'Confirmer la validation ?',
      text: `Création du compte ${demande.typeCompte} pour ${demande.client?.nom}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9308C8',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui, valider'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.validerDemande(demande.id).subscribe({
          next: () => {
            Swal.fire('Validé', 'Le compte a été créé avec succès.', 'success');
            this.loadDashboardData(); // Recharger automatiquement les données
          },
          error: (err) => Swal.fire('Erreur', err.error?.message || 'Erreur technique', 'error')
        });
      }
    });
  }

  onRejeter(demande: DemandeCompte) {
    Swal.fire({
      title: 'Motif du rejet',
      input: 'text',
      inputPlaceholder: 'Ex: Dossier incomplet...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Rejeter'
    }).then((result) => {
      if (result.isConfirmed) {
        const motif = result.value || 'Aucun motif';
        this.adminService.rejeterDemande(demande.id, motif).subscribe({
          next: () => {
            Swal.fire('Rejeté', 'La demande a été rejetée.', 'success');
            this.loadDashboardData(); // Recharger automatiquement les données
          },
          error: (err) => Swal.fire('Erreur', err.error?.message || 'Erreur technique', 'error')
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
