import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanqueService } from '../../services/banque.service';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-details.html'
})
export class ClientDetails implements OnInit {
  // On initialise à null pour pouvoir afficher un message de chargement dans le HTML
  client: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private banqueService: BanqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonneesClient();
  }

  /**
   * Cette méthode récupère l'ID dans l'URL et appelle le backend
   * pour obtenir les informations les plus récentes (nom, solde, etc.)
   */
  chargerDonneesClient(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.banqueService.getClientById(id).subscribe({
        next: (data: any) => {
          console.log("Données reçues du serveur :", data);
          this.client = data;

          // Force Angular à vérifier si les données ont changé pour mettre à jour la vue
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error("Erreur lors de la récupération des détails :", err);
          this.errorMessage = "Impossible de charger les détails du client. Vérifiez la connexion au serveur.";
        }
      });
    } else {
      this.errorMessage = "ID du client introuvable dans l'URL.";
    }
  }

  /**
   * Optionnel : Une méthode pour rafraîchir manuellement si besoin
   */
  refresh(): void {
    this.chargerDonneesClient();
  }
}
