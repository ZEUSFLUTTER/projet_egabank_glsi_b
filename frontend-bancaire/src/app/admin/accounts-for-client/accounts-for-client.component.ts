import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Account {
  id: string;
  numeroCompte: string;
  solde: number;
  type: string | null;
  devise: string;
  clientId: string;
  isActive: boolean;
  description?: string;
}

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  sexe: string;
  nationalite: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  statutKYC: string;
}

@Component({
  selector: 'app-admin-accounts-for-client',
  imports: [CommonModule, RouterModule, DecimalPipe, FormsModule],
  template: `
    <div class="admin-client-accounts-container">
      <header class="page-header">
        <h2>Comptes du Client : {{ clientName }}</h2>
        <button class="btn btn-back" (click)="goBack()">← Retour à la liste des clients</button>
      </header>

      <div class="loading" *ngIf="loadingAccounts">Chargement des comptes...</div>
      <div class="error" *ngIf="errorAccounts">Erreur lors du chargement des comptes.</div>

      <section class="accounts-section" *ngIf="accounts.length > 0">
        <table class="styled-table">
          <thead>
            <tr>
              <th>ID Compte</th>
              <th>Numéro</th>
              <th>Type</th>
              <th>Description</th>
              <th>Solde</th>
              <th>Devise</th>
              <th>Actif</th>
              <th>Actions</th>
              <th>Activation</th>
              <th>Opérations Admin</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts">
              <td>{{ account.id }}</td>
              <td>{{ account.numeroCompte }}</td>
              <td>{{ account.type || 'Non spécifié' }}</td>
              <td>{{ account.description || 'Aucune' }}</td>
              <td>{{ account.solde | number:'1.2-2' }} {{ account.devise }}</td>
              <td>{{ account.devise }}</td>
              <td>
                <span class="status-badge" [class.active]="account.isActive" [class.inactive]="!account.isActive">
                  {{ account.isActive ? 'Oui' : 'Non' }}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary" (click)="viewAccountTransactions(account.id)">
                  <i class="fas fa-file-invoice"></i> Voir Transactions
                </button>
                <button class="btn btn-info" (click)="downloadAccountPdf(account.id)">
                  <i class="fas fa-download"></i> PDF
                </button>
              </td>
              <td>
                <div class="admin-activation">
                  <button
                    class="btn"
                    [class.btn-success]="!account.isActive"
                    [class.btn-warning]="account.isActive"
                    (click)="toggleAccountStatus(account)"
                  >
                    <i class="fas" [class.fa-check]="!account.isActive" [class.fa-times]="account.isActive"></i>
                    {{ account.isActive ? 'Désactiver' : 'Activer' }}
                  </button>
                </div>
              </td>
              <td>
                <div class="admin-operations-summary">
                  <button class="btn btn-primary btn-small" (click)="toggleOperations(account.id)">
                    <i class="fas" [class.fa-chevron-down]="!isOperationsVisible(account.id)" [class.fa-chevron-up]="isOperationsVisible(account.id)"></i>
                    {{ isOperationsVisible(account.id) ? 'Masquer' : 'Afficher' }} Opérations
                  </button>

                  <div class="operation-form" *ngIf="isOperationsVisible(account.id)">
                    <h4>Opérations pour {{ account.numeroCompte }}</h4>

                    <div class="operations-buttons">
                      <button class="btn btn-success btn-operation" (click)="openDepotForm(account.id)">
                        <i class="fas fa-plus-circle"></i> Dépôt
                      </button>
                      <button class="btn btn-warning btn-operation" (click)="openRetraitForm(account.id)">
                        <i class="fas fa-minus-circle"></i> Retrait
                      </button>
                      <button class="btn btn-info btn-operation" (click)="openVirementForm(account.id)">
                        <i class="fas fa-exchange-alt"></i> Virement
                      </button>
                    </div>

                    <form (ngSubmit)="operationType === 'depot' ? performDepot() : operationType === 'retrait' ? performRetrait() : performVirement()" #operationForm="ngForm" *ngIf="selectedAccountId === account.id">
                      <div *ngIf="operationType === 'depot' || operationType === 'retrait'" class="form-group">
                        <label for="amount_op_{{account.id}}">Montant:</label>
                        <input type="number" id="amount_op_{{account.id}}" [(ngModel)]="operationAmount" name="amount_op" required min="0.01" step="0.01">
                      </div>

                      <div *ngIf="operationType === 'virement'" class="form-group">
                        <label for="targetAccount_op_{{account.id}}">Compte Destinataire ID:</label>
                        <input type="text" id="targetAccount_op_{{account.id}}" [(ngModel)]="targetAccountIdForTransfer" name="targetAccount_op" required>
                      </div>

                      <div *ngIf="operationType === 'virement'" class="form-group">
                        <label for="amount_virement_op_{{account.id}}">Montant:</label>
                        <input type="number" id="amount_virement_op_{{account.id}}" [(ngModel)]="operationAmount" name="amount_virement_op" required min="0.01" step="0.01">
                      </div>

                      <div class="form-actions">
                        <button type="submit" class="btn btn-primary" [disabled]="!operationForm.form.valid">Confirmer</button>
                        <button type="button" class="btn btn-secondary" (click)="cancelOperation()">Annuler</button>
                      </div>
                    </form>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="empty-state" *ngIf="accounts.length === 0 && !loadingAccounts && !errorAccounts">
        Aucun compte trouvé pour ce client.
      </div>

      <section class="create-account-section">
        <h3>Créer un nouveau compte</h3>
        <form (ngSubmit)="createNewAccount()" #accountForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="newAccountType">Type:</label>
              <select id="newAccountType" [(ngModel)]="newAccountType" name="type" required>
                <option value="courant">Courant</option>
                <option value="epargne">Épargne</option>
              </select>
            </div>

            <div class="form-group">
              <label>&nbsp;</label>
              <button type="submit" class="btn btn-primary" [disabled]="!accountForm.form.valid">Créer Compte (Solde 0, Devise CFA)</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  `,
  styles: [`
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .admin-client-accounts-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #e0f7fa 100%);
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #d1d5db;
    }

    .page-header h2 {
      color: #1a237e;
      font-size: 1.5rem;
    }

    .btn-back {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .btn-back:hover {
      background-color: #5a6268;
    }

    section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    h3 {
      margin-bottom: 1rem;
      color: #283593;
      font-size: 1.2rem;
    }

    .accounts-section {
      overflow-x: auto;
    }

    .styled-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .styled-table th,
    .styled-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .styled-table th {
      background: linear-gradient(to bottom, #3f51b5, #283593);
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .styled-table tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .styled-table tbody tr:hover {
      background-color: #e3f2fd;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-badge.active {
      background-color: #4caf50;
      color: white;
    }

    .status-badge.inactive {
      background-color: #f44336;
      color: white;
    }

    .btn {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: none;
      margin-right: 0.25rem;
      margin-bottom: 0.25rem;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn i {
      font-size: 0.9rem;
    }

    .btn-small {
      padding: 0.3rem 0.6rem;
      font-size: 0.8rem;
    }

    .btn-secondary {
      background-color: #607d8b;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #546e7a;
    }

    .btn-info {
      background-color: #0288d1;
      color: white;
    }

    .btn-info:hover {
      background-color: #0277bd;
    }

    .btn-primary {
      background-color: #303f9f;
      color: white;
    }

    .btn-primary:hover {
      background-color: #283593;
    }

    .btn-success {
      background-color: #388e3c;
      color: white;
    }

    .btn-success:hover {
      background-color: #2e7d32;
    }

    .btn-warning {
      background-color: #f57c00;
      color: white;
    }

    .btn-warning:hover {
      background-color: #ef6c00;
    }

    .btn-operation {
      margin-bottom: 0.5rem;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 1.5rem;
      font-style: italic;
      color: #7f8c8d;
    }

    .error {
      color: #e74c3c;
    }

    .empty-state {
      background-color: #f1f5f9;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .admin-operations-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .operations-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .operation-form {
      padding: 0.75rem;
      border: 1px solid #c5cae9;
      border-radius: 4px;
      background-color: #e8eaf6;
      margin-top: 0.5rem;
    }

    .operation-form h4 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #283593;
    }

    .operation-form .form-group {
      margin-bottom: 0.75rem;
    }

    .operation-form .form-group label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: #4b5563;
    }

    .operation-form .form-group input,
    .operation-form .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      box-sizing: border-box;
      background-color: white;
    }

    .form-actions {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-start;
    }

    .admin-activation {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
    }

    .create-account-section {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .create-account-section h3 {
      color: #1a237e;
    }

    .create-account-section .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: end;
    }

    .create-account-section .form-group {
      flex: 1 1 200px;
      min-width: 200px;
      margin-bottom: 1rem;
    }

    .create-account-section .form-group label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: #4b5563;
    }

    .create-account-section .form-group input,
    .create-account-section .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      box-sizing: border-box;
      background-color: white;
    }

    .create-account-section .form-actions {
      margin-top: 1rem;
      text-align: right;
    }
  `]
})
export class AdminAccountsForClientComponent implements OnInit {
  clientId: string = '';
  clientName: string = 'Chargement...';
  accounts: Account[] = [];
  loadingAccounts = false;
  errorAccounts = false;

  newAccountType: string = 'courant';

  // Variables pour gérer les formulaires d'opérations
  selectedAccountId: string | null = null;
  operationType: 'depot' | 'retrait' | 'virement' | null = null;
  operationAmount: number | null = null;
  targetAccountIdForTransfer: string | null = null;

  private operationsVisibilityMap = new Map<string, boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
    if (this.clientId) {
      this.loadClientInfo();
      this.loadAccountsForClient();
    } else {
      console.error('Aucun ID de client fourni.');
      this.router.navigate(['/admin']);
    }
  }

  loadClientInfo() {
    this.apiService.getData(`client/${this.clientId}`).subscribe({
      next: (clientData: Client) => {
        setTimeout(() => {
          this.clientName = `${clientData.prenom} ${clientData.nom}`;
        }, 0);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des infos du client:', err);
        setTimeout(() => {
          this.clientName = `Client ID: ${this.clientId}`;
        }, 0);
      }
    });
  }

  loadAccountsForClient() {
    this.loadingAccounts = true;
    this.errorAccounts = false;
    this.cdr.detectChanges();
    // Restauré à la logique originale
    this.apiService.getData(`compte/client/${this.clientId}`).subscribe({
      next: (data: any) => { // <--- Logique originale
        console.log('Comptes du client reçus:', data);
        if (Array.isArray(data)) {
          this.accounts = data as Account[];
        } else if (data && data.comptes && Array.isArray(data.comptes)) {
          this.accounts = data.comptes as Account[];
        } else {
          console.warn('Structure de réponse des comptes client inattendue:', data);
          this.accounts = [];
        }
        this.loadingAccounts = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des comptes du client:', err);
        this.errorAccounts = true;
        this.loadingAccounts = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleAccountStatus(account: Account) {
    if (!confirm(`Êtes-vous sûr de vouloir ${account.isActive ? 'désactiver' : 'activer'} le compte ${account.numeroCompte} ?`)) {
      return;
    }

    const updatedAccountData = {
      ...account,
      isActive: !account.isActive
    };

    console.log(`Tentative de ${updatedAccountData.isActive ? 'activation' : 'désactivation'} du compte:`, account.id, updatedAccountData);

    this.apiService.putData(`compte/${account.id}`, updatedAccountData).subscribe({
      next: (response: any) => {
        console.log(`${updatedAccountData.isActive ? 'Activation' : 'Désactivation'} réussie:`, response);
        account.isActive = updatedAccountData.isActive;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(`Erreur lors de la ${updatedAccountData.isActive ? 'désactivation' : 'activation'} du compte:`, err);
        alert(`Erreur lors de la ${updatedAccountData.isActive ? 'désactivation' : 'activation'} du compte.`);
      }
    });
  }

  openDepotForm(accountId: string) {
    this.selectedAccountId = accountId;
    this.operationType = 'depot';
    this.operationAmount = null;
  }

  openRetraitForm(accountId: string) {
    this.selectedAccountId = accountId;
    this.operationType = 'retrait';
    this.operationAmount = null;
  }

  openVirementForm(accountId: string) {
    this.selectedAccountId = accountId;
    this.operationType = 'virement';
    this.operationAmount = null;
    this.targetAccountIdForTransfer = null;
  }

  cancelOperation() {
    this.selectedAccountId = null;
    this.operationType = null;
    this.operationAmount = null;
    this.targetAccountIdForTransfer = null;
  }

  performDepot() {
    if (this.selectedAccountId && this.operationAmount && this.operationAmount > 0) {
      const urlWithParams = `compte/${this.selectedAccountId}/depot?montant=${this.operationAmount}`;
      this.apiService.postData(urlWithParams, {}).subscribe({
        next: (response: any) => {
          console.log('Dépôt réussi:', response);
          alert('Dépôt effectué avec succès !');
          this.loadAccountsForClient(); // Recharge les comptes
          this.cancelOperation();
        },
        error: (err: any) => {
          console.error('Erreur lors du dépôt:', err);
          alert('Erreur lors du dépôt.');
        }
      });
    }
  }

  performRetrait() {
    if (this.selectedAccountId && this.operationAmount && this.operationAmount > 0) {
      const urlWithParams = `compte/${this.selectedAccountId}/retrait?montant=${this.operationAmount}`;
      this.apiService.postData(urlWithParams, {}).subscribe({
        next: (response: any) => {
          console.log('Retrait réussi:', response);
          alert('Retrait effectué avec succès !');
          this.loadAccountsForClient(); // Recharge les comptes
          this.cancelOperation();
        },
        error: (err: any) => {
          console.error('Erreur lors du retrait:', err);
          alert('Erreur lors du retrait.');
        }
      });
    }
  }

  performVirement() {
    if (this.selectedAccountId && this.targetAccountIdForTransfer && this.operationAmount && this.operationAmount > 0) {
      const virementData = {
        compteSourceId: this.selectedAccountId,
        compteDestId: this.targetAccountIdForTransfer,
        montant: this.operationAmount
      };

      this.apiService.postData(`compte/virement-json`, virementData).subscribe({
        next: (response: any) => {
          console.log('Virement réussi:', response);
          alert('Virement effectué avec succès !');
          this.loadAccountsForClient(); // Recharge les comptes
          this.cancelOperation();
        },
        error: (err: any) => {
          console.error('Erreur lors du virement:', err);
          alert('Erreur lors du virement.');
        }
      });
    }
  }

  viewAccountTransactions(accountId: string) {
    console.log('Navigue vers les transactions du compte:', accountId);
    this.router.navigate(['/admin', 'account', accountId, 'transactions']);
  }

  downloadAccountPdf(accountId: string) {
    console.log('Télécharger PDF du compte:', accountId);
    this.apiService.getTransactionsByAccountPdf(accountId).subscribe({
      next: (blob: Blob) => {
        console.log('PDF reçu, tentative de téléchargement...');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_compte_${accountId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Erreur lors du téléchargement du PDF:', err);
      }
    });
  }

  createNewAccount() {
    if (this.newAccountType) {
      const accountData = {
        type: this.newAccountType.toUpperCase(),
        solde: 0,
        devise: 'CFA',
      };

      console.log('Création d\'un nouveau compte:', accountData);
      this.apiService.postData(`compte/client/${this.clientId}`, accountData).subscribe({
        next: (response: any) => {
          console.log('Compte créé avec succès:', response);
          this.loadAccountsForClient(); // Recharge les comptes
        },
        error: (err: any) => {
          console.error('Erreur lors de la création du compte:', err);
        }
      });
    }
  }

  toggleOperations(accountId: string) {
    const isVisible = this.operationsVisibilityMap.get(accountId) || false;
    this.operationsVisibilityMap.set(accountId, !isVisible);
    this.cdr.detectChanges();
  }

  isOperationsVisible(accountId: string): boolean {
    return this.operationsVisibilityMap.get(accountId) || false;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}