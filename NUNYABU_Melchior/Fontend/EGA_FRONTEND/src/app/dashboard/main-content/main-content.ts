import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompteService } from '../../compte/services/compte-service';
import { TransactionService } from '../../transaction/services/transaction-service';
import { AdminService } from '../../core/services/admin.service';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.html',
  styleUrl: './main-content.css',
})
export class MainContent implements OnInit {
  @Input() isAdmin: boolean = false;
  
  // Données client
  comptes: any[] = [];
  soldeTotal: number = 0;
  nombreComptes: number = 0;
  transactions: any[] = [];
  depotsMois: number = 0;
  retraitsMois: number = 0;

  // Données admin
  totalClients: number = 0;
  totalComptes: number = 0;
  totalTransactions: number = 0;
  clients: any[] = [];
  allTransactions: any[] = [];

  loading: boolean = true;

  constructor(
    private compteService: CompteService,
    private transactionService: TransactionService,
    private adminService: AdminService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isAdmin) {
      this.loadAdminData();
    } else {
      this.loadClientData();
    }
  }

  loadClientData() {
    this.loading = true;
    this.compteService.getComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.nombreComptes = comptes.length;
        this.soldeTotal = comptes.reduce((sum, compte) => sum + (compte.solde || 0), 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement comptes:', err);
        this.loading = false;
      }
    });

    this.transactionService.getHistorique().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        this.depotsMois = transactions
          .filter(t => {
            const date = new Date(t.dateTransaction);
            return t.type === 'DEPOT' && 
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + (t.montant || 0), 0);

        this.retraitsMois = transactions
          .filter(t => {
            const date = new Date(t.dateTransaction);
            return t.type === 'RETRAIT' && 
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + (t.montant || 0), 0);
      },
      error: (err) => console.error('Erreur chargement transactions:', err)
    });
  }

  loadAdminData() {
    this.loading = true;
    this.adminService.getStatistiques().subscribe({
      next: (stats) => {
        this.totalClients = stats.nombreClients || 0;
        this.totalComptes = stats.nombreComptes || 0;
        this.totalTransactions = stats.nombreTransactions || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement statistiques:', err);
        this.loading = false;
      }
    });

    this.adminService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (err) => console.error('Erreur chargement clients:', err)
    });

    this.adminService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.allTransactions = transactions.slice(0, 10); // Dernières 10
      },
      error: (err) => console.error('Erreur chargement transactions:', err)
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
