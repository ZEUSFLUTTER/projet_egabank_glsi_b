import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { AuthService } from '../../../services/auth.service';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compte-list.component.html',
  styleUrls: ['./compte-list.component.css']
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];
  loading = true;
  error = '';

  constructor(
    private compteService: CompteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.compteService.getAll().subscribe({
      next: res => { this.comptes = res; this.loading = false; },
      error: err => { this.error = err.error?.message || 'Erreur serveur'; this.loading = false; }
    });
  }

  toggle(compte: Compte): void {
    const action = compte.actif
      ? this.compteService.desactiver(compte.id!)
      : this.compteService.activer(compte.id!);
    action.subscribe(() => this.load());
  }

  supprimer(id: number): void {
    if (!confirm('Suppression définitive. Continuer ?')) return;
    this.compteService.delete(id).subscribe(() => this.load());
  }
}
