import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceAuthentification } from '../../services/service-authentification.service';
import { ClientModele } from '../../modeles/client-modele';
import Swal from 'sweetalert2';

interface ChangementMotDePasseDTO {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  client: ClientModele | null = null;
  chargement = true;
  
  modalMotDePasseOuverte = false;
  changementEnCours = false;
  confirmationMotDePasse = '';
  
  donneesChangement: ChangementMotDePasseDTO = {
    ancienMotDePasse: '',
    nouveauMotDePasse: ''
  };

  constructor(private serviceAuth: ServiceAuthentification) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.chargement = true;
    this.serviceAuth.rafraichirProfil().subscribe({
      next: (client) => {
        this.client = client;
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement du profil:', erreur);
        this.client = this.serviceAuth.obtenirClientConnecte();
        this.chargement = false;
      }
    });
  }

  ouvrirModalMotDePasse(): void {
    this.donneesChangement = {
      ancienMotDePasse: '',
      nouveauMotDePasse: ''
    };
    this.confirmationMotDePasse = '';
    this.modalMotDePasseOuverte = true;
  }

  fermerModalMotDePasse(): void {
    this.modalMotDePasseOuverte = false;
  }

  changerMotDePasse(): void {
    if (!this.validerChangementMotDePasse()) return;

    this.changementEnCours = true;
    
    this.serviceAuth.changerMotDePasse(this.donneesChangement).subscribe({
      next: () => {
        this.changementEnCours = false;
        this.fermerModalMotDePasse();
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe modifié',
          text: 'Votre mot de passe a été modifié avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (erreur) => {
        this.changementEnCours = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: erreur.error?.message || 'Erreur lors du changement de mot de passe'
        });
      }
    });
  }

  private validerChangementMotDePasse(): boolean {
    if (!this.donneesChangement.ancienMotDePasse.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Veuillez saisir votre ancien mot de passe'
      });
      return false;
    }

    if (!this.donneesChangement.nouveauMotDePasse.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Veuillez saisir votre nouveau mot de passe'
      });
      return false;
    }

    if (this.donneesChangement.nouveauMotDePasse.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Mot de passe trop court',
        text: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
      return false;
    }

    if (this.donneesChangement.nouveauMotDePasse !== this.confirmationMotDePasse) {
      Swal.fire({
        icon: 'warning',
        title: 'Mots de passe différents',
        text: 'La confirmation du mot de passe ne correspond pas'
      });
      return false;
    }

    if (this.donneesChangement.ancienMotDePasse === this.donneesChangement.nouveauMotDePasse) {
      Swal.fire({
        icon: 'warning',
        title: 'Mots de passe identiques',
        text: 'Le nouveau mot de passe doit être différent de l\'ancien'
      });
      return false;
    }

    return true;
  }

  obtenirSexeLibelle(sexe: string): string {
    return sexe === 'MASCULIN' ? 'Masculin' : 'Féminin';
  }

  calculerAge(): number {
    if (!this.client?.dateNaissance) return 0;
    
    const naissance = new Date(this.client.dateNaissance);
    const aujourd = new Date();
    let age = aujourd.getFullYear() - naissance.getFullYear();
    
    const moisDiff = aujourd.getMonth() - naissance.getMonth();
    if (moisDiff < 0 || (moisDiff === 0 && aujourd.getDate() < naissance.getDate())) {
      age--;
    }
    
    return age;
  }
}