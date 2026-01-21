import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientModele } from '../../modeles/client-modele';
import { ServiceClients } from '../../services/service-clients.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  chargement = false;
  messageErreur = '';
  messageSucces = '';
  creationEnCours = false;
  erreurCreation = '';
  editionEnCours = false;
  erreurEdition = '';
  clientEdition: ClientModele | null = null;
  suppressionEnCoursId: number | null = null;
  listeClients: ClientModele[] = [];
  nouveauClient: ClientModele = this.clientVide();
  constructor(
    private serviceClients: ServiceClients, 
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.charger();
    this.route.queryParams.subscribe(params => {
    if (params['ajout'] === 'true') {
      this.ouvrirModalAjoutClient();
    }
  });
  }
  clientVide(): ClientModele {
    return {
      nom: '',
      prenom: '',
      dateNaissance: '2000-01-01',
      sexe: 'MASCULIN',
      adresse: '',
      numeroTelephone: '',
      courriel: '',
      nationalite: '',
      motDePasse: '',
    };
  }
  private nettoyerMessages(): void {
    this.messageErreur = '';
    this.messageSucces = '';
  }
  private validerClient(c: ClientModele): string | null {
    if (!c.nom?.trim() || !c.prenom?.trim()) return 'Nom et prénom sont obligatoires.';
    if (!c.dateNaissance) return 'Date de naissance obligatoire.';
    if (!c.sexe) return 'Sexe obligatoire.';
    if (!c.motDePasse?.trim()) return 'Mot de passe obligatoire.';
    if (c.motDePasse.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    
    if (c.numeroTelephone?.trim()) {
      const telephoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!telephoneRegex.test(c.numeroTelephone.trim())) {
        return 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets, parenthèses et le signe +.';
      }
      if (c.numeroTelephone.trim().length < 8) {
        return 'Le numéro de téléphone doit contenir au moins 8 chiffres.';
      }
    }
    
    return null;
  }
  private normaliserClient(c: ClientModele): ClientModele {
    return {
      ...c,
      nom: c.nom.trim(),
      prenom: c.prenom.trim(),
      adresse: c.adresse?.trim() ?? '',
      numeroTelephone: c.numeroTelephone?.trim() ?? '',
      courriel: c.courriel?.trim() ?? '',
      nationalite: c.nationalite?.trim() ?? '',
      motDePasse: c.motDePasse?.trim() ?? '',
    };
  }
  charger(): void {
    this.nettoyerMessages();
    this.chargement = true;

    this.serviceClients.lister().subscribe({
      next: (c) => {
        this.listeClients = c ?? [];
        this.chargement = false;
      },
      error: (err) => {
        this.messageErreur = typeof err === 'string' ? err : 'Erreur chargement clients';
        this.chargement = false;
      },
    });
  }
  creer(): void {
    this.erreurCreation = '';
    this.nettoyerMessages();

    const erreur = this.validerClient(this.nouveauClient);
    if (erreur) {
      this.erreurCreation = erreur;
      return;
    }

    this.creationEnCours = true;

    const payload = this.normaliserClient(this.nouveauClient);

    this.serviceClients.creer(payload).subscribe({
      next: () => {
        this.creationEnCours = false;
        this.messageSucces = 'Client créé.';
        this.nouveauClient = this.clientVide();
        this.charger();

        const el = document.getElementById('modalClient');
        if (el) bootstrap?.Modal.getOrCreateInstance(el)?.hide();
      },
      error: (err) => {
        this.creationEnCours = false;
        this.erreurCreation =
          err?.error?.message ||
          err?.message ||
          (typeof err === 'string' ? err : 'Création impossible');
      },
    });
  }

  ouvrirEdition(c: ClientModele): void {
    this.erreurEdition = '';
    this.nettoyerMessages();
    this.clientEdition = { ...c };
    const el = document.getElementById('modalClientModifier');
    if (el) bootstrap?.Modal.getOrCreateInstance(el)?.show();
  }

  modifier(): void {
    this.erreurEdition = '';
    this.nettoyerMessages();
    if (!this.clientEdition?.id) {
      this.erreurEdition = "Client invalide (id manquant).";
      return;
    }
    const erreur = this.validerClient(this.clientEdition);
    if (erreur) {
      this.erreurEdition = erreur;
      return;
    }
    
    this.editionEnCours = true;

    const payload = this.normaliserClient(this.clientEdition);

    this.serviceClients.modifier(this.clientEdition.id, payload).subscribe({
      next: () => {
        this.editionEnCours = false;
        this.messageSucces = 'Client modifié.';
        this.clientEdition = null;
        this.charger();

        const el = document.getElementById('modalClientModifier');
        if (el) bootstrap?.Modal.getOrCreateInstance(el)?.hide();
      },
      error: (err) => {
        this.editionEnCours = false;
        this.erreurEdition =
          err?.error?.message ||
          err?.message ||
          (typeof err === 'string' ? err : 'Modification impossible');
      },
    });
  }

  supprimer(id?: number): void {
  this.nettoyerMessages();
  if (!id) return;

  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous supprimer ce client ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {

      this.suppressionEnCoursId = id;

      this.serviceClients.supprimer(id).subscribe({
        next: () => {
          this.suppressionEnCoursId = null;

          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'Client supprimé avec succès.',
            timer: 1500,
            showConfirmButton: false
          });

          this.charger();
        },
        error: (err) => {
          this.suppressionEnCoursId = null;

          let messageErreur = 'Suppression impossible';
          
          if (err?.error?.message) {
            messageErreur = err.error.message;
          } else if (err?.error?.statut === 409) {
            messageErreur = 'Ce client possède des comptes bancaires. Veuillez d\'abord fermer tous ses comptes.';
          } else if (typeof err === 'string') {
            messageErreur = err;
          }

          Swal.fire({
            icon: 'error',
            title: 'Erreur de suppression',
            text: messageErreur,
            confirmButtonText: 'Compris'
          });
        },
      });

    }
  });
}


  ouvrirModalAjoutClient(): void {
    this.nouveauClient = this.clientVide();
    this.erreurCreation = '';
    setTimeout(() => {
      const el = document.getElementById('modalClient');
      if (el) {
        bootstrap?.Modal.getOrCreateInstance(el).show();
      }
    });
    this.router.navigate([], {
      queryParams: { ajout: null },
      queryParamsHandling: 'merge'
    });
  }

}
