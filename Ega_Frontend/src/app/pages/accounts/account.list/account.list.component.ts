import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { AccountListDto } from '../../../dto/AccountListDto';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.list.component.html',
  styleUrl: './account.list.component.scss'
})
export class AccountListComponent implements OnInit {

  // Listes de comptes
  public activeAccounts: AccountListDto[] = [];
  public inactiveAccounts: AccountListDto[] = [];

  // États
  public activeTab: 'active' | 'inactive' = 'active';
  public isLoading = false;
  public isProcessing = false;
  public successMessage = '';
  public errorMessage = '';

  // Service
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    this.loadAccounts();
  }

  /**
   * Change l'onglet actif
   */
  switchTab(tab: 'active' | 'inactive'): void {
    this.activeTab = tab;
    this.resetMessages();
  }

  /**
   * Charge les comptes actifs et inactifs
   */
  loadAccounts(): void {
    this.isLoading = true;
    this.resetMessages();

    // Charger les comptes actifs
    this.accountService.listActiveAccounts().subscribe({
      next: (accounts: any) => {
        this.activeAccounts = accounts as AccountListDto[];
        console.log('Comptes actifs :', accounts);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes actifs :', err);
        this.errorMessage = 'Erreur lors du chargement des comptes actifs.';
      }
    });

    // Charger les comptes inactifs
    this.accountService.listInactiveAccounts().subscribe({
      next: (accounts: any) => {
        this.inactiveAccounts = accounts as AccountListDto[];
        this.isLoading = false;
        console.log('Comptes inactifs :', accounts);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes inactifs :', err);
        this.errorMessage = 'Erreur lors du chargement des comptes inactifs.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Supprime un compte (soft delete)
   */
  deleteAccount(accountNumber: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      return;
    }

    this.isProcessing = true;
    this.resetMessages();

    this.accountService.deleteAccount(accountNumber).subscribe({
      next: () => {
        console.log('Compte supprimé :', accountNumber);
        this.successMessage = 'Compte supprimé avec succès.';
        this.isProcessing = false;
        
        // Recharger les listes
        this.loadAccounts();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.errorMessage = 'Erreur lors de la suppression du compte.';
        this.isProcessing = false;
      }
    });
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(date: Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formate le montant pour l'affichage
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Réinitialise les messages
   */
  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}