import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- Importe ChangeDetectorRef
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Définition de l'interface Transaction
interface Transaction {
  id: string;
  compteSourceId: string;
  compteDestId: string | null;
  type: string;
  montant: number;
  date: string;
  description: string;
}

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, CommonModule, DecimalPipe],
  template: `
    <div class="transactions-container">
      <div class="header">
        <button class="back-button" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Retour à mes comptes
        </button>
        <h2>Mes Transactions</h2>
        <!-- ✅ Bouton de téléchargement PDF -->
        <button class="download-pdf-button" (click)="downloadPdf()">
          <i class="fas fa-download"></i> Télécharger en PDF
        </button>
      </div>

      <div class="summary">
        Nombre de transactions : {{ transactions.length }}
      </div>

      <div class="transactions-list" *ngIf="transactions.length > 0; else noTransactions">
        <div class="transaction-item" *ngFor="let transaction of transactions; let i = index">
          <div class="transaction-header">
            <span class="transaction-type">{{ formatType(transaction.type) }}</span>
            <span class="transaction-amount" [class.positive]="isCredit(transaction.type)" [class.negative]="isDebit(transaction.type)">
              {{ transaction.montant | number:'1.2-2' }} F CFA
            </span>
          </div>
          <div class="transaction-details">
            <span class="transaction-date">{{ transaction.date | date:'short' }}</span>
            <span class="transaction-description">{{ transaction.description }}</span>
          </div>
        </div>
      </div>

      <ng-template #noTransactions>
        <div class="no-transactions">
          Aucune transaction trouvée pour ce compte.
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 2rem;
      max-width: 900px;
      margin: 2rem auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      min-height: calc(100vh - 4rem);
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h2 {
          flex-grow: 1; /* Permet au bouton de rester collé à droite */
          text-align: center;
          color: #2c3e50;
          margin: 0;
          font-size: 1.8rem;
        }

        .back-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #5a6268;
          }

          i {
            font-size: 1rem;
          }
        }

        .download-pdf-button {
          background-color: #28a745; /* Vert pour le téléchargement */
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #218838;
          }

          i {
            font-size: 1rem;
          }
        }
      }

      .summary {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        font-weight: 600;
        color: #495057;
        text-align: center;
        border-left: 4px solid #007bff;
      }

      .transactions-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .transaction-item {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 1rem;
          transition: box-shadow 0.2s ease, transform 0.1s ease;

          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }

          .transaction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .transaction-type {
              font-weight: 600;
              font-size: 1.1rem;
              color: #2c3e50;
            }

            .transaction-amount {
              font-weight: 700;
              font-size: 1.2rem;

              &.positive {
                color: #28a745;
              }

              &.negative {
                color: #dc3545;
              }
            }
          }

          .transaction-details {
            display: flex;
            justify-content: space-between;
            color: #6c757d;
            font-size: 0.9rem;

            .transaction-date {
              // Peut-être stylé différemment si souhaité
            }

            .transaction-description {
              flex-grow: 1;
              margin: 0 1rem;
              text-align: center;
            }
          }
        }
      }

      .no-transactions {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        padding: 2rem;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  accountId = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef // <--- Injecte ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('=== TransactionsComponent - ngOnInit appelé ===');
    
    this.route.queryParams.subscribe(params => {
      this.accountId = params['accountId'] || '';
      console.log('ID du compte:', this.accountId);
      
      if (this.accountId) {
        console.log('Requête envoyée pour:', this.accountId);
        
        this.apiService.getData(`transaction/compte/${this.accountId}`).subscribe({
          next: (data: any) => {
          
            console.log('Données brutes reçues:', data);
            console.log('Type de ', typeof data);
            
            // Vérifie si c'est un tableau directement
            if (Array.isArray(data)) {
              console.log('La réponse est un tableau direct.');
              this.transactions = data;
            } else if (data && typeof data === 'object') {
              // Sinon, cherche un tableau dans les propriétés de l'objet
              console.log('La réponse est un objet, recherche d\'un tableau...');
              let found = false;
              const keys = Object.keys(data);
              for (const key of keys) {
                if (Array.isArray(data[key])) {
                  console.log(`Transactions trouvées dans la propriété '${key}'`);
                  this.transactions = data[key];
                  found = true;
                  break; // Prends le premier tableau trouvé
                }
              }
              if (!found) {
                console.log('Aucun tableau trouvé dans les propriétés de l\'objet.');
                this.transactions = [];
              }
            } else {
              console.log('La réponse n\'est ni un tableau, ni un objet contenant un tableau.');
              this.transactions = [];
            }
            
            console.log('Transactions assignées finales:', this.transactions);

            // Force la détection de changement
            this.cdr.detectChanges(); // <--- Ajoute cette ligne
          },
          error: (err: any) => {
            console.log('Erreur:', err);
            console.error('Erreur lors du chargement des transactions:', err);
          }
        });
      } else {
        console.log('Aucun ID de compte fourni');
      }
    });
  }

  // ✅ Méthode corrigée : Télécharge le PDF des transactions du compte actuel
  downloadPdf() {
    if (!this.accountId) {
      console.warn('Impossible de télécharger le PDF : aucun ID de compte disponible.');
      return;
    }

    console.log('Tentative de téléchargement du PDF des transactions pour le compte:', this.accountId);
    // Appelle la méthode spécifique à un compte dans ApiService
    this.apiService.getTransactionsByAccountPdf(this.accountId).subscribe({
      next: (blob) => {
        console.log('PDF reçu, tentative de téléchargement...');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Nom du fichier plus spécifique
        a.download = `releve_compte_${this.accountId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF:', err);
        // Tu peux ajouter un message d'erreur ici si tu veux
      }
    });
  }

  // Méthodes utilitaires pour le template
  formatType(type: string): string {
    const mapping: { [key: string]: string } = {
      'depot': 'Dépôt',
      'retrait': 'Retrait',
      'virement_sortant': 'Virement Sortant',
      'virement_entrant': 'Virement Entrant',
      'versement': 'Versement'
    };
    return mapping[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  isCredit(type: string): boolean {
    return ['depot', 'versement', 'virement_entrant'].includes(type);
  }

  isDebit(type: string): boolean {
    return ['retrait', 'virement_sortant'].includes(type);
  }

  goBack() {
    this.router.navigate(['/accounts']);
  }
}