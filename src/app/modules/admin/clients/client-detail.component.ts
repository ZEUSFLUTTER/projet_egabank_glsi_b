import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../shared/services/client.service';
import { CompteService } from '../../../shared/services/compte.service';
import { Client, Compte } from '../../../shared/models/bank.models';
import { Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Détails du Client</h2>
      <div>
        <button class="btn btn-light me-2" [routerLink]="['/admin/clients']">Retour</button>
        <button class="btn btn-primary" [routerLink]="['/admin/clients/modifier', clientId]">Modifier</button>
      </div>
    </div>

    <div class="row" *ngIf="data$ | async as data">
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body text-center p-4">
            <div class="avatar-lg bg-primary text-white rounded-circle mx-auto mb-3">
              {{ data.client.prenom[0] }}{{ data.client.nom[0] }}
            </div>
            <h4 class="fw-bold mb-1">{{ data.client.prenom }} {{ data.client.nom }}</h4>
            <span class="badge" [ngClass]="data.client.statut === 'Actif' ? 'bg-success' : 'bg-danger'">
              {{ data.client.statut }}
            </span>
            <hr>
            <div class="text-start">
              <p><i class="bi bi-envelope me-2"></i> {{ data.client.email }}</p>
              <p><i class="bi bi-telephone me-2"></i> {{ data.client.telephone }}</p>
              <p><i class="bi bi-geo-alt me-2"></i> {{ data.client.adresse }}</p>
              <p><i class="bi bi-calendar me-2"></i> Né le {{ data.client.dateNaissance | date:'dd/MM/yyyy' }}</p>
            </div>
            <div class="d-grid gap-2">
              <button class="btn" [ngClass]="data.client.statut === 'Actif' ? 'btn-outline-danger' : 'btn-outline-success'" (click)="toggleStatut(data.client)">
                {{ data.client.statut === 'Actif' ? 'Suspendre' : 'Réactiver' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Comptes Bancaires</h5>
            <button class="btn btn-sm btn-success" (click)="createCompte(data.client)">Créer un compte</button>
          </div>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>Numéro de compte</th>
                  <th>Type</th>
                  <th>Solde</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let compte of data.comptes">
                  <td>{{ compte.numeroCompte }}</td>
                  <td>
                    <span class="badge bg-info-subtle text-info">{{ compte.type }}</span>
                  </td>
                  <td class="fw-bold">{{ compte.solde | currency:'EUR' }}</td>
                  <td>
                    <button class="btn btn-sm btn-light" [routerLink]="['/admin/comptes', compte.id]">
                      Voir
                    </button>
                  </td>
                </tr>
                <tr *ngIf="data.comptes.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">Aucun compte pour ce client</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .avatar-lg { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; }
    .bg-info-subtle { background-color: #e0f7fa; }
  `]
})
export class ClientDetailComponent implements OnInit {
    clientId: string | null = null;
    data$: Observable<{ client: Client, comptes: Compte[] }> | undefined;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private compteService: CompteService
    ) { }

    ngOnInit(): void {
        this.clientId = this.route.snapshot.paramMap.get('id');
        if (this.clientId) {
            this.loadData();
        }
    }

    loadData() {
        this.data$ = forkJoin({
            client: this.clientService.getClientById(this.clientId!),
            comptes: this.compteService.getComptesByClientId(this.clientId!)
        }) as Observable<{ client: Client, comptes: Compte[] }>;
    }

    toggleStatut(client: Client) {
        const newStatut = client.statut === 'Actif' ? 'Suspendu' : 'Actif';
        this.clientService.updateClient(client.id, { statut: newStatut }).subscribe(() => {
            this.loadData();
        });
    }

    createCompte(client: Client) {
        const type = confirm("Créer un compte COURANT ? (OK = COURANT, Annuler = EPARGNE)") ? 'COURANT' : 'EPARGNE';
        this.compteService.createCompte(client.id, `${client.prenom} ${client.nom}`, type).subscribe(() => {
            this.loadData();
        });
    }
}
