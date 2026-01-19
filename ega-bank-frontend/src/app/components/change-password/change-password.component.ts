import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <div class="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Changement de mot de passe requis
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Pour votre sécurité, vous devez changer votre mot de passe par défaut
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
            <div class="space-y-6">
              
              <div>
                <label for="oldPassword" class="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <div class="mt-1">
                  <input 
                    id="oldPassword" 
                    name="oldPassword" 
                    type="password" 
                    [(ngModel)]="passwordData.oldPassword"
                    required 
                    class="input-field"
                    placeholder="client123">
                </div>
              </div>

              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <div class="mt-1">
                  <input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    [(ngModel)]="passwordData.newPassword"
                    required 
                    minlength="8"
                    class="input-field"
                    placeholder="Minimum 8 caractères">
                </div>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <div class="mt-1">
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    [(ngModel)]="passwordData.confirmPassword"
                    required 
                    class="input-field"
                    placeholder="Retapez le nouveau mot de passe">
                </div>
                <p *ngIf="passwordData.newPassword && passwordData.confirmPassword && !passwordsMatch()" 
                   class="mt-1 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              </div>

              <!-- Critères de sécurité -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Critères de sécurité :</h4>
                <ul class="text-xs text-blue-800 space-y-1">
                  <li class="flex items-center">
                    <svg class="w-3 h-3 mr-2" [class]="passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Au moins 8 caractères
                  </li>
                  <li class="flex items-center">
                    <svg class="w-3 h-3 mr-2" [class]="hasUpperCase() ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Au moins une majuscule
                  </li>
                  <li class="flex items-center">
                    <svg class="w-3 h-3 mr-2" [class]="hasNumber() ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Au moins un chiffre
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  type="submit" 
                  [disabled]="!isFormValid() || isProcessing"
                  class="w-full btn-primary">
                  
                  <svg *ngIf="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  {{ isProcessing ? 'Modification...' : 'Changer le mot de passe' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ChangePasswordComponent implements OnInit {
  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur doit vraiment changer son mot de passe
    const user = this.authService.getCurrentUser();
    if (!user?.premiereConnexion) {
      // Rediriger vers le dashboard approprié
      if (user?.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
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

  isFormValid(): boolean {
    return this.passwordData.oldPassword.length > 0 &&
           this.passwordData.newPassword.length >= 8 &&
           this.hasUpperCase() &&
           this.hasNumber() &&
           this.passwordsMatch();
  }

  changePassword(): void {
    if (!this.isFormValid()) return;
    
    this.isProcessing = true;
    
    this.authService.changePassword(this.passwordData.oldPassword, this.passwordData.newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Succès', 'Mot de passe modifié avec succès');
          
          // Mettre à jour l'utilisateur local
          const user = this.authService.getCurrentUser();
          if (user) {
            user.premiereConnexion = false;
            this.authService.updateCurrentUser(user);
          }
          
          // Rediriger vers le dashboard approprié
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.toastService.error('Erreur', response.message);
        }
      },
      error: (error) => {
        this.toastService.error('Erreur', 'Impossible de changer le mot de passe');
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }
}