import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../../compte/services/compte-service';

@Component({
  selector: 'app-retrait-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retrait-modal.html',
  styleUrl: './retrait-modal.css',
})
export class RetraitModal implements OnInit {
  @Input() comptes: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  numeroCompte: string = '';
  montant: number | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  soldeDisponible: number = 0;

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    if (this.comptes.length > 0) {
      this.numeroCompte = this.comptes[0].numeroCompte;
      this.updateSolde();
    }
  }

  onCompteChange() {
    this.updateSolde();
  }

  updateSolde() {
    const compte = this.comptes.find(c => c.numeroCompte === this.numeroCompte);
    this.soldeDisponible = compte ? (compte.solde || 0) : 0;
  }

  onSubmit() {
    this.errorMessage = '';

    // Validations
    if (!this.numeroCompte) {
      this.errorMessage = 'Veuillez sélectionner un compte';
      return;
    }

    if (!this.montant || this.montant <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0';
      return;
    }

    if (this.montant > this.soldeDisponible) {
      this.errorMessage = `Solde insuffisant. Solde disponible : ${this.formatCurrency(this.soldeDisponible)}`;
      return;
    }

    if (this.montant > 100000000) {
      this.errorMessage = 'Le montant est trop élevé (maximum 100 000 000 XOF)';
      return;
    }

    this.loading = true;
    this.compteService.retrait(this.numeroCompte, this.montant).subscribe({
      next: (response) => {
        this.loading = false;
        this.success.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Erreur lors du retrait';
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
