import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { VirementService } from '../services/virement-service';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './virement.html',
  styleUrl: './virement.css',
})
export class Virement implements OnInit {

  virements: any[] = [];
  statistiques: any = {};
  isModalOpen = false;

  nouveauVirement = {
    compteSource: '',
    compteDestination: '',
    montant: 0
  };

  private authService = inject(Auth);

  constructor(private virementService: VirementService) {}

  ngOnInit() {
    this.chargerVirements();
    this.chargerStats();
  }

  chargerVirements() {
    this.virementService.getVirements().subscribe({
      next: data => this.virements = data,
      error: err => console.error('Erreur chargement virements', err)
    });
  }

  chargerStats() {
    this.virementService.getStatistiques().subscribe({
      next: data => this.statistiques = data,
      error: err => console.error('Erreur stats virements', err)
    });
  }

  ouvrirModal() {
    this.isModalOpen = true;
  }

  fermerModal() {
    this.isModalOpen = false;
    this.nouveauVirement = {
      compteSource: '',
      compteDestination: '',
      montant: 0
    };
  }

  effectuerVirement() {
    const clientId = this.authService.getUserId();
    if (!clientId) return;

    const payload = {
      clientId,
      ...this.nouveauVirement
    };

    this.virementService.effectuerVirement(payload).subscribe({
      next: virement => {
        this.virements.push(virement);
        this.chargerStats();
        this.fermerModal();
      },
      error: err => console.error('Erreur virement', err)
    });
  }

  voirDetails(virement: any) {
    alert(`
Virement
Source: ${virement.compteSource}
Destination: ${virement.compteDestination}
Montant: ${virement.montant} XOF
Date: ${virement.date}
    `);
  }
}