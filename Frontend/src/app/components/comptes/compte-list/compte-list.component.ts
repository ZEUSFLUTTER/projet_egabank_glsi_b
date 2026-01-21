import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompteService, Compte } from '../../../services/compte.service';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Liste des Comptes</h2>
        <a routerLink="/comptes/new" class="btn btn-primary">Nouveau Compte</a>
      </div>

      <div *ngIf="errorMessage" style="color: red; padding: 10px; background-color: #ffe6e6; border-radius: 4px; margin-bottom: 20px;">
        {{ errorMessage }}
      </div>

      <div *ngIf="isLoading" style="text-align: center; padding: 20px;">
        Chargement en cours...
      </div>

      <table *ngIf="!isLoading">
        <thead>
          <tr>
            <th>Numéro de compte</th>
            <th>Type</th>
            <th>Solde</th>
            <th>Propriétaire</th>
            <th>Date de création</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let compte of comptes">
            <td>{{ compte.numeroCompte }}</td>
            <td>{{ compte.typeCompte }}</td>
            <td>{{ compte.solde | number:'1.2-2' }} €</td>
            <td>{{ compte.proprietaire?.nom }} {{ compte.proprietaire?.prenom }}</td>
            <td>{{ compte.dateCreation | date:'short' }}</td>
            <td>
              <span *ngIf="compte.typeCompte === 'COURANT'">
                Découvert: {{ compte.decouvertAutorise | number:'1.2-2' }} €
              </span>
              <span *ngIf="compte.typeCompte === 'EPARGNE'">
                Taux: {{ compte.tauxInteret }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!isLoading && comptes.length === 0" style="text-align: center; padding: 20px;">
        Aucun compte trouvé
      </div>
    </div>
  `,
  styles: []
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
        } else if (err.status === 403) {
          this.errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le Backend est en cours d\'exécution sur le port 8081.';
        } else {
          this.errorMessage = `Erreur lors du chargement des comptes: ${err.message}`;
        }
      }
    });
  }
}
