import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Nécessaire pour les formulaires
import { AdminService } from '../../_services/admin.service';
import { AuthService } from '../../_services/auth.service';
import { Transaction, User } from '../../_models/models';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './admin-transactions.component.html',
})
export class AdminTransactionsComponent implements OnInit {
  adminService = inject(AdminService);
  authService = inject(AuthService);

  transactions: Transaction[] = [];
  isLoading = true;
  isSidebarOpen = false;
  currentUser: User | null = null;
  
  showDepositModal = false;
  depositForm = {
    numeroCompte: '',
    montant: null as number | null
  };
  isSubmitting = false;

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.adminService.getAllTransactions().subscribe({
      next: (data) => { this.transactions = data; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  submitDeposit() {
    if (!this.depositForm.numeroCompte || !this.depositForm.montant || this.depositForm.montant <= 0) {
      Swal.fire('Erreur', 'Veuillez saisir un numéro de compte et un montant valide.', 'warning');
      return;
    }

    this.isSubmitting = true;

    this.adminService.effectuerDepot(this.depositForm.numeroCompte, this.depositForm.montant).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showDepositModal = false;

        Swal.fire({
          icon: 'success',
          title: 'Dépôt effectué !',
          text: `Le versement de ${this.depositForm.montant} FCFA sur le compte ${this.depositForm.numeroCompte} a réussi.`,
          confirmButtonColor: '#9308C8'
        });

        // Réinitialiser et recharger l'historique
        this.depositForm = { numeroCompte: '', montant: null };
        this.loadTransactions();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        Swal.fire('Erreur', err.error?.message || 'Transaction échouée. Vérifiez le numéro de compte.', 'error');
      }
    });
  }

  logout() { this.authService.logout(); }
}
