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
    <div class="container">
      <div class="page-header">
        <h1>Gestion des Comptes</h1>
        <button class="btn btn-primary" (click)="openModal()">+ Nouveau Compte</button>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && comptes.length === 0" class="empty-state">
        <p>Aucun compte trouvé</p>
        <button class="btn btn-primary" (click)="openModal()">Créer le premier compte</button>
      </div>

      <div *ngIf="!loading && comptes.length > 0" class="card">
        <table class="table">
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
              <td>{{ getClientName(compte.clientId) }}</td>
              <td>{{ compte.numCompte }}</td>
              <td>{{ compte.solde | number:'1.2-2' }} Fcfa</td>
              <td>{{ compte.typeCompte }}</td>
              <td>{{ formatDate(compte.dateCreation) }}</td>
              <td>
                <button class="btn btn-secondary" (click)="editCompte(compte)" title="Modifier"><i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button class="btn btn-danger" (click)="deleteCompte(compte.id!)" title="Supprimer"> Supprimer
                </button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal" [class.show]="showModal" (click)="closeModalOnBackdrop($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingCompte ? 'Modifier le compte' : 'Nouveau compte' }}</h3>
            <button class="close" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveCompte()" #compteForm="ngForm">
            <div class="form-group">
              <label for="clientId">Client *</label>
              <select id="clientId" name="clientId" [(ngModel)]="currentCompte.clientId" required>
                <option value="">Sélectionner un client</option>
                <option *ngFor="let client of clients" [value]="client.id">{{ client.prenom }} {{ client.nom }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="typeCompte">Type de compte *</label>
              <select id="typeCompte" name="typeCompte" [(ngModel)]="currentCompte.typeCompte" required>
                <option value="">Sélectionner un type</option>
                <option value="COURANT">Compte Courant</option>
                <option value="EPARGNE">Compte Épargne</option>
              </select>
            </div>
            <div *ngIf="error" class="error-message">{{ error }}</div>
            <div *ngIf="success" class="success-message">{{ success }}</div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      margin: 0;
      color: var(--color-black);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .table {
      font-size: 14px;
    }

    .table td {
      font-size: 13px;
    }

    .table .btn {
      padding: 5px 10px;
      font-size: 12px;
      margin-right: 5px;
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
    clientId: 0
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

  openModal(): void {
    this.editingCompte = null;
    this.currentCompte = {
      typeCompte: 'COURANT',
      clientId: 0
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
    if ((event.target as HTMLElement).classList.contains('modal')) {
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
      // Définir le solde initial selon le type de compte pour la création
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
