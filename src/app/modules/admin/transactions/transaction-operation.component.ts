import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompteService } from '../../../shared/services/compte.service';
import { TransactionService } from '../../../shared/services/transaction.service';
import { Compte } from '../../../shared/models/bank.models';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-transaction-operation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-4 text-dark">
      <h2 class="fw-bold">{{ isDepot ? 'Nouveau Dépôt' : 'Nouveau Retrait' }}</h2>
      <button class="btn btn-light" [routerLink]="['/admin/transactions']">Retour</button>
    </div>

    <div class="card border-0 shadow-sm col-lg-8 mx-auto">
      <div class="card-body p-4 text-dark">
        <form [formGroup]="opForm" (ngSubmit)="onSubmit()">
          <div class="mb-4 text-dark">
            <label class="form-label fw-bold">Sélectionner le Compte</label>
            <select class="form-select form-select-lg" formControlName="compteId">
              <option value="">-- Choisir un compte --</option>
              <option *ngFor="let c of comptes$ | async" [value]="c.id">
                {{ c.numeroCompte }} - {{ c.clientNom }} ({{ c.solde | currency:'EUR' }})
              </option>
            </select>
          </div>

          <div class="row g-3 text-dark">
            <div class="col-md-6">
              <label class="form-label fw-bold">Montant (EUR)</label>
              <input type="number" class="form-control form-control-lg" formControlName="montant" placeholder="0.00">
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Description / Libellé</label>
              <input type="text" class="form-control form-control-lg" formControlName="description">
            </div>
          </div>

          <div class="alert mt-4" [ngClass]="isDepot ? 'alert-success' : 'alert-danger'">
            <i class="bi" [ngClass]="isDepot ? 'bi-plus-circle' : 'bi-dash-circle'"></i>
            Cette opération va {{ isDepot ? 'créditer' : 'débiter' }} le compte sélectionné.
          </div>

          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-lg fw-bold" 
                    [ngClass]="isDepot ? 'btn-success' : 'btn-danger'"
                    [disabled]="opForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Confirmer le {{ isDepot ? 'Dépôt' : 'Retrait' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TransactionOperationComponent implements OnInit {
    opForm: FormGroup;
    comptes$: Observable<Compte[]>;
    isLoading = false;
    isDepot = true;

    constructor(
        private fb: FormBuilder,
        private compteService: CompteService,
        private transactionService: TransactionService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.comptes$ = this.compteService.getComptes();
        this.opForm = this.fb.group({
            compteId: ['', Validators.required],
            montant: [null, [Validators.required, Validators.min(0.01)]],
            description: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        const type = this.route.snapshot.data['type'];
        this.isDepot = type === 'DEPOT';
        this.opForm.patchValue({
            description: this.isDepot ? 'Dépôt espèce guichet' : 'Retrait espèce guichet'
        });
    }

    onSubmit() {
        if (this.opForm.valid) {
            const { compteId, montant, description } = this.opForm.value;
            this.isLoading = true;

            this.compteService.getCompteById(compteId).subscribe(compte => {
                if (!compte) {
                    this.isLoading = false;
                    return alert("Compte introuvable");
                }

                if (!this.isDepot && compte.solde < montant) {
                    this.isLoading = false;
                    return alert("Solde insuffisant pour ce retrait !");
                }

                const signedMontant = this.isDepot ? montant : -montant;

                this.compteService.updateSolde(compteId, signedMontant).subscribe(() => {
                    this.transactionService.createTransaction({
                        type: this.isDepot ? 'DEPOT' : 'RETRAIT',
                        montant: montant,
                        description: description,
                        [this.isDepot ? 'compteDestination' : 'compteSource']: compteId
                    }).subscribe(() => {
                        alert(`Opération de ${this.isDepot ? 'Dépôt' : 'Retrait'} effectuée avec succès !`);
                        this.router.navigate(['/admin/transactions']);
                    });
                });
            });
        }
    }
}
