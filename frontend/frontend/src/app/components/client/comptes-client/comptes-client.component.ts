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

      <div *ngIf="!loading && comptes.length > 0" class="comptes-grid">
        <div *ngFor="let compte of comptes" class="compte-card">
          <div class="compte-header">
            <h3>{{ getTypeCompteLabel(compte.typeCompte) }}</h3>
            <span class="compte-number">{{ compte.numCompte }}</span>
          </div>
          <div class="compte-body">
            <div class="compte-info">
              <div class="info-item">
                <span class="label">Solde:</span>
                <span class="value">{{ compte.solde | number:'1.2-2' }} F</span>
              </div>
              <div class="info-item">
                <span class="label">Date de création:</span>
                <span class="value">{{ formatDate(compte.dateCreation) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      background-color: #ffffff;
      min-height: 100vh;
    }

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
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 2px solid #000080;
      padding-bottom: 1rem;
    }

    .header h1 {
      margin: 0;
      color: #000080;
      font-size: 2rem;
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .comptes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .compte-card {
      background-color: #ffffff;
      border: 1px solid #000080;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .compte-card:hover {
      transform: translateY(-2px);
      box-shadow: 4px 4px 0 #000080;
    }

    .compte-header {
      background-color: #000080;
      color: #ffffff;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .compte-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .compte-number {
      font-size: 0.875rem;
      color: #e0e0e0;
    }

    .compte-body {
      padding: 1.5rem;
    }

    .compte-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      color: #808080;
      font-weight: 500;
    }

    .value {
      color: #000080;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .loading, .empty-state {
      padding: 2rem;
      text-align: center;
      color: #808080;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid ##000080;
      background-color: #ffffff;
      color: #000080;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn:hover {
      background-color: #000080;
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
      next: (comptes: any) => {
        this.comptes = comptes;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
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
