import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="flex h-screen bg-dark-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-black border-r border-dark-700 text-white flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-dark-700">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-gold-600 to-gold-400 rounded-lg flex items-center justify-center">
              <span class="text-black font-bold text-xl">E</span>
            </div>
            <h1 class="text-xl font-bold text-gold-400">EGA Bank</h1>
          </div>
        </div>
        
        <!-- User Welcome -->
        <div class="p-6 border-b border-dark-700">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">{{ getCurrentDate() }}</p>
          <h2 class="text-lg font-semibold text-white">Bienvenue,</h2>
          <p class="text-gold-400 font-medium">{{ currentUser }}!</p>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-gold-600 text-black" 
             class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-dark-800 hover:text-white transition-all duration-200 group">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>

          <a routerLink="/accounts" routerLinkActive="bg-gold-600 text-black" 
             class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-dark-800 hover:text-white transition-all duration-200 group">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span class="font-medium">Comptes</span>
          </a>

          <a routerLink="/transactions" routerLinkActive="bg-gold-600 text-black" 
             class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-dark-800 hover:text-white transition-all duration-200 group">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            <span class="font-medium">Transactions</span>
          </a>

          <a routerLink="/profile" routerLinkActive="bg-gold-600 text-black" 
             class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-dark-800 hover:text-white transition-all duration-200 group">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="font-medium">Profile</span>
          </a>

          <!-- Admin links -->
          <ng-container *ngIf="userRole === 'ADMIN'">
            <div class="pt-2 pb-2 border-t border-dark-700 mt-2">
              <p class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider mb-2">Administration</p>
            </div>
            <a routerLink="/admin-clients" routerLinkActive="bg-gold-600 text-black" 
               class="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-dark-800 hover:text-white transition-all duration-200 group">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span class="font-medium">Gestion Clients</span>
            </a>
          </ng-container>
        </nav>
        
        <!-- Logout Button -->
        <div class="p-4 border-t border-dark-700">
          <button (click)="logout()" 
                  class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all duration-200 font-semibold shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-dark-900">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class LayoutComponent implements OnInit {
  currentUser = 'George';
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    
    // Écouter les changements de route pour forcer le rechargement
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Navigation vers:', event.url);
      // Petit délai pour laisser le composant se charger
      setTimeout(() => {
        this.triggerDataRefresh();
      }, 50);
    });
  }

  loadUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user.username;
        // S'assurer que le rôle est en majuscules pour la comparaison
        this.userRole = user.role ? user.role.toUpperCase() : null;
        console.log('User role detected:', this.userRole); // Debug
      },
      error: (error) => {
        console.error('Error getting current user:', error);
        this.currentUser = '';
        this.userRole = null;
      }
    });
  }

  triggerDataRefresh(): void {
    // Émettre un événement global pour signaler aux composants de recharger leurs données
    window.dispatchEvent(new CustomEvent('refreshData'));
  }

  getCurrentDate(): string {
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const months = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
    const now = new Date();
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}