import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CompteService, Compte } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { DepotComponent } from '../depot/depot.component';
import { RetraitComponent } from '../retrait/retrait.component';
import { VirementComponent } from '../virement/virement.component';
import { CompteDetailsComponent } from '../compte-details/compte-details.component';
import { NewAccountComponent } from '../new-account/new-account.component';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './comptes.component.html',
  styleUrls: ['./comptes.component.css']
})
export class ComptesComponent implements OnInit {

  comptes: Compte[] = [];
  clientId: number | null = null;
  clientName = '';
  loading = true;

  constructor(
    private compteService: CompteService,
    private clientService: ClientService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientName = this.authService.getUsername() || '';
    if (this.authService.isClient()) {
      this.clientId = this.authService.getClientId();
    }
    this.loadComptes();
  }

  loadComptes() {
    this.loading = true;

    if (this.authService.isAdmin()) {
      // Admin voit tout
      this.compteService.getAllComptes().subscribe({
        next: (data) => {
          this.comptes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement tous les comptes', err);
          this.loading = false;
        }
      });
    } else if (this.clientId) {
      // Client voit ses comptes
      this.compteService.getComptesByClient(this.clientId).subscribe({
        next: (data) => {
          this.comptes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement comptes client', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  refreshAccounts() {
    this.loadComptes();
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

  getSoldeClass(solde: number): string {
    if (solde > 0) return 'positive';
    if (solde < 0) return 'negative';
    return 'neutral';
  }

  trackByCompte(index: number, compte: any): any {
    return compte.numeroCompte;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Actions
  openNewAccountDialog() {
    const dialogRef = this.dialog.open(NewAccountComponent, {
      width: '400px',
      data: {
        clientId: this.clientId,
        isAdmin: this.authService.isAdmin()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
      }
    });
  }

  navigateToClients() {
    this.router.navigate(['/clients']);
  }

  openDepositDialog(compte?: Compte) {
    if (!compte && this.comptes.length > 0) {
      compte = this.comptes[0];
    }
    if (!compte) {
      alert('Aucun compte disponible');
      return;
    }

    const dialogRef = this.dialog.open(DepotComponent, {
      width: '400px',
      data: { compteId: compte.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
      }
    });
  }

  openRetraitDialog(compte: Compte) {
    const dialogRef = this.dialog.open(RetraitComponent, {
      width: '400px',
      data: { compteId: compte.id, solde: compte.solde }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
      }
    });
  }

  openTransferDialog(compte?: Compte) {
    if (!compte && this.comptes.length > 0) {
      compte = this.comptes[0];
    }
    if (!compte) {
      alert('Aucun compte disponible');
      return;
    }

    const dialogRef = this.dialog.open(VirementComponent, {
      width: '500px',
      data: { compteId: compte.id, solde: compte.solde, clientId: this.clientId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadComptes();
      }
    });
  }

  viewAccountDetails(compte: Compte) {
    const dialogRef = this.dialog.open(CompteDetailsComponent, {
      width: '800px',
      data: { compte: compte }
    });
  }

  makeDeposit(compte: Compte) {
    this.openDepositDialog(compte);
  }

  makeTransfer(compte: Compte) {
    this.openTransferDialog(compte);
  }
}
