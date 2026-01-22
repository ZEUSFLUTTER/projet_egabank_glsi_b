import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/client.model';
import { Compte } from '../../models/compte.model';
import { Transaction, TypeTransaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  clients: Client[] = [];
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  loading = true;
  TypeTransaction = TypeTransaction;

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    let loadCount = 0;
    const totalRequests = 3;

    // Load clients
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data.slice(0, 5);
        this.checkLoadingComplete(++loadCount, totalRequests);
      },
      error: () => {
        this.clients = [];
        this.checkLoadingComplete(++loadCount, totalRequests);
      }
    });

    // Load comptes
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data.slice(0, 5);
        this.checkLoadingComplete(++loadCount, totalRequests);
      },
      error: () => {
        this.comptes = [];
        this.checkLoadingComplete(++loadCount, totalRequests);
      }
    });

    // Load transactions
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data.slice(0, 5).sort((a, b) => {
          const dateA = a.dateTransaction ? new Date(a.dateTransaction).getTime() : 0;
          const dateB = b.dateTransaction ? new Date(b.dateTransaction).getTime() : 0;
          return dateB - dateA;
        });
        this.checkLoadingComplete(++loadCount, totalRequests);
      },
      error: () => {
        this.transactions = [];
        this.checkLoadingComplete(++loadCount, totalRequests);
      }
    });
  }

  private checkLoadingComplete(current: number, total: number): void {
    if (current === total) {
      this.loading = false;
    }
  }
}

