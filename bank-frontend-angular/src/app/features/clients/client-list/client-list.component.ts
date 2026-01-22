import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="client-list-container">
      <div class="header">
        <h1>Gestion des Clients</h1>
        <button mat-raised-button color="primary" (click)="navigateToNewClient()">
          <mat-icon>person_add</mat-icon>
          Nouveau Client
        </button>
      </div>

      <mat-card *ngIf="!isLoading; else loadingTemplate">
        <mat-card-content>
          <div class="table-container" *ngIf="clients.length > 0; else noDataTemplate">
            <table mat-table [dataSource]="clients" class="clients-table">
              <!-- Colonne Nom -->
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let client">{{ client.nom }}</td>
              </ng-container>

              <!-- Colonne Prénom -->
              <ng-container matColumnDef="prenom">
                <th mat-header-cell *matHeaderCellDef>Prénom</th>
                <td mat-cell *matCellDef="let client">{{ client.prenom }}</td>
              </ng-container>

              <!-- Colonne Email -->
              <ng-container matColumnDef="courriel">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let client">{{ client.courriel }}</td>
              </ng-container>

              <!-- Colonne Téléphone -->
              <ng-container matColumnDef="numeroTelephone">
                <th mat-header-cell *matHeaderCellDef>Téléphone</th>
                <td mat-cell *matCellDef="let client">{{ client.numeroTelephone }}</td>
              </ng-container>

              <!-- Colonne Nationalité -->
              <ng-container matColumnDef="nationalite">
                <th mat-header-cell *matHeaderCellDef>Nationalité</th>
                <td mat-cell *matCellDef="let client">{{ client.nationalite }}</td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let client">
                  <button mat-icon-button color="primary" 
                          (click)="viewClient(client.id)"
                          matTooltip="Voir détails">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" 
                          (click)="editClient(client.id)"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" 
                          (click)="deleteClient(client)"
                          matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <ng-template #noDataTemplate>
            <div class="no-data">
              <mat-icon>people_outline</mat-icon>
              <h3>Aucun client trouvé</h3>
              <p>Commencez par ajouter votre premier client</p>
              <button mat-raised-button color="primary" (click)="navigateToNewClient()">
                <mat-icon>person_add</mat-icon>
                Ajouter un client
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Chargement des clients...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .client-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-container {
      overflow-x: auto;
    }

    .clients-table {
      width: 100%;
    }

    .clients-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .clients-table td, .clients-table th {
      padding: 12px 8px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    .no-data {
      text-align: center;
      padding: 50px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
      color: #ccc;
    }

    .no-data h3 {
      margin: 0 0 10px 0;
    }

    .no-data p {
      margin-bottom: 20px;
    }

    .no-data button {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }

    mat-card {
      margin-top: 20px;
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'courriel', 'numeroTelephone', 'nationalite', 'actions'];
  isLoading = true;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  navigateToNewClient() {
    this.router.navigate(['/clients/new']);
  }

  viewClient(clientId: number) {
    this.router.navigate(['/clients', clientId]);
  }

  editClient(clientId: number) {
    this.router.navigate(['/clients', clientId, 'edit']);
  }

  deleteClient(client: Client) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadClients(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.snackBar.open('Erreur lors de la suppression du client', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}