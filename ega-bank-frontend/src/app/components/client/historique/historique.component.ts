import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { Transaction } from '../../../models/models';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700;">Historique des Transactions</h1>
        <button (click)="downloadPdf()" class="btn btn-secondary">📄 Télécharger PDF</button>
      </div>
      <div class="card" *ngIf="transactions.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Compte Source</th>
              <th>Compte Destination</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of transactions">
              <td>{{ tx.dateOperation | date:'short' }}</td>
              <td><span class="badge" [class.badge-success]="tx.type === 'DEPOT'" [class.badge-warning]="tx.type === 'RETRAIT'" [class.badge-primary]="tx.type === 'VIREMENT'">{{ tx.type }}</span></td>
              <td>{{ tx.montant | number:'1.2-2' }} FCFA</td>
              <td>{{ tx.compteSource?.numeroCompte || '-' }}</td>
              <td>{{ tx.compteDestination?.numeroCompte || '-' }}</td>
              <td>{{ tx.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="transactions.length === 0" class="card text-center" style="padding: 60px;">
        <h3 style="font-size: 24px; color: #6B7280;">Aucune transaction</h3>
        <p style="color: #9CA3AF;">Vous n'avez effectué aucune transaction pour le moment</p>
      </div>
    </div>
  `
})
export class HistoriqueComponent implements OnInit {
  transactions: Transaction[] = [];
  clientId: number | null = null;
  constructor(private transactionService: TransactionService, private authService: AuthService, private adminService: AdminService) {}
  ngOnInit(): void {
    const email = this.authService.getEmail();
    if (email) {
      this.adminService.listClients().subscribe(clients => {
        const client = clients.find(c => c.courriel === email);
        if (client && client.id) {
          this.clientId = client.id;
          this.transactionService.getHistoriqueClient(client.id).subscribe(tx => this.transactions = tx);
        }
      });
    }
  }
  downloadPdf(): void {
    if (this.clientId) {
      this.transactionService.getHistoriqueClientPdf(this.clientId).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historique_transactions.pdf';
        a.click();
      });
    }
  }
}
