import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { AccountService } from '../../_services/account.service';
import { User, Compte, Client } from '../../_models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-virements',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './virements.component.html',
})
export class VirementsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  authService = inject(AuthService);
  router = inject(Router);

  user: User | null = null;
  client: Client | null = null;
  comptes: Compte[] = [];

  isSidebarOpen = false;
  isLoading = false;

  virementData = {
    compteSource: '',
    compteDest: '',
    montant: null as number | null, // Typage explicite
    motif: ''
  };

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.route.data.subscribe(data => {
      const resolvedData = data['donnees'];
      if (resolvedData) {
        this.comptes = resolvedData.comptes || [];
        this.client = resolvedData.clientInfos;
        if (this.comptes.length > 0) {
          this.virementData.compteSource = this.comptes[0].numeroCompte;
        }
      }
    });
  }

  // Récupère l'objet compte complet
  getCurrentAccount(): Compte | undefined {
    return this.comptes.find(c => c.numeroCompte === this.virementData.compteSource);
  }

  // Remplir avec le montant max
  setMaxMontant() {
    const compte = this.getCurrentAccount();
    if (compte) {
      this.virementData.montant = compte.solde;
    }
  }

  onSubmitVirement() {
    // 1. Validation des champs
    if (!this.virementData.compteSource || !this.virementData.compteDest || !this.virementData.montant) {
      Swal.fire('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    // 2. Validation Montant Positif
    if (this.virementData.montant <= 0) {
      Swal.fire('Montant invalide', 'Le montant doit être strictement positif.', 'warning');
      return;
    }

    // 3. Validation Auto-Virement
    if (this.virementData.compteSource === this.virementData.compteDest) {
        Swal.fire('Opération impossible', 'Vous ne pouvez pas effectuer un virement vers le même compte.', 'warning');
        return;
    }

    const destClean = this.virementData.compteDest.replace(/\s/g, '').toUpperCase();

    // Regex : Uniquement des Chiffres et Lettres (A-Z, 0-9), longueur entre 11 et 34 caractères
    // (11 est souvent la taille d'un numéro de compte local, 24-34 pour un IBAN)
    const formatRegex = /^[A-Z0-9]{11,34}$/;

    if (!formatRegex.test(destClean)) {
        Swal.fire({
            icon: 'warning',
            title: 'Numéro de compte invalide',
            text: 'Le numéro du bénéficiaire semble incorrect. Il doit comporter au moins 11 caractères alphanumériques sans caractères spéciaux.',
        });
        return;
    }

    // if (this.virementData.motif && /[0-9]/.test(this.virementData.motif)) {
    //     Swal.fire('Motif invalide', 'Le motif ne doit contenir aucun chiffre.', 'warning');
    //     return;
    // }

    const currentCompte = this.getCurrentAccount();
    if (currentCompte && this.virementData.montant > currentCompte.solde) {
        Swal.fire('Solde insuffisant', `Vous ne disposez que de ${currentCompte.solde} FCFA.`, 'error');
        return;
    }

    // --- ENVOI AU BACKEND ---
    this.isLoading = true;

    // Le backend attend : { compteEmetteur, compteBeneficiaire, montant }
    // Assurez-vous que votre DTO Java correspond à ces noms de clés,
    // ou adaptez l'objet ci-dessous (ex: numeroCompteEmetteur, etc.)
    const payload = {
        compteEmetteur: this.virementData.compteSource,
        compteBeneficiaire: destClean,
        montant: this.virementData.montant
    };

    // Note : J'utilise ici une méthode générique 'effectuerVirement' qu'il faut s'assurer d'avoir dans le service
    // Si votre service s'appelle autrement, adaptez la ligne suivante.
    this.accountService.effectuerVirement(payload.compteEmetteur, payload.compteBeneficiaire, payload.montant)
      .subscribe({
        next: () => {
          this.isLoading = false;

          // Mise à jour locale du solde pour éviter de recharger la page
          if (currentCompte && this.virementData.montant) {
            currentCompte.solde -= this.virementData.montant;
          }

          Swal.fire({
            icon: 'success',
            title: 'Virement réussi !',
            text: `Le transfert de ${this.virementData.montant} FCFA a été effectué avec succès.`,
            confirmButtonColor: '#9308C8'
          });

          // Reset partiel du formulaire
          this.virementData.montant = null;
          this.virementData.motif = '';
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);

          // GESTION INTELLIGENTE DES ERREURS BACKEND
          let message = "Une erreur est survenue.";

          // Si le backend renvoie une erreur spécifique (ex: Compte introuvable)
          if (err.error && err.error.message) {
             message = err.error.message;
          } else if (err.status === 404 || err.status === 400) {
             // Souvent lié au compte destination qui n'existe pas
             message = "Le compte bénéficiaire est introuvable ou n'existe pas dans nos livres.";
          }

          Swal.fire('Échec du virement', message, 'error');
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
