import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Client, Compte } from '../../../models/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="padding: 40px 20px;">
      <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">Détails du Client</h1>
      <div class="grid grid-2" *ngIf="client">
        <div class="card">
          <h2 style="font-size: 24px; margin-bottom: 20px;">Informations personnelles</h2>
          <p><strong>Nom:</strong> {{ client.prenom }} {{ client.nom }}</p>
          <p><strong>Email:</strong> {{ client.courriel }}</p>
          <p><strong>Téléphone:</strong> {{ client.telephone }}</p>
          <p><strong>Adresse:</strong> {{ client.adresse }}</p>
          <p><strong>Nationalité:</strong> {{ client.nationalite }}</p>
          <p><strong>Date de naissance:</strong> {{ client.dateNaissance }}</p>
          <p><strong>Sexe:</strong> {{ client.sexe }}</p>
          <div style="margin-top: 24px;">
            <a [routerLink]="['/admin/clients', client.id, 'edit']" class="btn btn-primary" style="margin-right: 12px;">Modifier</a>
            <a [routerLink]="['/admin/clients', client.id, 'historique']" class="btn btn-secondary" style="margin-right: 12px;">Historique</a>
            <a [routerLink]="['/admin/clients', client.id, 'operations']" class="btn btn-success">Effectuer une opération</a>
          </div>
        </div>
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="font-size: 24px; margin: 0;">Comptes bancaires</h2>
            <a [routerLink]="['/admin/clients', client.id, 'create-compte']" class="btn btn-primary">
              + Créer un compte
            </a>
          </div>
          
          <div *ngIf="comptes.length === 0" style="text-align: center; padding: 40px; color: #666;">
            <p>Aucun compte bancaire pour ce client</p>
            <a [routerLink]="['/admin/clients', client.id, 'create-compte']" class="btn btn-outline">
              Créer le premier compte
            </a>
          </div>
          
          <div *ngFor="let compte of comptes" style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <p><strong>Numéro:</strong> {{ compte.numeroCompte }}</p>
                <p><strong>Type:</strong> <span class="badge" [class.badge-primary]="compte.type === 'COURANT'" [class.badge-success]="compte.type === 'EPARGNE'">{{ compte.type }}</span></p>
                <p><strong>Solde:</strong> {{ compte.solde | number:'1.2-2' }} FCFA</p>
                <p><strong>Date de création:</strong> {{ compte.dateCreation }}</p>
              </div>
              <div style="margin-left: 16px;">
                <a [routerLink]="['/admin/clients', client.id, 'operations']" 
                   [queryParams]="{compte: compte.numeroCompte}"
                   class="btn btn-sm btn-outline">
                  Opération
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  comptes: Compte[] = [];
  constructor(private adminService: AdminService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadClient(id);
      this.loadComptes(id);
    });
  }
  loadClient(id: number): void {
    this.adminService.getClient(id).subscribe(client => this.client = client);
  }
  loadComptes(clientId: number): void {
    this.adminService.getComptesByClient(clientId).subscribe(comptes => this.comptes = comptes);
  }
}
