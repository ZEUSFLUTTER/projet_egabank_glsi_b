import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceReleves } from '../../services/service-releves.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-releves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './releves.component.html',
  styleUrls: ['./releves.component.css'],
})
export class RelevesComponent implements OnInit{
  messageErreur = '';
  messageSucces = '';

  erreurModal = '';
  telechargementEnCours = false;

  numeroCompte = '';
  dateDebut = '2026-01-01';
  dateFin = '2026-12-31';

  constructor(
    private serviceReleves: ServiceReleves,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['ajout'] === 'true') {
      this.ouvrirModalReleve();
    }
  });
}


  telecharger(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.erreurModal = '';

    const iban = this.numeroCompte.trim();
    if (!iban) {
      this.erreurModal = 'Veuillez saisir un IBAN.';
      return;
    }

    if (!this.dateDebut || !this.dateFin) {
      this.erreurModal = 'Veuillez choisir une date de début et une date de fin.';
      return;
    }

    if (this.dateDebut > this.dateFin) {
      this.erreurModal = 'La date de début doit être avant la date de fin.';
      return;
    }

    this.telechargementEnCours = true;

    this.serviceReleves.telechargerPdf(iban, this.dateDebut, this.dateFin).subscribe({
      next: (blob) => {
        this.telechargementEnCours = false;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `releve_${iban}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.messageSucces = 'Relevé téléchargé.';

        const el = document.getElementById('modalReleve');
        if (el) {
          const modal = bootstrap?.Modal.getOrCreateInstance(el);
          modal?.hide();
        }
      },
      error: (e) => {
        this.telechargementEnCours = false;
        this.erreurModal = e?.error?.message || 'Téléchargement impossible.';
      },
    });
  }
  ouvrirModalReleve(): void {
    this.erreurModal = '';

    setTimeout(() => {
      const el = document.getElementById('modalReleve');
      if (el) {
        bootstrap?.Modal.getOrCreateInstance(el).show();
      }
    });

    this.router.navigate([], {
      queryParams: { ajout: null },
      queryParamsHandling: 'merge'
    });
  }

}
