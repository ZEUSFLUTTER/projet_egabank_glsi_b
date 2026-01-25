// ... autres imports ...
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Ajuste le chemin si nécessaire
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// ✅ DÉFINITION DES INTERFACES AU DÉBUT DU FICHIER
interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string; // ou Date si tu la convertis
  sexe: string;
  nationalite: string;
  role: string; // CLIENT, ADMIN, etc.
  isActive: boolean;
  createdAt: string; // ou Date
  lastLoginAt?: string; // ou Date
  statutKYC: string; // EN_ATTENTE, APPROUVE, etc.
}

// ⭐ INTERFACE POUR LES STATS (MODIFIÉE - avec soldeTotalFonds affiché) ⭐
interface GlobalStats {
  totalClients: number;
  totalComptes: number;
  totalTransactions: number;
  soldeTotalFonds: number; // Récupéré pour affichage
  comptesActifs: number;
  comptesInactifs: number;
  // Ajoute d'autres champs si ton backend envoie autre chose
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <h3>EGA Admin</h3>
        </div>
        <nav class="nav-menu">
          <ul>
            <li><a [routerLink]="['/admin']" routerLinkActive="active"><i class="icon-dashboard"></i> Dashboard</a></li>
            <li><a [routerLink]="['/admin', 'client', 'create']" routerLinkActive="active"><i class="icon-user-add"></i> Créer Client</a></li>
            <li><a [routerLink]="['/admin', 'logs']" routerLinkActive="active"><i class="icon-history"></i> Logs Audit</a></li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar">
          <h1>Panel Administrateur</h1>
        </header>

        <div class="content-wrapper">
          <!-- Stats Cards -->
          <section class="stats-section">
            <h2>Statistiques Globales</h2>
            <div class="loading" *ngIf="loadingStats">Chargement des statistiques...</div>
            <div class="error" *ngIf="errorStats">Erreur lors du chargement des statistiques.</div>
            <div class="stats-grid" *ngIf="globalStats && !loadingStats && !errorStats">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="fas fa-users"></i> <!-- Icône clients -->
                </div>
                <div class="stat-info">
                  <h3>Total Clients</h3>
                  <p class="value">{{ globalStats.totalClients }}</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon bg-secondary">
                  <i class="fas fa-piggy-bank"></i> <!-- Icône comptes -->
                </div>
                <div class="stat-info">
                  <h3>Total Comptes</h3>
                  <p class="value">{{ globalStats.totalComptes }}</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon bg-info">
                  <i class="fas fa-exchange-alt"></i> <!-- Icône transactions -->
                </div>
                <div class="stat-info">
                  <h3>Total Transactions</h3>
                  <p class="value">{{ globalStats.totalTransactions }}</p>
                </div>
              </div>
              <!-- ✅ CARTE FONDS TOTAUX REMISE -->
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="fas fa-coins"></i> <!-- Icône fonds -->
                </div>
                <div class="stat-info">
                  <h3>Fonds Totaux</h3>
                  <p class="value">{{ globalStats.soldeTotalFonds | number:'1.2-2' }} CFA</p>
                </div>
              </div>
              <!-- FIN CARTE FONDS TOTAUX -->
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="fas fa-check-circle"></i> <!-- Icône actifs -->
                </div>
                <div class="stat-info">
                  <h3>Comptes Actifs</h3>
                  <p class="value">{{ globalStats.comptesActifs }}</p>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon bg-warning">
                  <i class="fas fa-times-circle"></i> <!-- Icône inactifs -->
                </div>
                <div class="stat-info">
                  <h3>Comptes Inactifs</h3>
                  <p class="value">{{ globalStats.comptesInactifs }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Clients Section -->
          <section class="clients-section" *ngIf="!showingChildView">
            <div class="section-header">
              <h2>Gestion des Clients</h2>
              <div class="actions">
                <button type="button" class="btn btn-primary" [routerLink]="['/admin', 'client', 'create']">
                  <i class="fas fa-user-plus"></i> Créer un nouveau client
                </button>
                <button type="button" class="btn btn-secondary" [routerLink]="['/admin', 'logs']">
                  <i class="fas fa-history"></i> Voir les logs d'audit
                </button>
              </div>
            </div>

            <div class="loading" *ngIf="loadingClients">Chargement des clients...</div>
            <div class="error" *ngIf="errorClients">Erreur lors du chargement des clients.</div>
            <div class="clients-grid" *ngIf="clients.length > 0; else noClients">
              <div class="client-card" *ngFor="let client of clients">
                <div class="client-info">
                  <div class="client-name">{{ client.prenom }} {{ client.nom }}</div>
                  <div class="client-email">{{ client.email }}</div>
                  <div class="client-details">
                    <span class="detail"><strong>Téléphone:</strong> {{ client.telephone }}</span>
                    <span class="detail"><strong>Rôle:</strong> {{ client.role }}</span>
                    <span class="detail"><strong>KYC:</strong> {{ client.statutKYC }}</span>
                  </div>
                </div>
                <div class="client-status">
                  <span class="status-badge" [class.active]="client.isActive" [class.inactive]="!client.isActive">
                    {{ client.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                  <button type="button" class="btn btn-sm btn-outline-primary" [routerLink]="['/admin', 'client', client.id, 'accounts']">
                    <i class="fas fa-wallet"></i> Voir Comptes
                  </button>
                </div>
              </div>
            </div>
            <ng-template #noClients>
              <div class="empty-state" *ngIf="clients.length === 0 && !loadingClients && !errorClients">
                Aucun client trouvé.
              </div>
            </ng-template>
          </section>

          <!-- Afficher les routes enfants ici -->
          <router-outlet (activate)="onChildViewActivate()" (deactivate)="onChildViewDeactivate()"></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
    }

    /* Layout */
    .admin-dashboard {
      display: flex;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    /* Sidebar */
    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
      color: white;
      padding: 20px 0;
      position: fixed;
      height: 100vh;
      box-shadow: 3px 0 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .logo h3 {
      padding: 0 20px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 20px;
    }

    .nav-menu ul {
      list-style: none;
    }

    .nav-menu li a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .nav-menu li a:hover,
    .nav-menu li a.active {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .nav-menu li a i {
      margin-right: 10px;
      font-size: 1.2em;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 250px; /* Compenser la sidebar */
      padding: 20px;
    }

    .top-bar h1 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #2c3e50;
      text-align: center;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Sections */
    section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    h2 {
      margin-bottom: 15px;
      color: #2c3e50;
      font-size: 1.4rem;
    }

    h3 {
      margin: 15px 0 10px;
      color: #34495e;
      font-size: 1.2rem;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Cartes un peu plus petites */
      gap: 15px; /* Espacement entre les cartes */
      margin-top: 15px;
    }

    .stat-card {
      display: flex;
      align-items: center; /* Centrer verticalement l'icône et le texte */
      background: white; /* Fond blanc */
      border-radius: 10px;
      padding: 15px; /* Moins de padding */
      text-align: left; /* Texte aligné à gauche */
      box-shadow: 0 4px 10px rgba(0,0,0,0.08); /* Ombre subtile */
      transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animation au survol */
    }

    .stat-card:hover {
      transform: translateY(-5px); /* Légère translation vers le haut */
      box-shadow: 0 6px 15px rgba(0,0,0,0.12); /* Ombre plus prononcée */
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%; /* Forme circulaire */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px; /* Espacement entre icône et texte */
      color: white;
      font-size: 1.5rem; /* Taille de l'icône */
    }

    .bg-primary { background-color: #3498db; } /* Bleu */
    .bg-secondary { background-color: #95a5a6; } /* Gris */
    .bg-info { background-color: #17a2b8; } /* Bleu-vert */
    .bg-success { background-color: #2ecc71; } /* Vert */
    .bg-warning { background-color: #f39c12; } /* Orange */

    .stat-info h3 {
      font-size: 0.9rem;
      margin: 0 0 5px 0;
      color: #7f8c8d; /* Couleur texte subtil */
    }

    .stat-info .value {
      font-size: 1.6rem; /* Taille du chiffre principal */
      font-weight: bold;
      color: #2c3e50; /* Couleur texte principal */
      margin: 0;
    }

    /* Buttons */
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: none;
      display: inline-block;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
      margin-left: 10px;
    }

    .btn-secondary:hover {
      background-color: #7f8c8d;
    }

    .btn-sm {
      padding: 5px 10px;
      font-size: 0.8rem;
    }

    .btn-outline-primary {
      background-color: transparent;
      color: #3498db;
      border: 1px solid #3498db;
    }

    .btn-outline-primary:hover {
      background-color: #3498db;
      color: white;
    }

    .actions {
      margin-bottom: 15px;
    }

    /* Nouveaux styles pour la liste des clients (remplace le tableau) */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .clients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* Cartes de clients */
      gap: 1rem;
    }

    .client-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .client-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .client-info {
      flex-grow: 1;
    }

    .client-name {
      font-weight: bold;
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    .client-email {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .client-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail {
      font-size: 0.85rem;
      color: #95a5a6;
    }

    .client-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-badge.active {
      background-color: #2ecc71;
      color: white;
    }

    .status-badge.inactive {
      background-color: #e74c3c;
      color: white;
    }

    /* Loading, Error, Empty */
    .loading, .error, .empty-state {
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: #7f8c8d;
    }

    .error {
      color: #e74c3c;
    }

    .empty-state {
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-top: 20px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-dashboard {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }

      .main-content {
        margin-left: 0;
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: 1fr; /* Une seule colonne sur mobile */
      }

      .clients-grid {
        grid-template-columns: 1fr; /* Une seule colonne sur mobile */
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  clients: Client[] = [];
  loadingClients = false;
  errorClients = false;
  showingChildView = false;

  globalStats: GlobalStats | null = null;
  loadingStats = false;
  errorStats = false;

  // Données pour afficher les stats dans une boucle
  // On les construit dynamiquement dans loadGlobalStats
  statsArray: Array<{label: string, value: any, icon: string, colorClass: string}> = [];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadGlobalStats();
    this.loadClients();
  }

  loadGlobalStats() {
    this.loadingStats = true;
    this.errorStats = false;
    this.cdr.detectChanges();
    this.apiService.getData('admin/stats').subscribe({
      next: (response: any) => {
        console.log('Stats globales reçues:', response);
        this.globalStats = {
          totalClients: response.totalClients,
          totalComptes: response.totalComptes,
          totalTransactions: response.totalTransactions,
          soldeTotalFonds: response.soldeTotalFonds, // Récupéré pour affichage
          comptesActifs: response.comptesActifs,
          comptesInactifs: response.comptesInactifs,
        };
        // Préparer le tableau pour la boucle *ngFor dans le template mis à jour
        this.statsArray = [
          { label: 'Total Clients', value: this.globalStats.totalClients, icon: 'fa-users', colorClass: 'bg-primary' },
          { label: 'Total Comptes', value: this.globalStats.totalComptes, icon: 'fa-piggy-bank', colorClass: 'bg-secondary' },
          { label: 'Total Transactions', value: this.globalStats.totalTransactions, icon: 'fa-exchange-alt', colorClass: 'bg-info' },
          // ✅ AJOUT DE LA STAT POUR LES FONDS TOTAUX
          { label: 'Fonds Totaux', value: `${this.globalStats.soldeTotalFonds.toFixed(2)} CFA`, icon: 'fa-coins', colorClass: 'bg-success' },
          { label: 'Comptes Actifs', value: this.globalStats.comptesActifs, icon: 'fa-check-circle', colorClass: 'bg-success' },
          { label: 'Comptes Inactifs', value: this.globalStats.comptesInactifs, icon: 'fa-times-circle', colorClass: 'bg-warning' },
        ]; // <-- 'Fonds Totaux' rétabli dans la liste
        this.loadingStats = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des stats globales:', err);
        this.errorStats = true;
        this.loadingStats = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ... reste des méthodes inchangées ...
  loadClients() {
    this.loadingClients = true;
    this.errorClients = false;
    this.cdr.detectChanges();
    this.apiService.getData('admin/clients').subscribe({
      next: (response: any) => {
        console.log('Données clients reçues:', response);
        if (Array.isArray(response)) {
          this.clients = response;
        } else if (response && response.clients && Array.isArray(response.clients)) {
          this.clients = response.clients;
        } else {
          console.warn('Structure de réponse client inattendue:', response);
          this.clients = [];
        }
        this.loadingClients = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des clients:', err);
        this.errorClients = true;
        this.loadingClients = false;
        this.cdr.detectChanges();
      }
    });
  }

  onChildViewActivate() {
    this.showingChildView = true;
    this.cdr.detectChanges();
  }

  onChildViewDeactivate() {
    this.showingChildView = false;
    this.cdr.detectChanges();
  }
}