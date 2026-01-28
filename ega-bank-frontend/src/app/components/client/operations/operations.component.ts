import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../../services/compte.service';
import { OperationRequest, TypeOperation, Compte } from '../../../models/models';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px; max-width: 800px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Effectuer une opération</h1>
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div class="form-group">
            <label class="form-label">Type d'opération</label>
            <select [(ngModel)]="operation.type" name="type" class="form-select" required>
              <option value="">Sélectionner</option>
              <option [value]="TypeOperation.DEPOT">Dépôt</option>
              <option [value]="TypeOperation.RETRAIT">Retrait</option>
              <option [value]="TypeOperation.VIREMENT">Virement</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Compte source</label>
            <select [(ngModel)]="operation.numeroCompteSource" name="source" class="form-select" required>
              <option value="">Sélectionner un compte</option>
              <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">{{ compte.numeroCompte }} - {{ compte.type }} ({{ compte.solde | number:'1.2-2' }} FCFA)</option>
            </select>
          </div>
          <div class="form-group" *ngIf="operation.type === TypeOperation.VIREMENT">
            <label class="form-label">Compte destination</label>
            <input type="text" [(ngModel)]="operation.numeroCompteDestination" name="destination" class="form-control" placeholder="FR76..." />
          </div>
          <div class="form-group">
            <label class="form-label">Montant (FCFA)</label>
            <input type="number" [(ngModel)]="montantNumber" name="montant" class="form-control" placeholder="0.00" min="0.01" step="0.01" required />
          </div>
          <div class="form-group">
            <label class="form-label">Description (optionnel)</label>
            <input type="text" [(ngModel)]="operation.description" name="description" class="form-control" placeholder="Ex: Loyer, Salaire..." />
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Traitement...' : 'Valider l'opération' }}</button>
        </form>
      </div>
    </div>
  `
})
export class OperationsComponent implements OnInit {
  TypeOperation = TypeOperation;
  comptes: Compte[] = [];
  montantNumber: number = 0;
  operation: OperationRequest = { type: TypeOperation.DEPOT, montant: 0, numeroCompteSource: '', numeroCompteDestination: '', description: '' };
  errorMessage = '';
  successMessage = '';
  loading = false;
  constructor(private compteService: CompteService) {}
  ngOnInit(): void {
    this.compteService.listMyComptes().subscribe(comptes => this.comptes = comptes);
  }
  onSubmit(): void {
    this.operation.montant = this.montantNumber;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.compteService.executeOperation(this.operation).subscribe({
      next: () => {
        this.successMessage = 'Opération effectuée avec succès!';
        this.loading = false;
        this.resetForm();
        this.compteService.listMyComptes().subscribe(comptes => this.comptes = comptes);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de l\'opération';
        this.loading = false;
      }
    });
  }
  resetForm(): void {
    this.montantNumber = 0;
    this.operation = { type: TypeOperation.DEPOT, montant: 0, numeroCompteSource: '', numeroCompteDestination: '', description: '' };
  }
}
