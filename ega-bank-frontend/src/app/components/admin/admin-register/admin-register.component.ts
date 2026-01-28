import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminRequest, Sexe } from '../../../models/models';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 20px; max-width: 800px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Créer un compte Admin</h1>
      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div class="grid grid-2">
            <div class="form-group"><label class="form-label">Nom</label><input type="text" [(ngModel)]="admin.nom" name="nom" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Prénom</label><input type="text" [(ngModel)]="admin.prenom" name="prenom" class="form-control" required /></div>
          </div>
          <div class="form-group"><label class="form-label">Email</label><input type="email" [(ngModel)]="admin.courriel" name="courriel" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Mot de passe</label><input type="password" [(ngModel)]="admin.password" name="password" class="form-control" required /></div>
          <div class="grid grid-2">
            <div class="form-group"><label class="form-label">Date de naissance</label><input type="date" [(ngModel)]="admin.dateNaissance" name="dateNaissance" class="form-control" required /></div>
            <div class="form-group"><label class="form-label">Sexe</label><select [(ngModel)]="admin.sexe" name="sexe" class="form-select" required><option value="">Sélectionner</option><option [value]="Sexe.MASCULIN">Masculin</option><option [value]="Sexe.FEMININ">Féminin</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">Téléphone</label><input type="tel" [(ngModel)]="admin.telephone" name="telephone" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Adresse</label><input type="text" [(ngModel)]="admin.adresse" name="adresse" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Nationalité</label><input type="text" [(ngModel)]="admin.nationalite" name="nationalite" class="form-control" required /></div>
          <button type="submit" class="btn btn-primary">Créer Admin</button>
        </form>
      </div>
    </div>
  `
})
export class AdminRegisterComponent {
  Sexe = Sexe;
  admin: AdminRequest = { nom: '', prenom: '', dateNaissance: '', sexe: Sexe.MASCULIN, adresse: '', telephone: '', courriel: '', nationalite: '', password: '' };
  errorMessage = '';
  successMessage = '';
  constructor(private adminService: AdminService, private router: Router) {}
  onSubmit(): void {
    this.adminService.registerAdmin(this.admin).subscribe({
      next: () => {
        this.successMessage = 'Admin créé avec succès!';
        setTimeout(() => this.router.navigate(['/admin/dashboard']), 2000);
      },
      error: () => this.errorMessage = 'Erreur lors de la création'
    });
  }
}
