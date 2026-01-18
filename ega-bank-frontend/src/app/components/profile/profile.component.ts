import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <button 
                (click)="goBack()"
                class="mr-4 p-2 text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ currentUser?.email }}</span>
              <button 
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <div class="grid grid-cols-1 gap-6">
            
            <!-- Changement d'email -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Modifier mon email</h3>
              
              <form (ngSubmit)="updateEmail()" #emailForm="ngForm">
                <div class="space-y-4">
                  <div>
                    <label for="currentEmail" class="block text-sm font-medium text-gray-700">Email actuel</label>
                    <input 
                      type="email" 
                      id="currentEmail"
                      [value]="currentUser?.email || ''"
                      disabled
                      class="input-field mt-1 bg-gray-100">
                  </div>
                  
                  <div>
                    <label for="newEmail" class="block text-sm font-medium text-gray-700">Nouvel email</label>
                    <input 
                      type="email" 
                      id="newEmail"
                      name="newEmail"
                      [(ngModel)]="emailData.newEmail"
                      required
                      class="input-field mt-1">
                  </div>
                  
                  <div class="flex justify-end">
                    <button 
                      type="submit"
                      [disabled]="!emailForm.valid || isUpdatingEmail"
                      class="btn-primary">
                      
                      <svg *ngIf="isUpdatingEmail" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      {{ isUpdatingEmail ? 'Modification...' : 'Modifier l\'email' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- Changement de mot de passe -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-6">Changer le mot de passe</h3>
              
              <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
                <div class="space-y-4">
                  
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                    <input 
                      type="password" 
                      id="currentPassword"
                      name="currentPassword"
                      [(ngModel)]="passwordData.currentPassword"
                      required
                      class="input-field mt-1">
                  </div>
                  
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      name="newPassword"
                      [(ngModel)]="passwordData.newPassword"
                      required
                      minlength="8"
                      class="input-field mt-1">
                  </div>
                  
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      name="confirmPassword"
                      [(ngModel)]="passwordData.confirmPassword"
                      required
                      class="input-field mt-1">
                    <p *ngIf="passwordData.newPassword && passwordData.confirmPassword && !passwordsMatch()" 
                       class="mt-1 text-sm text-red-600">
                      Les mots de passe ne correspondent pas
                    </p>
                  </div>
                  
                  <!-- Critères de sécurité -->
                  <div class="bg-blue-50 p-3 rounded-lg">
                    <h5 class="text-xs font-medium text-blue-900 mb-2">Critères :</h5>
                    <ul class="text-xs text-blue-800 space-y-1">
                      <li class="flex items-center">
                        <svg class="w-3 h-3 mr-2" [class]="passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        8+ caractères
                      </li>
                      <li class="flex items-center">
                        <svg class="w-3 h-3 mr-2" [class]="hasUpperCase() ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Majuscule
                      </li>
                      <li class="flex items-center">
                        <svg class="w-3 h-3 mr-2" [class]="hasNumber() ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Chiffre
                      </li>
                    </ul>
                  </div>
                  
                  <div class="flex justify-end">
                    <button 
                      type="submit"
                      [disabled]="!isPasswordFormValid() || isChangingPassword"
                      class="btn-primary">
                      
                      <svg *ngIf="isChangingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      {{ isChangingPassword ? 'Modification...' : 'Changer le mot de passe' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  
  emailData = {
    newEmail: ''
  };
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  isUpdatingEmail = false;
  isChangingPassword = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  updateEmail(): void {
    if (this.isUpdatingEmail) return;
    
    this.isUpdatingEmail = true;
    
    // Simuler la mise à jour de l'email (vous pouvez ajouter un endpoint backend plus tard)
    setTimeout(() => {
      if (this.currentUser) {
        this.currentUser.email = this.emailData.newEmail;
        this.authService.updateCurrentUser(this.currentUser);
        this.toastService.success('Email modifié', 'Votre email a été mis à jour avec succès');
        this.emailData.newEmail = '';
      }
      this.isUpdatingEmail = false;
    }, 1000);
  }

  changePassword(): void {
    if (!this.isPasswordFormValid() || this.isChangingPassword) return;
    
    this.isChangingPassword = true;
    
    this.authService.changePassword(this.passwordData.currentPassword, this.passwordData.newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Mot de passe modifié', 'Votre mot de passe a été modifié avec succès');
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        } else {
          this.toastService.error('Erreur', response.message);
        }
      },
      error: (error) => {
        this.toastService.error('Erreur', 'Impossible de changer le mot de passe');
      },
      complete: () => {
        this.isChangingPassword = false;
      }
    });
  }

  passwordsMatch(): boolean {
    return this.passwordData.newPassword === this.passwordData.confirmPassword;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordData.newPassword);
  }

  hasNumber(): boolean {
    return /\d/.test(this.passwordData.newPassword);
  }

  isPasswordFormValid(): boolean {
    return this.passwordData.currentPassword.length > 0 &&
           this.passwordData.newPassword.length >= 8 &&
           this.hasUpperCase() &&
           this.hasNumber() &&
           this.passwordsMatch();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}