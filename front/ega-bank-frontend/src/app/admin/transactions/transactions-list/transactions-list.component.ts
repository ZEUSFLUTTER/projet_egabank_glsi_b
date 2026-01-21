import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { Operation } from 'src/app/core/models/operation.model';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  transactions: Operation[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (data: Operation[]) => {
        this.transactions = data;
      },
      (error) => {
        console.error('Error loading transactions', error);
      }
    );
  }
}