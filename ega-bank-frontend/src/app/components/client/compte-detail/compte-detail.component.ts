import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../../services/compte.service';
import { Compte, Transaction } from '../../../models/models';

@Component({
  selector: 'app-compte-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div *ngIf="compte">
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Détails du Compte</h1>
        <div class="grid grid-2">
          <div class="card">
            <h2 style="font-size: 24px; margin-bottom: 20px;">Informations</h2>
            <div style="margin-bottom: 16px;"><span class="badge" [class.badge-primary]="compte.type === 'COURANT'" [class.badge-success]="compte.type === 'EPARGNE'">{{ compte.type }}</span></div>
            <p><strong>Numéro:</strong> {{ compte.numeroCompte }}</p>
            <p><strong>Date d'ouverture:</strong> {{ compte.dateCreation }}</p>
            <div style="margin: 24px 0; padding: 24px; background: var(--gradient-light); border-radius: 12px;"><span style="display: block; font-size: 14px; color: var(--text-dark); opacity: 0.8; margin-bottom: 8px;">Solde actuel</span><span style="font-size: 36px; font-weight: 700; color: var(--dark-purple);">{{ compte.solde | number:'1.2-2' }} FCFA</span></div>
            <a routerLink="/client/operations" class="btn btn-primary" style="width: 100%;">Effectuer une opération</a>
          </div>
          <div class="card">
            <h2 style="font-size: 24px; margin-bottom: 20px;">Relevé de compte</h2>
            <div class="form-group"><label class="form-label">Date de début</label><input type="datetime-local" [(ngModel)]="dateDebut" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Date de fin</label><input type="datetime-local" [(ngModel)]="dateFin" class="form-control" /></div>
            <button (click)="downloadPdf()" class="btn btn-secondary" style="width: 100%;">📄 Télécharger le relevé PDF</button>
          </div>
        </div>
        <div *ngIf="transactions.length > 0" style="margin-top: 32px;">
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Dernières transactions</h2>
          <div class="card">
            <table class="table">
              <thead><tr><th>Date</th><th>Type</th><th>Montant</th><th>Description</th></tr></thead>
              <tbody>
                <tr *ngFor="let tx of transactions">
                  <td>{{ tx.dateOperation | date:'short' }}</td>
                  <td><span class="badge badge-primary">{{ tx.type }}</span></td>
                  <td>{{ tx.montant | number:'1.2-2' }} FCFA</td>
                  <td>{{ tx.description || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CompteDetailComponent implements OnInit {
  compte: Compte | null = null;
  transactions: Transaction[] = [];
  dateDebut: string = '';
  dateFin: string = '';
  constructor(private compteService: CompteService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const numero = params['numero'];
      this.compteService.getByNumero(numero).subscribe(compte => this.compte = compte);
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      this.dateDebut = lastMonth.toISOString().slice(0, 16);
      this.dateFin = now.toISOString().slice(0, 16);
      this.loadTransactions(numero);
    });
  }
  loadTransactions(numero: string): void {
    this.compteService.getTransactions(numero, this.dateDebut, this.dateFin).subscribe(tx => this.transactions = tx);
  }
  downloadPdf(): void {
    if (this.compte) {
      this.compteService.getRelevePdf(this.compte.numeroCompte, this.dateDebut, this.dateFin).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'releve_' + this.compte!.numeroCompte + '.pdf';
        a.click();
      });
    }
  }
}
