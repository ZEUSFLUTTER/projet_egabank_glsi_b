import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { AuthService } from '../../../services/auth.service';
import { Compte, TypeCompte } from '../../../models/compte.model';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compte-list.component.html',
  styleUrl: './compte-list.component.css'
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];
  loading = false;
  errorMessage: string = '';
  TypeCompte = TypeCompte;

  constructor(
    private compteService: CompteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.loading = true;
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des comptes';
        this.loading = false;
      }
    });
  }

  deleteCompte(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.deleteCompte(id).subscribe({
        next: () => {
          this.loadComptes();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }
}

