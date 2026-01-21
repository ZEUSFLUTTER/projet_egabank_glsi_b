import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanqueService } from '../../services/banque.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Ajouté pour la barre de recherche

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // FormsModule ajouté ici
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  clients: any[] = [];
  clientsFiltres: any[] = []; // Liste affichée à l'écran
  searchTerm: string = '';    // Texte tapé dans la barre de recherche

  constructor(
    private banqueService: BanqueService,
    private router: Router
  ) {}

  ngOnInit() {
    this.chargerClients();
  }

  chargerClients() {
    this.banqueService.getClients().subscribe({
      next: (donnees) => {
        this.clients = donnees;
        this.clientsFiltres = donnees; // On initialise la liste filtrée
      },
      error: (err) => {
        console.error("Erreur lors du chargement des clients", err);
      }
    });
  }

  // Fonction de recherche en temps réel
  filtrerClients(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.clientsFiltres = this.clients;
    } else {
      this.clientsFiltres = this.clients.filter(c =>
        c.nom?.toLowerCase().includes(term) ||
        c.prenom?.toLowerCase().includes(term) ||
        c.numeroCompte?.toLowerCase().includes(term) ||
        c.compte?.numeroCompte?.toLowerCase().includes(term)
      );
    }
  }

  voirDetails(c: any) {
    this.router.navigate(['/client-details', c.id]);
  }

  supprimerClient(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ce client ?")) {
      this.banqueService.supprimerClient(id).subscribe(() => {
        this.chargerClients();
      });
    }
  }

  modifierClient(c: any) {
    this.router.navigate(['/modifier-client', c.id]);
  }

  ajouterClient() {
    this.router.navigate(['/nouveau-client']);
  }
}
