import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientBankService } from '../../../shared/services/client-bank.service';
import { Compte } from '../../../shared/models/bank.models';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-client-comptes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 text-dark">
        <h2 class="fw-bold">Mes Comptes Bancaires</h2>
        <button class="btn btn-primary" routerLink="/client/virement">Virement</button>
      </div>

      <div class="card border-0 shadow-sm text-dark">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4">Compte</th>
                <th>Type</th>
                <th>Devise</th>
                <th class="text-end">Solde</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let acc of accounts$ | async" [routerLink]="['/client/comptes', acc.id]" style="cursor: pointer;">
                <td class="ps-4">
                  <div class="fw-bold">{{ acc.numeroCompte }}</div>
                  <small class="text-muted">ID: {{ acc.id }}</small>
                </td>
                <td>
                  <span class="badge rounded-pill" [ngClass]="acc.type === 'COURANT' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'">
                    {{ acc.type }}
                  </span>
                </td>
                <td>{{ acc.devise }}</td>
                <td class="text-end fw-bold fs-5">
                  {{ acc.solde | currency: acc.devise }}
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-light">Détails</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bg-primary-subtle { background-color: #e3f2fd; }
    .bg-success-subtle { background-color: #e8f5e9; }
  `]
})
export class ClientComptesListComponent implements OnInit {
    accounts$: Observable<Compte[]>;

    constructor(private clientBankService: ClientBankService) {
        this.accounts$ = this.clientBankService.getAccounts();
    }

    ngOnInit(): void { }
}
