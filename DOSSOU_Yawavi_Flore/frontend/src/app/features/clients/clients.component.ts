import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { AccountService } from '../../core/services/account.service';
import { Client, ClientUpdateDto } from '../../shared/models/client.model';
import { Account } from '../../shared/models/account.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faEdit, faTrash, faSearch, faEye, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FaIconComponent],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  clientAccounts: Account[] = [];
  showUpdateModal = false;
  showDetailsModal = false;
  updateForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  filterStatus: 'active' | 'inactive' = 'active';
  searchTerm = '';

  faUserPlus = faUserPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faEye = faEye;
  faCreditCard = faCreditCard;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private accountService: AccountService
  ) {
    this.updateForm = this.fb.group({
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    const service = this.filterStatus === 'active' 
      ? this.clientService.getAllActiveClients()
      : this.clientService.getAllInactiveClients();

    service.subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(client => {
      const search = this.searchTerm.toLowerCase();
      return client.lastName.toLowerCase().includes(search) ||
             client.firstName.toLowerCase().includes(search) ||
             client.email.toLowerCase().includes(search) ||
             client.codeClient?.toLowerCase().includes(search);
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.loadClients();
  }

  viewDetails(client: Client): void {
    this.selectedClient = client;
    this.showDetailsModal = true;
    this.loadClientAccounts(client.email);
  }

  loadClientAccounts(email: string): void {
    this.accountService.getActiveAccountsByClient(email).subscribe({
      next: (accounts) => {
        this.clientAccounts = accounts;
      },
      error: () => {
        this.clientAccounts = [];
      }
    });
  }

  openUpdateModal(client: Client): void {
    this.selectedClient = client;
    this.updateForm.patchValue({
      address: client.address,
      phoneNumber: client.phoneNumber,
      email: client.email
    });
    this.showUpdateModal = true;
  }

  closeModals(): void {
    this.showUpdateModal = false;
    this.showDetailsModal = false;
    this.selectedClient = null;
  }

  onUpdate(): void {
    if (this.updateForm.valid && this.selectedClient) {
      this.loading = true;
      const updateData: ClientUpdateDto = this.updateForm.value;

      this.clientService.updateClient(this.selectedClient.codeClient!, updateData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadClients();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
          this.loading = false;
        }
      });
    }
  }

  deleteClient(client: Client): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.firstName} ${client.lastName} ?`)) {
      this.clientService.deleteClient(client.codeClient!).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
            this.loadClients();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
