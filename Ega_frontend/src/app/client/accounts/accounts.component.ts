import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { AccountService } from '../../_services/account.service';
import { User, Compte, Client, DemandeCompte, Transaction } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  authService = inject(AuthService);
  router = inject(Router);

  user: User | null = null;
  client: Client | null = null;

  comptes: Compte[] = [];
  demandesEnAttente: DemandeCompte[] = [];

  // AJOUT: Historique des transactions du client (tous comptes)
  historiqueClient: Transaction[] = [];

  isSidebarOpen = false;
  isLoading = true;

  // --- ÉTATS DES POPUPS ---
  showDepositModal = false;
  showWithdrawModal = false;
  showDemandeModal = false;
  showHistoryModal = false;
  showRibModal = false;

  // --- DONNÉES FORMULAIRES ---
  selectedCompte: Compte | null = null;
  montantOperation: number | null = null;
  selectedTypeCompteDemande: string = 'COURANT';
  historiqueCompte: Transaction[] = [];

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.route.data.subscribe((data) => {
      const resolvedData = data['donnees'];
      if (resolvedData) {
        this.comptes = resolvedData.comptes || [];
        this.client = resolvedData.clientInfos;
        // Charger l'historique du client dès que les données sont disponibles
        if (this.user?.id) {
          this.loadHistoriqueClient(this.user.id);
        }
      }

      this.isLoading = false;
    });
    this.refreshDemandes();
    if (this.user?.id && this.comptes.length === 0) {
      this.loadComptes();
    }
  }


  loadHistoriqueClient(clientId: number) {
    this.isLoading = true;

    // Récupérer tous les comptes du client
    this.accountService.getComptesByClient(clientId).subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        let historiquePromises: any[] = [];

        // Pour chaque compte, récupérer l'historique
        comptes.forEach((compte) => {
          historiquePromises.push(
            this.accountService.getHistorique(compte.numeroCompte).toPromise()
          );
        });

        // Attendre que tous les historiques soient chargés
        Promise.all(historiquePromises)
          .then((results) => {
            // Fusionner tous les historiques
            let allTransactions: Transaction[] = [];
            results.forEach((transactions) => {
              if (transactions) {
                allTransactions = allTransactions.concat(transactions);
              }
            });

            // Filtrer uniquement les types VERSEMENT, RETRAIT, VIREMENT
            // et trier par date décroissante
            this.historiqueClient = allTransactions
              .filter((tr) => ['VERSEMENT', 'RETRAIT', 'VIREMENT'].includes(tr.type))
              .sort(
                (a, b) =>
                  new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
              );

            this.isLoading = false;
          })
          .catch((error) => {
            console.error("Erreur lors du chargement de l'historique:", error);
            this.isLoading = false;
          });
      },
      error: (err) => {
        console.error('Erreur chargement comptes', err);
        this.isLoading = false;
      },
    });
  }

  loadComptes() {
    if (!this.user?.id) return;
    this.accountService.getComptesByClient(this.user.id).subscribe({
      next: (data) => (this.comptes = data),
      error: (err) => console.error('Erreur chargement comptes', err),
    });
  }

  refreshDemandes() {
    if (this.user?.id) {
      this.accountService.getMesDemandes(this.user.id).subscribe({
        next: (data) => {
          if (data) {
            this.demandesEnAttente = data.filter((d) => d.statut === 'EN_ATTENTE');
          }
        },
      });
    }
  }

  // --- GESTION DES MODALS ---

  // 1. Ouvrir Dépôt/Retrait
  openOperationModal(type: 'VERSEMENT' | 'RETRAIT', compte: Compte) {
    this.selectedCompte = compte;
    this.montantOperation = null;
    if (type === 'VERSEMENT') this.showDepositModal = true;
    else this.showWithdrawModal = true;
  }

  // 2. Ouvrir Historique (utilise maintenant l'historique déjà chargé)
  openHistoryModal(compte: Compte) {
    this.selectedCompte = compte;
    this.historiqueCompte = this.historiqueClient.filter(
      (tr) =>
        tr.compteSource?.numeroCompte === compte.numeroCompte ||
        tr.compteDestination?.numeroCompte === compte.numeroCompte
    );

    this.showHistoryModal = true;
  }

  // 3. Ouvrir RIB
  openRibModal(compte: Compte) {
    this.selectedCompte = compte;
    this.showRibModal = true;
  }

  closeModals() {
    this.showDepositModal = false;
    this.showWithdrawModal = false;
    this.showDemandeModal = false;
    this.showHistoryModal = false;
    this.showRibModal = false;
    this.selectedCompte = null;
    this.montantOperation = null;
  }

  // --- ACTIONS & VALIDATIONS ---

  submitVersement() {
    if (!this.montantOperation || this.montantOperation <= 0) {
      Swal.fire('Attention', 'Le montant du dépôt doit être supérieur à 0.', 'warning');
      return;
    }
    if (!this.selectedCompte) return;

    this.accountService
      .effectuerVersement(this.selectedCompte.numeroCompte, this.montantOperation)
      .subscribe({
        next: () => {
          this.handleSuccess('Dépôt effectué avec succès !');
          if (this.selectedCompte && this.montantOperation) {
            this.selectedCompte.solde += this.montantOperation;
          }
          // Recharger l'historique après une opération
          if (this.user?.id) {
            this.loadHistoriqueClient(this.user.id);
          }
          this.closeModals();
        },
        error: (err) => this.handleError(err),
      });
  }

  submitRetrait() {
    if (!this.montantOperation || this.montantOperation <= 0) {
      Swal.fire('Attention', 'Le montant du retrait doit être supérieur à 0.', 'warning');
      return;
    }
    if (!this.selectedCompte) return;

    if (this.montantOperation > this.selectedCompte.solde) {
      Swal.fire(
        'Fonds insuffisants',
        `Vous ne pouvez pas retirer ${this.montantOperation} FCFA. Solde disponible : ${this.selectedCompte.solde} FCFA`,
        'error'
      );
      return;
    }

    this.accountService
      .effectuerRetrait(this.selectedCompte.numeroCompte, this.montantOperation)
      .subscribe({
        next: () => {
          this.handleSuccess('Retrait effectué avec succès !');
          if (this.selectedCompte && this.montantOperation) {
            this.selectedCompte.solde -= this.montantOperation;
          }
          // Recharger l'historique après une opération
          if (this.user?.id) {
            this.loadHistoriqueClient(this.user.id);
          }
          this.closeModals();
        },
        error: (err) => this.handleError(err),
      });
  }

  submitDemande() {
    if (!this.user || !this.user.id) return;

    this.accountService.creerDemandeCompte(this.user.id, this.selectedTypeCompteDemande).subscribe({
      next: () => {
        this.handleSuccess('Demande envoyée !');
        this.refreshDemandes();
        this.closeModals();
      },
      error: (err) => this.handleError(err),
    });
  }

  // --- HELPERS ---

  // Générer des fausses infos RIB pour l'affichage (si pas stocké en base séparément)
  getBankCode() {
    return '30055';
  } // Code banque fictif
  getBranchCode() {
    return '00254';
  } // Code guichet
  getRibKey() {
    return '45';
  }

  private handleSuccess(msg: string) {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: msg,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  private handleError(err: any) {
    const msg = err.error?.message || 'Une erreur est survenue';
    Swal.fire('Erreur', msg, 'error');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
