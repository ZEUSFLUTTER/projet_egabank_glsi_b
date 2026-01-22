import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceTransactions } from '../../services/service-transactions.service';
import { ServiceComptes } from '../../services/service-comptes.service';
import { TransactionModele } from '../../modeles/transaction-modele';
import { CompteModele } from '../../modeles/compte-modele';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: TransactionModele[] = [];
  comptes: CompteModele[] = [];
  chargement = true;
  
  compteSelectionne: number | null = null;
  dateDebut = '';
  dateFin = '';
  typeTransactionFiltre = '';

  constructor(
    private serviceTransactions: ServiceTransactions,
    private serviceComptes: ServiceComptes
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  private chargerDonnees(): void {
    this.chargement = true;
    
    this.serviceComptes.listerMesComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des comptes:', erreur);
      }
    });

    this.chargerTransactions();
  }

  chargerTransactions(): void {
    this.chargement = true;
    
    if (this.compteSelectionne && this.dateDebut && this.dateFin) {
      this.serviceTransactions.listerTransactionsPeriode(
        this.compteSelectionne, 
        this.dateDebut, 
        this.dateFin
      ).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.chargement = false;
        },
        error: (erreur) => {
          console.error('Erreur lors du chargement des transactions:', erreur);
          this.chargement = false;
        }
      });
    } else if (this.compteSelectionne) {
      this.serviceTransactions.listerTransactionsCompte(this.compteSelectionne).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.chargement = false;
        },
        error: (erreur) => {
          console.error('Erreur lors du chargement des transactions:', erreur);
          this.chargement = false;
        }
      });
    } else {
      this.serviceTransactions.listerMesTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.chargement = false;
        },
        error: (erreur) => {
          console.error('Erreur lors du chargement des transactions:', erreur);
          this.chargement = false;
        }
      });
    }
  }

  appliquerFiltres(): void {
    this.chargerTransactions();
  }

  appliquerFiltreType(): void {
  }

  reinitialiserFiltres(): void {
    this.compteSelectionne = null;
    this.dateDebut = '';
    this.dateFin = '';
    this.typeTransactionFiltre = '';
    this.chargerTransactions();
  }

  get transactionsFiltrees(): TransactionModele[] {
    if (!this.transactions) {
      return [];
    }
    
    if (!this.typeTransactionFiltre || this.typeTransactionFiltre === '') {
      return this.transactions;
    }
    
    return this.transactions.filter(t => 
      t.typeTransaction && t.typeTransaction === this.typeTransactionFiltre
    );
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

  obtenirBadgeTransaction(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'bg-success';
      case 'RETRAIT':
        return 'bg-danger';
      case 'VIREMENT':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  obtenirSigneMontant(type: string, transaction: TransactionModele): string {
    switch (type) {
      case 'DEPOT':
        return '+';
      case 'RETRAIT':
        return '-';
      case 'VIREMENT':
        return transaction.compteDestination ? '+' : '-';
      default:
        return '';
    }
  }

  obtenirNomCompte(compteId: number): string {
    const compte = this.comptes.find(c => c.id === compteId);
    return compte ? compte.numeroCompte : 'Compte inconnu';
  }
}