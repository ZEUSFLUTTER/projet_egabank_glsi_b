import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { AdminDashboard } from '../../../dashboard/models/admin-dashboard.model';

interface Transaction {
  id: number;
  type: 'Dépôt' | 'Retrait' | 'Transfert' | 'Paiement';
  amount: number;
  date: Date;
  sourceAccount: string;
  sourceName: string;
  destinationAccount: string;
  destinationName: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardPage implements OnInit {
  // ====== Dashboard stats ======
  dashboardData: AdminDashboard = {
    totalClients: 0,
    totalComptes: 0,
    totalTransactions: 0,
    totalSoldes: 0,
  };

  // ====== Transactions (encore mockées volontairement) ======
  transactions: Transaction[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadMockTransactions();
  }

  // ===============================
  // DASHBOARD STATS (BACKEND)
  // ===============================
  private loadDashboardData(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        console.log('DASHBOARD API RAW RESPONSE 👉', data);
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard admin', err);
        console.error('Détails de l\'erreur:', err.status, err.message);
        // Temporairement, afficher des données mockées si l'API échoue
        if (err.status === 403 || err.status === 401) {
          console.warn('Authentification requise. Utilisation de données mockées temporairement.');
          this.dashboardData = {
            totalClients: 1250,
            totalComptes: 3400,
            totalTransactions: 15600,
            totalSoldes: 25000000,
          };
        }
      },
    });
  }

  // ===============================
  // TRANSACTIONS (MOCK TEMPORAIRE)
  // ===============================
  private loadMockTransactions(): void {
    this.transactions = [
      {
        id: 1,
        type: 'Transfert',
        amount: 1500.0,
        date: new Date('2024-01-15T10:30:00'),
        sourceAccount: 'FR76 3000 1000 1234 5678 9012 345',
        sourceName: 'Jean Dupont',
        destinationAccount: 'FR76 3000 2000 9876 5432 1098 765',
        destinationName: 'Marie Martin',
      },
      {
        id: 2,
        type: 'Dépôt',
        amount: 2500.5,
        date: new Date('2024-01-14T14:20:00'),
        sourceAccount: 'N/A',
        sourceName: 'Espèces',
        destinationAccount: 'FR76 3000 1000 1111 2222 3333 444',
        destinationName: 'Sophie Leroy',
      },
      {
        id: 3,
        type: 'Retrait',
        amount: -300.0,
        date: new Date('2024-01-13T16:45:00'),
        sourceAccount: 'FR76 3000 3000 5555 6666 7777 888',
        sourceName: 'Thomas Bernard',
        destinationAccount: 'N/A',
        destinationName: 'Guichet automatique',
      },
      {
        id: 4,
        type: 'Paiement',
        amount: -89.99,
        date: new Date('2024-01-12T09:15:00'),
        sourceAccount: 'FR76 3000 4000 9999 8888 7777 666',
        sourceName: 'Lisa Petit',
        destinationAccount: 'FR76 3000 5000 4444 3333 2222 111',
        destinationName: 'Super Marché',
      },
    ];
  }

  // UI HELPERS (INCHANGÉS)
  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'Dépôt':
        return 'bg-green-500';
      case 'Retrait':
        return 'bg-red-500';
      case 'Transfert':
        return 'bg-blue-500';
      case 'Paiement':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  }

  getAmountClass(type: string): string {
    switch (type) {
      case 'Dépôt':
        return 'text-green-600';
      case 'Transfert':
        return 'text-blue-600';
      case 'Retrait':
      case 'Paiement':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  loadMoreTransactions(): void {
    // Toujours mock pour l’instant
  }
}
