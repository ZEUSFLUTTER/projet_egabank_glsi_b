import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../shared/services/client.service';
import { Client } from '../../../shared/models/bank.models';
import { Observable, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gestion des Clients</h2>
      <button class="btn btn-primary" [routerLink]="['/admin/clients/nouveau']">
        <i class="bi bi-person-plus me-2"></i>Nouveau Client
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" 
                 placeholder="Rechercher par nom, prénom ou email..." 
                 [(ngModel)]="searchTerm" 
                 (input)="onSearch()">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Nationalité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients$ | async">
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-sm bg-primary-subtle text-primary rounded-circle p-2 me-3">
                    {{ client.prenom[0] }}{{ client.nom[0] }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ client.prenom }} {{ client.nom }}</div>
                    <small class="text-muted">Inscrit le {{ client.dateInscription | date:'dd/MM/yyyy' }}</small>
                  </div>
                </div>
              </td>
              <td>
                <div>{{ client.email }}</div>
                <small class="text-muted">{{ client.telephone }}</small>
              </td>
              <td>{{ client.nationalite }}</td>
              <td>
                <span class="badge" [ngClass]="client.statut === 'Actif' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                  {{ client.statut }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-light" [routerLink]="['/admin/clients', client.id]">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-primary" [routerLink]="['/admin/clients/modifier', client.id]">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" (click)="deleteClient(client)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .avatar-sm { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .bg-primary-subtle { background-color: #e0f2f1; }
    .bg-success-subtle { background-color: #e8f5e9; }
    .bg-danger-subtle { background-color: #ffebee; }
  `]
})
export class ClientListComponent implements OnInit {
  clients$: Observable<Client[]> | undefined;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.clients$ = this.clientService.getClients();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.clients$ = this.clientService.searchClients(term);
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  deleteClient(client: Client) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?`)) {
      this.clientService.deleteClient(client.id).subscribe(() => {
        this.clients$ = this.clientService.getClients();
      });
    }
  }
}
