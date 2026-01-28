import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { CompteRequestClient, TypeCompte } from '../../../models/models';

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px; max-width: 600px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Ouvrir un nouveau compte</h1>
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div class="form-group">
            <label class="form-label">Type de compte</label>
            <select [(ngModel)]="compte.type" name="type" class="form-select" required>
              <option value="">Sélectionner un type</option>
              <option [value]="TypeCompte.COURANT">Compte Courant</option>
              <option [value]="TypeCompte.EPARGNE">Compte Épargne</option>
            </select>
            <p style="font-size: 14px; color: #6B7280; margin-top: 8px;" *ngIf="compte.type === TypeCompte.COURANT">Pour vos opérations quotidiennes</p>
            <p style="font-size: 14px; color: #6B7280; margin-top: 8px;" *ngIf="compte.type === TypeCompte.EPARGNE">Pour épargner et faire fructifier votre argent</p>
          </div>
          <div class="form-group">
            <label class="form-label">Solde initial (optionnel)</label>
            <input type="number" [(ngModel)]="compte.soldeInitial" name="soldeInitial" class="form-control" placeholder="0.00" min="0" step="0.01" />
          </div>
          <div style="display: flex; gap: 16px; margin-top: 24px;">
            <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Création...' : 'Créer le compte' }}</button>
            <button type="button" (click)="cancel()" class="btn btn-outline">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CompteFormComponent {
  TypeCompte = TypeCompte;
  compte: CompteRequestClient = { type: TypeCompte.COURANT, soldeInitial: undefined };
  errorMessage = '';
  successMessage = '';
  loading = false;
  constructor(private compteService: CompteService, private router: Router) {}
  onSubmit(): void {
    this.loading = true;
    this.compteService.createForConnectedClient(this.compte).subscribe({
      next: () => {
        this.successMessage = 'Compte créé avec succès!';
        setTimeout(() => this.router.navigate(['/client/comptes']), 1500);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création du compte';
        this.loading = false;
      }
    });
  }
  cancel(): void {
    this.router.navigate(['/client/comptes']);
  }
}
