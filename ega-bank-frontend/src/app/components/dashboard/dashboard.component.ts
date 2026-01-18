import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ClientService, SoldeResponse, VirementRequest } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';
import { MobileMoneyComponent } from '../mobile-money/mobile-money.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MobileMoneyComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h1 class="ml-3 text-2xl font-bold text-gray-900">EGA Bank</h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                (click)="goToProfile()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                👤 Mon Profil
              </button>
              <span class="text-sm text-gray-700">Bonjour, {{ currentUser?.email }}</span>
              <button 
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Solde Card -->
          <div class="card mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900">Solde du compte</h2>
                <div *ngIf="!isLoadingSolde && soldeInfo; else loadingOrError">
                  <p class="text-3xl font-bold text-primary-600 mt-2">
                    {{ soldeInfo.solde | number:'1.0-0' }} FCFA
                  </p>
                  <p class="text-sm text-gray-500 mt-1">IBAN: {{ soldeInfo.iban }}</p>
                </div>
                
                <ng-template #loadingOrError>
                  <div *ngIf="isLoadingSolde" class="mt-2">
                    <div class="flex items-center space-x-2">
                      <svg class="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="text-gray-600">Chargement...</span>
                    </div>
                  </div>
                  <div *ngIf="!isLoadingSolde && !soldeInfo" class="mt-2">
                    <p class="text-xl text-red-600">Erreur de chargement</p>
                    <p class="text-sm text-gray-500">Impossible de récupérer le solde</p>
                  </div>
                </ng-template>
              </div>
              <div class="text-right">
                <button 
                  (click)="refreshSolde()"
                  [disabled]="isLoadingSolde"
                  class="btn-secondary text-sm">
                  <svg *ngIf="isLoadingSolde" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Virement Bancaire -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Virement Bancaire</h3>
              
              <form (ngSubmit)="effectuerVirement()" #virementForm="ngForm">
                <div class="space-y-4">
                  <div>
                    <label for="iban" class="block text-sm font-medium text-gray-700">IBAN Destinataire</label>
                    <input 
                      type="text" 
                      id="iban"
                      name="iban"
                      [(ngModel)]="virementRequest.ibanDestinataire"
                      required
                      class="input-field mt-1"
                      placeholder="TG00 0000 0000 0000 0000 0000">
                  </div>
                  
                  <div>
                    <label for="montant" class="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
                    <input 
                      type="number" 
                      id="montant"
                      name="montant"
                      [(ngModel)]="virementRequest.montant"
                      required
                      min="1"
                      [max]="soldeInfo?.solde || 0"
                      class="input-field mt-1"
                      placeholder="0">
                  </div>
                  
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description (optionnel)</label>
                    <input 
                      type="text" 
                      id="description"
                      name="description"
                      [(ngModel)]="virementRequest.description"
                      class="input-field mt-1"
                      placeholder="Motif du virement">
                  </div>
                  
                  <button 
                    type="submit"
                    [disabled]="!virementForm.valid || isProcessingVirement || !isSoldeValid()"
                    class="w-full btn-primary">
                    
                    <svg *ngIf="isProcessingVirement" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    
                    {{ isProcessingVirement ? 'Traitement...' : 'Effectuer le virement' }}
                  </button>
                  
                  <p *ngIf="!isSoldeValid() && virementRequest.montant > 0" class="text-sm text-red-600">
                    Solde insuffisant
                  </p>
                </div>
              </form>
            </div>

            <!-- Mobile Money -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Mobile Money</h3>
              <app-mobile-money (transactionComplete)="onMobileMoneyComplete($event)"></app-mobile-money>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  soldeInfo: SoldeResponse | null = null;
  isLoadingSolde = false;
  isProcessingVirement = false;
  
  virementRequest: VirementRequest = {
    ibanDestinataire: '',
    montant: 0,
    description: ''
  };

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadSolde();
    
    // Rafraîchissement automatique du solde toutes les 3 secondes
    setInterval(() => {
      this.loadSolde();
    }, 3000);
  }

  loadSolde(): void {
    this.isLoadingSolde = true;
    console.log('🔄 Chargement du solde...');
    
    this.clientService.getSolde().subscribe({
      next: (solde) => {
        console.log('✅ Solde reçu:', solde);
        this.soldeInfo = solde;
      },
      error: (error) => {
        console.error('❌ Erreur chargement solde:', error);
        this.toastService.error('Erreur', 'Impossible de charger le solde du compte');
        // Garder les anciennes données si disponibles
      },
      complete: () => {
        this.isLoadingSolde = false;
        console.log('🏁 Chargement solde terminé');
      }
    });
  }

  refreshSolde(): void {
    this.loadSolde();
  }

  effectuerVirement(): void {
    if (!this.isSoldeValid()) {
      this.toastService.error('Erreur', 'Solde insuffisant');
      return;
    }

    this.isProcessingVirement = true;
    
    this.clientService.effectuerVirement(this.virementRequest).subscribe({
      next: (response) => {
        this.toastService.success('Virement réussi', `${this.virementRequest.montant} FCFA transférés`);
        this.resetVirementForm();
        this.loadSolde(); // Refresh balance
      },
      error: (error) => {
        this.toastService.error('Erreur de virement', 'Le virement a échoué');
      },
      complete: () => {
        this.isProcessingVirement = false;
      }
    });
  }

  isSoldeValid(): boolean {
    return this.soldeInfo ? this.virementRequest.montant <= this.soldeInfo.solde : false;
  }

  resetVirementForm(): void {
    this.virementRequest = {
      ibanDestinataire: '',
      montant: 0,
      description: ''
    };
  }

  onMobileMoneyComplete(event: any): void {
    if (event.success) {
      // Mettre à jour le solde localement si disponible
      if (event.nouveauSolde && this.soldeInfo) {
        this.soldeInfo.solde = event.nouveauSolde;
      }
      
      this.toastService.success('Transaction Mobile Money', event.message);
      
      // Rafraîchir le solde depuis le serveur pour être sûr
      setTimeout(() => {
        this.loadSolde();
      }, 500);
    } else {
      this.toastService.error('Erreur Mobile Money', event.message);
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}