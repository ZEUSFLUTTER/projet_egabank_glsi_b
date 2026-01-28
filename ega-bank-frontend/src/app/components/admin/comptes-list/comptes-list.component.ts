import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Client, CompteAdmin } from '../../../models/models';

@Component({
  selector: 'app-comptes-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Tous les Comptes</h1>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Numéro de compte</th>
              <th>Type</th>
              <th>Propriétaire</th>
              <th>Solde</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let compte of comptes">
              <td>{{ compte.numeroCompte }}</td>
              <td><span class="badge" [class.badge-primary]="compte.type === 'COURANT'" [class.badge-success]="compte.type === 'EPARGNE'">{{ compte.type }}</span></td>
              <td>{{ compte.proprietaire?.prenom }} {{ compte.proprietaire?.nom }}</td>
              <td>{{ compte.solde | number:'1.2-2' }} FCFA</td>
              <td>{{ compte.dateCreation }}</td>
              <td>
                <div class="client-actions-row">
                  <button class="btn btn-sm btn-outline" title="Voir les détails du compte">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Détails
                  </button>
                  <button class="btn btn-sm btn-success" title="Effectuer une opération">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Opération
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ComptesListComponent implements OnInit {
  comptes: CompteAdmin[] = [];
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadAllComptes();
  }
  loadAllComptes(): void {
    this.adminService.listClients().subscribe(clients => {
      clients.forEach(client => {
        if (client.id) {
          this.adminService.getComptesByClient(client.id).subscribe(comptes => {
            comptes.forEach(compte => {
              (compte as CompteAdmin).proprietaire = client;
              this.comptes.push(compte as CompteAdmin);
            });
          });
        }
      });
    });
  }
}
