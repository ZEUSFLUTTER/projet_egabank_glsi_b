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
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  selectedCompteId: number | null = null;
  dateDebut: string = '';
  dateFin: string = '';
  loading = false;
  errorMessage: string = '';
  TypeTransaction = TypeTransaction;

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService,
    private releveService: ReleveService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
    this.loadTransactions();
    
    // Initialiser les dates (mois courant par défaut)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.dateDebut = this.formatDate(firstDay);
    this.dateFin = this.formatDate(now);
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
      }
    });
  }

  loadTransactions(): void {
    this.loading = true;
    
    if (this.selectedCompteId && this.dateDebut && this.dateFin) {
      this.transactionService.getTransactionsByCompteIdAndPeriod(
        this.selectedCompteId,
        this.dateDebut + 'T00:00:00',
        this.dateFin + 'T23:59:59'
      ).subscribe({
        next: (data) => {
          this.transactions = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
          this.loading = false;
        }
      });
    } else {
      this.transactionService.getAllTransactions().subscribe({
        next: (data) => {
          this.transactions = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
          this.loading = false;
        }
      });
    }
  }

  onFilterChange(): void {
    this.loadTransactions();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  downloadReleve(): void {
    if (!this.selectedCompteId || !this.dateDebut || !this.dateFin) {
      alert('Veuillez sélectionner un compte et une période');
      return;
    }

    this.releveService.generateRelevePdf(
      this.selectedCompteId,
      this.dateDebut + 'T00:00:00',
      this.dateFin + 'T23:59:59'
    ).subscribe({
      next: (blob) => {
        const filename = `releve_${this.selectedCompteId}_${this.dateDebut}_${this.dateFin}.pdf`;
        this.releveService.downloadPdf(blob, filename);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la génération du relevé';
      }
    });
  }
}

