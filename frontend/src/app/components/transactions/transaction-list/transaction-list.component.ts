import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { ReleveService } from '../../../services/releve.service';
import { Transaction, TypeTransaction } from '../../../models/transaction.model';
import { CompteService } from '../../../services/compte.service';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  transactions: Transaction[] = [];
  comptes: Compte[] = [];

  selectedCompteId: number | null = null;
  dateDebut = '';
  dateFin = '';

  loading = false;
  errorMessage = '';

  TypeTransaction = TypeTransaction;

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService,
    private releveService: ReleveService
  ) {}

  ngOnInit(): void {
    this.loadComptes();

    const now = new Date();
    this.dateDebut = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    this.dateFin = this.formatDate(now);

    this.loadTransactions();
  }

  loadComptes(): void {
    this.compteService.getAll().subscribe({
      next: data => this.comptes = data
    });
  }

  loadTransactions(): void {
    this.loading = true;

    const success = (data: Transaction[]) => {
      this.transactions = data;
      this.loading = false;
    };

    const failure = (err: any) => {
      this.errorMessage = err.error?.message || 'Erreur de chargement';
      this.loading = false;
    };

    if (this.selectedCompteId && this.dateDebut && this.dateFin) {
      this.transactionService
        .getTransactionsByCompteIdAndPeriod(
          this.selectedCompteId,
          `${this.dateDebut}T00:00:00`,
          `${this.dateFin}T23:59:59`
        )
        .subscribe({ next: success, error: failure });
    } else {
      this.transactionService
        .getAllTransactions()
        .subscribe({ next: success, error: failure });
    }
  }

  onFilterChange(): void {
    this.loadTransactions();
  }

  downloadReleve(): void {
    this.generatePdf(false);
  }

  printReleve(): void {
    this.generatePdf(true);
  }

  private generatePdf(print: boolean): void {
    if (!this.selectedCompteId || !this.dateDebut || !this.dateFin) {
      alert('Veuillez sélectionner un compte et une période');
      return;
    }

    this.releveService.generateRelevePdf(
      this.selectedCompteId,
      `${this.dateDebut}T00:00:00`,
      `${this.dateFin}T23:59:59`
    ).subscribe({
      next: blob => {
        if (print) {
          this.releveService.printPdf(blob);
        } else {
          this.releveService.downloadPdf(
            blob,
            `releve_${this.selectedCompteId}_${this.dateDebut}_${this.dateFin}.pdf`
          );
        }
      },
      error: err => this.errorMessage = err.error?.message || 'Erreur génération relevé'
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
