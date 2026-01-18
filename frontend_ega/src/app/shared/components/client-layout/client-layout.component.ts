import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo et Titre -->
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span class="iconify text-white" data-icon="lucide:landmark" data-width="24"></span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900">EGA Banking</h1>
                <p class="text-xs text-gray-500">Espace Client</p>
              </div>
            </div>

            <!-- Actions Header -->
            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <span class="iconify" data-icon="lucide:bell" data-width="20"></span>
                <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- Profil -->
              <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-medium text-gray-900">Mon Compte</p>
                  <p class="text-xs text-gray-500">Client</p>
                </div>
                <div class="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="iconify text-blue-600" data-icon="lucide:user" data-width="18"></span>
                </div>
              </div>

              <!-- Déconnexion -->
              <button (click)="logout()" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <span class="iconify text-gray-500" data-icon="lucide:log-out" data-width="18"></span>
                <span class="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-8">
          <!-- Sidebar Navigation -->
          <aside class="w-64 flex-shrink-0 hidden lg:block">
            <nav class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
              <div class="space-y-1">
                <a routerLink="/client/dashboard" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200" 
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:layout-dashboard" data-width="20"></span>
                  <span>Tableau de bord</span>
                </a>

                <a routerLink="/client/comptes" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:wallet" data-width="20"></span>
                  <span>Mes Comptes</span>
                </a>

                <a routerLink="/client/operations" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:arrow-left-right" data-width="20"></span>
                  <span>Opérations</span>
                </a>

                <a routerLink="/client/historique" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:history" data-width="20"></span>
                  <span>Historique</span>
                </a>

                <a routerLink="/client/statistiques" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:bar-chart-3" data-width="20"></span>
                  <span>Statistiques</span>
                </a>

                <a routerLink="/client/releves" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:file-text" data-width="20"></span>
                  <span>Relevés</span>
                </a>

                <div class="my-4 border-t border-gray-200"></div>

                <a routerLink="/client/profil" routerLinkActive="bg-blue-50 text-blue-700 border-blue-200"
                   class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-transparent">
                  <span class="iconify" data-icon="lucide:user-circle" data-width="20"></span>
                  <span>Mon Profil</span>
                </a>
              </div>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="flex-1 min-w-0">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div class="grid grid-cols-5 gap-1 p-2">
          <a routerLink="/client/dashboard" routerLinkActive="text-blue-600" 
             class="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span class="iconify" data-icon="lucide:layout-dashboard" data-width="20"></span>
            <span class="text-xs font-medium">Accueil</span>
          </a>

          <a routerLink="/client/comptes" routerLinkActive="text-blue-600"
             class="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span class="iconify" data-icon="lucide:wallet" data-width="20"></span>
            <span class="text-xs font-medium">Comptes</span>
          </a>

          <a routerLink="/client/operations" routerLinkActive="text-blue-600"
             class="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span class="iconify" data-icon="lucide:arrow-left-right" data-width="20"></span>
            <span class="text-xs font-medium">Opérations</span>
          </a>

          <a routerLink="/client/historique" routerLinkActive="text-blue-600"
             class="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span class="iconify" data-icon="lucide:history" data-width="20"></span>
            <span class="text-xs font-medium">Historique</span>
          </a>

          <a routerLink="/client/profil" routerLinkActive="text-blue-600"
             class="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span class="iconify" data-icon="lucide:user-circle" data-width="20"></span>
            <span class="text-xs font-medium">Profil</span>
          </a>
        </div>
      </nav>
    </div>
  `
})
export class ClientLayoutComponent {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
