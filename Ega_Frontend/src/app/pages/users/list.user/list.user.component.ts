import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ListUserDto } from '../../../dto/ListUserDto';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.user.component.html',
  styleUrl: './list.user.component.scss'
})
export class ListUserComponent implements OnInit {

  // Listes d'utilisateurs
  public activeUsers: ListUserDto[] = [];
  public inactiveUsers: ListUserDto[] = [];

  // États
  public activeTab: 'active' | 'inactive' = 'active';
  public isLoading = false;
  public isProcessing = false;
  public successMessage = '';
  public errorMessage = '';

  // Service
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Change l'onglet actif
   */
  switchTab(tab: 'active' | 'inactive'): void {
    this.activeTab = tab;
    this.resetMessages();
  }

  /**
   * Charge les utilisateurs actifs et inactifs
   */
  loadUsers(): void {
    this.isLoading = true;
    this.resetMessages();

    // Charger les utilisateurs actifs
    this.authService.getActiveUsers().subscribe({
      next: (users) => {
        this.activeUsers = users as ListUserDto[];
        console.log('Utilisateurs actifs :', users);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs actifs :', err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs actifs.';
      }
    });

    // Charger les utilisateurs inactifs
    this.authService.getInactiveUsers().subscribe({
      next: (users) => {
        this.inactiveUsers = users as ListUserDto[];
        this.isLoading = false;
        console.log('Utilisateurs inactifs :', users);
      },

      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs inactifs :', err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs inactifs.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Désactive un utilisateur
   */
  deactivateUser(matricule: string): void {
    if (!confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      return;
    }

    this.isProcessing = true;
    this.resetMessages();

    this.authService.deactivateUser(matricule).subscribe({
      next: () => {
        console.log('Utilisateur désactivé :', matricule);
        this.successMessage = 'Utilisateur désactivé avec succès.';
        this.isProcessing = false;
        
        // Recharger les listes
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors de la désactivation :', err);
        this.errorMessage = 'Erreur lors de la désactivation de l\'utilisateur.';
        this.isProcessing = false;
      }
    });
  }

  /**
   * Active un utilisateur
   */
  activateUser(matricule: string): void {
    if (!confirm('Êtes-vous sûr de vouloir activer cet utilisateur ?')) {
      return;
    }

    this.isProcessing = true;
    this.resetMessages();

    this.authService.activateUser(matricule).subscribe({
      next: () => {
        console.log('Utilisateur activé :', matricule);
        this.successMessage = 'Utilisateur activé avec succès.';
        this.isProcessing = false;
        
        // Recharger les listes
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors de l\'activation :', err);
        this.errorMessage = 'Erreur lors de l\'activation de l\'utilisateur.';
        this.isProcessing = false;
      }
    });
  }

  /**
   * Réinitialise les messages
   */
  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}