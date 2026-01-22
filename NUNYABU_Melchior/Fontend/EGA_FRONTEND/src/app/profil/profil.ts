import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilService, ClientDTO } from '../core/services/profil.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProfilService],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent implements OnInit {
  profil: ClientDTO = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    email: '',
    nationalite: ''
  };
  
  isEditing = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(private profilService: ProfilService) { }

  ngOnInit(): void {
    this.loadProfil();
  }

  loadProfil(): void {
    this.loading = true;
    this.profilService.getProfil().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.profil = response.data;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement du profil';
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  saveProfil(): void {
    // Validation client-side
    this.fieldErrors = {};
    
    if (!this.profil.nom?.trim()) {
      this.fieldErrors['nom'] = 'Le nom est obligatoire';
    }
    if (!this.profil.prenom?.trim()) {
      this.fieldErrors['prenom'] = 'Le prénom est obligatoire';
    }
    if (!this.profil.dateNaissance) {
      this.fieldErrors['dateNaissance'] = 'La date de naissance est obligatoire';
    }
    if (!this.profil.sexe?.trim()) {
      this.fieldErrors['sexe'] = 'Le sexe est obligatoire';
    }
    if (!this.profil.adresse?.trim()) {
      this.fieldErrors['adresse'] = 'L\'adresse est obligatoire';
    }
    if (!this.profil.telephone?.trim()) {
      this.fieldErrors['telephone'] = 'Le téléphone est obligatoire';
    }
    if (!this.profil.email?.trim()) {
      this.fieldErrors['email'] = 'L\'email est obligatoire';
    } else if (!this.isValidEmail(this.profil.email)) {
      this.fieldErrors['email'] = 'L\'email n\'est pas valide';
    }
    if (!this.profil.nationalite?.trim()) {
      this.fieldErrors['nationalite'] = 'La nationalité est obligatoire';
    }

    if (Object.keys(this.fieldErrors).length > 0) {
      this.errorMessage = 'Veuillez corriger les erreurs ci-dessus';
      return;
    }

    this.loading = true;
    this.profilService.updateProfil(this.profil).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = response.message;
          this.isEditing = false;
          this.fieldErrors = {};
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (err: any) => {
        if (err.error?.errors) {
          this.fieldErrors = err.error.errors;
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        }
        this.loading = false;
      }
    });
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  cancelEdit(): void {
    this.loadProfil();
    this.isEditing = false;
    this.fieldErrors = {};
    this.errorMessage = '';
  }
}
