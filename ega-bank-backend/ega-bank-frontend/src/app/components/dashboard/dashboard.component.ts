import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClientService } from '../../services/client.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalClients: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  isLoading: boolean = true;

  constructor(
    private clientService: ClientService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les clients
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.totalClients = clients.length;
        console.log('Clients chargés:', this.totalClients);
      },
      error: (error) => {
        console.error('Erreur chargement clients:', error);
      }
    });

    // Charger les comptes
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + (account.solde || 0), 0);
        console.log('Comptes chargés:', this.totalAccounts);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
        this.isLoading = false;
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR');
  }
}
