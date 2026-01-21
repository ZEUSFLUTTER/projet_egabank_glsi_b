import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService, OperationDTO, VirementDTO } from '../../../services/compte.service';
import { Compte } from '../../../services/compte.service';

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>Opérations Bancaires</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Dépôt -->
        <div class="card">
          <h3>Dépôt</h3>
          <form (ngSubmit)="effectuerDepot()">
            <div class="form-group">
              <label>Compte</label>
              <select [(ngModel)]="depot.numeroCompte" name="depotCompte" required>
                <option value="">Sélectionner...</option>
                <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                  {{ compte.numeroCompte }} - {{ compte.proprietaire?.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Montant</label>
              <input type="number" [(ngModel)]="depot.montant" name="depotMontant" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Libellé</label>
              <input type="text" [(ngModel)]="depot.libelle" name="depotLibelle" required>
            </div>
            <button type="submit" class="btn btn-success">Effectuer le dépôt</button>
          </form>
        </div>

        <!-- Retrait -->
        <div class="card">
          <h3>Retrait</h3>
          <form (ngSubmit)="effectuerRetrait()">
            <div class="form-group">
              <label>Compte</label>
              <select [(ngModel)]="retrait.numeroCompte" name="retraitCompte" required>
                <option value="">Sélectionner...</option>
                <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                  {{ compte.numeroCompte }} - {{ compte.proprietaire?.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Montant</label>
              <input type="number" [(ngModel)]="retrait.montant" name="retraitMontant" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Libellé</label>
              <input type="text" [(ngModel)]="retrait.libelle" name="retraitLibelle" required>
            </div>
            <button type="submit" class="btn btn-danger">Effectuer le retrait</button>
          </form>
        </div>

        <!-- Virement -->
        <div class="card" style="grid-column: 1 / -1;">
          <h3>Virement</h3>
          <form (ngSubmit)="effectuerVirement()">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px;">
              <div class="form-group">
                <label>Compte source</label>
                <select [(ngModel)]="virement.numeroCompteSource" name="virementSource" required>
                  <option value="">Sélectionner...</option>
                  <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                    {{ compte.numeroCompte }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Compte destination</label>
                <select [(ngModel)]="virement.numeroCompteDestination" name="virementDestination" required>
                  <option value="">Sélectionner...</option>
                  <option *ngFor="let compte of comptes" [value]="compte.numeroCompte">
                    {{ compte.numeroCompte }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Montant</label>
                <input type="number" [(ngModel)]="virement.montant" name="virementMontant" min="0.01" step="0.01" required>
              </div>
              <div class="form-group">
                <label>Libellé</label>
                <input type="text" [(ngModel)]="virement.libelle" name="virementLibelle" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Effectuer le virement</button>
          </form>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-error" style="margin-top: 20px;">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success" style="margin-top: 20px;">{{ success }}</div>
    </div>
  `,
  styles: []
})
export class OperationComponent implements OnInit {
  comptes: Compte[] = [];
  depot: OperationDTO = { numeroCompte: '', montant: 0, libelle: '' };
  retrait: OperationDTO = { numeroCompte: '', montant: 0, libelle: '' };
  virement: VirementDTO = {
    numeroCompteSource: '',
    numeroCompteDestination: '',
    montant: 0,
    libelle: ''
  };
  error = '';
  success = '';

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes', err);
      }
    });
  }

  effectuerDepot(): void {
    this.error = '';
    this.success = '';
    this.compteService.depot(this.depot).subscribe({
      next: () => {
        this.success = 'Dépôt effectué avec succès';
        this.depot = { numeroCompte: '', montant: 0, libelle: '' };
        this.loadComptes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du dépôt';
        console.error(err);
      }
    });
  }

  effectuerRetrait(): void {
    this.error = '';
    this.success = '';
    this.compteService.retrait(this.retrait).subscribe({
      next: () => {
        this.success = 'Retrait effectué avec succès';
        this.retrait = { numeroCompte: '', montant: 0, libelle: '' };
        this.loadComptes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du retrait';
        console.error(err);
      }
    });
  }

  effectuerVirement(): void {
    this.error = '';
    this.success = '';
    this.compteService.virement(this.virement).subscribe({
      next: () => {
        this.success = 'Virement effectué avec succès';
        this.virement = {
          numeroCompteSource: '',
          numeroCompteDestination: '',
          montant: 0,
          libelle: ''
        };
        this.loadComptes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du virement';
        console.error(err);
      }
    });
  }
}
