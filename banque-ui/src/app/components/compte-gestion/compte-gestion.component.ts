import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BanqueService } from '../../services/banque.service';

@Component({
  selector: 'app-compte-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte-gestion.component.html'
})
export class CompteGestionComponent {

  constructor(private banqueService: BanqueService) {}

  // On ajoute 'data: any' pour recevoir 'opForm.value' du HTML
  onVerser(data: any) {
    if (!data.numero || !data.montant) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    this.banqueService.verser(data.numero, data.montant).subscribe({
      next: (res: any) => {
        alert("✅ Versement de " + data.montant + " effectué sur le compte " + data.numero);
      },
      error: (err: any) => {
        alert("❌ Échec : Numéro de compte inexistant.");
      }
    });
  }

  // Idem ici pour le retrait
  onRetirer(data: any) {
    if (!data.numero || !data.montant) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    this.banqueService.retirer(data.numero, data.montant).subscribe({
      next: (res: any) => {
        alert("✅ Retrait effectué avec succès !");
      },
      error: (err: any) => {
        alert("❌ Échec : Solde insuffisant ou compte invalide.");
      }
    });
  }
}
