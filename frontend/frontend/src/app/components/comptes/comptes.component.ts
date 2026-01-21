import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate as ngFormatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { Compte } from '../../models/compte.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
   <div class="comptes-container">
  <div class="page-header">
    <div class="header-content">
      <div class="logo-container">
        <div class="bank-logo">BE</div>
      </div>
      <div class="header-text">
        <h1>Gestion des Comptes</h1>
        <p>Créez et gérez les comptes bancaires</p>
      </div>
    </div>
    <button class="btn btn-primary" (click)="openModal()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
      </svg>
      Nouveau Compte
    </button>
  </div>

  <div *ngIf="loading" class="loading">
    <div class="loading-spinner"></div>
    <span>Chargement des comptes...</span>
  </div>
  
  <div *ngIf="!loading && comptes.length === 0" class="empty-state">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#000080"/>
    </svg>
    <h3>Aucun compte trouvé</h3>
    <p>Commencez par créer votre premier compte</p>
    <button class="btn btn-primary" (click)="openModal()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
      </svg>
      Créer le premier compte
    </button>
  </div>

  <div *ngIf="!loading && comptes.length > 0" class="comptes-card">
    <div class="card-header">
      <div class="card-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
          <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#ffffff"/>
        </svg>
        <h2>Liste des comptes</h2>
        <span class="compte-count">{{ comptes.length }} compte(s)</span>
      </div>
      <div class="total-solde">
        <span>Solde total :</span>
        <strong>{{ getTotalSolde() | number:'1.2-2' }} Fcfa</strong>
      </div>
    </div>
    <div class="table-container">
      <table class="comptes-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Numéro de compte</th>
            <th>Solde</th>
            <th>Type</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let compte of comptes">
            <td>
              <div class="client-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#000080"/>
                </svg>
                <div>
                  <div class="client-name">{{ getClientName(compte.clientId) }}</div>
                  <div class="client-id">ID: {{ compte.clientId }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="compte-num">{{ compte.numCompte }}</span>
            </td>
            <td>
              <span class="solde-amount" [class.positive]="(compte.solde ?? 0) >= 0" 
                    [class.negative]="(compte.solde ?? 0) < 0">
                {{ compte.solde | number:'1.2-2' }} Fcfa
              </span>
            </td>
            <td>
              <span class="compte-type" [class.compte-courant]="compte.typeCompte === 'COURANT'" 
                    [class.compte-epargne]="compte.typeCompte === 'EPARGNE'">
                {{ compte.typeCompte === 'COURANT' ? 'Courant' : 'Épargne' }}
              </span>
            </td>
            <td>{{ formatDate(compte.dateCreation) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-edit" (click)="editCompte(compte)" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#ffffff"/>
                  </svg>
                </button>
                <button class="btn btn-delete" (click)="deleteCompte(compte.id!)" title="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#ffffff"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal-overlay" [class.show]="showModal" (click)="closeModalOnBackdrop($event)">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
            <path d="M4 10V20H20V10H4ZM20 8C21.11 8 22 8.89 22 10V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V10C2 8.89 2.89 8 4 8H8L10 4H14L16 8H20Z" fill="#ffffff"/>
          </svg>
          <h3>{{ editingCompte ? 'Modifier le compte' : 'Nouveau compte' }}</h3>
        </div>
        <button class="close-btn" (click)="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#ffffff"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form (ngSubmit)="saveCompte()" #compteForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="clientId">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#000080"/>
                </svg>
                Client *
              </label>
              <select id="clientId" name="clientId" [(ngModel)]="currentCompte.clientId" required>
                <option value="">Sélectionner un client</option>
                <option *ngFor="let client of clients" [value]="client.id">
                  {{ client.prenom }} {{ client.nom }} (ID: {{ client.id }})
                </option>
              </select>
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="typeCompte">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="#000080"/>
                </svg>
                Type de compte *
              </label>
              <select id="typeCompte" name="typeCompte" [(ngModel)]="currentCompte.typeCompte" required>
                <option value="">Sélectionner un type</option>
                <option value="COURANT">Compte Courant</option>
                <option value="EPARGNE">Compte Épargne</option>
              </select>
              <div class="input-line"></div>
            </div>
            
            <div *ngIf="editingCompte" class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="#000080"/>
                </svg>
                Solde actuel
              </label>
              <div class="solde-info">
                {{ currentCompte.solde | number:'1.2-2' }} Fcfa
              </div>
            </div>
            
            <div *ngIf="!editingCompte" class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="#000080"/>
                </svg>
                Solde initial
              </label>
              <div class="solde-info">
                {{ currentCompte.typeCompte === 'EPARGNE' ? '1,000.50' : '0.00' }} Fcfa
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
            <button type="submit" class="btn btn-primary" [disabled]="compteForm.invalid">
              {{ editingCompte ? 'Modifier' : 'Créer' }}
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
  --color-positive: #008000;
  --color-negative: #ff0000;
}

.comptes-container {
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
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Comptes Card */
.comptes-card {
  background-color: var(--color-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.card-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-navy-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.compte-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.total-solde {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-white);
  font-size: 0.9rem;
}

.total-solde strong {
  font-size: 1.1rem;
  color: #ffffff;
}

/* Table */
.table-container {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.comptes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 1000px;
}

.comptes-table thead {
  position: sticky;
  top: 0;
  background-color: var(--color-gray-light);
  z-index: 10;
}

.comptes-table th {
  padding: 1rem;
  text-align: left;
  color: var(--color-navy);
  font-weight: 600;
  border-bottom: 2px solid var(--color-navy-light);
  white-space: nowrap;
}

.comptes-table td {
  padding: 0.875rem 1rem;
  color: var(--color-gray);
  border-bottom: 1px solid var(--color-navy-light);
  vertical-align: middle;
}

.comptes-table tbody tr:hover {
  background-color: var(--color-navy-light);
}

.client-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-name {
  font-weight: 600;
  color: var(--color-navy);
}

.client-id {
  font-size: 0.75rem;
  color: var(--color-gray);
}

.compte-num {
  background-color: var(--color-navy-light);
  color: var(--color-navy);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.solde-amount {
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.solde-amount.positive {
  color: var(--color-positive);
}

.solde-amount.negative {
  color: var(--color-negative);
}

.compte-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.compte-courant {
  background-color: rgba(0, 0, 128, 0.1);
  color: var(--color-navy);
}

.compte-epargne {
  background-color: rgba(0, 128, 0, 0.1);
  color: var(--color-success);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background-color: var(--color-navy);
}

.btn-edit:hover {
  background-color: var(--color-navy-dark);
  transform: translateY(-1px);
}

.btn-delete {
  background-color: var(--color-error);
}

.btn-delete:hover {
  background-color: #cc0000;
  transform: translateY(-1px);
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
  max-width: 600px;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  position: relative;
  grid-column: 1 / -1;
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

.solde-info {
  padding: 0.75rem 0;
  color: var(--color-gray);
  font-weight: 500;
  font-family: 'Courier New', monospace;
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

.btn-secondary {
  background-color: var(--color-gray-light);
  color: var(--color-navy);
  border: 1px solid var(--color-navy-medium);
}

.btn-secondary:hover {
  background-color: var(--color-navy-light);
}

/* Responsive */
@media (max-width: 1200px) {
  .comptes-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .comptes-container {
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
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .total-solde {
    align-self: flex-start;
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
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-title h3 {
    font-size: 1.1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class ComptesComponent implements OnInit {
  comptes: Compte[] = [];
  clients: Client[] = [];
  loading = true;
  showModal = false;
  editingCompte: Compte | null = null;
  currentCompte: Compte = {
    typeCompte: 'COURANT',
    clientId: 0,
    numCompte: undefined,
    dateCreation: undefined,
    solde: undefined
  };
  error = '';
  success = '';

  constructor(
    private compteService: CompteService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.loadComptes();
    this.loadClients();
  }

  loadComptes(): void {
    this.loading = true;
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
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

  getTotalSolde(): number {
    return this.comptes.reduce((total, compte) => total + (compte.solde ?? 0), 0);
  }

  openModal(): void {
    this.editingCompte = null;
    this.currentCompte = {
      typeCompte: 'COURANT',
      clientId: 0,
      numCompte: undefined,
      dateCreation: undefined,
      solde: undefined
    };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  editCompte(compte: Compte): void {
    this.editingCompte = compte;
    this.currentCompte = { ...compte };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCompte = null;
  }

  closeModalOnBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  saveCompte(): void {
    this.error = '';
    this.success = '';

    if (this.editingCompte) {
      this.compteService.updateCompte(this.editingCompte.id!, this.currentCompte).subscribe({
        next: () => {
          this.success = 'Compte modifié avec succès';
          this.loadComptes();
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || JSON.stringify(err.error) || 'Erreur lors de la modification';
        }
      });
    } else {
      if (this.currentCompte.typeCompte === 'EPARGNE') {
        this.currentCompte.solde = 1000.50;
      } else if (this.currentCompte.typeCompte === 'COURANT') {
        this.currentCompte.solde = 0;
      }

      this.compteService.createCompte(this.currentCompte).subscribe({
        next: () => {
          this.success = 'Compte créé avec succès';
          this.loadComptes();
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || JSON.stringify(err.error) || 'Erreur lors de la création';
        }
      });
    }
  }

  deleteCompte(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.deleteCompte(id).subscribe({
        next: () => this.loadComptes(),
        error: (err) => alert(err.error?.message || JSON.stringify(err.error) || 'Erreur lors de la suppression')
      });
    }
  }

  formatDate(date?: string | Date): string {
    if (!date) return '';
    return ngFormatDate(date, 'dd/MM/yyyy', 'fr-FR');
  }

  getClientName(clientId?: number): string {
    if (!clientId) return 'Client inconnu';
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  }
}