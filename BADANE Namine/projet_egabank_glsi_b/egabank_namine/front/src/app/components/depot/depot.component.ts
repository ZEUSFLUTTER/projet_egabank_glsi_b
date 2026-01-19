import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.scss']
})
export class DepotComponent {
  compteId: number | null = null;
  montant: number | null = null;
  message = '';
  error = '';

  constructor(private apiService: ApiService) {}

  submitDepot() {
    if (!this.compteId || !this.montant || this.montant <= 0) {
      this.error = 'Veuillez remplir correctement tous les champs';
      return;
    }

    this.apiService.deposit({ 
      compteId: this.compteId, 
      montant: this.montant 
    }).subscribe({
      next: (response) => {
        this.message = 'Dépôt effectué avec succès!';
        this.error = '';
        this.compteId = null;
        this.montant = null;
      },
      error: (err: any) => { // Explicit type for err
        this.error = 'Erreur lors du dépôt: ' + (err.error?.message || 'Erreur serveur');
        this.message = '';
      }
    });
  }
}