import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { Compte } from '../../../models/compte.model';
import { ClientAuthService } from '../../../services/client-auth.service';

@Component({
  selector: 'app-comptes-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && comptes.length === 0" class="empty-state">
        <p>Aucun compte trouvé</p>
      </div>

      <table *ngIf="!loading && comptes.length > 0" class="comptes-table">
        <thead>
          <tr>
            <th>Type de compte</th>
            <th>Numéro de compte</th>
            <th>Solde</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let compte of comptes">
            <td>{{ getTypeCompteLabel(compte.typeCompte) }}</td>
            <td>{{ compte.numCompte }}</td>
            <td>{{ compte.solde | number:'1.2-2' }} F</td>
            <td>{{ formatDate(compte.dateCreation) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: #ffffff;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 2px solid #000000;
      padding-bottom: 1rem;
    }

    .header h1 {
      margin: 0;
      color: #000000;
      font-size: 2rem;
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .comptes-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .comptes-table th {
      background-color: #000000;
      color: #ffffff;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }

    .comptes-table td {
      padding: 1rem;
      border-bottom: 1px solid #000000;
    }

    .comptes-table tr:hover {
      background-color: #f5f5f5;
    }

    .loading, .empty-state {
      padding: 2rem;
      text-align: center;
      color: #808080;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid #000000;
      background-color: #ffffff;
      color: #000000;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn:hover {
      background-color: #000000;
      color: #ffffff;
    }
  `]
})
export class ComptesClientComponent implements OnInit {
  comptes: Compte[] = [];
  loading = true;

  constructor(
    private dashboardService: ClientDashboardService,
    private clientAuthService: ClientAuthService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.loading = true;
    this.dashboardService.getComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        this.loading = false;
      }
    });
  }

  getTypeCompteLabel(type: string): string {
    return type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
