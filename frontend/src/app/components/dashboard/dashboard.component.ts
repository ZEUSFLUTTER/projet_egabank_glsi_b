import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/client.model';
import { Compte } from '../../models/compte.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  clients: Client[] = [];
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  loading = true;

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

    this.clientService.getAllClients().subscribe({
      next: data => { this.clients = data.slice(0,5); this.loading = false; },
      error: () => this.loading = false
    });

    this.compteService.getAll().subscribe({ next: data => this.comptes = data.slice(0,5) });
    this.transactionService.getAllTransactions().subscribe({ next: data => this.transactions = data.slice(0,5) });
  }
}
