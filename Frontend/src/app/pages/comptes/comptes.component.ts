import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompteModele } from '../../modeles/compte-modele';
import { ServiceComptes } from '../../services/service-comptes.service';
import { ClientModele } from '../../modeles/client-modele';
import { ServiceClients } from '../../services/service-clients.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const bootstrap: any;

type TypeCompteFormulaire = 'COURANT' | 'EPARGNE';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comptes.component.html',
  styleUrls: ['./comptes.component.css'],
})
export class ComptesComponent implements OnInit {
  chargementClients = false;
  chargementListe = false;

  creationEnCours = false;
  erreurCreation = '';

  consultationEnCours = false;

  messageErreur = '';
  messageSucces = '';

  listeClients: ClientModele[] = [];
  listeComptes: CompteModele[] = [];

  idClientSelectionne: number | null = null;
  typeCompte: TypeCompteFormulaire = 'COURANT';
  decouvertAutorise = 0;
  tauxInteret = 0;

  ibanRecherche = '';
  compteTrouve: CompteModele | null = null;

  constructor(
    private serviceClients: ServiceClients,
    private serviceComptes: ServiceComptes,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerClients();
    this.chargerComptes();
    this.route.queryParams.subscribe(params => {
      if (params['ajout'] === 'true') {
        this.ouvrirModalAjoutCompte();
      }
    });
  }

  private reussite(message: string): void {
    this.messageSucces = message;
    this.messageErreur = '';
  }

  private echec(message: string): void {
    this.messageErreur = message;
    this.messageSucces = '';
  }

  chargerClients(): void {
    this.chargementClients = true;

    this.serviceClients.lister().subscribe({
      next: (c) => {
        this.listeClients = c ?? [];
        this.chargementClients = false;

        if (this.idClientSelectionne == null && this.listeClients.length > 0) {
          this.idClientSelectionne = this.listeClients[0].id ?? null;
        }
      },
      error: () => {
        this.echec('Erreur lors du chargement des clients.');
        this.chargementClients = false;
      },
    });
  }

 chargerComptes(): void {
  this.chargementListe = true;
  this.serviceComptes.lister().subscribe({
    next: (c) => { this.listeComptes = c ?? []; this.chargementListe = false; },
    error: () => { this.listeComptes = []; this.chargementListe = false; this.echec('Erreur chargement comptes.'); }
  });
}


  reinitialiserFormulaire(): void {
    this.typeCompte = 'COURANT';
    this.decouvertAutorise = 0;
    this.tauxInteret = 0;
    this.erreurCreation = '';
  }

  creerCompte(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.erreurCreation = '';

    if (!this.idClientSelectionne) {
      this.erreurCreation = 'Veuillez sélectionner un client.';
      return;
    }

    if (this.typeCompte === 'COURANT' && this.decouvertAutorise < 0) {
      this.erreurCreation = 'Le découvert autorisé doit être ≥ 0.';
      return;
    }

    if (this.typeCompte === 'EPARGNE' && this.tauxInteret < 0) {
      this.erreurCreation = 'Le taux d’intérêt doit être ≥ 0.';
      return;
    }

    this.creationEnCours = true;

    const obs =
      this.typeCompte === 'COURANT'
        ? this.serviceComptes.creerCourant(this.idClientSelectionne, this.decouvertAutorise)
        : this.serviceComptes.creerEpargne(this.idClientSelectionne, this.tauxInteret);

    obs.subscribe({
      next: (c) => {
        this.creationEnCours = false;
        this.reussite(`Compte ${this.typeCompte.toLowerCase()} créé : ${c.numeroCompte}`);
        this.reinitialiserFormulaire();
        this.chargerComptes();

        const el = document.getElementById('modalCompte');
        if (el) {
          const modal = bootstrap?.Modal.getOrCreateInstance(el);
          modal?.hide();
        }
      },
      error: (e) => {
        this.creationEnCours = false;
        this.erreurCreation = e?.error?.message || 'Création du compte impossible.';
      },
    });
  }

  consulterCompte(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.compteTrouve = null;

    const iban = this.ibanRecherche.trim();
    if (!iban) {
      this.echec('Veuillez saisir un IBAN.');
      return;
    }

    this.consultationEnCours = true;

    this.serviceComptes.consulter(iban).subscribe({
      next: (c) => {
        this.consultationEnCours = false;
        this.compteTrouve = c;
        this.reussite('Compte trouvé.');
      },
      error: () => {
        this.consultationEnCours = false;
        this.compteTrouve = null;
        this.echec('Compte introuvable.');
      },
    });
  }
  ouvrirModalAjoutCompte(): void {
    this.reinitialiserFormulaire();
    this.erreurCreation = '';

    setTimeout(() => {
      const el = document.getElementById('modalCompte');
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
