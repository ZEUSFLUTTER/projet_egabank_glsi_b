import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html',
  styleUrls: ['./virement.component.scss']
})
export class VirementComponent {
  compteSourceId: number | null = null;
  compteDestinationId: number | null = null;
  montant: number | null = null;
  message: string = '';
  error: string = '';

  constructor(private apiService: ApiService) {}

  onSubmit(): void {
    this.message = '';
    this.error = '';
    if (!this.compteSourceId || !this.compteDestinationId || !this.montant || this.montant <= 0) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }
    this.apiService.transfer({
      compteSourceId: this.compteSourceId,
      compteDestinationId: this.compteDestinationId,
      montant: this.montant
    }).subscribe({
      next: (response) => {
        this.message = 'Virement effectué avec succès';
        this.compteSourceId = null;
        this.compteDestinationId = null;
        this.montant = null;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du virement: ' + (err.error?.message || 'Erreur serveur');
      }
    });
  }
}