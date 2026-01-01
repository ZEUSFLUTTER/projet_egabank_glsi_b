import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-screen flex overflow-hidden bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-blue-900 border-r border-blue-800 flex flex-col hidden md:flex flex-shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-blue-800">
          <span class="iconify text-white mr-2" data-icon="lucide:hexagon" data-width="20"></span>
          <span class="text-lg font-semibold tracking-tight text-white">Ega<span class="text-blue-200">Bank</span></span>
        </div>

        <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div class="px-3 mb-2 text-xs font-medium text-blue-300 uppercase tracking-wider">Gestion</div>
          <a routerLink="/dashboard" routerLinkActive="bg-blue-800 text-white" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-all">
            <span class="iconify mr-3 text-blue-300 group-hover:text-white" data-icon="lucide:layout-dashboard" data-width="18"></span>
            Tableau de bord
          </a>
          <a routerLink="/clients" routerLinkActive="bg-blue-800 text-white" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-all">
            <span class="iconify mr-3 text-blue-300 group-hover:text-white" data-icon="lucide:users" data-width="18"></span>
            Clients
          </a>
          <a routerLink="/comptes" routerLinkActive="bg-blue-800 text-white" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-all">
            <span class="iconify mr-3 text-blue-300 group-hover:text-white" data-icon="lucide:wallet" data-width="18"></span>
            Comptes
          </a>
          
          <div class="px-3 mt-8 mb-2 text-xs font-medium text-blue-300 uppercase tracking-wider">Opérations</div>
          <a routerLink="/virements" routerLinkActive="bg-blue-800 text-white" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-all">
            <span class="iconify mr-3 text-blue-300 group-hover:text-white" data-icon="lucide:arrow-right-left" data-width="18"></span>
            Virements
          </a>
          <a routerLink="/releves" routerLinkActive="bg-blue-800 text-white" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-all">
            <span class="iconify mr-3 text-blue-300 group-hover:text-white" data-icon="lucide:file-text" data-width="18"></span>
            Relevés & Documents
          </a>
        </nav>

        <div class="p-4 border-t border-blue-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-xs font-semibold text-white uppercase border border-blue-700">
                {{ user()?.username?.substring(0, 2) }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white leading-none">{{ user()?.username }}</p>
                <p class="text-[10px] text-blue-300 uppercase mt-1 tracking-wider">{{ user()?.role }}</p>
              </div>
            </div>
            <button (click)="logout()" class="text-blue-300 hover:text-white hover:bg-red-600/80 transition-all p-1.5 rounded-md" title="Déconnexion">
              <span class="iconify" data-icon="lucide:log-out" data-width="18"></span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        <!-- Header -->
        <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div class="flex items-center text-sm text-gray-500">
            <span class="hover:text-gray-900 cursor-pointer">Ega Bank</span>
            <span class="iconify mx-2" data-icon="lucide:chevron-right" data-width="14"></span>
            <span class="font-medium text-gray-900">Tableau de bord</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-400 hover:text-gray-600 transition-colors">
              <span class="iconify" data-icon="lucide:search" data-width="18"></span>
            </button>
            <button class="text-gray-400 hover:text-gray-600 transition-colors relative">
              <span class="iconify" data-icon="lucide:bell" data-width="18"></span>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.user;

  logout() {
    this.authService.logout();
  }
}
