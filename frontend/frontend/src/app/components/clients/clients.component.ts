import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clients-container">
  <div class="page-header">
    <div class="header-content">
      <div class="logo-container">
        <div class="bank-logo">BE</div>
      </div>
      <div class="header-text">
        <h1>Gestion des Clients</h1>
        <p>Créez et gérez les clients de votre banque</p>
      </div>
    </div>
    <button class="btn btn-primary" (click)="openModal()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
      </svg>
      Nouveau Client
    </button>
  </div>

  <div *ngIf="loading" class="loading">
    <div class="loading-spinner"></div>
    <span>Chargement des clients...</span>
  </div>
  
  <div *ngIf="!loading && clients.length === 0" class="empty-state">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#000080"/>
    </svg>
    <h3>Aucun client trouvé</h3>
    <p>Commencez par créer votre premier client</p>
    <button class="btn btn-primary" (click)="openModal()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#ffffff"/>
      </svg>
      Créer le premier client
    </button>
  </div>

  <div *ngIf="!loading && clients.length > 0" class="clients-card">
    <div class="card-header">
      <div class="card-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 12px;">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#ffffff"/>
        </svg>
        <h2>Liste des clients</h2>
        <span class="client-count">{{ clients.length }} client(s)</span>
      </div>
    </div>
    <div class="table-container">
      <table class="clients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Courriel</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Date de naissance</th>
            <th>Sexe</th>
            <th>Nationalité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let client of clients">
            <td><span class="client-id">{{ client.id }}</span></td>
            <td><strong>{{ client.nom }}</strong></td>
            <td>{{ client.prenom }}</td>
            <td><span class="client-email">{{ client.courriel }}</span></td>
            <td>{{ client.numTelephone }}</td>
            <td class="truncate">{{ client.adresse }}</td>
            <td>{{ formatDate(client.dateNaissance) }}</td>
            <td>
              <span class="gender-badge" [class.male]="client.sexe === 'M'" [class.female]="client.sexe === 'F'">
                {{ client.sexe === 'M' ? 'M' : 'F' }}
              </span>
            </td>
            <td>{{ client.nationalite }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-edit" (click)="editClient(client)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#ffffff"/>
                  </svg>
                </button>
                <button class="btn btn-delete" (click)="deleteClient(client.id!)">
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
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#ffffff"/>
          </svg>
          <h3>{{ editingClient ? 'Modifier le client' : 'Nouveau client' }}</h3>
        </div>
        <button class="close-btn" (click)="closeModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#ffffff"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form (ngSubmit)="saveClient()" #clientForm="ngForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="nom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#000080"/>
                </svg>
                Nom *
              </label>
              <input type="text" id="nom" name="nom" [(ngModel)]="currentClient.nom" required 
                     placeholder="Entrez le nom" />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="prenom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#000080"/>
                </svg>
                Prénom *
              </label>
              <input type="text" id="prenom" name="prenom" [(ngModel)]="currentClient.prenom" required 
                     placeholder="Entrez le prénom" />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="courriel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#000080"/>
                </svg>
                Courriel *
              </label>
              <input type="email" id="courriel" name="courriel" [(ngModel)]="currentClient.courriel" required 
                     placeholder="exemple@email.com" />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="numTelephone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#000080"/>
                </svg>
                Téléphone *
              </label>
              <input type="text" id="numTelephone" name="numTelephone" [(ngModel)]="currentClient.numTelephone" required 
                     placeholder="+XX XXX XXX XXX" />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group full-width">
              <label for="adresse">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#000080"/>
                </svg>
                Adresse *
              </label>
              <input type="text" id="adresse" name="adresse" [(ngModel)]="currentClient.adresse" required 
                     placeholder="Adresse complète" />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="dateNaissance">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#000080"/>
                </svg>
                Date de naissance *
              </label>
              <input type="date" id="dateNaissance" name="dateNaissance" [(ngModel)]="currentClient.dateNaissance" required />
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="sexe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="#000080"/>
                </svg>
                Sexe *
              </label>
              <select id="sexe" name="sexe" [(ngModel)]="currentClient.sexe" required>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
              <div class="input-line"></div>
            </div>
            
            <div class="form-group">
              <label for="nationalite">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z" fill="#000080"/>
                </svg>
                Nationalité *
              </label>
              <input type="text" id="nationalite" name="nationalite" [(ngModel)]="currentClient.nationalite" required 
                     placeholder="Nationalité" />
              <div class="input-line"></div>
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
            <button type="submit" class="btn btn-primary" [disabled]="clientForm.invalid">
              {{ editingClient ? 'Modifier' : 'Créer' }}
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
}

.clients-container {
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

/* Clients Card */
.clients-card {
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

.client-count {
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

.clients-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 1200px;
}

.clients-table thead {
  position: sticky;
  top: 0;
  background-color: var(--color-gray-light);
  z-index: 10;
}

.clients-table th {
  padding: 1rem;
  text-align: left;
  color: var(--color-navy);
  font-weight: 600;
  border-bottom: 2px solid var(--color-navy-light);
  white-space: nowrap;
}

.clients-table td {
  padding: 0.875rem 1rem;
  color: var(--color-gray);
  border-bottom: 1px solid var(--color-navy-light);
  vertical-align: middle;
}

.clients-table tbody tr:hover {
  background-color: var(--color-navy-light);
}

.client-id {
  background-color: var(--color-navy-light);
  color: var(--color-navy);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 600;
}

.client-email {
  color: var(--color-navy);
  font-weight: 500;
}

.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gender-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.gender-badge.male {
  background-color: rgba(0, 0, 128, 0.1);
  color: var(--color-navy);
}

.gender-badge.female {
  background-color: rgba(255, 0, 128, 0.1);
  color: #ff0080;
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
  max-width: 800px;
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
}

.form-group.full-width {
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

.form-group input::placeholder,
.form-group select::placeholder {
  color: #999;
  opacity: 0.7;
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
  .clients-table {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .clients-container {
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
  
  .form-grid {
    grid-template-columns: 1fr;
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
}
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  showModal = false;
  editingClient: Client | null = null;
  currentClient: Client = {
    nom: '',
    prenom: '',
    courriel: '',
    numTelephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: '',
    nationalite: ''
  };
  error = '';
  success = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.editingClient = null;
    this.currentClient = {
      nom: '',
      prenom: '',
      courriel: '',
      numTelephone: '',
      adresse: '',
      dateNaissance: '',
      sexe: '',
      nationalite: ''
    };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  editClient(client: Client): void {
    this.editingClient = client;
    this.currentClient = { ...client };
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingClient = null;
  }

  closeModalOnBackdrop(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  saveClient(): void {
    this.error = '';
    this.success = '';

    if (this.editingClient) {
      this.clientService.updateClient(this.editingClient.id!, this.currentClient).subscribe({
        next: () => {
          this.success = 'Client modifié avec succès';
          this.loadClients();
          setTimeout(() => {
            this.closeModal();
          }, 15000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.clientService.createClient(this.currentClient).subscribe({
        next: (createdClient) => {
          if (createdClient.password) {
            this.success = `Client créé avec succès. Mot de passe généré: ${createdClient.password}`;
          } else {
            this.success = 'Client créé avec succès';
          }
          this.loadClients();
          setTimeout(() => {
            this.closeModal();
          }, 5000); // Augmenter le délai pour permettre de voir le mot de passe
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          alert(err.error?.message || 'Erreur lors de la suppression');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}

