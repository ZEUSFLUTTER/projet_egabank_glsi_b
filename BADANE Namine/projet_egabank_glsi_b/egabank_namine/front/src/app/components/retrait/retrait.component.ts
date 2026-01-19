import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-retrait',
  templateUrl: './retrait.component.html',
  styleUrls: ['./retrait.component.scss']
})
export class RetraitComponent {
  compteId: number | null = null;
  montant: number | null = null;
  message = '';
  error = '';

  constructor(private apiService: ApiService) {}

  submitRetrait() {
    if (!this.compteId || !this.montant || this.montant <= 0) {
      this.error = 'Veuillez remplir correctement tous les champs';
      return;
    }

    this.apiService.withdrawal({ 
      compteId: this.compteId, 
      montant: this.montant 
    }).subscribe({
      next: (response) => {
        this.message = 'Retrait effectué avec succès!';
        this.error = '';
        this.compteId = null;
        this.montant = null;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du retrait (solde insuffisant ?): ' + (err.error?.message || 'Erreur serveur');
        this.message = '';
      }
    });
  }
}