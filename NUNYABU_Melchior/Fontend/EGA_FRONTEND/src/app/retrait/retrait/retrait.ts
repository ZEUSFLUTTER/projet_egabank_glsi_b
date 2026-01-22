import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetraitService } from '../services/retrait-service';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-retrait',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retrait.html',
  styleUrl: './retrait.css',
})
export class Retrait implements OnInit {
  retraits: any[] = [];
  statistiques: any = {};
  isModalOpen = false;

  nouveauRetrait = {
    compteId: '',
    montant: 0
  };

  private authService = inject(Auth);

  constructor(private retraitService: RetraitService) {}

  ngOnInit() {
    this.chargerRetraits();
    this.chargerStats();
  }

  chargerRetraits() {
    this.retraitService.getRetraits().subscribe({
      next: data => this.retraits = data,
      error: err => console.error('Erreur récupération retraits', err)
    });
  }

  chargerStats() {
    this.retraitService.getStatistiques().subscribe({
      next: data => this.statistiques = data,
      error: err => console.error('Erreur statistiques', err)
    });
  }

  ouvrirModal() {
    this.isModalOpen = true;
  }

  fermerModal() {
    this.isModalOpen = false;
    this.nouveauRetrait = { compteId: '', montant: 0 };
  }

  effectuerRetrait() {
    const clientId = this.authService.getUserId();
    if (!clientId) return console.error('Client ID introuvable');

    const payload = {
      clientId: clientId,
      compteId: this.nouveauRetrait.compteId,
      montant: this.nouveauRetrait.montant
    };

    this.retraitService.effectuerRetrait(payload).subscribe({
      next: retrait => {
        this.retraits.push(retrait);
        this.chargerStats();
        this.fermerModal();
      },
      error: err => console.error('Erreur retrait', err)
    });
  }

  voirDetails(retrait: any) {
    alert(`Détails du retrait:\nCompte: ${retrait.compteId}\nMontant: ${retrait.montant}`);
  }
}