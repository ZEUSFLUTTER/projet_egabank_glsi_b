import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { Compte } from '../../../models/models';

@Component({
  selector: 'app-mes-comptes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 700;">Mes Comptes</h1>
        <a routerLink="/client/comptes/new" class="btn btn-primary">+ Nouveau Compte</a>
      </div>
      <div class="grid grid-2" *ngIf="comptes.length > 0">
        <div *ngFor="let compte of comptes" class="card" style="position: relative;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <span class="badge" [class.badge-primary]="compte.type === 'COURANT'" [class.badge-success]="compte.type === 'EPARGNE'">{{ compte.type }}</span>
          </div>
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Numéro de compte</p>
          <p style="font-size: 16px; font-weight: 600; margin-bottom: 20px; word-break: break-all;">{{ compte.numeroCompte }}</p>
          <div style="margin-bottom: 20px;"><span style="display: block; font-size: 14px; color: #6B7280; margin-bottom: 4px;">Solde actuel</span><span style="font-size: 32px; font-weight: 700; color: var(--primary-purple);">{{ compte.solde | number:'1.2-2' }} FCFA</span></div>
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">Créé le {{ compte.dateCreation }}</p>
          <a [routerLink]="['/client/comptes', compte.numeroCompte]" class="btn btn-primary" style="width: 100%;">Voir détails</a>
        </div>
      </div>
      <div *ngIf="errorMessage" class="card text-center" style="padding: 60px; background-color: #fee; border: 1px solid #fcc;">
        <h3 style="font-size: 24px; color: #e74c3c; margin-bottom: 16px;">Erreur</h3>
        <p style="color: #c0392b; margin-bottom: 24px;">{{ errorMessage }}</p>
      </div>
      <div *ngIf="comptes.length === 0 && !errorMessage" class="card text-center" style="padding: 60px;">
        <h3 style="font-size: 24px; color: #6B7280; margin-bottom: 16px;">Aucun compte</h3>
        <p style="color: #9CA3AF; margin-bottom: 24px;">Vous n'avez pas encore de compte bancaire</p>
        <a routerLink="/client/comptes/new" class="btn btn-primary">Créer mon premier compte</a>
      </div>
    </div>
  `
})
export class MesComptesComponent implements OnInit {
  comptes: Compte[] = [];
  errorMessage: string = '';
  
  constructor(private compteService: CompteService) {}
  ngOnInit(): void {
    this.compteService.listMyComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.errorMessage = 'Erreur lors du chargement des comptes. Veuillez réessayer.';
      }
    });
  }
}
