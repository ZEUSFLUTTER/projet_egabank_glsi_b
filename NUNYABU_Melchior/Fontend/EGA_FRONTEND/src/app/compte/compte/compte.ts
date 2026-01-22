import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompteService } from '../services/compte-service';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte.html',
  styleUrl: './compte.css',
})
export class Compte implements OnInit {

  comptes: any[] = [];
  isFormOpen = false;
  errorMessage: string = '';
  successMessage: string = '';
  private authService = inject(Auth);

  nouveauCompte: any = {
    typeCompte: 'COURANT'
  };

  constructor(private compteService: CompteService) {}

  ngOnInit() {
    this.chargerComptes();
  }

  chargerComptes() {
    this.compteService.getComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        console.log('✅ Comptes chargés:', data);
      },
      error: (err) => {
        console.error('❌ Erreur récupération comptes', err);
        this.errorMessage = `Erreur: ${err.error?.message || err.error?.error || err.statusText}`;
      }
    });
  }

  ouvrirFormulaire() {
    this.isFormOpen = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  fermerFormulaire() {
    this.isFormOpen = false;
    this.nouveauCompte = { typeCompte: 'COURANT' };
    this.errorMessage = '';
    this.successMessage = '';
  }

  creerCompte() {
    this.errorMessage = '';
    this.successMessage = '';
    
    const clientId = this.authService.getUserId();
    
    if (!clientId) {
      this.errorMessage = '❌ Client ID non trouvé. Connectez-vous à nouveau.';
      console.error('Client ID not found');
      return;
    }

    if (!this.nouveauCompte.typeCompte) {
      this.errorMessage = '❌ Veuillez sélectionner un type de compte';
      return;
    }

    const payload = {
      clientId: parseInt(clientId),
      typeCompte: this.nouveauCompte.typeCompte
    };

    console.log('📤 Envoi requête création compte:', payload);

    this.compteService.creerCompte(payload).subscribe({
      next: (response: any) => {
        console.log('✅ Compte créé avec succès!');
        console.log('📥 Response complète:', response);
        console.log('📥 Response status:', response.status);
        console.log('📥 Response body:', response.body || response);
        this.successMessage = '✅ Compte créé avec succès !';
        this.chargerComptes();
        setTimeout(() => this.fermerFormulaire(), 2000);
      },
      error: (err) => {
        console.error('❌ Erreur création compte:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ StatusText:', err.statusText);
        console.error('❌ Error Object:', err.error);
        const message = err.error?.error || err.error?.message || err.statusText || 'Erreur inconnue';
        this.errorMessage = `❌ Erreur: ${message}`;
      }
    });
  }

  voirDetails(compte: any) {
    alert(`Détails du compte ${compte.numeroCompte}\n\nType: ${compte.typeCompte}\nSolde: ${compte.solde} EUR\nStatut: ${compte.statut}`);
  }

  supprimerCompte(compteId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.supprimerCompte(compteId).subscribe({
        next: () => {
          this.comptes = this.comptes.filter(c => c.id !== compteId);
          this.successMessage = '✅ Compte supprimé avec succès';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur suppression compte', err);
          this.errorMessage = `❌ Erreur: ${err.error?.message || err.statusText}`;
        }
      });
    }
  }
}