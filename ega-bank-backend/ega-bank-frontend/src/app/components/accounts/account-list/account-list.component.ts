import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes', error);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.isLoading = false;
      }
    });
  }

  deleteAccount(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression du compte');
        }
      });
    }
  }

  getAccountTypeLabel(type: string): string {
    return type === 'COMPTE_EPARGNE' ? 'Épargne' : 'Courant';
  }

  getAccountTypeBadgeClass(type: string): string {
    return type === 'COMPTE_EPARGNE' ? 'bg-success' : 'bg-primary';
  }

  getCountByType(type: string): number {
    return this.accounts.filter(account => account.typeCompte === type).length;
  }
}
