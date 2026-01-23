import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { Transaction, TransactionFilter } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  accounts: Account[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  filter: TransactionFilter = {
    numeroCompte: '',
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filter.dateDebut = this.formatDate(firstDay);
    this.filter.dateFin = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes', error);
      }
    });
  }

  searchTransactions(): void {
    if (!this.filter.numeroCompte) {
      this.errorMessage = 'Veuillez sélectionner un compte';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const filterWithTime = {
      numeroCompte: this.filter.numeroCompte,
      dateDebut: this.filter.dateDebut + 'T00:00:00',
      dateFin: this.filter.dateFin + 'T23:59:59'
    };

    this.transactionService.getTransactionsByPeriod(filterWithTime).subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions', error);
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
        this.isLoading = false;
      }
    });
  }

  generatePDF(): void {
    if (!this.filter.numeroCompte) {
      alert('Veuillez sélectionner un compte');
      return;
    }

    const filterWithTime = {
      numeroCompte: this.filter.numeroCompte,
      dateDebut: this.filter.dateDebut + 'T00:00:00',
      dateFin: this.filter.dateFin + 'T23:59:59'
    };

    this.transactionService.generateReleve(filterWithTime).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${this.filter.numeroCompte}_${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors de la génération du PDF', error);
        alert('Erreur lors de la génération du relevé PDF');
      }
    });
  }

  getTransactionIcon(type: string): string {
    switch(type) {
      case 'DEPOT': return 'fa-arrow-down text-success';
      case 'RETRAIT': return 'fa-arrow-up text-warning';
      case 'VIREMENT': return 'fa-exchange-alt text-primary';
      default: return 'fa-question';
    }
  }

  getTransactionBadgeClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'bg-success';
      case 'RETRAIT': return 'bg-warning';
      case 'VIREMENT': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  resetFilters(): void {
    this.filter.numeroCompte = '';
    this.transactions = [];
    this.setDefaultDates();
  }

  getTotalByType(type: string): number {
    return this.transactions
      .filter(t => t.typeTransaction === type)
      .reduce((sum, t) => sum + t.montant, 0);
  }
}
