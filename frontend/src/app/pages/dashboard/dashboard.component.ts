import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { CompteService, Compte } from '../../services/compte.service';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { DepotComponent } from '../depot/depot.component';
import { RetraitComponent } from '../retrait/retrait.component';
import { VirementComponent } from '../virement/virement.component';
import { CompteDetailsComponent } from '../compte-details/compte-details.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTableModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  clientId: number | null = null;
  clientName = '';
  loading = true;
  transactionsLoading = false;

  displayedColumns: string[] = ['date', 'type', 'montant', 'description'];

  constructor(
    private compteService: CompteService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si c'est un client (pas admin)
    if (this.authService.isAdmin()) {
      this.router.navigate(['/comptes']);
      return;
    }

    this.clientId = this.authService.getClientId();
    const username = this.authService.getUsername();
    
    if (!this.clientId || !username) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.clientName = username;
    this.loadComptes();
  }

  ngAfterViewInit(): void {
    // logique après affichage de la vue
    // (charts, canvas, DOM, etc.)
  }

  loadComptes(): void {
    if (!this.clientId) return;

    this.loading = true;
    this.compteService.getComptesByClient(this.clientId).subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading = false;
        // Charger les transactions après le chargement des comptes
        if (this.comptes.length > 0) {
          this.loadRecentTransactions();
        }
      },
      error: (err) => {
        console.error('Erreur chargement comptes', err);
        this.loading = false;
      }
    });
  }

  loadRecentTransactions(): void {
    if (!this.clientId || this.comptes.length === 0) {
      this.transactionsLoading = false;
      return;
    }

    this.transactionsLoading = true;
    const allClientTransactions: Transaction[] = [];
    const compteIds = this.comptes.map(c => c.id!);
    let loaded = 0;

    if (compteIds.length === 0) {
      this.transactionsLoading = false;
      return;
    }

    compteIds.forEach(compteId => {
      this.transactionService.getTransactionsByCompteOnly(compteId).subscribe({
        next: (transactions) => {
          allClientTransactions.push(...transactions);
          loaded++;
          
          if (loaded === compteIds.length) {
            // Trier par date et prendre les 10 dernières
            this.transactions = allClientTransactions
              .sort((a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime())
              .slice(0, 10);
            this.transactionsLoading = false;
          }
        },
        error: () => {
          loaded++;
          if (loaded === compteIds.length) {
            this.transactionsLoading = false;
          }
        }
      });
    });
  }

  getTotalBalance(): number {
    return this.comptes.reduce((total, compte) => total + compte.solde, 0);
  }

  getBalanceByType(type: string): number {
    return this.comptes
      .filter(compte => compte.typeCompte.toUpperCase() === type)
      .reduce((total, compte) => total + compte.solde, 0);
  }

  getCountByType(type: string): number {
    return this.comptes.filter(compte => compte.typeCompte.toUpperCase() === type).length;
  }

  getCompteIcon(typeCompte: string): string {
    switch (typeCompte?.toUpperCase()) {
      case 'COURANT': return 'account_balance';
      case 'EPARGNE': return 'savings';
      default: return 'account_balance_wallet';
    }
  }

  getCompteTypeLabel(typeCompte: string): string {
    switch (typeCompte?.toUpperCase()) {
      case 'COURANT': return 'Compte Courant';
      case 'EPARGNE': return 'Compte Épargne';
      default: return typeCompte;
    }
  }

  openDepositDialog(compte: Compte): void {
    const dialogRef = this.dialog.open(DepotComponent, {
      width: '400px',
      data: { compteId: compte.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
        this.loadRecentTransactions();
      }
    });
  }

  openRetraitDialog(compte: Compte): void {
    const dialogRef = this.dialog.open(RetraitComponent, {
      width: '400px',
      data: { compteId: compte.id, solde: compte.solde }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
        this.loadRecentTransactions();
      }
    });
  }

  openTransferDialog(compte: Compte): void {
    if (!this.clientId) return;

    const dialogRef = this.dialog.open(VirementComponent, {
      width: '500px',
      data: { compteId: compte.id, solde: compte.solde, clientId: this.clientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
        this.loadRecentTransactions();
      }
    });
  }

  viewAccountDetails(compte: Compte): void {
    this.dialog.open(CompteDetailsComponent, {
      width: '800px',
      data: { compte: compte }
    });
  }

  getTransactionDescription(transaction: Transaction): string {
    if (transaction.typeTransaction === 'VIREMENT') {
      const compte = this.comptes.find(c => c.id === transaction.compteSource?.id);
      if (compte) {
        return `Vers ${transaction.compteDestination?.numeroCompte || 'N/A'}`;
      } else {
        return `Depuis ${transaction.compteSource?.numeroCompte || 'N/A'}`;
      }
    }
    return transaction.typeTransaction;
  }

  getTransactionAmount(transaction: Transaction): number {
    const compteSourceId = transaction.compteSource?.id;
    
    // Pour RETRAIT et VIREMENT sortant, le montant est négatif
    if (transaction.typeTransaction === 'RETRAIT' || 
        (transaction.typeTransaction === 'VIREMENT' && 
         this.comptes.some(c => c.id === compteSourceId))) {
      return -transaction.montant;
    }
    // Pour DEPOT et VIREMENT entrant, le montant est positif
    return transaction.montant;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
