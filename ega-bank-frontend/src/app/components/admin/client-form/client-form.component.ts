import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ClientRequest, Sexe } from '../../../models/models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px; max-width: 800px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">{{ isEditMode ? 'Modifier' : 'Nouveau' }} Client</h1>
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div class="grid grid-2">
            <div class="form-group"><label class="form-label">Nom</label><input type="text" [(ngModel)]="client.nom" name="nom" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Prénom</label><input type="text" [(ngModel)]="client.prenom" name="prenom" class="form-control" required /></div>
          </div>
          <div class="grid grid-2">
            <div class="form-group"><label class="form-label">Date de naissance</label><input type="date" [(ngModel)]="client.dateNaissance" name="dateNaissance" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Sexe</label><select [(ngModel)]="client.sexe" name="sexe" class="form-select" required><option value="">Sélectionner</option><option [value]="Sexe.MASCULIN">Masculin</option><option [value]="Sexe.FEMININ">Féminin</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">Email</label><input type="email" [(ngModel)]="client.courriel" name="courriel" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Mot de passe</label><input type="password" [(ngModel)]="client.password" name="password" class="form-control" [required]="!isEditMode" /></div>
          <div class="form-group"><label class="form-label">Téléphone</label><input type="tel" [(ngModel)]="client.telephone" name="telephone" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Adresse</label><input type="text" [(ngModel)]="client.adresse" name="adresse" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Nationalité</label><input type="text" [(ngModel)]="client.nationalite" name="nationalite" class="form-control" required /></div>
          <div style="display: flex; gap: 16px; margin-top: 24px;">
            <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Modifier' : 'Créer' }}</button>
            <button type="button" (click)="cancel()" class="btn btn-outline">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientFormComponent implements OnInit {
  Sexe = Sexe;
  isEditMode = false;
  clientId: number | null = null;
  client: ClientRequest = { nom: '', prenom: '', dateNaissance: '', sexe: Sexe.MASCULIN, adresse: '', telephone: '', courriel: '', nationalite: '', password: '' };
  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clientId = +params['id'];
        this.loadClient(this.clientId);
      }
    });
  }
  loadClient(id: number): void {
    this.adminService.getClient(id).subscribe(client => {
      this.client = { nom: client.nom, prenom: client.prenom, dateNaissance: client.dateNaissance, sexe: client.sexe, adresse: client.adresse, telephone: client.telephone, courriel: client.courriel, nationalite: client.nationalite };
    });
  }
  onSubmit(): void {
    if (this.isEditMode && this.clientId) {
      this.adminService.updateClient(this.clientId, this.client).subscribe(() => this.router.navigate(['/admin/clients']));
    } else {
      this.adminService.createClient(this.client).subscribe(() => this.router.navigate(['/admin/clients']));
    }
  }
  cancel(): void {
    this.router.navigate(['/admin/clients']);
  }
}
