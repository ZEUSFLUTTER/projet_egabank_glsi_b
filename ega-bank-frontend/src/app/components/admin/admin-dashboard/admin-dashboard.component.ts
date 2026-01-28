import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { TransactionService } from '../../../services/transaction.service';
import { 
  ClientResponse, 
  CompteResponse, 
  Transaction, 
  DashboardStats, 
  NewClientForm, 
  NewCompteForm 
} from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  // Data properties
  clients: ClientResponse[] = [];
  filteredClients: ClientResponse[] = [];
  selectedClient: ClientResponse | null = null;
  selectedClientComptes: CompteResponse[] = [];
  recentTransactions: Transaction[] = [];
  stats: DashboardStats = {
    totalClients: 0,
    totalComptes: 0,
    totalTransactions: 0,
    soldeTotal: 0
  };

  // Loading states
  loading = false;
  loadingComptes = false;

  // Form states
  showCreateClientForm = false;
  showCreateCompteForm = false;
  showCreateTransactionForm = false;
  isEditingClient = false;

  // Filter states
  clientSearchTerm = '';

  // Form data
  newClient: NewClientForm = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'MASCULIN',
    adresse: '',
    telephone: '',
    courriel: '',
    nationalite: '',
    password: ''
  };

  newCompte: NewCompteForm = {
    type: 'COURANT',
    soldeInitial: 0
  };

  newTransaction = {
    compteId: 0,
    type: 'DEPOT',
    montant: 0,
    description: '',
    compteDestinataire: ''
  };

  // Available accounts for transactions
  availableComptes: CompteResponse[] = [];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Navigation
  goToTransactions(): void {
    this.router.navigate(['/admin/transactions']);
  }

  // Main data loading
  loadDashboardData(): void {
    this.loading = true;
    this.loadClients();
    this.loadRecentTransactions();
    this.loadStats();
  }

  loadClients(): void {
    this.adminService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = [...clients];
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.notificationService.showError('Erreur lors du chargement des clients');
        this.loading = false;
      }
    });
  }

  loadRecentTransactions(): void {
    this.adminService.getRecentTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions:', error);
        this.notificationService.showError('Erreur lors du chargement des transactions');
      }
    });
  }

  loadStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        // Fallback to calculated stats
        this.calculateStats();
      }
    });
  }

  // Client selection and compte loading
  selectClient(client: ClientResponse): void {
    this.selectedClient = client;
    this.loadClientComptes(client.id);
  }

  loadClientComptes(clientId: number): void {
    this.loadingComptes = true;
    this.adminService.getClientComptes(clientId).subscribe({
      next: (comptes) => {
        this.selectedClientComptes = comptes;
        this.loadingComptes = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.notificationService.showError('Erreur lors du chargement des comptes');
        this.loadingComptes = false;
      }
    });
  }

  // Nouvelle méthode pour ouvrir le formulaire de transaction pour un client spécifique
  openTransactionForm(client: ClientResponse, transactionType: string): void {
    this.selectedClient = client;
    this.loadClientComptes(client.id);
    
    // Pré-remplir le type de transaction
    this.newTransaction.type = transactionType;
    
    // Ouvrir le formulaire de transaction
    this.toggleCreateTransactionForm();
  }

  selectClientForAccount(client: ClientResponse): void {
    this.selectedClient = client;
    this.toggleCreateCompteForm();
  }

  viewClientTransactions(client: ClientResponse): void {
    // Navigate to transactions page with client filter
    this.router.navigate(['/admin/transactions'], { 
      queryParams: { clientId: client.id } 
    });
  }

  // Statistics calculation
  calculateStats(): void {
    this.stats.totalClients = this.clients.length;
    this.stats.totalComptes = this.clients.reduce((total, client) => total + (client.nombreComptes || 0), 0);
    this.stats.totalTransactions = this.recentTransactions.length;
    this.stats.soldeTotal = this.selectedClientComptes.reduce((total, compte) => total + compte.solde, 0);
  }

  // Filtering methods
  filterClients(): void {
    if (!this.clientSearchTerm.trim()) {
      this.filteredClients = [...this.clients];
    } else {
      const searchTerm = this.clientSearchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm) ||
        client.prenom.toLowerCase().includes(searchTerm) ||
        client.courriel.toLowerCase().includes(searchTerm) ||
        client.telephone?.toLowerCase().includes(searchTerm)
      );
    }
  }

  // Form toggles
  toggleCreateClientForm(): void {
    this.showCreateClientForm = !this.showCreateClientForm;
    if (!this.showCreateClientForm) {
      this.resetClientForm();
      this.isEditingClient = false;
      // Reset selected client when closing form if we were editing
      if (this.isEditingClient) {
        this.selectedClient = null;
      }
    }
  }

  toggleCreateCompteForm(): void {
    if (!this.selectedClient && !this.showCreateCompteForm) {
      this.notificationService.showWarning('Veuillez sélectionner un client d\'abord');
      return;
    }
    
    this.showCreateCompteForm = !this.showCreateCompteForm;
    if (!this.showCreateCompteForm) {
      this.resetCompteForm();
    }
  }

  toggleCreateTransactionForm(): void {
    this.showCreateTransactionForm = !this.showCreateTransactionForm;
    if (this.showCreateTransactionForm) {
      // Si un client est sélectionné, charger ses comptes, sinon charger tous les comptes
      if (this.selectedClient) {
        this.availableComptes = this.selectedClientComptes;
        // Pré-sélectionner le premier compte du client s'il en a
        if (this.selectedClientComptes.length > 0) {
          this.newTransaction.compteId = this.selectedClientComptes[0].id;
        }
      } else {
        this.loadAllComptes();
      }
    } else {
      this.resetTransactionForm();
    }
  }

  // Client creation
  createClient(): void {
    if (!this.validateClientForm()) {
      return;
    }

    const clientRequest = {
      nom: this.newClient.nom,
      prenom: this.newClient.prenom,
      dateNaissance: this.newClient.dateNaissance,
      sexe: this.newClient.sexe as any,
      adresse: this.newClient.adresse,
      telephone: this.newClient.telephone,
      courriel: this.newClient.courriel,
      nationalite: this.newClient.nationalite,
      password: this.newClient.password
    };

    // Check if we're editing or creating
    if (this.isEditingClient && this.selectedClient) {
      // Update existing client
      this.adminService.updateClient(this.selectedClient.id, clientRequest).subscribe({
        next: (client) => {
          this.notificationService.showSuccess('Client modifié avec succès');
          this.toggleCreateClientForm();
          this.loadClients();
          this.selectedClient = null;
          this.isEditingClient = false;
        },
        error: (error) => {
          console.error('Erreur lors de la modification du client:', error);
          this.notificationService.showError('Erreur lors de la modification du client');
        }
      });
    } else {
      // Create new client
      this.adminService.createClient(clientRequest).subscribe({
        next: (client) => {
          this.notificationService.showSuccess('Client créé avec succès');
          this.toggleCreateClientForm();
          this.loadClients();
        },
        error: (error) => {
          console.error('Erreur lors de la création du client:', error);
          this.notificationService.showError('Erreur lors de la création du client');
        }
      });
    }
  }

  // Compte creation
  createCompteForClient(): void {
    if (!this.selectedClient) {
      this.notificationService.showError('Aucun client sélectionné');
      return;
    }

    const compteRequest = {
      type: this.newCompte.type,
      soldeInitial: this.newCompte.soldeInitial
    };

    this.adminService.createCompteForClient(this.selectedClient.id, compteRequest).subscribe({
      next: (compte) => {
        this.notificationService.showSuccess('Compte créé avec succès');
        this.toggleCreateCompteForm();
        this.loadClientComptes(this.selectedClient!.id);
        this.loadClients(); // Refresh to update compte count
      },
      error: (error) => {
        console.error('Erreur lors de la création du compte:', error);
        this.notificationService.showError('Erreur lors de la création du compte');
      }
    });
  }

  // Load all accounts for transaction form
  loadAllComptes(): void {
    this.adminService.getAllAccounts().subscribe({
      next: (comptes) => {
        this.availableComptes = comptes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.notificationService.showError('Erreur lors du chargement des comptes');
      }
    });
  }

  // Transaction creation
  createTransaction(): void {
    if (!this.validateTransactionForm()) {
      return;
    }

    const transactionRequest = {
      compteId: this.newTransaction.compteId,
      type: this.newTransaction.type,
      montant: this.newTransaction.montant,
      description: this.newTransaction.description,
      compteDestinataire: this.newTransaction.type === 'VIREMENT' ? this.newTransaction.compteDestinataire : undefined
    };

    // Utiliser l'API directement pour créer la transaction
    this.adminService.createTransaction(transactionRequest).subscribe({
      next: (transaction: Transaction) => {
        this.notificationService.showSuccess('Transaction créée avec succès');
        this.toggleCreateTransactionForm();
        this.loadRecentTransactions();
        this.loadStats();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création de la transaction:', error);
        this.notificationService.showError('Erreur lors de la création de la transaction');
      }
    });
  }

  // Client deletion
  deleteClient(client: ClientResponse): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?`)) {
      this.adminService.deleteClient(client.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Client supprimé avec succès');
          this.loadClients();
          if (this.selectedClient?.id === client.id) {
            this.selectedClient = null;
            this.selectedClientComptes = [];
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du client:', error);
          this.notificationService.showError('Erreur lors de la suppression du client');
        }
      });
    }
  }

  // Client editing
  editClient(client: ClientResponse): void {
    // Pre-fill the form with client data
    this.newClient = {
      nom: client.nom,
      prenom: client.prenom,
      dateNaissance: client.dateNaissance || '',
      sexe: client.sexe || 'MASCULIN',
      adresse: client.adresse || '',
      telephone: client.telephone || '',
      courriel: client.courriel,
      nationalite: client.nationalite || '',
      password: '' // Don't pre-fill password for security
    };
    
    // Store the client being edited
    this.selectedClient = client;
    this.isEditingClient = true;
    this.showCreateClientForm = true;
  }

  // Form validation
  validateClientForm(): boolean {
    if (!this.newClient.nom || !this.newClient.prenom || !this.newClient.courriel || !this.newClient.password) {
      this.notificationService.showError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newClient.courriel)) {
      this.notificationService.showError('Veuillez saisir un email valide');
      return false;
    }

    return true;
  }

  // Form reset
  resetClientForm(): void {
    this.newClient = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: 'MASCULIN',
      adresse: '',
      telephone: '',
      courriel: '',
      nationalite: '',
      password: ''
    };
  }

  resetCompteForm(): void {
    this.newCompte = {
      type: 'COURANT',
      soldeInitial: 0
    };
  }

  resetTransactionForm(): void {
    this.newTransaction = {
      compteId: 0,
      type: 'DEPOT',
      montant: 0,
      description: '',
      compteDestinataire: ''
    };
  }

  validateTransactionForm(): boolean {
    if (!this.newTransaction.compteId || this.newTransaction.compteId === 0) {
      this.notificationService.showError('Veuillez sélectionner un compte');
      return false;
    }

    if (!this.newTransaction.montant || this.newTransaction.montant <= 0) {
      this.notificationService.showError('Veuillez saisir un montant valide');
      return false;
    }

    if (!this.newTransaction.description.trim()) {
      this.notificationService.showError('Veuillez saisir une description');
      return false;
    }

    if (this.newTransaction.type === 'VIREMENT' && (!this.newTransaction.compteDestinataire || this.newTransaction.compteDestinataire === '')) {
      this.notificationService.showError('Veuillez sélectionner un compte destinataire pour le virement');
      return false;
    }

    return true;
  }

  // Logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}