import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-clients',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Gestion des Clients</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addClientModal">
        <i class="bi bi-plus-lg me-2"></i>Nouveau Client
      </button>
    </div>

    <!-- Modal Placeholder -->
    <div class="modal fade" id="addClientModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Ajouter un nouveau client</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" class="form-control" formControlName="nom">
              </div>
              <div class="mb-3">
                <label class="form-label">Prénom</label>
                <input type="text" class="form-control" formControlName="prenom">
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email">
              </div>
              <div class="mb-3">
                <label class="form-label">Type de Compte</label>
                <select class="form-select" formControlName="typeCompte">
                  <option value="COURANT">Courant</option>
                  <option value="EPARGNE">Épargne</option>
                </select>
              </div>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-success" [disabled]="clientForm.invalid">
                  Enregistrer le client
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm p-4 text-center">
      <p class="text-muted">Liste des clients (en attente d'implémentation complète)</p>
    </div>
  `
})
export class AdminClientsComponent implements OnInit {
    clientForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.clientForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            typeCompte: ['COURANT']
        });
    }

    ngOnInit(): void { }

    onSubmit() {
        if (this.clientForm.valid) {
            console.log("Données à envoyer au futur backend Spring Boot:", this.clientForm.value);
            alert('Client ajouté avec succès (Simulation)');
            this.clientForm.reset({ typeCompte: 'COURANT' });
        }
    }
}
