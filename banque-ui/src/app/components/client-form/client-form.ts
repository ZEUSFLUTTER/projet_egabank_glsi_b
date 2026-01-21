import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BanqueService } from '../../services/banque.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-form.html'
})
export class ClientForm {
  // Structure conforme au modèle Compte.java
  nouveauCompte: any = {
    typeCompte: 'COURANT',
    solde: 0,
    proprietaire: {
      nom: '',
      prenom: '',
      email: ''
    }
  };

  constructor(
    private banqueService: BanqueService,
    private router: Router
  ) {}

  enregistrer() {
    // On s'assure que le solde est un nombre
    this.nouveauCompte.solde = Number(this.nouveauCompte.solde);

    /**
     * TRÈS IMPORTANT : On appelle ouvrirCompte.
     * C'est le Java qui va générer le numéro EGA-XXXX et l'ID du client.
     */
    this.banqueService.ouvrirCompte(this.nouveauCompte).subscribe({
      next: (response: any) => {
        // Le serveur nous renvoie le compte créé avec son numéro officiel
        alert(`Succès ! Compte ${response.typeCompte} créé.\nNuméro : ${response.numeroCompte}`);
        this.router.navigate(['/clients']);
      },
      error: (err: any) => {
        console.error("Erreur détaillée:", err);
        alert("Erreur lors de l'ouverture du compte. Vérifiez que le serveur est lancé.");
      }
    });
  }
}
