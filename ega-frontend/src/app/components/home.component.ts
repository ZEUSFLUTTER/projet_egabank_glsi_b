import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-gold-600 to-gold-400 rounded-xl p-8 text-dark-900">
        <h2 class="text-3xl font-bold mb-2">Bienvenue sur EGA Bank</h2>
        <p class="text-lg">Gérez vos finances en toute sécurité</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card-gold p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Solde Total</p>
              <p class="text-2xl font-bold text-gold-400">€12,450.00</p>
            </div>
            <div class="bg-gold-600 rounded-full p-3">
              <svg class="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-gold p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Comptes</p>
              <p class="text-2xl font-bold text-gold-400">3</p>
            </div>
            <div class="bg-gold-600 rounded-full p-3">
              <svg class="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-gold p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Transactions</p>
              <p class="text-2xl font-bold text-gold-400">24</p>
            </div>
            <div class="bg-gold-600 rounded-full p-3">
              <svg class="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card-gold p-6">
        <h3 class="text-xl font-semibold text-gold-400 mb-4">Transactions Récentes</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="bg-green-600 rounded-full p-2">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">Virement Reçu</p>
                <p class="text-gray-400 text-sm">12 Jan 2026</p>
              </div>
            </div>
            <span class="text-green-400 font-semibold">+€500.00</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="bg-red-600 rounded-full p-2">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">Paiement Carte</p>
                <p class="text-gray-400 text-sm">11 Jan 2026</p>
              </div>
            </div>
            <span class="text-red-400 font-semibold">-€75.50</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  constructor() {}
}
