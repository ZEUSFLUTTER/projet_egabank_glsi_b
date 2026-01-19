import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  fromDate: string = '';
  toDate: string = '';
  compteId: number | null = null;
  transactions: any[] = [];

  constructor(private apiService: ApiService) {}

  loadTransactions() {
    if (!this.compteId || !this.fromDate || !this.toDate) return;
    this.apiService.getTransactions(this.compteId, this.fromDate, this.toDate).subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error(err)
    });
  }

  printStatement() {
    // Implement print logic (e.g., window.print() or generate PDF)
    window.print();
  }
}