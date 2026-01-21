import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { Transaction } from '../../../models/transaction.model';
import { Compte } from '../../../models/compte.model';
import { ClientAuthService } from '../../../services/client-auth.service';

@Component({
  selector: 'app-transactions-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="transactions-container">
      <!-- En-tête de page -->
      <div class="page-header">
        <div class="header-content">
          <div class="logo-container">
            <div class="bank-logo">BE</div>
          </div>
          <div class="header-text">
            <h1>Transactions</h1>
            <p>Gérez vos retraits, virements et consultez votre historique</p>
          </div>
        </div>
        <button class="btn btn-secondary" (click)="downloadHistory()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="currentColor"/>
          </svg>
          Télécharger l'historique
        </button>
      </div>

      <!-- Section Actions -->
      <div class="actions-section">
        <!-- Carte Retrait -->
        <div class="action-card">
          <div class="card-header">
            <div class="card-icon withdraw-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 13H5V11H19V13Z" fill="#ffffff"/>
              </svg>
            </div>
            <h3>Effectuer un retrait</h3>
          </div>
          <form (ngSubmit)="effectuerRetrait()" #retraitForm="ngForm">
            <div class="form-group">
              <label for="retraitCompte">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="var(--color-navy)"/>
                </svg>
                Compte
              </label>
              <select id="retraitCompte" [(ngModel)]="retraitFormData.compteId" name="compteId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
              <div class="input-line"></div>
            </div>
            <div class="form-group">
              <label for="retraitMontant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 14.26 7.75 14.3 8.9H16.35C16.3 7.33 15 5.9 12.7 5.49V3H10.2V5.49C7.97 5.9 6.3 7.15 6.3 8.95C6.3 11.2 8.14 12.35 11.1 13.05C13.5 13.65 14.2 14.5 14.2 15.55C14.2 16.5 13.4 17.4 11.5 17.4C9.5 17.4 8.35 16.45 8.25 15.2H6.2C6.3 17.25 7.95 18.6 10.2 19.01V21.5H12.7V19.01C14.95 18.6 16.7 17.25 16.7 15.55C16.7 12.85 14.1 11.8 11.8 10.9Z" fill="var(--color-navy)"/>
                </svg>
                Montant
              </label>
              <input id="retraitMontant" type="number" [(ngModel)]="retraitFormData.montant" name="montant" required min="0.01" step="0.01" placeholder="0.00" />
              <div class="input-line"></div>
            </div>
            <div class="form-group">
              <label for="retraitDescription">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="var(--color-navy)"/>
                </svg>
                Description (optionnel)
              </label>
              <input id="retraitDescription" type="text" [(ngModel)]="retraitFormData.description" name="description" placeholder="Description de la transaction" />
              <div class="input-line"></div>
            </div>
            
            <div *ngIf="retraitError" class="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF0000"/>
              </svg>
              {{ retraitError }}
            </div>
            <div *ngIf="retraitSuccess" class="success-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#008000"/>
              </svg>
              {{ retraitSuccess }}
            </div>
            
            <button type="submit" class="btn btn-primary" [disabled]="loadingRetrait || retraitForm.invalid">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M19 13H5V11H19V13Z" fill="#ffffff"/>
              </svg>
              {{ loadingRetrait ? 'Traitement...' : 'Retirer' }}
            </button>
          </form>
        </div>

        <!-- Carte Virement -->
        <div class="action-card">
          <div class="card-header">
            <div class="card-icon transfer-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="#ffffff"/>
              </svg>
            </div>
            <h3>Effectuer un virement</h3>
          </div>
          <form (ngSubmit)="effectuerVirement()" #virementForm="ngForm">
            <div class="form-group">
              <label for="virementSource">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="var(--color-navy)"/>
                </svg>
                Compte source
              </label>
              <select id="virementSource" [(ngModel)]="virementFormData.compteSourceId" name="compteSourceId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
              <div class="input-line"></div>
            </div>
            <div class="form-group">
              <label for="virementDestination">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="var(--color-navy)"/>
                </svg>
                Compte destination
              </label>
              <select id="virementDestination" [(ngModel)]="virementFormData.compteDestinationId" name="compteDestinationId" required>
                <option value="">Sélectionner un compte</option>
                <option *ngFor="let compte of comptes" [value]="compte.id">
                  {{ getTypeCompteLabel(compte.typeCompte) }} - {{ compte.numCompte }} ({{ compte.solde | number:'1.2-2' }} F)
                </option>
              </select>
              <div class="input-line"></div>
            </div>
            <div class="form-group">
              <label for="virementMontant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 14.26 7.75 14.3 8.9H16.35C16.3 7.33 15 5.9 12.7 5.49V3H10.2V5.49C7.97 5.9 6.3 7.15 6.3 8.95C6.3 11.2 8.14 12.35 11.1 13.05C13.5 13.65 14.2 14.5 14.2 15.55C14.2 16.5 13.4 17.4 11.5 17.4C9.5 17.4 8.35 16.45 8.25 15.2H6.2C6.3 17.25 7.95 18.6 10.2 19.01V21.5H12.7V19.01C14.95 18.6 16.7 17.25 16.7 15.55C16.7 12.85 14.1 11.8 11.8 10.9Z" fill="var(--color-navy)"/>
                </svg>
                Montant
              </label>
              <input id="virementMontant" type="number" [(ngModel)]="virementFormData.montant" name="montant" required min="0.01" step="0.01" placeholder="0.00" />
              <div class="input-line"></div>
            </div>
            <div class="form-group">
              <label for="virementDescription">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="var(--color-navy)"/>
                </svg>
                Description (optionnel)
              </label>
              <input id="virementDescription" type="text" [(ngModel)]="virementFormData.description" name="description" placeholder="Description de la transaction" />
              <div class="input-line"></div>
            </div>
            
            <div *ngIf="virementError" class="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF0000"/>
              </svg>
              {{ virementError }}
            </div>
            <div *ngIf="virementSuccess" class="success-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#008000"/>
              </svg>
              {{ virementSuccess }}
            </div>
            
            <button type="submit" class="btn btn-primary" [disabled]="loadingVirement || virementForm.invalid">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M15 15H3V13H15V9L20 12L15 15ZM9 9H21V11H9V15L4 12L9 9Z" fill="#ffffff"/>
              </svg>
              {{ loadingVirement ? 'Traitement...' : 'Virer' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Section Historique -->
      <div class="transactions-section">
        <div class="section-card">
          <div class="section-header">
            <div class="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
                <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="#ffffff"/>
              </svg>
              <h2>Historique des transactions</h2>
            </div>
          </div>
          
          <div class="section-body">
            <div *ngIf="loadingTransactions" class="loading-state">
              <div class="loading-spinner"></div>
              <span>Chargement des transactions...</span>
            </div>
            
            <div *ngIf="!loadingTransactions && transactions.length === 0" class="empty-state">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="var(--color-navy-light)"/>
              </svg>
              <h3>Aucune transaction</h3>
              <p>Vous n'avez effectué aucune transaction pour le moment</p>
            </div>

            <div *ngIf="!loadingTransactions && transactions.length > 0" class="table-container">
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let transaction of transactions">
                    <td>
                      <div class="date-cell">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                          <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="var(--color-gray)"/>
                        </svg>
                        {{ formatDate(transaction.dateTransaction) }}
                      </div>
                    </td>
                    <td>
                      <span class="transaction-type" 
                            [class.type-depot]="transaction.typeTransaction === 'DEPOT'"
                            [class.type-retrait]="transaction.typeTransaction === 'RETRAIT'"
                            [class.type-virement]="transaction.typeTransaction === 'TRANSFERT'">
                        {{ getTransactionTypeLabel(transaction.typeTransaction) }}
                      </span>
                    </td>
                    <td>
                      <span class="montant-cell" 
                            [class.montant-positif]="transaction.typeTransaction === 'DEPOT'"
                            [class.montant-negatif]="transaction.typeTransaction === 'RETRAIT' || transaction.typeTransaction === 'TRANSFERT'">
                        {{ transaction.montant | number:'1.2-2' }} F
                      </span>
                    </td>
                    <td class="description-cell">{{ transaction.description || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --color-navy: #000080;
      --color-white: #ffffff;
      --color-navy-light: rgba(0, 0, 128, 0.1);
      --color-navy-medium: rgba(0, 0, 128, 0.3);
      --color-navy-dark: #000066;
      --color-gray: #666666;
      --color-gray-light: #f5f5f7;
      --color-success: #008000;
      --color-error: #ff0000;
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
      overflow: auto;
    }

    /* En-tête de page */
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

    /* Boutons */
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

    .btn-primary {
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      color: var(--color-white);
      box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: var(--color-white);
      color: var(--color-navy);
      border: 1px solid var(--color-navy-medium);
    }

    .btn-secondary:hover {
      background-color: var(--color-navy-light);
    }

    /* Section Actions */
    .actions-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .action-card {
      background-color: var(--color-white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
    }

    .card-header {
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .withdraw-icon {
      background-color: var(--color-withdraw);
    }

    .transfer-icon {
      background-color: var(--color-transfer);
    }

    .card-header h3 {
      margin: 0;
      color: var(--color-white);
      font-size: 1.25rem;
      font-weight: 600;
    }

    form {
      padding: 1.5rem;
    }

    .form-group {
      position: relative;
      margin-bottom: 1.5rem;
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

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem 0;
      background-color: transparent;
      border: none;
      color: var(--color-gray);
      font-size: 0.95rem;
      outline: none;
    }

    .form-group select {
      appearance: none;
      background-color: var(--color-white);
      cursor: pointer;
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
    .form-group select:focus + .input-line {
      height: 2px;
      background-color: var(--color-navy);
    }

    /* Messages */
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

    /* Section Transactions */
    .transactions-section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .section-card {
      background-color: var(--color-white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .section-header {
      background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
      padding: 1rem 1.5rem;
    }

    .section-title {
      display: flex;
      align-items: center;
    }

    .section-title h2 {
      margin: 0;
      color: var(--color-white);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .section-body {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* États de chargement et vide */
    .loading-state {
      padding: 3rem 1rem;
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

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: var(--color-gray);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      flex: 1;
      justify-content: center;
    }

    .empty-state h3 {
      margin: 0;
      color: var(--color-navy);
      font-size: 1.25rem;
    }

    .empty-state p {
      margin: 0;
      color: var(--color-gray);
      font-size: 0.95rem;
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

    .date-cell {
      display: flex;
      align-items: center;
      font-size: 0.85rem;
    }

    .transaction-type {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    .type-depot {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--color-deposit);
    }

    .type-retrait {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--color-withdraw);
    }

    .type-virement {
      background-color: rgba(33, 150, 243, 0.1);
      color: var(--color-transfer);
    }

    .montant-cell {
      font-weight: 600;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }

    .montant-positif {
      color: var(--color-deposit);
    }

    .montant-negatif {
      color: var(--color-withdraw);
    }

    .description-cell {
      color: var(--color-gray);
      font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .actions-section {
        grid-template-columns: 1fr;
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

      .actions-section {
        grid-template-columns: 1fr;
      }

      .transactions-table {
        font-size: 0.8rem;
      }

      .transactions-table th,
      .transactions-table td {
        padding: 0.75rem 0.5rem;
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

      .card-header h3 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class TransactionsClientComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  loadingTransactions = true;
  loadingRetrait = false;
  loadingVirement = false;
  clientEmail: string | null = null;

  retraitFormData = {
    compteId: null as number | null,
    montant: null as number | null,
    description: ''
  };

  virementFormData = {
    compteSourceId: null as number | null,
    compteDestinationId: null as number | null,
    montant: null as number | null,
    description: ''
  };

  retraitError = '';
  retraitSuccess = '';
  virementError = '';
  virementSuccess = '';

  constructor(
    private dashboardService: ClientDashboardService,
    private clientAuthService: ClientAuthService
  ) {}

  ngOnInit(): void {
    this.clientEmail = this.clientAuthService.getCurrentClientEmail();
    this.loadComptes();
    this.loadTransactions();
  }

  loadComptes(): void {
    this.dashboardService.getComptes().subscribe({
      next: (comptes: any) => {
        this.comptes = comptes;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
      }
    });
  }

  loadTransactions(): void {
    this.loadingTransactions = true;
    this.dashboardService.getTransactions().subscribe({
      next: (transactions: any) => {
        this.transactions = transactions;
        this.loadingTransactions = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des transactions:', error);
        this.loadingTransactions = false;
      }
    });
  }

  effectuerRetrait(): void {
    if (!this.retraitFormData.compteId || !this.retraitFormData.montant) {
      this.retraitError = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loadingRetrait = true;
    this.retraitError = '';
    this.retraitSuccess = '';

    this.dashboardService.effectuerRetrait(
      this.retraitFormData.compteId,
      this.retraitFormData.montant,
      this.retraitFormData.description || undefined
    ).subscribe({
      next: (response: any) => {
        this.retraitSuccess = 'Retrait effectué avec succès';
        this.retraitFormData = { compteId: null, montant: null, description: '' };
        this.loadComptes();
        this.loadTransactions();
        this.loadingRetrait = false;
        setTimeout(() => this.retraitSuccess = '', 3000);
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || error.error?.error?.message || error.message || 'Erreur lors du retrait';
        this.retraitError = errorMessage;
        this.loadingRetrait = false;
        console.error('Erreur retrait:', error);
      }
    });
  }

  effectuerVirement(): void {
    if (!this.virementFormData.compteSourceId || !this.virementFormData.compteDestinationId || !this.virementFormData.montant) {
      this.virementError = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.virementFormData.compteSourceId === this.virementFormData.compteDestinationId) {
      this.virementError = 'Le compte source et le compte destination doivent être différents';
      return;
    }

    this.loadingVirement = true;
    this.virementError = '';
    this.virementSuccess = '';

    this.dashboardService.effectuerVirement(
      this.virementFormData.compteSourceId,
      this.virementFormData.compteDestinationId!,
      this.virementFormData.montant,
      this.virementFormData.description || undefined
    ).subscribe({
      next: (response: any) => {
        this.virementSuccess = 'Virement effectué avec succès';
        this.virementFormData = { compteSourceId: null, compteDestinationId: null, montant: null, description: '' };
        this.loadComptes();
        this.loadTransactions();
        this.loadingVirement = false;
        setTimeout(() => this.virementSuccess = '', 3000);
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || error.error?.error?.message || error.message || 'Erreur lors du virement';
        this.virementError = errorMessage;
        this.loadingVirement = false;
        console.error('Erreur virement:', error);
      }
    });
  }

  downloadHistory(): void {
    const headers = ['Date', 'Type', 'Montant', 'Description'];
    const rows = this.transactions.map(t => [
      this.formatDate(t.dateTransaction),
      this.getTransactionTypeLabel(t.typeTransaction),
      t.montant.toString(),
      t.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getTypeCompteLabel(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'TRANSFERT': return 'Virement';
      default: return type;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}