import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobileMoneyService, MobileMoneyRequest } from '../../services/mobile-money.service';

@Component({
  selector: 'app-mobile-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      
      <!-- Provider Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Choisir le service</label>
        <div class="grid grid-cols-2 gap-3">
          <button 
            type="button"
            (click)="selectProvider('T_MONEY')"
            [class]="getProviderButtonClass('T_MONEY')"
            class="p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
            
            <div class="flex flex-col items-center space-y-2">
              <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">T</span>
              </div>
              <span class="text-sm font-medium">T-Money</span>
            </div>
          </button>
          
          <button 
            type="button"
            (click)="selectProvider('FLOOZ')"
            [class]="getProviderButtonClass('FLOOZ')"
            class="p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
            
            <div class="flex flex-col items-center space-y-2">
              <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">F</span>
              </div>
              <span class="text-sm font-medium">Flooz</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Transaction Type -->
      <div *ngIf="selectedProvider">
        <label class="block text-sm font-medium text-gray-700 mb-2">Type d'opération</label>
        <div class="grid grid-cols-2 gap-3">
          <button 
            type="button"
            (click)="selectType('DEPOT')"
            [class]="getTypeButtonClass('DEPOT')"
            class="p-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
            
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="font-medium">Dépôt</span>
            </div>
          </button>
          
          <button 
            type="button"
            (click)="selectType('RETRAIT')"
            [class]="getTypeButtonClass('RETRAIT')"
            class="p-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
            
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
              <span class="font-medium">Retrait</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Transaction Form -->
      <form *ngIf="selectedProvider && selectedType" (ngSubmit)="processTransaction()" #mobileMoneyForm="ngForm">
        <div class="space-y-4">
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input 
              type="tel" 
              id="phoneNumber"
              name="phoneNumber"
              [(ngModel)]="transactionRequest.phoneNumber"
              required
              pattern="[0-9]{8}"
              class="input-field mt-1"
              placeholder="90123456">
            <p class="text-xs text-gray-500 mt-1">Format: 8 chiffres (ex: 90123456)</p>
          </div>
          
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
            <input 
              type="number" 
              id="amount"
              name="amount"
              [(ngModel)]="transactionRequest.amount"
              required
              min="500"
              max="500000"
              class="input-field mt-1"
              placeholder="5000">
            <p class="text-xs text-gray-500 mt-1">Minimum: 500 FCFA - Maximum: 500,000 FCFA</p>
          </div>
          
          <button 
            type="submit"
            [disabled]="!mobileMoneyForm.valid || isProcessing"
            class="w-full btn-primary">
            
            <svg *ngIf="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            
            {{ getSubmitButtonText() }}
          </button>
        </div>
      </form>

      <!-- Processing Status -->
      <div *ngIf="isProcessing" class="text-center py-4">
        <div class="inline-flex items-center space-x-2 text-primary-600">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium">Traitement en cours...</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Connexion avec {{ selectedProvider === 'T_MONEY' ? 'T-Money' : 'Flooz' }}</p>
      </div>
    </div>
  `
})
export class MobileMoneyComponent {
  @Output() transactionComplete = new EventEmitter<any>();

  selectedProvider: 'T_MONEY' | 'FLOOZ' | null = null;
  selectedType: 'DEPOT' | 'RETRAIT' | null = null;
  isProcessing = false;
  
  transactionRequest: MobileMoneyRequest = {
    provider: 'T_MONEY',
    phoneNumber: '',
    amount: 0,
    type: 'DEPOT'
  };

  constructor(private mobileMoneyService: MobileMoneyService) {}

  selectProvider(provider: 'T_MONEY' | 'FLOOZ'): void {
    this.selectedProvider = provider;
    this.transactionRequest.provider = provider;
  }

  selectType(type: 'DEPOT' | 'RETRAIT'): void {
    this.selectedType = type;
    this.transactionRequest.type = type;
  }

  getProviderButtonClass(provider: 'T_MONEY' | 'FLOOZ'): string {
    const selectedClass = 'border-primary-500 bg-primary-50';
    const unselectedClass = 'border-gray-200 hover:border-gray-300';
    
    return this.selectedProvider === provider ? selectedClass : unselectedClass;
  }

  getTypeButtonClass(type: 'DEPOT' | 'RETRAIT'): string {
    const selectedClass = 'border-primary-500 bg-primary-50 text-primary-700';
    const unselectedClass = 'border-gray-200 hover:border-gray-300 text-gray-700';
    
    return this.selectedType === type ? selectedClass : unselectedClass;
  }

  getSubmitButtonText(): string {
    if (this.isProcessing) {
      return 'Traitement...';
    }
    
    const providerName = this.selectedProvider === 'T_MONEY' ? 'T-Money' : 'Flooz';
    const action = this.selectedType === 'DEPOT' ? 'Déposer via' : 'Retirer via';
    
    return `${action} ${providerName}`;
  }

  processTransaction(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    this.mobileMoneyService.processTransaction(this.transactionRequest).subscribe({
      next: (response) => {
        // Émettre l'événement immédiatement pour rafraîchir le solde
        this.transactionComplete.emit({
          success: response.success,
          message: response.message,
          nouveauSolde: response.nouveauSolde
        });
        
        if (response.success) {
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Erreur Mobile Money:', error);
        this.transactionComplete.emit({
          success: false,
          message: 'Erreur de connexion. Veuillez réessayer.'
        });
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  resetForm(): void {
    this.selectedProvider = null;
    this.selectedType = null;
    this.transactionRequest = {
      provider: 'T_MONEY',
      phoneNumber: '',
      amount: 0,
      type: 'DEPOT'
    };
  }
}