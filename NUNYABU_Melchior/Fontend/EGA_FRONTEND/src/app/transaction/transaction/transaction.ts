import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction-service';
import { ReleveService } from '../../core/services/releve.service';
import { CompteService } from '../../compte/services/compte-service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class Transaction implements OnInit {

  transactions: any[] = [];
  comptes: any[] = [];
  filtreType = 'ALL';
  compteSelectionne: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  loading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private releveService: ReleveService,
    private compteService: CompteService
  ) {}

  ngOnInit() {
    this.chargerComptes();
    this.chargerHistorique();
  }

  chargerComptes() {
    this.compteService.getComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        if (data.length > 0) {
          this.compteSelectionne = data[0].numeroCompte;
        }
      },
      error: (err) => console.error('Erreur récupération comptes', err)
    });
  }

  chargerHistorique() {
    this.loading = true;
    this.transactionService.getHistorique().subscribe({
      next: data => {
        this.transactions = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur historique', err);
        this.loading = false;
      }
    });
  }

  filtrerParCompte() {
    if (!this.compteSelectionne) {
      this.chargerHistorique();
      return;
    }
    this.loading = true;
    this.transactionService.getTransactionsByCompte(this.compteSelectionne).subscribe({
      next: data => {
        this.transactions = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur filtrage', err);
        this.loading = false;
      }
    });
  }

  filtrerParPeriode() {
    if (!this.dateDebut || !this.dateFin || !this.compteSelectionne) {
      alert('Veuillez sélectionner un compte et une période');
      return;
    }
    this.loading = true;
    this.transactionService.getTransactionsByPeriod(
      this.compteSelectionne,
      this.dateDebut,
      this.dateFin
    ).subscribe({
      next: data => {
        this.transactions = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur filtrage période', err);
        this.loading = false;
      }
    });
  }

  transactionsFiltrees() {
    let filtered = this.transactions;
    if (this.filtreType !== 'ALL') {
      filtered = filtered.filter(t => t.type === this.filtreType);
    }
    return filtered;
  }

  badgeClass(type: string) {
    switch (type) {
      case 'DEPOT': return 'bg-green-100 text-green-700';
      case 'RETRAIT': return 'bg-red-100 text-red-700';
      case 'VIREMENT': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  imprimerReleve() {
    if (!this.compteSelectionne) {
      alert('Veuillez sélectionner un compte');
      return;
    }

    this.releveService.genererReleve(
      this.compteSelectionne,
      this.dateDebut || undefined,
      this.dateFin || undefined
    ).subscribe({
      next: (releve) => {
        this.imprimerRelevePDF(releve);
      },
      error: (err) => {
        console.error('Erreur génération relevé', err);
        alert('Erreur lors de la génération du relevé');
      }
    });
  }

  imprimerRelevePDF(releve: any) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const compte = releve.compte;
    const client = releve.client;
    const transactions = releve.transactions || [];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relevé de compte - ${compte.numeroCompte}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; margin-top: 20px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BANQUE EGA</h1>
          <h2>RELEVÉ DE COMPTE</h2>
        </div>
        
        <div class="info">
          <p><strong>Client:</strong> ${client.nom} ${client.prenom}</p>
          <p><strong>Numéro de compte:</strong> ${compte.numeroCompte}</p>
          <p><strong>Type de compte:</strong> ${compte.typeCompte}</p>
          <p><strong>Solde actuel:</strong> ${this.formatCurrency(compte.solde || 0)}</p>
          <p><strong>Période:</strong> ${releve.periode.debut} - ${releve.periode.fin}</p>
          <p><strong>Date d'édition:</strong> ${new Date(releve.dateGeneration).toLocaleDateString('fr-FR')}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Compte source</th>
              <th>Compte destination</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map((t: any) => `
              <tr>
                <td>${new Date(t.dateTransaction).toLocaleDateString('fr-FR')}</td>
                <td>${t.type}</td>
                <td>${this.formatCurrency(t.montant || 0)}</td>
                <td>${t.compteSource?.numeroCompte || '-'}</td>
                <td>${t.compteDestination?.numeroCompte || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <p>Nombre de transactions: ${transactions.length}</p>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer;">
            Imprimer
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
