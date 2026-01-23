import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { DepotRequest, RetraitRequest, VirementRequest } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  transactionType: 'DEPOT' | 'RETRAIT' | 'VIREMENT' = 'DEPOT';
  accounts: Account[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  depotData: DepotRequest = {
    numeroCompte: '',
    montant: 0,
    description: ''
  };

  retraitData: RetraitRequest = {
    numeroCompte: '',
    montant: 0,
    description: ''
  };

  virementData: VirementRequest = {
    numeroCompteSource: '',
    numeroCompteDestination: '',
    montant: 0,
    description: ''
  };

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes', error);
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    switch(this.transactionType) {
      case 'DEPOT':
        this.makeDepot();
        break;
      case 'RETRAIT':
        this.makeRetrait();
        break;
      case 'VIREMENT':
        this.makeVirement();
        break;
    }
  }

  makeDepot(): void {
    this.transactionService.depot(this.depotData).subscribe({
      next: () => {
        this.successMessage = 'Dépôt effectué avec succès !';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/transactions']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du dépôt';
        this.isLoading = false;
      }
    });
  }

  makeRetrait(): void {
    this.transactionService.retrait(this.retraitData).subscribe({
      next: () => {
        this.successMessage = 'Retrait effectué avec succès !';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/transactions']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du retrait';
        this.isLoading = false;
      }
    });
  }

  makeVirement(): void {
    this.transactionService.virement(this.virementData).subscribe({
      next: () => {
        this.successMessage = 'Virement effectué avec succès !';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/transactions']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du virement';
        this.isLoading = false;
      }
    });
  }
}
