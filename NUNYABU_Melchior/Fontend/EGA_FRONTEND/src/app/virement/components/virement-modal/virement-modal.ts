import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../../compte/services/compte-service';

@Component({
  selector: 'app-virement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './virement-modal.html',
  styleUrl: './virement-modal.css',
})
export class VirementModal implements OnInit {
  @Input() comptes: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  compteSource: string = '';
  compteDestination: string = '';
  montant: number | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  soldeDisponible: number = 0;

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    if (this.comptes.length > 0) {
      this.compteSource = this.comptes[0].numeroCompte;
      this.updateSolde();
    }
  }

  onCompteSourceChange() {
    this.updateSolde();
  }

  updateSolde() {
    const compte = this.comptes.find(c => c.numeroCompte === this.compteSource);
    this.soldeDisponible = compte ? (compte.solde || 0) : 0;
  }

  onSubmit() {
    this.errorMessage = '';

    // Validations
    if (!this.compteSource) {
      this.errorMessage = 'Veuillez sélectionner un compte source';
      return;
    }

    if (!this.compteDestination) {
      this.errorMessage = 'Veuillez saisir le numéro de compte destination';
      return;
    }

    if (this.compteSource === this.compteDestination) {
      this.errorMessage = 'Le compte source et le compte destination ne peuvent pas être identiques';
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
    this.compteService.virement(this.compteSource, this.compteDestination, this.montant).subscribe({
      next: (response) => {
        this.loading = false;
        this.success.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Erreur lors du virement';
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
