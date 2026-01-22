import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceComptes } from '../../services/service-comptes.service';
import { CompteModele, OperationDTO, VirementDTO } from '../../modeles/compte-modele';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mes-comptes',
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-comptes.component.html',
  styleUrls: ['./mes-comptes.component.css']
})
export class MesComptesComponent implements OnInit {
  comptes: CompteModele[] = [];
  chargement = true;
  
  modalDepotOuverte = false;
  modalRetraitOuverte = false;
  modalVirementOuvert = false;
  
  operationEnCours = false;
  compteSelectionne: CompteModele | null = null;
  
  donneesDepot: OperationDTO = {
    compteId: 0,
    montant: 0,
    description: ''
  };
  
  donneesRetrait: OperationDTO = {
    compteId: 0,
    montant: 0,
    description: ''
  };
  
  donneesVirement: VirementDTO = {
    compteSourceId: 0,
    compteDestinationId: undefined,
    numeroCompteDestination: '',
    montant: 0,
    description: ''
  };
  
  typeVirement: 'interne' | 'externe' = 'interne';

  constructor(private serviceComptes: ServiceComptes) {}

  ngOnInit(): void {
    this.chargerComptes();
  }

  chargerComptes(): void {
    console.log('DEBUG - Début chargement des comptes');
    this.chargement = true;
    
    this.comptes = [];
    
    this.serviceComptes.listerMesComptes().subscribe({
      next: (comptes) => {
        console.log('DEBUG - Comptes reçus:', comptes);
        setTimeout(() => {
          this.comptes = comptes;
          this.chargement = false;
          console.log('DEBUG - Comptes mis à jour dans le composant');
        }, 200);
      },
      error: (erreur) => {
        console.error('DEBUG - Erreur lors du chargement des comptes:', erreur);
        this.chargement = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur de chargement',
          text: 'Impossible de charger vos comptes. Veuillez actualiser la page.',
          confirmButtonText: 'Actualiser',
          confirmButtonColor: '#dc3545'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }

  ouvrirModalDepot(compte: CompteModele): void {
    this.compteSelectionne = compte;
    this.donneesDepot = {
      compteId: compte.id!,
      montant: 0,
      description: ''
    };
    this.modalDepotOuverte = true;
  }

  fermerModalDepot(): void {
    this.modalDepotOuverte = false;
    this.compteSelectionne = null;
  }

  effectuerDepot(): void {
    if (!this.validerMontant(this.donneesDepot.montant)) return;

    console.log('DEBUG - Début dépôt:', this.donneesDepot);
    this.operationEnCours = true;
    
    this.serviceComptes.effectuerDepot(this.donneesDepot).subscribe({
      next: (response) => {
        console.log('DEBUG - Réponse dépôt réussie:', response);
        this.operationEnCours = false;
        this.fermerModalDepot();
        
        Swal.fire({
          icon: 'success',
          title: '💰 Dépôt réussi !',
          html: `<div class="text-center">
                   <p class="mb-2">Votre dépôt de <strong>${this.donneesDepot.montant.toLocaleString('fr-FR')} FCFA</strong> a été traité avec succès.</p>
                   <p class="text-muted small">Votre nouveau solde sera visible dans quelques instants.</p>
                 </div>`,
          confirmButtonText: 'Parfait !',
          confirmButtonColor: '#28a745',
          timer: 3000,
          timerProgressBar: true
        });
        
        setTimeout(() => {
          console.log('DEBUG - Rechargement des comptes après dépôt');
          this.chargerComptes();
        }, 500);
      },
      error: (erreur) => {
        console.error('DEBUG - Erreur dépôt:', erreur);
        console.error('DEBUG - Status:', erreur.status);
        console.error('DEBUG - Message:', erreur.message);
        console.error('DEBUG - Error object:', erreur.error);
        
        this.operationEnCours = false;
        Swal.fire({
          icon: 'error',
          title: 'Échec du dépôt',
          text: erreur.error?.message || 'Une erreur est survenue lors du traitement de votre dépôt. Veuillez réessayer.',
          confirmButtonText: 'Compris',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  ouvrirModalRetrait(compte: CompteModele): void {
    this.compteSelectionne = compte;
    this.donneesRetrait = {
      compteId: compte.id!,
      montant: 0,
      description: ''
    };
    this.modalRetraitOuverte = true;
  }

  fermerModalRetrait(): void {
    this.modalRetraitOuverte = false;
    this.compteSelectionne = null;
  }

  effectuerRetrait(): void {
    if (!this.validerMontant(this.donneesRetrait.montant)) return;

    this.operationEnCours = true;
    this.serviceComptes.effectuerRetrait(this.donneesRetrait).subscribe({
      next: () => {
        this.operationEnCours = false;
        this.fermerModalRetrait();
        
        Swal.fire({
          icon: 'success',
          title: '💸 Retrait autorisé !',
          html: `<div class="text-center">
                   <p class="mb-2">Votre retrait de <strong>${this.donneesRetrait.montant.toLocaleString('fr-FR')} FCFA</strong> a été approuvé.</p>
                   <p class="text-muted small">Les fonds ont été débités de votre compte avec succès.</p>
                 </div>`,
          confirmButtonText: 'Merci !',
          confirmButtonColor: '#17a2b8',
          timer: 3000,
          timerProgressBar: true
        });
        
        setTimeout(() => {
          this.chargerComptes();
        }, 500);
      },
      error: (erreur) => {
        this.operationEnCours = false;
        Swal.fire({
          icon: 'error',
          title: 'Retrait impossible',
          text: erreur.error?.message || 'Votre retrait n\'a pas pu être traité. Vérifiez votre solde disponible.',
          confirmButtonText: 'Compris',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  ouvrirModalVirement(compte: CompteModele): void {
    this.compteSelectionne = compte;
    this.donneesVirement = {
      compteSourceId: compte.id!,
      compteDestinationId: undefined,
      numeroCompteDestination: '',
      montant: 0,
      description: ''
    };
    this.typeVirement = 'interne';
    this.modalVirementOuvert = true;
  }

  fermerModalVirement(): void {
    this.modalVirementOuvert = false;
    this.compteSelectionne = null;
  }

  changerTypeVirement(): void {
    if (this.typeVirement === 'interne') {
      this.donneesVirement.numeroCompteDestination = '';
    } else {
      this.donneesVirement.compteDestinationId = undefined;
    }
  }

  effectuerVirement(): void {
    if (!this.validerMontant(this.donneesVirement.montant)) return;

    if (this.typeVirement === 'interne' && !this.donneesVirement.compteDestinationId) {
      Swal.fire({
        icon: 'warning',
        title: 'Compte de destination requis',
        text: 'Veuillez sélectionner un compte de destination pour votre virement',
        confirmButtonText: 'D\'accord',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    if (this.typeVirement === 'externe' && !this.donneesVirement.numeroCompteDestination?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Numéro de compte requis',
        text: 'Veuillez saisir le numéro de compte de destination pour votre virement',
        confirmButtonText: 'D\'accord',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    this.operationEnCours = true;
    this.serviceComptes.effectuerVirement(this.donneesVirement).subscribe({
      next: () => {
        this.operationEnCours = false;
        this.fermerModalVirement();
        
        const typeVirementText = this.typeVirement === 'interne' ? 'entre vos comptes' : 'vers un compte externe';
        
        Swal.fire({
          icon: 'success',
          title: '🔄 Virement exécuté !',
          html: `<div class="text-center">
                   <p class="mb-2">Votre virement de <strong>${this.donneesVirement.montant.toLocaleString('fr-FR')} FCFA</strong></p>
                   <p class="mb-2">${typeVirementText} a été traité avec succès.</p>
                   <p class="text-muted small">La transaction apparaîtra dans votre historique sous peu.</p>
                 </div>`,
          confirmButtonText: 'Excellent !',
          confirmButtonColor: '#6f42c1',
          timer: 3500,
          timerProgressBar: true
        });
        
        setTimeout(() => {
          this.chargerComptes();
        }, 500);
      },
      error: (erreur) => {
        this.operationEnCours = false;
        Swal.fire({
          icon: 'error',
          title: 'Virement échoué',
          text: erreur.error?.message || 'Votre virement n\'a pas pu être traité. Vérifiez les informations saisies.',
          confirmButtonText: 'Compris',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  private validerMontant(montant: number): boolean {
    if (!montant || montant <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Montant invalide',
        text: 'Veuillez saisir un montant supérieur à 0 FCFA',
        confirmButtonText: 'Corriger',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }
    
    if (montant > 50000) {
      Swal.fire({
        icon: 'info',
        title: 'Montant élevé détecté',
        text: 'Pour les montants supérieurs à 50 000 FCFA, veuillez contacter votre conseiller.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#17a2b8'
      });
      return false;
    }
    
    return true;
  }

  obtenirTypeCompteLibelle(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  obtenirComptesDestination(): CompteModele[] {
    return this.comptes.filter(compte => compte.id !== this.compteSelectionne?.id);
  }
}