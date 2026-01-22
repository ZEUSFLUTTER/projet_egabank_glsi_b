import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../../../compte/services/compte-service';

@Component({
  selector: 'app-depot-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depot-modal.html',
  styleUrl: './depot-modal.css',
})
export class DepotModal implements OnInit {
  @Input() comptes: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  numeroCompte: string = '';
  montant: number | null = null;
  source: string = 'MOBILE_MONEY';
  errorMessage: string = '';
  loading: boolean = false;

  sources = [
    { value: 'MOBILE_MONEY', label: 'Mobile Money' },
    { value: 'ESPECES', label: 'Espèces' },
    { value: 'VIREMENT', label: 'Virement' },
    { value: 'CHEQUE', label: 'Chèque' }
  ];

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    if (this.comptes.length > 0) {
      this.numeroCompte = this.comptes[0].numeroCompte;
    }
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

    if (this.montant > 100000000) {
      this.errorMessage = 'Le montant est trop élevé (maximum 100 000 000 XOF)';
      return;
    }

    this.loading = true;
    this.compteService.depot(this.numeroCompte, this.montant, this.source).subscribe({
      next: (response) => {
        this.loading = false;
        this.success.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Erreur lors du dépôt';
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
