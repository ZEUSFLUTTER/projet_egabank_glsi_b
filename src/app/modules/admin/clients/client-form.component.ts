import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../shared/services/client.service';
import { Client } from '../../../shared/models/bank.models';

@Component({
    selector: 'app-client-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">{{ isEditMode ? 'Modifier' : 'Nouveau' }} Client</h2>
      <button class="btn btn-light" [routerLink]="['/admin/clients']">Retour</button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nom</label>
              <input type="text" class="form-control" formControlName="nom" [class.is-invalid]="isInvalid('nom')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Prénom</label>
              <input type="text" class="form-control" formControlName="prenom" [class.is-invalid]="isInvalid('prenom')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Date de naissance</label>
              <input type="date" class="form-control" formControlName="dateNaissance" [class.is-invalid]="isInvalid('dateNaissance')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Sexe</label>
              <select class="form-select" formControlName="sexe" [class.is-invalid]="isInvalid('sexe')">
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label">Adresse</label>
              <input type="text" class="form-control" formControlName="adresse" [class.is-invalid]="isInvalid('adresse')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Téléphone</label>
              <input type="text" class="form-control" formControlName="telephone" [class.is-invalid]="isInvalid('telephone')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" formControlName="email" [class.is-invalid]="isInvalid('email')">
            </div>
            <div class="col-md-6">
              <label class="form-label">Nationalité</label>
              <input type="text" class="form-control" formControlName="nationalite" [class.is-invalid]="isInvalid('nationalite')">
            </div>
          </div>

          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary p-2 fw-bold" [disabled]="clientForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditMode ? 'Mettre à jour' : 'Enregistrer le client' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientFormComponent implements OnInit {
    clientForm: FormGroup;
    isEditMode = false;
    isLoading = false;
    clientId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private clientService: ClientService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.clientForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            prenom: ['', [Validators.required]],
            dateNaissance: ['', [Validators.required]],
            sexe: ['M', [Validators.required]],
            adresse: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            nationalite: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.clientId = this.route.snapshot.paramMap.get('id');
        if (this.clientId) {
            this.isEditMode = true;
            this.clientService.getClientById(this.clientId).subscribe(client => {
                if (client) {
                    this.clientForm.patchValue({
                        ...client,
                        dateNaissance: new Date(client.dateNaissance).toISOString().split('T')[0]
                    });
                }
            });
        }
    }

    isInvalid(controlName: string) {
        const control = this.clientForm.get(controlName);
        return control?.invalid && (control?.dirty || control?.touched);
    }

    onSubmit() {
        if (this.clientForm.valid) {
            this.isLoading = true;
            const data = {
                ...this.clientForm.value,
                dateNaissance: new Date(this.clientForm.value.dateNaissance)
            };

            const obs = this.isEditMode
                ? this.clientService.updateClient(this.clientId!, data)
                : this.clientService.createClient(data);

            obs.subscribe({
                next: () => {
                    alert(`Client ${this.isEditMode ? 'mis à jour' : 'créé'} avec succès !`);
                    this.router.navigate(['/admin/clients']);
                },
                error: () => this.isLoading = false
            });
        }
    }
}
