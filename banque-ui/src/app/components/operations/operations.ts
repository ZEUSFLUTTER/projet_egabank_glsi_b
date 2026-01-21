import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BanqueService } from '../../services/banque.service';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operations.html'
})
export class OperationsComponent implements OnInit {
  clients: any[] = [];

  // ON DÉCLARE LES VARIABLES ICI POUR QU'ELLES NE SOIENT PLUS EN ROUGE
  selectedClientId: any = '';
  montant: number = 0;
  typeOp: string = 'VERSEMENT';

  constructor(private banqueService: BanqueService) {}

  ngOnInit() {
    this.chargerClients();
  }

  chargerClients() {
    this.banqueService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => console.error("Erreur de chargement", err)
    });
  }

  validerOperation() {
    // On cherche le client dans la liste grâce à l'ID sélectionné dans le HTML
    const clientSelectionne = this.clients.find(c => c.id == this.selectedClientId);

    if (!clientSelectionne) {
      alert("Veuillez sélectionner un client valide.");
      return;
    }

    // On récupère son numéro de compte (ex: EGA-68925)
    const numeroAEnvoyer = clientSelectionne.numeroCompte;

    if (this.typeOp === 'VERSEMENT') {
      this.banqueService.verser(numeroAEnvoyer, this.montant).subscribe({
        next: (res) => {
          alert("Succès ! Versement effectué sur le compte " + numeroAEnvoyer);
          this.reinitialiser();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur : Le compte " + numeroAEnvoyer + " n'a pas été trouvé en base.");
        }
      });
    } else {
      this.banqueService.retirer(numeroAEnvoyer, this.montant).subscribe({
        next: (res) => {
          alert("Succès ! Retrait effectué.");
          this.reinitialiser();
        },
        error: (err) => alert("Erreur : Solde insuffisant ou compte inexistant.")
      });
    }
  }

  reinitialiser() {
    this.montant = 0;
    this.selectedClientId = '';
    this.chargerClients(); // Pour rafraîchir les soldes affichés
  }
}
