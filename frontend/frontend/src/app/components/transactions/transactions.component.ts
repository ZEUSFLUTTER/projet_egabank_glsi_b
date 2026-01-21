import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CompteService } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { Transaction } from '../../models/transaction.model';
import { Compte } from '../../models/compte.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="transactions-container">
  <div class="page-header">
    <div class="header-content">
      <div class="logo-container">
        <div class="bank-logo">BE</div>
      </div>
      <div class="header-text">
        <h1>Gestion des Transactions</h1>
        <p>Effectuez et gérez les opérations bancaires</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-deposit" (click)="openTransactionModal('DEPOT')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
        </svg>
        Dépôt
      </button>
      <button class="btn btn-withdraw" (click)="openTransactionModal('RETRAIT')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
          <path d="M19 13H5V11H19V13Z" fill="#ffffff"/>
        </svg>
        Retrait
      </button>
      <button class="btn btn-transfer" (click)="openTransactionModal('TRANSFERT')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
          <path d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="#ffffff"/>
        </svg>
        Virement
      </button>
    </div>
  </div>

  <div class="filters-card">
    <div class="card-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
        <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#ffffff"/>
      </svg>
      <h3>Filtres</h3>
    </div>
    <div class="filters-grid">
      <div class="form-group">
        <label for="filterCompte">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#000080"/>
          </svg>
          Compte
        </label>
        <div class="input-wrapper">
          <select id="filterCompte" name="filterCompte" [(ngModel)]="filterCompteId" (change)="loadTransactions()">
            <option value="">Tous les comptes</option>
            <option *ngFor="let compte of comptes" [value]="compte.id">{{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }}</option>
          </select>
          <div class="input-line"></div>
        </div>
      </div>
      <div class="form-group">
        <label for="dateDebut">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#000080"/>
          </svg>
          Date début
        </label>
        <div class="input-wrapper">
          <input type="date" id="dateDebut" name="dateDebut" [(ngModel)]="dateDebut" (change)="loadTransactions()" />
          <div class="input-line"></div>
        </div>
      </div>
      <div class="form-group">
        <label for="dateFin">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#000080"/>
          </svg>
          Date fin
        </label>
        <div class="input-wrapper">
          <input type="date" id="dateFin" name="dateFin" [(ngModel)]="dateFin" (change)="loadTransactions()" />
          <div class="input-line"></div>
        </div>
      </div>
      <div class="form-group">
        <label>&nbsp;</label>
        <button class="btn btn-secondary" (click)="clearFilters()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M19.79 5.61C20.3 4.95 19.83 4 19 4H6.83L7.85 2.51C8.14 2.19 8.37 1.82 8.54 1.41C8.71 1 8.79 0.57 8.79 0.14C8.79 -0.29 8.71 -0.72 8.54 -1.13C8.37 -1.54 8.14 -1.91 7.85 -2.23L6.83 -4H19C19.83 -4 20.3 -4.95 19.79 -5.61C19.28 -6.27 18.29 -6.27 17.78 -5.61L16.76 -4H5C4.17 -4 3.7 -4.95 4.21 -5.61C4.72 -6.27 5.71 -6.27 6.22 -5.61L7.24 -4H19C19.83 -4 20.3 -4.95 19.79 -5.61Z" transform="translate(2 12)" fill="#000080"/>
          </svg>
          Réinitialiser
        </button>
      </div>
    </div>
  </div>

  <div *ngIf="filterCompteId" class="releve-card">
    <div class="card-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="#ffffff"/>
      </svg>
      <h3>Générer un relevé</h3>
    </div>
    <button class="btn btn-releve" (click)="downloadReleve()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="#ffffff"/>
      </svg>
      Télécharger le relevé PDF
    </button>
  </div>

  <div *ngIf="loading" class="loading">
    <div class="loading-spinner"></div>
    <span>Chargement des transactions...</span>
  </div>
  
  <div *ngIf="!loading && transactions.length === 0" class="empty-state">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="#000080"/>
    </svg>
    <h3>Aucune transaction trouvée</h3>
    <p>Commencez par créer votre première transaction</p>
  </div>

  <div *ngIf="!loading && transactions.length > 0" class="transactions-card">
    <div class="card-header">
      <div class="card-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
          <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="#ffffff"/>
        </svg>
        <h2>Liste des transactions</h2>
        <span class="transaction-count">{{ transactions.length }} transaction(s)</span>
      </div>
    </div>
    <div class="table-container">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Compte source</th>
            <th>Compte destinataire</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of transactions">
            <td><span class="transaction-id">{{ transaction.id }}</span></td>
            <td>
              <span class="transaction-type" 
                    [class.transaction-depot]="transaction.typeTransaction === 'DEPOT'" 
                    [class.transaction-retrait]="transaction.typeTransaction === 'RETRAIT'"
                    [class.transaction-transfert]="transaction.typeTransaction === 'TRANSFERT'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 6px;">
                  <path *ngIf="transaction.typeTransaction === 'DEPOT'" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                  <path *ngIf="transaction.typeTransaction === 'RETRAIT'" d="M19 13H5V11H19V13Z" fill="currentColor"/>
                  <path *ngIf="transaction.typeTransaction === 'TRANSFERT'" d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="currentColor"/>
                </svg>
                {{ getTransactionTypeLabel(transaction.typeTransaction) }}
              </span>
            </td>
            <td><span class="transaction-amount">{{ transaction.montant | number:'1.2-2' }} F</span></td>
            <td>{{ formatDate(transaction.dateTransaction) }}</td>
            <td>
              <span class="compte-info">
                {{ transaction.compteSourceId ? getCompteClientName(transaction.compteSourceId) : '-' }}
              </span>
            </td>
            <td>
              <span class="compte-info">
                {{ transaction.compteDestinationId ? getCompteClientName(transaction.compteDestinationId) : '-' }}
              </span>
            </td>
            <td class="transaction-description">{{ transaction.description || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Transaction -->
  <div class="modal-overlay" [class.show]="showModal" (click)="closeModalOnBackdrop($event)">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
            <path *ngIf="transactionType === 'DEPOT'" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
            <path *ngIf="transactionType === 'RETRAIT'" d="M19 13H5V11H19V13Z" fill="#ffffff"/>
            <path *ngIf="transactionType === 'TRANSFERT'" d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="#ffffff"/>
          </svg>
          <h3>{{ getTransactionModalTitle() }}</h3>
        </div>
        <button class="close-btn" (click)="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#ffffff"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form (ngSubmit)="executeTransaction()" #transactionForm="ngForm">
          <div class="form-grid">
            <div class="form-group" *ngIf="transactionType !== 'TRANSFERT'">
              <label for="compteId">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#000080"/>
                </svg>
                Compte *
              </label>
              <div class="input-wrapper">
                <select id="compteId" name="compteId" [(ngModel)]="transactionData.compteId" required>
                  <option value="">Sélectionner un compte</option>
                  <option *ngFor="let compte of comptes" [value]="compte.id">
                    {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }} - Solde: {{ compte.solde | number:'1.2-2' }} F
                  </option>
                </select>
                <div class="input-line"></div>
              </div>
            </div>
            
            <div class="form-group" *ngIf="transactionType === 'TRANSFERT'">
              <label for="compteSourceId">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M15 15H3V13H15V9L20 12L15 15Z" fill="#000080"/>
                </svg>
                Compte source *
              </label>
              <div class="input-wrapper">
                <select id="compteSourceId" name="compteSourceId" [(ngModel)]="transactionData.compteSourceId" required>
                  <option value="">Sélectionner un compte</option>
                  <option *ngFor="let compte of comptes" [value]="compte.id">
                    {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }} - Solde: {{ compte.solde | number:'1.2-2' }} F
                  </option>
                </select>
                <div class="input-line"></div>
              </div>
            </div>
            
            <div class="form-group" *ngIf="transactionType === 'TRANSFERT'">
              <label for="compteDestId">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M9 9H21V11H9V15L4 12L9 9Z" fill="#000080"/>
                </svg>
                Compte destinataire *
              </label>
              <div class="input-wrapper">
                <select id="compteDestId" name="compteDestId" [(ngModel)]="transactionData.compteDestId" required>
                  <option value="">Sélectionner un compte</option>
                  <option *ngFor="let compte of comptes" [value]="compte.id">
                    {{ getClientName(compte.clientId) }} {{ getTypeLabel(compte.typeCompte) }}
                  </option>
                </select>
                <div class="input-line"></div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="montant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 14.26 7.75 14.3 8.9H16.35C16.3 7.33 15 5.9 12.7 5.49V3H10.2V5.49C7.97 5.9 6.3 7.15 6.3 8.95C6.3 11.2 8.14 12.35 11.1 13.05C13.5 13.65 14.2 14.5 14.2 15.55C14.2 16.5 13.4 17.4 11.5 17.4C9.5 17.4 8.35 16.45 8.25 15.2H6.2C6.3 17.25 7.95 18.6 10.2 19.01V21.5H12.7V19.01C14.95 18.6 16.7 17.25 16.7 15.55C16.7 12.85 14.1 11.8 11.8 10.9Z" fill="#000080"/>
                </svg>
                Montant (F) *
              </label>
              <div class="input-wrapper">
                <input type="number" id="montant" name="montant" [(ngModel)]="transactionData.montant" step="0.01" min="0.01" required 
                       placeholder="0.00" />
                <div class="input-line"></div>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label for="description">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="#000080"/>
                </svg>
                Description
              </label>
              <div class="input-wrapper">
                <textarea id="description" name="description" [(ngModel)]="transactionData.description" rows="3"
                          placeholder="Description de la transaction"></textarea>
                <div class="input-line"></div>
              </div>
            </div>
          </div>
          
          <div *ngIf="error" class="error-message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF0000"/>
            </svg>
            {{ error }}
          </div>
          
          <div *ngIf="success" class="success-message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#008000"/>
            </svg>
            {{ success }}
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">
  Annuler
</button>
<button type="submit" class="btn btn-execute" [disabled]="transactionForm.invalid">
  {{ transactionType === 'DEPOT' ? 'Déposer' : transactionType === 'RETRAIT' ? 'Retirer' : 'Transférer' }}
</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`:host {
  --color-navy: #000080;
  --color-white: #ffffff;
  --color-navy-light: rgba(0, 0, 128, 0.1);
  --color-navy-medium: rgba(0, 0, 128, 0.3);
  --color-navy-dark: #000066;
  --color-gray: #666666;
  --color-gray-light: #f5f5f7;
  --color-success: #008000;
  --color-error: #ff0000;
  --color-warning: #ff9800;
  --color-deposit: #4CAF50;
  --color-withdraw: #F44336;
  --color-transfer: #2196F3;
}

.transactions-container {
  height: 100vh;
  width: 100%;
  background-color: var(--color-gray-light);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-navy-light);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.bank-logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
}

.header-text h1 {
  margin: 0 0 0.25rem 0;
  color: var(--color-navy);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-text p {
  margin: 0;
  color: var(--color-gray);
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-deposit {
  background: linear-gradient(135deg, var(--color-deposit) 0%, #2E7D32 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.btn-deposit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-withdraw {
  background: linear-gradient(135deg, var(--color-withdraw) 0%, #C62828 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
}

.btn-withdraw:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.btn-transfer {
  background: linear-gradient(135deg, var(--color-transfer) 0%, #1565C0 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.btn-transfer:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-secondary {
  background-color: var(--color-gray-light);
  color: var(--color-navy);
  border: 1px solid var(--color-navy-medium);
}

.btn-secondary:hover {
  background-color: var(--color-navy-light);
}

.btn-releve {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
}

.btn-releve:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
}

.btn-execute {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
}

.btn-execute:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Filters Card */
.filters-card {
  background-color: var(--color-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.1);
  margin-bottom: 1.5rem;
}

.filters-card .card-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-navy-light);
}

.filters-card h3 {
  margin: 0;
  color: var(--color-white);
  font-size: 1.1rem;
  font-weight: 600;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--color-navy);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.input-wrapper {
  position: relative;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 0;
  background-color: transparent;
  border: none;
  color: var(--color-gray);
  font-size: 0.95rem;
  outline: none;
}

.form-group input::placeholder,
.form-group select::placeholder,
.form-group textarea::placeholder {
  color: #999;
  opacity: 0.7;
}

.form-group select {
  appearance: none;
  background-color: var(--color-white);
  cursor: pointer;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-navy-medium);
  transition: all 0.3s ease;
}

.form-group input:focus + .input-line,
.form-group select:focus + .input-line,
.form-group textarea:focus + .input-line {
  height: 2px;
  background-color: var(--color-navy);
}

/* Releve Card */
.releve-card {
  background-color: var(--color-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.1);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.releve-card .card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.releve-card h3 {
  margin: 0;
  color: var(--color-navy);
  font-size: 1.1rem;
  font-weight: 600;
}

/* Loading State */
.loading {
  padding: 3rem;
  text-align: center;
  color: var(--color-gray);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-navy-light);
  border-top-color: var(--color-navy);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--color-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: center;
  background-color: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.1);
}

.empty-state h3 {
  margin: 0;
  color: var(--color-navy);
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  color: var(--color-gray);
  font-size: 0.95rem;
}

/* Transactions Card */
.transactions-card {
  background-color: var(--color-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.transactions-card .card-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-navy-light);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-title h2 {
  margin: 0;
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 600;
}

.transaction-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 1200px;
}

.transactions-table thead {
  position: sticky;
  top: 0;
  background-color: var(--color-gray-light);
  z-index: 10;
}

.transactions-table th {
  padding: 1rem;
  text-align: left;
  color: var(--color-navy);
  font-weight: 600;
  border-bottom: 2px solid var(--color-navy-light);
  white-space: nowrap;
}

.transactions-table td {
  padding: 0.875rem 1rem;
  color: var(--color-gray);
  border-bottom: 1px solid var(--color-navy-light);
  vertical-align: middle;
}

.transactions-table tbody tr:hover {
  background-color: var(--color-navy-light);
}

.transaction-id {
  background-color: var(--color-navy-light);
  color: var(--color-navy);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 600;
}

.transaction-type {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
}

.transaction-depot {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-deposit);
}

.transaction-retrait {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-withdraw);
}

.transaction-transfert {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--color-transfer);
}

.transaction-amount {
  font-weight: 600;
  font-size: 0.9rem;
}

.compte-info {
  color: var(--color-navy);
  font-weight: 500;
}

.transaction-description {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background-color: var(--color-white);
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 128, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-navy-light);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title h3 {
  margin: 0;
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.error-message,
.success-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--color-error);
  border-left: 4px solid var(--color-error);
}

.success-message {
  background-color: rgba(0, 128, 0, 0.1);
  color: var(--color-success);
  border-left: 4px solid var(--color-success);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Responsive */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .transactions-table {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .transactions-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .releve-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }
}

@media (max-width: 480px) {
  .header-text h1 {
    font-size: 1.5rem;
  }
  
  .bank-logo {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-title h3 {
    font-size: 1.1rem;
  }
}
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  clients: Client[] = [];
  loading = true;
  showModal = false;
  transactionType: 'DEPOT' | 'RETRAIT' | 'TRANSFERT' = 'DEPOT'; // Changé de VIREMENT à TRANSFERT
  transactionData: any = {
    compteId: null,
    compteSourceId: null,
    compteDestId: null,
    montant: null,
    description: ''
  };
  filterCompteId: number | null = null;
  dateDebut = '';
  dateFin = '';
  error = '';
  success = '';

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
    this.loadClients();
    this.loadTransactions();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
      }
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      }
    });
  }

  loadTransactions(): void {
    this.loading = true;
    if (this.filterCompteId) {
      this.transactionService.getTransactionsByCompte(
        this.filterCompteId,
        this.dateDebut || undefined,
        this.dateFin || undefined
      ).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.transactionService.getAllTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  clearFilters(): void {
    this.filterCompteId = null;
    this.dateDebut = '';
    this.dateFin = '';
    this.loadTransactions();
  }

  openTransactionModal(type: 'DEPOT' | 'RETRAIT' | 'TRANSFERT'): void { // Changé ici aussi
    this.transactionType = type;
    this.transactionData = {
      compteId: null,
      compteSourceId: null,
      compteDestId: null,
      montant: null,
      description: ''
    };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeModalOnBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  getTransactionModalTitle(): string {
    const titles: { [key: string]: string } = {
      'DEPOT': 'Effectuer un dépôt',
      'RETRAIT': 'Effectuer un retrait',
      'TRANSFERT': 'Effectuer un virement' // Changé ici aussi
    };
    return titles[this.transactionType] || 'Transaction';
  }

  executeTransaction(): void {
    this.error = '';
    this.success = '';

    if (this.transactionType === 'DEPOT') {
      this.transactionService.effectuerDepot(
        this.transactionData.compteId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Dépôt effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du dépôt';
          this.error = errorMessage;
          console.error('Erreur dépôt:', err);
        }
      });
    } else if (this.transactionType === 'RETRAIT') {
      this.transactionService.effectuerRetrait(
        this.transactionData.compteId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Retrait effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du retrait';
          this.error = errorMessage;
          console.error('Erreur retrait:', err);
        }
      });
    } else if (this.transactionType === 'TRANSFERT') { // Changé ici aussi
      this.transactionService.effectuerVirement(
        this.transactionData.compteSourceId,
        this.transactionData.compteDestId,
        this.transactionData.montant,
        this.transactionData.description
      ).subscribe({
        next: () => {
          this.success = 'Virement effectué avec succès';
          this.loadTransactions();
          this.loadComptes();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          const errorMessage = err.error?.message || err.error?.error?.message || err.message || 'Erreur lors du virement';
          this.error = errorMessage;
          console.error('Erreur virement:', err);
        }
      });
    }
  }

  downloadReleve(): void {
    if (!this.filterCompteId) {
      alert('Veuillez sélectionner un compte');
      return;
    }

    this.transactionService.downloadReleve(
      this.filterCompteId,
      this.dateDebut || undefined,
      this.dateFin || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_compte_${this.filterCompteId}_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors du téléchargement du relevé');
      }
    });
  }

  getTransactionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'TRANSFERT': 'Virement' // Changé ici aussi
    };
    return labels[type] || type;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getClientName(clientId?: number): string {
    if (!clientId) return 'Client inconnu';
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  }

  getTypeLabel(type: string): string {
    if (type === 'COURANT') return 'Courant';
    if (type === 'EPARGNE') return 'Épargne';
    return type;
  }

  getCompteClientName(compteId: number): string {
    const compte = this.comptes.find(c => c.id === compteId);
    if (!compte) return 'Inconnu';
    return this.getClientName(compte.clientId);
  }
}