import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CompteService, Compte } from '../../services/compte.service';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compte-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './compte-details.component.html',
  styleUrls: ['./compte-details.component.css']
})
export class CompteDetailsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'type', 'montant', 'description'];
  transactions: Transaction[] = [];
  loading = false;
  dateDebut: Date | null = null;
  dateFin: Date | null = null;
  compte: Compte;

  constructor(
    public dialogRef: MatDialogRef<CompteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compte: Compte },
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {
    this.compte = data.compte;
    // Par défaut, afficher les transactions du dernier mois
    const now = new Date();
    this.dateFin = now;
    this.dateDebut = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    if (!this.dateDebut || !this.dateFin) {
      // Charger toutes les transactions
      this.transactionService.getTransactionsByCompteOnly(this.compte.id!).subscribe({
        next: (transactions) => {
          this.transactions = transactions.sort((a, b) => 
            new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
          );
        },
        error: (err) => {
          console.error('Erreur chargement transactions', err);
        }
      });
      return;
    }

    const debut = this.dateDebut.toISOString();
    const fin = this.dateFin.toISOString();

    this.loading = true;
    this.transactionService.getTransactionsByCompte(this.compte.id!, debut, fin).subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort((a, b) => 
          new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement transactions', err);
        this.loading = false;
      }
    });
  }

  onFilter(): void {
    this.loadTransactions();
  }

  imprimerReleve(): void {
    if (!this.dateDebut || !this.dateFin) {
      alert('Veuillez sélectionner une période');
      return;
    }

    const debut = this.dateDebut.toISOString();
    const fin = this.dateFin.toISOString();

    window.open(
      `http://localhost:8080/api/comptes/${this.compte.id}/releve?dateDebut=${debut}&dateFin=${fin}`,
      '_blank'
    );
  }

  getTransactionDescription(transaction: Transaction): string {
    if (transaction.typeTransaction === 'VIREMENT') {
      if (transaction.compteSource?.id === this.compte.id) {
        return `Vers ${transaction.compteDestination?.numeroCompte || 'N/A'}`;
      } else {
        return `Depuis ${transaction.compteSource?.numeroCompte || 'N/A'}`;
      }
    }
    return transaction.typeTransaction;
  }

  getTransactionAmount(transaction: Transaction): number {
    if (transaction.typeTransaction === 'RETRAIT' || 
        (transaction.typeTransaction === 'VIREMENT' && transaction.compteSource?.id === this.compte.id)) {
      return -transaction.montant;
    }
    return transaction.montant;
  }
}
