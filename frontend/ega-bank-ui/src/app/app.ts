import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (authService.isAuthenticated()) {
        <nav class="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center space-x-8">
                <a routerLink="/dashboard" class="text-xl font-bold flex items-center gap-2">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  EGA Bank
                </a>
                <div class="hidden md:flex space-x-4">
                  <a routerLink="/dashboard" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Tableau de bord</a>
                  <a routerLink="/clients" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Clients</a>
                  <a routerLink="/accounts" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Comptes</a>
                  <a routerLink="/transactions" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-lg hover:bg-blue-700 transition">Transactions</a>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="hidden sm:block text-sm">{{ authService.currentUser()?.username }}</span>
                <button (click)="authService.logout()" class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition font-medium">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>
      }
      <main [class.pt-0]="!authService.isAuthenticated()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  constructor(public authService: AuthService) { }
}
