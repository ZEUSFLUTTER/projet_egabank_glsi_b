import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceAuthentification } from '../../services/service-authentification.service';
import { ServiceComptes } from '../../services/service-comptes.service';
import { ServiceTransactions } from '../../services/service-transactions.service';
import { ClientModele } from '../../modeles/client-modele';
import { CompteModele } from '../../modeles/compte-modele';
import { TransactionModele } from '../../modeles/transaction-modele';

@Component({
  selector: 'app-tableau-de-bord',
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {
  client: ClientModele | null = null;
  comptes: CompteModele[] = [];
  dernieresTransactions: TransactionModele[] = [];
  chargement = true;
  soldeTotal = 0;

  constructor(
    private serviceAuth: ServiceAuthentification,
    private serviceComptes: ServiceComptes,
    private serviceTransactions: ServiceTransactions
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  private chargerDonnees(): void {
    this.chargement = true;
    this.client = this.serviceAuth.obtenirClientConnecte();

    this.serviceComptes.listerMesComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.calculerSoldeTotal();
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des comptes:', erreur);
      }
    });

    this.serviceTransactions.listerMesTransactions().subscribe({
      next: (transactions) => {
        this.dernieresTransactions = transactions.slice(0, 5); // 5 dernières transactions
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des transactions:', erreur);
        this.chargement = false;
      }
    });
  }

  private calculerSoldeTotal(): void {
    this.soldeTotal = this.comptes.reduce((total, compte) => total + compte.solde, 0);
  }

  obtenirTypeCompteLibelle(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  obtenirTypeTransactionLibelle(type: string): string {
    switch (type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'VIREMENT': return 'Virement';
      default: return type;
    }
  }

  obtenirClasseTransaction(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'text-success';
      case 'RETRAIT':
        return 'text-danger';
      case 'VIREMENT':
        return 'text-info';
      default:
        return '';
    }
  }
}