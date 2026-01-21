import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanqueService } from '../../services/banque.service';

@Component({
  selector: 'app-client-modifier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  // ON COPIE LE HTML ICI POUR ÉVITER TOUT PROBLÈME DE LIEN
  template: `
    <div class="container mt-4">
      <div class="card shadow border-0 p-4" *ngIf="client">
        <h3 class="fw-bold text-warning mb-4">Modifier Client : {{client.nom}}</h3>
        <form (ngSubmit)="enregistrerModif()">
          <div class="mb-3">
            <label class="form-label">Nom</label>
            <input type="text" class="form-control" [(ngModel)]="client.nom" name="nom">
          </div>
          <div class="mb-3">
            <label class="form-label">Prénom</label>
            <input type="text" class="form-control" [(ngModel)]="client.prenom" name="prenom">
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="client.email" name="email">
          </div>
          <div class="mb-3">
            <label class="form-label">Solde</label>
            <input type="number" class="form-control" [(ngModel)]="client.solde" name="solde">
          </div>
          <button type="submit" class="btn btn-warning w-100">Enregistrer les modifications</button>
          <button type="button" class="btn btn-light w-100 mt-2" routerLink="/clients">Annuler</button>
        </form>
      </div>

      <div class="text-center mt-5" *ngIf="!client">
        <div class="spinner-border text-primary"></div>
        <p>Chargement des informations (ID: {{currentId}})...</p>
      </div>
    </div>
  `
})
export class ClientModifier implements OnInit {
  client: any = null;
  currentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private banqueService: BanqueService,
    private router: Router,
    private cdr: ChangeDetectorRef // Ajout pour forcer la mise à jour
  ) {}

  ngOnInit() {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.banqueService.getClientById(this.currentId).subscribe({
       next: (data: any) => {
          console.log("DONNÉES REÇUES :", data);
          this.client = data;
          this.cdr.detectChanges(); // FORCE l'affichage du formulaire
        },
        error: (err: any) => {
          console.error("ERREUR :", err);
          alert("Erreur de chargement");
        }
      });
    }
  }

  enregistrerModif() {
    this.banqueService.updateClient(this.client.id, this.client).subscribe(() => {
      alert("Succès !");
      this.router.navigate(['/clients']);
    });
  }
}
