import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientResponse } from '../models/client.model';
import { ClientService } from '../services/client.service';
import { UserService } from '../services/user.service';
import { AppStore } from '../stores/app.store';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule, RouterLink],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: ClientResponse[] = [];
  isLoading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private clientService: ClientService,
    private userService: UserService,
    private store: AppStore,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadClients();

    // S'abonner aux changements du store
    this.store.dataChanged$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      console.log('[Clients] Data change event:', event);
      if (event.type === 'client' || event.type === 'system') {
        this.loadClients();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.clientService.getAll(0, 100).subscribe({
      next: (response) => {
        this.clients = response.content || [];
        this.isLoading = false;
        // Mettre à jour le store
        this.store.setClients(this.clients, response.totalElements);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.errorMessage = 'Échec du chargement des clients. Veuillez réessayer.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  viewAccounts(clientId: number) {
    this.router.navigate(['/admin/accounts'], { queryParams: { clientId } });
  }

  viewDetails(clientId: number) {
    this.router.navigate(['/admin/clients/new'], { queryParams: { id: clientId } }); // Reuse create form for edit
  }

  deleteClient(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    this.clientService.delete(id).subscribe({
      next: () => {
        // Mettre à jour le store
        this.store.removeClient(id);
        this.loadClients(); // Reload list
      },
      error: (err) => alert('Échec de la suppression du client')
    });
  }

  activateClient(client: ClientResponse) {
    if (!client.userId) {
      alert('Aucun compte utilisateur associé à ce client');
      return;
    }

    if (!confirm(`Activer le compte de ${client.prenom} ${client.nom} ?`)) return;

    this.userService.activate(client.userId).subscribe({
      next: () => {
        this.loadClients(); // Reload list to update status
      },
      error: (err) => {
        console.error('Failed to activate account', err);
        alert('Échec de l\'activation du compte. Veuillez réessayer.');
      }
    });
  }

  deactivateClient(client: ClientResponse) {
    if (!client.userId) {
      alert('Aucun compte utilisateur associé à ce client');
      return;
    }

    if (!confirm(`Désactiver le compte de ${client.prenom} ${client.nom} ?`)) return;

    this.userService.deactivate(client.userId).subscribe({
      next: () => {
        this.loadClients(); // Reload list to update status
      },
      error: (err) => {
        console.error('Failed to deactivate account', err);
        alert('Échec de la désactivation du compte. Veuillez réessayer.');
      }
    });
  }
}
