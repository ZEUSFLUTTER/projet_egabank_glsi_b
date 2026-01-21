import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Transaction } from '../../../services/transaction.service';
import { CompteService, Compte } from '../../../services/compte.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-container">
      <div class="header-section">
        <h2>📋 Historique des Transactions</h2>
        <p class="subtitle">Consultez et exportez vos transactions bancaires</p>
      </div>

      <div class="filter-card">
        <div class="filter-header">
          <h3>🔍 Filtres de recherche</h3>
        </div>
        <div class="filter-grid">
          <div class="form-group">
            <label>💳 Compte</label>
            <select [(ngModel)]="selectedCompte" name="selectedCompte" class="form-control">
              <option value="">Tous les comptes</option>
              <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                {{ compte.numeroCompte }} - {{ compte.proprietaire?.nom }} {{ compte.proprietaire?.prenom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>📅 Date de début</label>
            <input type="date" [(ngModel)]="dateDebut" name="dateDebut" class="form-control">
          </div>
          <div class="form-group">
            <label>📅 Date de fin</label>
            <input type="date" [(ngModel)]="dateFin" name="dateFin" class="form-control">
          </div>
          <div class="form-group">
            <label>🔍 Recherche dans les libellés</label>
            <input type="text" [(ngModel)]="searchText" name="searchText" 
                   (input)="onSearchChange()"
                   placeholder="Rechercher dans les libellés..." class="form-control">
          </div>
        </div>
        <div class="filter-actions">
          <button (click)="loadTransactions()" class="btn btn-primary" [disabled]="isLoading">
            <span class="btn-icon">{{ isLoading ? '⏳' : '🔎' }}</span> 
            {{ isLoading ? 'Chargement...' : 'Rechercher' }}
          </button>
          <button
            *ngIf="selectedCompte && dateDebut && dateFin && transactions.length > 0"
            (click)="downloadReleve()"
            class="btn btn-print"
            title="Télécharger le relevé bancaire en PDF">
            <span class="btn-icon">🖨️</span> Imprimer le relevé
          </button>
        </div>
      </div>

      <div class="results-section">
        <div class="results-header">
          <h3>📊 Résultats</h3>
          <div class="results-info">
            <span class="badge" *ngIf="filteredTransactions.length > 0">
              {{ filteredTransactions.length }} transaction(s)
            </span>
            <span class="total-amount" *ngIf="filteredTransactions.length > 0">
              Total: {{ getTotalAmount() | number:'1.2-2' }} €
            </span>
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          <strong>❌ Erreur:</strong> {{ errorMessage }}
        </div>

        <div *ngIf="filteredTransactions.length === 0 && !isLoading" class="empty-state">
          <div class="empty-icon">📭</div>
          <p>Aucune transaction trouvée pour les critères sélectionnés</p>
          <p class="empty-hint">Modifiez les filtres ci-dessus pour voir les transactions</p>
        </div>

        <div *ngIf="filteredTransactions.length > 0" class="table-wrapper">
          <table class="transactions-table">
            <thead>
              <tr>
                <th (click)="sortBy('dateOperation')" class="sortable">
                  Date {{ getSortIcon('dateOperation') }}
                </th>
                <th>Type</th>
                <th (click)="sortBy('montant')" class="sortable">
                  Montant {{ getSortIcon('montant') }}
                </th>
                <th>Libellé</th>
                <th>Compte</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of paginatedTransactions" 
                  [class]="'transaction-' + (transaction.typeTransaction || '').toLowerCase()">
                <td>{{ transaction.dateOperation | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span class="transaction-badge" [class]="'badge-' + (transaction.typeTransaction || '').toLowerCase()">
                    {{ getTransactionTypeLabel(transaction.typeTransaction) }}
                  </span>
                </td>
                <td [class.positive]="transaction.typeTransaction === 'DEPOT'"
                    [class.negative]="transaction.typeTransaction === 'RETRAIT'">
                  {{ transaction.typeTransaction === 'DEPOT' ? '+' : '-' }}{{ transaction.montant | number:'1.2-2' }} €
                </td>
                <td>{{ transaction.libelle }}</td>
                <td class="account-number">{{ transaction.compteSource?.numeroCompte || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" class="btn btn-pagination">
              ← Précédent
            </button>
            <span class="page-info">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages" class="btn btn-pagination">
              Suivant →
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="selectedCompte && dateDebut && dateFin && transactions.length > 0" class="releve-section">
        <div class="releve-card">
          <div class="releve-info">
            <span class="releve-icon">📋</span>
            <div>
              <h4>Relevé bancaire disponible</h4>
              <p>Générez et téléchargez un PDF de votre relevé pour la période du {{ dateDebut }} au {{ dateFin }}</p>
            </div>
          </div>
          <button (click)="downloadReleve()" class="btn btn-print-large">
            <span class="btn-icon">📥</span>
            Télécharger le PDF
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 20px 0;
    }

    .header-section {
      margin-bottom: 30px;
    }

    .header-section h2 {
      color: #333;
      margin-bottom: 5px;
      font-size: 28px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .filter-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      border: 1px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .filter-header h3 {
      margin-bottom: 20px;
      color: #495057;
      font-size: 18px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .filter-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      padding-top: 15px;
      border-top: 1px solid #dee2e6;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-print {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
    }

    .btn-print:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(39, 174, 96, 0.4);
    }

    .btn-print-large {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      padding: 15px 30px;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
    }

    .btn-print-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(39, 174, 96, 0.4);
    }

    .btn-icon {
      font-size: 16px;
    }

    .results-section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 25px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e9ecef;
    }

    .results-header h3 {
      margin: 0;
      color: #333;
    }

    .results-info {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .badge {
      background: #667eea;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .total-amount {
      background: #27ae60;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .alert {
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid;
    }

    .alert-error {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }

    .sortable:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
      padding: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn-pagination {
      background: #667eea;
      color: white;
      padding: 8px 16px;
      font-size: 13px;
    }

    .btn-pagination:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .page-info {
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 15px;
    }

    .empty-hint {
      font-size: 13px;
      color: #adb5bd;
      margin-top: 8px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .transactions-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .transactions-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .transactions-table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      font-size: 14px;
    }

    .transactions-table tbody tr {
      transition: background 0.2s;
    }

    .transactions-table tbody tr:hover {
      background: #f8f9fa;
    }

    .transaction-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-depot {
      background: #d4edda;
      color: #155724;
    }

    .badge-retrait {
      background: #f8d7da;
      color: #721c24;
    }

    .badge-virement {
      background: #d1ecf1;
      color: #0c5460;
    }

    .positive {
      color: #27ae60;
      font-weight: 600;
    }

    .negative {
      color: #e74c3c;
      font-weight: 600;
    }

    .account-number {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #6c757d;
    }

    .releve-section {
      margin-top: 25px;
    }

    .releve-card {
      background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
      border: 2px solid #ffc107;
      border-radius: 12px;
      padding: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
    }

    .releve-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .releve-icon {
      font-size: 32px;
    }

    .releve-info h4 {
      margin: 0 0 5px 0;
      color: #856404;
      font-size: 16px;
    }

    .releve-info p {
      margin: 0;
      color: #856404;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .filter-grid {
        grid-template-columns: 1fr;
      }

      .filter-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .releve-card {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .releve-info {
        flex-direction: column;
        text-align: center;
      }

      .transactions-table {
        font-size: 12px;
      }

      .transactions-table th,
      .transactions-table td {
        padding: 10px 8px;
      }
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  comptes: Compte[] = [];
  selectedCompte = '';
  dateDebut = '';
  dateFin = '';
  searchText = '';
  isLoading = false;
  errorMessage = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Tri
  sortField = 'dateOperation';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
    this.loadTransactions();
  }

  loadComptes(): void {
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes', err);
        this.errorMessage = 'Impossible de charger les comptes.';
      }
    });
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    if (this.selectedCompte && this.dateDebut && this.dateFin) {
      this.transactionService.getByPeriod(this.selectedCompte, this.dateDebut, this.dateFin).subscribe({
        next: (data) => {
          this.transactions = data;
          this.applyFiltersAndSort();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des transactions', err);
          this.isLoading = false;
          this.handleError(err);
        }
      });
    } else {
      this.transactionService.getAll().subscribe({
        next: (data) => {
          this.transactions = data;
          this.applyFiltersAndSort();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des transactions', err);
          this.isLoading = false;
          this.handleError(err);
        }
      });
    }
  }

  applyFiltersAndSort(): void {
    // Filtrage par texte de recherche
    this.filteredTransactions = this.transactions.filter(transaction => {
      if (!this.searchText) return true;
      return transaction.libelle?.toLowerCase().includes(this.searchText.toLowerCase());
    });

    // Tri
    this.filteredTransactions.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Transaction];
      let bValue: any = b[this.sortField as keyof Transaction];

      if (this.sortField === 'dateOperation') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.applyFiltersAndSort();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalAmount(): number {
    return this.filteredTransactions.reduce((total, transaction) => {
      const amount = transaction.typeTransaction === 'DEPOT' ? transaction.montant : -transaction.montant;
      return total + amount;
    }, 0);
  }

  handleError(err: any): void {
    if (err.status === 401) {
      this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
    } else if (err.status === 0) {
      this.errorMessage = 'Impossible de se connecter au serveur.';
    } else {
      this.errorMessage = `Erreur lors du chargement: ${err.message}`;
    }
  }

  downloadReleve(): void {
    if (this.selectedCompte && this.dateDebut && this.dateFin) {
      // Afficher un indicateur de chargement
      const originalText = 'Télécharger le PDF';
      const buttons = document.querySelectorAll('.btn-print, .btn-print-large');
      buttons.forEach(btn => {
        btn.textContent = '⏳ Génération en cours...';
        (btn as HTMLButtonElement).disabled = true;
      });

      this.transactionService.downloadReleve(this.selectedCompte, this.dateDebut, this.dateFin)
        .subscribe({
          next: () => {
            console.log('PDF téléchargé avec succès');
          },
          error: (err) => {
            console.error('Erreur lors du téléchargement du relevé', err);
            this.errorMessage = 'Erreur lors du téléchargement du relevé. Veuillez réessayer.';
          }
        })
        .add(() => {
          // Restaurer les boutons après téléchargement (succès ou erreur)
          setTimeout(() => {
            buttons.forEach(btn => {
              btn.innerHTML = '<span class="btn-icon">📥</span> ' + originalText;
              (btn as HTMLButtonElement).disabled = false;
            });
          }, 2000);
        });
    }
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  getTransactionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'VIREMENT': 'Virement'
    };
    return labels[type] || type;
  }
}
