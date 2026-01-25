import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // <--- Nouveau chemin corrigé
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

interface Transaction {
  id: string;
  type: string; // Ex: "DEPOT", "RETRAIT", "VIREMENT"
  montant: number;
  date: string; // Format ISO ou autre
  description: string;
  compteSourceId?: string; // Pour les virements
  compteDestinataireId?: string; // Pour les virements
  // Ajoute d'autres champs si nécessaire
}

@Component({
  selector: 'app-admin-transactions-for-account',
  imports: [CommonModule, RouterModule, DecimalPipe],
  template: `
    <div class="admin-account-transactions-container">
      <h2>Transactions du Compte : {{ compteNumero }}</h2>
      <button class="back-btn" (click)="goBack()">Retour aux comptes du client</button>

      <div class="loading" *ngIf="loadingTransactions">Chargement des transactions...</div>
      <div class="error" *ngIf="errorTransactions">Erreur lors du chargement des transactions.</div>

      <table class="transactions-table" *ngIf="transactions.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Description</th>
            <th>Compte Source</th>
            <th>Compte Destinataire</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of transactions">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.montant | number:'1.2-2' }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.compteSourceId || '-' }}</td>
            <td>{{ transaction.compteDestinataireId || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" *ngIf="transactions.length === 0 && !loadingTransactions && !errorTransactions">
        Aucune transaction trouvée pour ce compte.
      </div>

      <!-- Bouton pour télécharger le PDF des transactions de ce compte -->
      <div class="download-pdf-section">
        <button class="btn btn-info" (click)="downloadAccountPdf()">
          Télécharger Relevé PDF
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-account-transactions-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
    }

    .back-btn {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
    }

    .back-btn:hover {
      background-color: #5a6268;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .transactions-table th,
    .transactions-table td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: left;
    }

    .transactions-table th {
      background-color: #34495e;
      color: white;
    }

    .transactions-table tr:nth-child(even) {
      background-color: #ecf0f1;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 1rem;
      font-style: italic;
      color: #666;
    }

    .error {
      color: #dc3545;
    }

    .download-pdf-section {
      margin-top: 2rem;
      text-align: center;
    }
  `]
})
export class AdminTransactionsForAccountComponent implements OnInit {
  compteId: string = '';
  compteNumero: string = 'Chargement...'; // On pourrait le charger ou le passer en paramètre
  transactions: Transaction[] = [];
  loadingTransactions = false;
  errorTransactions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.compteId = this.route.snapshot.paramMap.get('accountId')!;
    if (this.compteId) {
      this.loadAccountInfo(); // Optionnel, pour afficher le numéro de compte
      this.loadTransactionsForAccount();
    } else {
      console.error('Aucun ID de compte fourni.');
      // Redirige vers la liste des comptes du client ou la liste des clients
      this.goBack();
    }
  }

  loadAccountInfo() {
    // Optionnel : Charger les infos du compte pour afficher son numéro
    // Appelle GET /api/compte/{id} si ton backend le permet
    // this.apiService.getData(`compte/${this.compteId}`).subscribe({
    //   next: (accountData) => {
    //     this.compteNumero = accountData.numeroCompte;
    //   },
    //   error: (err) => {
    //     console.error('Erreur lors du chargement des infos du compte:', err);
    //     this.compteNumero = `Compte ID: ${this.compteId}`;
    //   }
    // });
    // Pour le moment, on affiche juste l'ID
    this.compteNumero = `ID: ${this.compteId}`;
  }

  loadTransactionsForAccount() {
    this.loadingTransactions = true;
    this.errorTransactions = false;
    // Appelle ton endpoint pour récupérer les transactions d'un compte spécifique
    // Remplace 'transaction/compte/{id}' par l'endpoint réel de ton backend si différent
    this.apiService.getData(`transaction/compte/${this.compteId}`).subscribe({
      next: (data) => {
        console.log('Transactions du compte reçues:', data);
        // Selon la structure de ta réponse
        if (Array.isArray(data)) {
          this.transactions = data as Transaction[];
        } else if (data && data.transactions && Array.isArray(data.transactions)) {
          this.transactions = data.transactions as Transaction[];
        } else {
          console.warn('Structure de réponse des transactions du compte inattendue:', data);
          this.transactions = [];
        }
        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions du compte:', err);
        this.errorTransactions = true;
        this.loadingTransactions = false;
      }
    });
  }

  downloadAccountPdf() {
    // Télécharge le PDF des transactions de ce compte (via endpoint admin)
    console.log('Télécharger PDF des transactions du compte:', this.compteId);
    this.apiService.getTransactionsByAccountPdf(this.compteId).subscribe({
      next: (blob) => {
        console.log('PDF des transactions reçu, tentative de téléchargement...');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_compte_${this.compteId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF des transactions:', err);
        // Afficher un message d'erreur
      }
    });
  }

  goBack() {
    // Redirige vers la liste des comptes du client précédent
    // On suppose que le client ID est disponible, sinon on pourrait le stocker ou le passer en queryParams
    // Par exemple, si on venait de /admin/client/{clientId}/accounts
    // On aurait besoin de le récupérer. Pour simplifier, on revient en arrière dans l'historique.
    // this.location.back(); // Requiert import { Location } from '@angular/common';
    // Ou on redirige vers la liste des comptes du client en supposant qu'on la connaît
    // this.router.navigate(['/admin', 'client', knownClientId, 'accounts']);
    // Pour le moment, on redirige vers la liste des clients
    this.router.navigate(['/admin']);
  }
}