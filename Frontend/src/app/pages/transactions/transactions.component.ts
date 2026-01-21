import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionModele } from '../../modeles/transaction-modele';
import { ServiceTransactions } from '../../services/service-transactions.service';
import { CompteModele } from '../../modeles/compte-modele';
import { ServiceComptes } from '../../services/service-comptes.service';
import { ServiceClients } from '../../services/service-clients.service';
import { ClientModele } from '../../modeles/client-modele';
import { ActivatedRoute, Router } from '@angular/router';

declare const bootstrap: any;

type TypeOperation = 'DEPOT' | 'RETRAIT' | 'VIREMENT';
type TypeCompteFiltre = 'TOUS' | 'COURANT' | 'EPARGNE';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  listeClients: ClientModele[] = [];
  comptesDuClient: CompteModele[] = [];
  listeTransactions: TransactionModele[] = [];
  listeComptes: CompteModele[] = [];
  chargementListe = false;

  messageErreur = '';
  messageSucces = '';
  creationEnCours = false;
  erreurModal = '';

  idClientSelectionne: number | null = null;
  typeCompteFiltre: TypeCompteFiltre = 'TOUS';
  numeroCompteSelectionne = '';

  typeOperation: TypeOperation = 'DEPOT';
  montant = 0;
  libelle = 'Operation';
  numeroCompteDestination = '';
  ibanRecherche = '';
  dateDebut = '2026-01-01';
  dateFin = '2026-12-31';

  constructor(
    private serviceClients: ServiceClients,
    private serviceComptes: ServiceComptes,
    private serviceTransactions: ServiceTransactions,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerComptes();
    this.chargerClients();
    this.chargerToutesTransactions();
    this.route.queryParams.subscribe(params => {
      if (params['ajout'] === 'true') {
        this.ouvrirModalAjoutTransaction();
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
    this.serviceClients.lister().subscribe({
      next: (c) => {
        this.listeClients = c ?? [];

        if (this.idClientSelectionne == null && this.listeClients.length > 0) {
          this.idClientSelectionne = this.listeClients[0].id ?? null;
          this.chargerComptesClient();
        }
      },
      error: () => this.echec('Erreur lors du chargement des clients.'),
    });
  }

  chargerComptes(): void {
  this.serviceComptes.lister().subscribe({
    next: (c) => this.listeComptes = c ?? [],
    error: () => this.listeComptes = []
  });
}


  chargerComptesClient(): void {
  this.comptesDuClient = [];
  this.numeroCompteSelectionne = '';

  if (!this.idClientSelectionne) return;

  this.comptesDuClient = this.listeComptes.filter(
    c => c.proprietaire?.id === this.idClientSelectionne
  );

  this.numeroCompteSelectionne = this.comptesFiltres[0]?.numeroCompte || '';
}


  get comptesFiltres(): CompteModele[] {
    if (this.typeCompteFiltre === 'TOUS') return this.comptesDuClient;
    return this.comptesDuClient.filter((c) => c.typeCompte === this.typeCompteFiltre);
  }

  appliquerFiltreTypeCompte(): void {
    this.numeroCompteSelectionne = this.comptesFiltres[0]?.numeroCompte || '';
  }

  reinitialiserFormulaireTransaction(): void {
    this.erreurModal = '';
    this.typeOperation = 'DEPOT';
    this.montant = 0;
    this.libelle = 'Operation';
    this.numeroCompteDestination = '';
  }

  creerTransaction(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.erreurModal = '';

    const numeroCompte = this.numeroCompteSelectionne.trim();
    if (!numeroCompte) {
      this.erreurModal = 'Veuillez sélectionner un compte.';
      return;
    }

    if (this.montant <= 0) {
      this.erreurModal = 'Le montant doit être supérieur à 0.';
      return;
    }

    const libelle = (this.libelle || 'Operation').trim();

    if (this.typeOperation === 'VIREMENT') {
      const dest = this.numeroCompteDestination.trim();
      if (!dest) {
        this.erreurModal = 'Veuillez saisir le compte destination.';
        return;
      }
      if (dest === numeroCompte) {
        this.erreurModal = 'Le compte destination doit être différent du compte source.';
        return;
      }

      this.creationEnCours = true;
      this.serviceComptes.virement(numeroCompte, dest, this.montant, libelle).subscribe({
        next: () => {
          this.creationEnCours = false;
          this.reussite('Virement effectué.');
          this.reinitialiserFormulaireTransaction();
          this.chargerTransactions(numeroCompte);

          const el = document.getElementById('modalTransaction');
          if (el) bootstrap?.Modal.getOrCreateInstance(el)?.hide();
        },
        error: (e) => {
          this.creationEnCours = false;
          this.erreurModal = e?.error?.message || 'Virement impossible.';
        },
      });
      return;
    }
    this.creationEnCours = true;

    const obs =
      this.typeOperation === 'DEPOT'
        ? this.serviceComptes.depot(numeroCompte, this.montant, libelle)
        : this.serviceComptes.retrait(numeroCompte, this.montant, libelle);

    obs.subscribe({
      next: () => {
        this.creationEnCours = false;
        this.reussite(this.typeOperation === 'DEPOT' ? 'Dépôt effectué.' : 'Retrait effectué.');
        this.reinitialiserFormulaireTransaction();
        this.chargerTransactions(numeroCompte);

        const el = document.getElementById('modalTransaction');
        if (el) bootstrap?.Modal.getOrCreateInstance(el)?.hide();
      },
      error: (e) => {
        this.creationEnCours = false;
        this.erreurModal = e?.error?.message || 'Opération impossible.';
      },
    });
  }

  chargerToutesTransactions(): void {
  this.chargementListe = true;

  this.serviceTransactions.lister().subscribe({
    next: (t) => {
      this.listeTransactions = t ?? [];
      this.chargementListe = false;
    },
    error: () => {
      this.listeTransactions = [];
      this.chargementListe = false;
    }
  });
}


  chargerTransactions(iban: string): void {
    this.ibanRecherche = iban;
    this.chargementListe = true;

    this.serviceTransactions.listerParPeriode(iban, this.dateDebut, this.dateFin).subscribe({
      next: (t) => {
        this.listeTransactions = t ?? [];
        this.chargementListe = false;
      },
      error: () => {
        this.listeTransactions = [];
        this.chargementListe = false;
      },
    });
  }

  chercherTransactions(): void {
  this.messageErreur = '';
  this.messageSucces = '';

  const iban = this.ibanRecherche.trim();

  if (!iban) {
    this.chargerToutesTransactions(); 
    return;
  }

  if (!this.dateDebut || !this.dateFin) {
    this.echec('Veuillez choisir une date de début et une date de fin.');
    return;
  }

  if (this.dateDebut > this.dateFin) {
    this.echec('La date de début doit être avant la date de fin.');
    return;
  }

  this.chargerTransactions(iban);
}


  ouvrirModalAjoutTransaction(): void {
    this.reinitialiserFormulaireTransaction();
    this.erreurModal = '';

    setTimeout(() => {
      const el = document.getElementById('modalTransaction');
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
