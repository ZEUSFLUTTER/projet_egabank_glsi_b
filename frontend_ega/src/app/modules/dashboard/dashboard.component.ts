import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Client, Compte } from '../../core/models';
import { ClientFormModalComponent } from '../../shared/components/client-form-modal/client-form-modal.component';
import { AccountFormModalComponent } from '../../shared/components/account-form-modal/account-form-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ClientFormModalComponent, AccountFormModalComponent],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Tableau de bord</h1>
          <p class="text-sm text-gray-500 mt-1">Bienvenue dans votre interface de gestion bancaire.</p>
        </div>
        <button (click)="logout()" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
          <span class="iconify text-gray-500" data-icon="lucide:log-out" data-width="18"></span>
          Déconnexion
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Actions rapides</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <!-- Clients -->
          <a routerLink="/clients" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:users" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Clients</span>
          </a>

          <!-- Comptes -->
          <a routerLink="/comptes" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:wallet" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Comptes</span>
          </a>

          <!-- Transactions -->
          <a routerLink="/virements" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:arrow-left-right" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Transactions</span>
          </a>

          <!-- Nouveau Client -->
          <button (click)="openNewClientModal()" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:user-plus" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Nouveau Client</span>
          </button>

          <!-- Ouvrir Compte -->
          <button (click)="openNewAccountModal()" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:plus-circle" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Ouvrir Compte</span>
          </button>

          <!-- Relevés -->
          <a routerLink="/releves" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group cursor-pointer">
            <span class="p-3 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span class="iconify" data-icon="lucide:file-text" data-width="24"></span>
            </span>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">Relevés</span>
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <span class="iconify" data-icon="lucide:users" data-width="24"></span>
            </span>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Actif</span>
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Clients</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalClients }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <span class="iconify" data-icon="lucide:wallet" data-width="24"></span>
            </span>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Actif</span>
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Comptes</p>
            <div class="flex items-baseline gap-2 mt-1">
              <p class="text-2xl font-semibold text-gray-900">{{ totalComptes }}</p>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
              <div>
                <p class="text-xs text-gray-500">Courant</p>
                <p class="text-sm font-semibold text-gray-900">{{ totalCourant }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Épargne</p>
                <p class="text-sm font-semibold text-gray-900">{{ totalEpargne }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <span class="iconify" data-icon="lucide:trending-up" data-width="24"></span>
            </span>
            <span class="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Stable</span>
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Encours Total</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ totalBalance | number:'1.0-0' }} FCFA</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Clients -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Derniers Clients</h3>
            <a routerLink="/clients" class="text-xs text-blue-600 font-medium hover:underline">Voir tout</a>
          </div>
          <div class="divide-y divide-gray-100">
            <a *ngFor="let client of recentClients" [routerLink]="['/clients', client.id]" class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                {{ client.nom[0] }}{{ client.prenom[0] }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ client.prenom }} {{ client.nom }}</p>
                <p class="text-xs text-gray-500">{{ client.email }}</p>
              </div>
              <span class="iconify text-gray-300" data-icon="lucide:chevron-right" data-width="16"></span>
            </a>
            <div *ngIf="recentClients.length === 0" class="p-8 text-center text-gray-500 text-sm">
              Aucun client trouvé. <button (click)="openNewClientModal()" class="text-blue-600 hover:underline">Créer un client</button>
            </div>
          </div>
        </div>

        <!-- Recent Accounts -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Derniers Comptes</h3>
            <a routerLink="/comptes" class="text-xs text-blue-600 font-medium hover:underline">Voir tout</a>
          </div>
          <div class="divide-y divide-gray-100">
            <a *ngFor="let compte of recentComptes" [routerLink]="['/comptes', compte.id]" class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div [ngClass]="compte.type === 'COURANT' ? 'bg-blue-800' : 'bg-blue-100'" class="h-10 w-10 rounded-lg flex items-center justify-center">
                <span class="iconify" [ngClass]="compte.type === 'COURANT' ? 'text-white' : 'text-blue-600'" [attr.data-icon]="compte.type === 'COURANT' ? 'lucide:credit-card' : 'lucide:piggy-bank'" data-width="20"></span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-mono text-gray-900">{{ compte.numeroCompte.substring(0, 20) }}...</p>
                <p class="text-xs text-gray-500">{{ compte.clientPrenom }} {{ compte.clientNom }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold" [ngClass]="compte.solde >= 0 ? 'text-gray-900' : 'text-red-600'">{{ compte.solde | number:'1.0-0' }}</p>
                <p class="text-xs text-gray-400">FCFA</p>
              </div>
            </a>
            <div *ngIf="recentComptes.length === 0" class="p-8 text-center text-gray-500 text-sm">
              Aucun compte trouvé. <button (click)="openNewAccountModal()" class="text-blue-600 hover:underline">Ouvrir un compte</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <app-client-form-modal
        [isVisible]="showClientModal"
        (close)="showClientModal = false"
        (save)="onClientCreated($event)">
      </app-client-form-modal>

      <app-account-form-modal
        [isVisible]="showAccountModal"
        (close)="showAccountModal = false"
        (save)="loadData()">
      </app-account-form-modal>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  totalComptes = 0;
  totalCourant = 0;
  totalEpargne = 0;
  totalBalance = 0;
  recentClients: Client[] = [];
  recentComptes: Compte[] = [];

  showClientModal = false;
  showAccountModal = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getClients().subscribe(clients => {
      this.totalClients = clients.length;
      this.recentClients = clients.slice(0, 5);
    });

    this.apiService.getComptes().subscribe(comptes => {
      this.totalComptes = comptes.length;
      this.totalCourant = comptes.filter(c => c.type === 'COURANT').length;
      this.totalEpargne = comptes.filter(c => c.type === 'EPARGNE').length;
      this.totalBalance = comptes.reduce((sum, c) => sum + c.solde, 0);
      this.recentComptes = comptes.slice(0, 5);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openNewClientModal() {
    this.showClientModal = true;
  }

  openNewAccountModal() {
    this.showAccountModal = true;
  }

  onClientCreated(client: Client) {
    console.log('🎉 Client créé:', client);

    // Fermer la modal de création
    this.showClientModal = false;

    // Recharger les données
    this.loadData();
  }
}
