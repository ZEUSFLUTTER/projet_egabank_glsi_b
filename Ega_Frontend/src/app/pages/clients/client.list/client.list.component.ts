import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { ClientListDto2 } from '../../../dto/ClientListDto2';
import { ClientUpdateDto } from '../../../dto/ClientUpdateDto';


@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client.list.component.html',
  styleUrl: './client.list.component.scss'
})
export class ClientListComponent implements OnInit {

  // Listes de clients
  public activeClients: ClientListDto2[] = [];
  public inactiveClients: ClientListDto2[] = [];

  // États
  public activeTab: 'active' | 'inactive' = 'active';
  public isLoading = false;
  public isProcessing = false;
  public successMessage = '';
  public errorMessage = '';

  // Modal de modification
  public showEditModal = false;
  public editForm!: FormGroup;
  public selectedClient: ClientListDto2 | null = null;

  // Service
  private readonly clientService = inject(ClientService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initEditForm();
    this.loadClients();
  }

  /**
   * Initialise le formulaire de modification
   */
  initEditForm(): void {
    this.editForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+228\d{8}|\+228\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Change l'onglet actif
   */
  switchTab(tab: 'active' | 'inactive'): void {
    this.activeTab = tab;
    this.resetMessages();
  }

  /**
   * Charge les clients actifs et inactifs
   */
  loadClients(): void {
    this.isLoading = true;
    this.resetMessages();

    // Charger les clients actifs
    this.clientService.listActiveClients().subscribe({
      next: (clients: any) => {
        this.activeClients = clients as ClientListDto2[];
        console.log('Clients actifs :', clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients actifs :', err);
        this.errorMessage = 'Erreur lors du chargement des clients actifs.';
      }
    });

    // Charger les clients inactifs
    this.clientService.listInactiveClients().subscribe({
      next: (clients: any) => {
        this.inactiveClients = clients as ClientListDto2[];
        this.isLoading = false;
        console.log('Clients inactifs :', clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients inactifs :', err);
        this.errorMessage = 'Erreur lors du chargement des clients inactifs.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Ouvre le modal de modification
   */
  openEditModal(client: ClientListDto2): void {
    this.selectedClient = client;
    this.showEditModal = true;
    
    // Remplir le formulaire avec les données du client
    this.editForm.patchValue({
      address: client.address,
      phoneNumber: client.phoneNumber,
      email: client.email
    });
  }

  /**
   * Ferme le modal de modification
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedClient = null;
    this.editForm.reset();
  }

  /**
   * Soumet la modification du client
   */
  submitEdit(): void {
    if (this.editForm.invalid || !this.selectedClient) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.resetMessages();

    const updateData: ClientUpdateDto = this.editForm.value;

    this.clientService.modifyClient(this.selectedClient.codeClient, updateData).subscribe({
      next: () => {
        console.log('Client modifié avec succès');
        this.successMessage = 'Client modifié avec succès.';
        this.isProcessing = false;
        this.closeEditModal();
        
        // Recharger les listes
        this.loadClients();
      },
      error: (err) => {
        console.error('Erreur lors de la modification :', err);
        this.errorMessage = 'Erreur lors de la modification du client.';
        this.isProcessing = false;
      }
    });
  }

  /**
   * Supprime un client (soft delete)
   */
  deleteClient(codeClient: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    this.isProcessing = true;
    this.resetMessages();

    this.clientService.deleteClient(codeClient).subscribe({
      next: () => {
        console.log('Client supprimé :', codeClient);
        this.successMessage = 'Client supprimé avec succès.';
        this.isProcessing = false;
        
        // Recharger les listes
        this.loadClients();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.errorMessage = 'Erreur lors de la suppression du client.';
        this.isProcessing = false;
      }
    });
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(date: Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  /**
   * Réinitialise les messages
   */
  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}