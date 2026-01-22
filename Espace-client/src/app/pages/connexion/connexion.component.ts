import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceAuthentification } from '../../services/service-authentification.service';
import { ConnexionClientDTO } from '../../modeles/client-modele';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  connexionEnCours = false;
  donnees: ConnexionClientDTO = {
    courriel: '',
    motDePasse: ''
  };

  constructor(
    private serviceAuth: ServiceAuthentification,
    private router: Router
  ) {
    if (this.serviceAuth.estConnecte()) {
      this.router.navigate(['/tableau-de-bord']);
    }
  }

  connecter(): void {
    if (!this.validerFormulaire()) return;

    this.connexionEnCours = true;

    this.serviceAuth.connecter(this.donnees).subscribe({
      next: (reponse) => {
        this.connexionEnCours = false;
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          text: `Bienvenue ${reponse.client.prenom} !`,
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/tableau-de-bord']);
      },
      error: (erreur) => {
        this.connexionEnCours = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: erreur.error?.message || 'Email ou mot de passe incorrect'
        });
      }
    });
  }

  private validerFormulaire(): boolean {
    if (!this.donnees.courriel.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Veuillez saisir votre email'
      });
      return false;
    }

    if (!this.donnees.motDePasse.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Veuillez saisir votre mot de passe'
      });
      return false;
    }

    return true;
  }
}