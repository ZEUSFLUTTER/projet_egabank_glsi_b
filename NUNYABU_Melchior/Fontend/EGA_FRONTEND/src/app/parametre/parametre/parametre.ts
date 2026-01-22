import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametreService, Parametre } from '../../core/services/parametre.service';

@Component({
  selector: 'app-parametre',
  imports: [CommonModule, FormsModule],
  templateUrl: './parametre.html',
  styleUrl: './parametre.css',
})
export class ParametreComponent implements OnInit {
  parametres: Parametre[] = [];
  newParametre: Parametre = { cle: '', valeur: '' };
  loading = false;
  successMessage = '';
  errorMessage = '';
  editingId: number | null = null;

  constructor(private parametreService: ParametreService) { }

  ngOnInit(): void {
    this.loadParametres();
  }

  loadParametres(): void {
    this.loading = true;
    this.parametreService.getParametres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.parametres = response.data || [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des paramètres';
        this.loading = false;
      }
    });
  }

  saveParametre(): void {
    if (!this.newParametre.cle || !this.newParametre.valeur) {
      this.errorMessage = 'La clé et la valeur sont obligatoires';
      return;
    }

    this.loading = true;
    this.parametreService.saveParametre(this.newParametre.cle, this.newParametre.valeur).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = response.message;
          this.newParametre = { cle: '', valeur: '' };
          this.loadParametres();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la sauvegarde';
        this.loading = false;
      }
    });
  }

  deleteParametre(cle: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
      this.parametreService.deleteParametre(cle).subscribe({
        next: (response: any) => {
          this.successMessage = 'Paramètre supprimé avec succès';
          this.loadParametres();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
