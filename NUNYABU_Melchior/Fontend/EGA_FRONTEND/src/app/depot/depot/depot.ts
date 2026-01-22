import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { CompteService } from '../../compte/services/compte-service';
import { DepotModal } from '../components/depot-modal/depot-modal';
import { TransactionService } from '../../transaction/services/transaction-service';

@Component({
  selector: 'app-depot',
  standalone: true,
  imports: [CommonModule, FormsModule, DepotModal],
  templateUrl: './depot.html',
  styleUrl: './depot.css',
})
export class Depot implements OnInit {
  comptes: any[] = [];
  isModalOpen = false;
  transactions: any[] = [];

  private authService = inject(Auth);

  constructor(
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.chargerComptes();
    this.chargerTransactions();
  }

  chargerComptes() {
    this.compteService.getComptes().subscribe({
      next: data => this.comptes = data,
      error: err => console.error('Erreur récupération comptes', err)
    });
  }

  chargerTransactions() {
    this.transactionService.getHistorique().subscribe({
      next: data => {
        this.transactions = data.filter(t => t.type === 'DEPOT').slice(0, 10);
      },
      error: err => console.error('Erreur récupération transactions', err)
    });
  }

  ouvrirModal() {
    this.isModalOpen = true;
  }

  fermerModal() {
    this.isModalOpen = false;
  }

  onDepotSuccess() {
    this.chargerComptes();
    this.chargerTransactions();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getTotalDepots(): number {
    return this.transactions.reduce((sum: number, t: any) => sum + (t.montant || 0), 0);
  }

  getDernierDepot(): number | null {
    return this.transactions.length > 0 ? (this.transactions[0].montant || 0) : null;
  }
}