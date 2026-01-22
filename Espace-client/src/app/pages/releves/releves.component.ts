import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceReleves } from '../../services/service-releves.service';
import { ServiceComptes } from '../../services/service-comptes.service';
import { CompteModele } from '../../modeles/compte-modele';
import { ReleveDTO } from '../../modeles/transaction-modele';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-releves',
  imports: [CommonModule, FormsModule],
  templateUrl: './releves.component.html',
  styleUrls: ['./releves.component.css']
})
export class RelevesComponent implements OnInit {
  comptes: CompteModele[] = [];
  chargement = true;
  generationEnCours = false;
  
  donneesReleve: ReleveDTO = {
    compteId: 0,
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private serviceReleves: ServiceReleves,
    private serviceComptes: ServiceComptes
  ) {
    // Définir les dates par défaut (dernier mois)
    const aujourd = new Date();
    const debutMois = new Date(aujourd.getFullYear(), aujourd.getMonth(), 1);
    
    this.donneesReleve.dateFin = aujourd.toISOString().split('T')[0];
    this.donneesReleve.dateDebut = debutMois.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.chargerComptes();
  }

  chargerComptes(): void {
    this.chargement = true;
    this.serviceComptes.listerMesComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        if (comptes.length > 0) {
          this.donneesReleve.compteId = comptes[0].id!;
        }
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des comptes:', erreur);
        this.chargement = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger vos comptes'
        });
      }
    });
  }

  genererReleve(): void {
    if (!this.validerFormulaire()) return;

    this.generationEnCours = true;
    
    const compte = this.comptes.find(c => c.id === this.donneesReleve.compteId);
    const nomFichier = `releve_${compte?.numeroCompte}_${this.donneesReleve.dateDebut}_${this.donneesReleve.dateFin}.pdf`;

    this.serviceReleves.telechargerReleve(this.donneesReleve, nomFichier);
    
    // Simuler un délai pour l'UX
    setTimeout(() => {
      this.generationEnCours = false;
      Swal.fire({
        icon: 'success',
        title: 'Relevé généré',
        text: 'Votre relevé a été téléchargé avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    }, 2000);
  }

  private validerFormulaire(): boolean {
    if (!this.donneesReleve.compteId) {
      Swal.fire({
        icon: 'warning',
        title: 'Compte requis',
        text: 'Veuillez sélectionner un compte'
      });
      return false;
    }

    if (!this.donneesReleve.dateDebut) {
      Swal.fire({
        icon: 'warning',
        title: 'Date de début requise',
        text: 'Veuillez sélectionner une date de début'
      });
      return false;
    }

    if (!this.donneesReleve.dateFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Date de fin requise',
        text: 'Veuillez sélectionner une date de fin'
      });
      return false;
    }

    const dateDebut = new Date(this.donneesReleve.dateDebut);
    const dateFin = new Date(this.donneesReleve.dateFin);

    if (dateDebut > dateFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Dates invalides',
        text: 'La date de début doit être antérieure à la date de fin'
      });
      return false;
    }

    const aujourd = new Date();
    if (dateFin > aujourd) {
      Swal.fire({
        icon: 'warning',
        title: 'Date future',
        text: 'La date de fin ne peut pas être dans le futur'
      });
      return false;
    }

    // Vérifier que la période ne dépasse pas 1 an
    const unAn = 365 * 24 * 60 * 60 * 1000; // 1 an en millisecondes
    if (dateFin.getTime() - dateDebut.getTime() > unAn) {
      Swal.fire({
        icon: 'warning',
        title: 'Période trop longue',
        text: 'La période ne peut pas dépasser 1 an'
      });
      return false;
    }

    return true;
  }

  definirPeriodePredefinie(periode: string): void {
    const aujourd = new Date();
    let dateDebut: Date;

    switch (periode) {
      case 'semaine':
        dateDebut = new Date(aujourd.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mois':
        dateDebut = new Date(aujourd.getFullYear(), aujourd.getMonth(), 1);
        break;
      case 'trimestre':
        const moisTrimestre = Math.floor(aujourd.getMonth() / 3) * 3;
        dateDebut = new Date(aujourd.getFullYear(), moisTrimestre, 1);
        break;
      case 'annee':
        dateDebut = new Date(aujourd.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    this.donneesReleve.dateDebut = dateDebut.toISOString().split('T')[0];
    this.donneesReleve.dateFin = aujourd.toISOString().split('T')[0];
  }

  obtenirTypeCompteLibelle(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  obtenirCompteSelectionne(): CompteModele | undefined {
    return this.comptes.find(c => c.id === this.donneesReleve.compteId);
  }
}