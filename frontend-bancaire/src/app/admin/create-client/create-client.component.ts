import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // <--- Chemin corrigé
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Nécessaire pour ngModel

interface NewClientData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string; // Format YYYY-MM-DD
  sexe?: string; // M, F, etc.
  nationalite?: string;
  // Ajoute d'autres champs si nécessaire
}

@Component({
  selector: 'app-admin-create-client',
  imports: [CommonModule, FormsModule], // Ajoute FormsModule
  templateUrl: './create-client.component.html', // Référence le fichier HTML
  styleUrls: ['./create-client.component.css'],  // Référence le fichier CSS
})
export class AdminCreateClientComponent {
  clientData: NewClientData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    sexe: '',
    nationalite: ''
  };

  loading = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService, // <--- Injection corrigée
    private router: Router
  ) {}

  createClient() {
    if (this.loading) return; // Empêche les soumissions multiples

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('Envoi des données client:', this.clientData);
    this.apiService.postData('admin/client/create', this.clientData).subscribe({
      next: (response: any) => { // <--- CORRIGÉ : Typage explicite de 'response'
        console.log('Client créé avec succès:', response); // 'response' est maintenant connu
        this.successMessage = 'Client créé avec succès !';
        this.errorMessage = '';
        // Optionnel : Réinitialiser le formulaire
        this.clientData = {
          nom: '',
          prenom: '',
          email: '',
          password: '',
          telephone: '',
          adresse: '',
          dateNaissance: '',
          sexe: '',
          nationalite: ''
        };
        // Rediriger vers la liste des clients après un court délai
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500); // Délai de 1.5 secondes pour laisser le temps de lire le message
        // OU sans délai :
        // this.router.navigate(['/admin']);
      },
      error: (err: any) => { // <--- Typage explicite de 'err'
        console.error('Erreur lors de la création du client:', err);
        // Gestion d'erreur
        if (err.status === 400 && err.error && err.error.message) {
          // Ex: "Client exists"
          this.errorMessage = err.error.message || 'Erreur de validation.';
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur serveur interne.';
        } else {
          this.errorMessage = 'Erreur lors de la création du client.'; // Message générique
        }
        this.successMessage = '';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}