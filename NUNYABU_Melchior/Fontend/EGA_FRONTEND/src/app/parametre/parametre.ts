import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametreService, Parametre } from '../core/services/parametre.service';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametre.html',
  styleUrl: './parametre.css',
})
export class ParametreComponent implements OnInit {
  parametres: Parametre[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  
  newParametre = {
    cle: '',
    valeur: ''
  };

  constructor(private parametreService: ParametreService) { }

  ngOnInit(): void {
    this.loadParametres();
  }

  loadParametres(): void {
    this.loading = true;
    this.parametreService.getParametres().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.parametres = response.data;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des paramètres';
        this.loading = false;
      }
    });
  }

  addParametre(): void {
    if (!this.newParametre.cle?.trim() || !this.newParametre.valeur?.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.parametreService.saveParametre(this.newParametre.cle, this.newParametre.valeur).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Paramètre ajouté avec succès';
          this.newParametre = { cle: '', valeur: '' };
          this.errorMessage = '';
          this.loadParametres();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout du paramètre';
        this.loading = false;
      }
    });
  }

  updateParametre(parametre: Parametre): void {
    this.loading = true;
    this.parametreService.saveParametre(parametre.cle, parametre.valeur).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Paramètre mis à jour avec succès';
          this.errorMessage = '';
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }

  deleteParametre(cle: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
      return;
    }

    this.loading = true;
    this.parametreService.deleteParametre(cle).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Paramètre supprimé avec succès';
          this.errorMessage = '';
          this.loadParametres();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la suppression';
        this.loading = false;
      }
    });
  }
}
