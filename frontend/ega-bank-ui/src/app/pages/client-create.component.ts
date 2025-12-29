import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page card">
      <h2>Create Client</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Last name</label>
        <input formControlName="nom" />
        <label>First name</label>
        <input formControlName="prenom" />
        <label>Date of birth</label>
        <input type="date" formControlName="dateNaissance" />
        <label>Sex</label>
        <select formControlName="sexe">
          <option value="MASCULIN">Male</option>
          <option value="FEMININ">Female</option>
        </select>
        <label>Phone</label>
        <input formControlName="telephone" />
        <label>Email</label>
        <input formControlName="courriel" />
        <div class="actions">
          <button type="submit" [disabled]="form.invalid">Create</button>
        </div>
      </form>
    </div>
  `,
})
export class ClientCreateComponent {
  form: any;

  constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [new Date().toISOString().split('T')[0], Validators.required],
      sexe: ['MASCULIN', Validators.required],
      telephone: [''],
      courriel: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const payload = {
      nom: this.form.value.nom,
      prenom: this.form.value.prenom,
      dateNaissance: this.form.value.dateNaissance,
      sexe: this.form.value.sexe,
      telephone: this.form.value.telephone,
      courriel: this.form.value.courriel,
    };
    this.clientService.create(payload).subscribe({
      next: () => this.router.navigateByUrl('/clients'),
      error: (err) => console.error('Create client failed', err),
    });
  }
}
