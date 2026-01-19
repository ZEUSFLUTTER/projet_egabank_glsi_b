import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientBankService } from '../../../shared/services/client-bank.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../shared/models/bank.models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-client-profil',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container py-4 text-dark" *ngIf="profile$ | async as p">
      <h2 class="fw-bold mb-4">Mon Profil</h2>

      <div class="row g-4">
        <!-- Informations personnelles -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm p-4 h-100">
            <h5 class="fw-bold mb-4"><i class="bi bi-person-badge me-2 text-primary"></i>Informations Personnelles</h5>
            
            <div class="mb-3">
              <label class="small text-muted d-block">Nom & Prénom</label>
              <div class="fw-bold fs-5">{{ p.prenom }} {{ p.nom }}</div>
            </div>
            
            <div class="mb-3">
              <label class="small text-muted d-block">Adresse e-mail</label>
              <div class="fw-bold">{{ p.email }}</div>
            </div>

            <div class="mb-3">
              <label class="small text-muted d-block">Numéro de téléphone</label>
              <div class="fw-bold">{{ p.telephone }}</div>
            </div>

            <div class="mb-3">
              <label class="small text-muted d-block">Adresse de résidence</label>
              <div class="fw-bold">{{ p.adresse }}</div>
            </div>

            <div class="row">
              <div class="col-6">
                <label class="small text-muted d-block">Nationalité</label>
                <div class="fw-bold">{{ p.nationalite }}</div>
              </div>
              <div class="col-6">
                <label class="small text-muted d-block">Inscrit depuis le</label>
                <div class="fw-bold">{{ p.dateInscription | date:'dd/MM/yyyy' }}</div>
              </div>
            </div>

            <div class="alert alert-warning border-0 mt-4 small">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Pour modifier vos informations personnelles, veuillez contacter votre conseiller en agence.
            </div>
          </div>
        </div>

        <!-- Changement de mot de passe -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm p-4 h-100">
            <h5 class="fw-bold mb-4"><i class="bi bi-shield-lock me-2 text-primary"></i>Sécurité</h5>
            <p class="text-muted small">Changez votre mot de passe régulièrement pour protéger votre compte.</p>
            
            <form [formGroup]="pwdForm" (ngSubmit)="onPasswordSubmit()">
              <div class="mb-3">
                <label class="form-label fw-bold">Mot de passe actuel</label>
                <input type="password" class="form-control" formControlName="currentPwd">
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Nouveau mot de passe</label>
                <input type="password" class="form-control" formControlName="newPwd">
                <div class="form-text small">Minimum 8 caractères, incluant des chiffres et symboles.</div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold">Confirmer le nouveau mot de passe</label>
                <input type="password" class="form-control" formControlName="confirmPwd">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-dark" [disabled]="pwdForm.invalid">Mettre à jour le mot de passe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientProfilComponent implements OnInit {
    profile$: Observable<Client>;
    pwdForm: FormGroup;

    constructor(
        private clientBankService: ClientBankService,
        private fb: FormBuilder
    ) {
        this.profile$ = this.clientBankService.getProfile();
        this.pwdForm = this.fb.group({
            currentPwd: ['', Validators.required],
            newPwd: ['', [Validators.required, Validators.minLength(8)]],
            confirmPwd: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void { }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPwd')?.value === g.get('confirmPwd')?.value ? null : { mismatch: true };
    }

    onPasswordSubmit() {
        if (this.pwdForm.valid) {
            alert("Demande de changement de mot de passe envoyée (Simulation) !");
            this.pwdForm.reset();
        }
    }
}
