import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// ✅ Interface corrigée
interface Account {
  id: string;
  numeroCompte: string;
  solde: number;
  type: string | null;  // ✅ Accepte null
  devise: string;
}

@Component({
  selector: 'app-accounts',
  imports: [CurrencyPipe, FormsModule, RouterModule, CommonModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  userName = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef  // ✅ Injection
  ) { }

  ngOnInit() {
    // Récupère le nom de l'utilisateur depuis localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Utilisateur"}');
    this.userName = user.name;

    this.loadAccounts();
  }

  loadAccounts() {
    console.log('Chargement des comptes...');
    this.apiService.getMyAccounts().subscribe({
      next: (data) => {
        console.log('Type de data:', typeof data);
        console.log('Est-ce un array?', Array.isArray(data));
        console.log('Nombre de comptes:', data?.length);

        // ✅ Conversion manuelle
        const accountsArray = Array.isArray(data) ? data : [];
        console.log('Tableau final:', accountsArray);

        this.accounts = accountsArray;
        
        // ✅ Force la détection de changement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
      }
    });
  }

  // ✅ Ajoute cette méthode
  trackById(index: number, item: any) {
    return item.id;
  }

  goToTransactions(accountId: string) {
    this.router.navigate(['/transactions'], { queryParams: { accountId } });
  }

  goToTransfer(accountId: string) {
    this.router.navigate(['/transfer'], { queryParams: { sourceAccountId: accountId } });
  }

  goToDeposit(accountId: string) {
    this.router.navigate(['/deposit'], { queryParams: { accountId } });
  }

  goToWithdraw(accountId: string) {  // ✅ Méthode ajoutée
    this.router.navigate(['/withdraw'], { queryParams: { accountId } });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}