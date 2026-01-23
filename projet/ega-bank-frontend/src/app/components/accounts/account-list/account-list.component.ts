import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AccountService } from '../../../services/account.service'; // <-- Assure-toi que ce service existe
import { Account } from '../../../models/account.model'; // <-- Modèle Account

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  private isBrowser: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteAccount(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => this.loadAccounts(),
        error: (error) => alert('Erreur lors de la suppression du compte')
      });
    }
  }

  getCountByType(type: string): number {
    return this.accounts.filter(a => a.typeCompte === type).length;
  }
}
