import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServiceAuthentification } from '../../services/service-authentification.service';
import { StockageJeton } from '../../coeur/stockage-jeton';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent {
  nomUtilisateur = '';
  motDePasse = '';

  chargement = false;
  messageErreur = '';

  constructor(
    private serviceAuth: ServiceAuthentification,
    private routeur: Router,
    private routeActive: ActivatedRoute
  ) {}

  seConnecter(): void {
    this.messageErreur = '';
    const nom = this.nomUtilisateur.trim();
    const mdp = this.motDePasse.trim();
    if (!nom || !mdp) {
      this.messageErreur = "Veuillez renseigner le nom d'utilisateur et le mot de passe.";
      return;
    }
    this.chargement = true;
    this.serviceAuth.connexion(nom, mdp).subscribe({
      next: () => {
        StockageJeton.enregistrerNomUtilisateur(nom);
        this.chargement = false;
        const retour = this.routeActive.snapshot.queryParamMap.get('retour');
        this.routeur.navigateByUrl(retour || '/application/tableau-de-bord');
      },
      error: (err) => {
        this.chargement = false;
        this.messageErreur =
          err === 'Identifiants incorrects'
            ? 'Identifiants incorrects.'
            : (typeof err === 'string' ? err : 'Identifiants incorrects ou serveur indisponible.');
      },
    });
  }
}
