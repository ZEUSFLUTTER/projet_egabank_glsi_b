import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card p-6" style="max-width: 600px; margin: 0 auto;">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Client' : 'Create Client' }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Last name</label>
            <input formControlName="nom" class="form-input" placeholder="Enter last name" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">First name</label>
            <input formControlName="prenom" class="form-input" placeholder="Enter first name" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
            <input type="date" formControlName="dateNaissance" class="form-input" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sex</label>
            <select formControlName="sexe" class="form-input">
                <option value="MASCULIN">Male</option>
                <option value="FEMININ">Female</option>
            </select>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input formControlName="telephone" class="form-input" placeholder="+1 234 567 8900" />
        </div>
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" formControlName="courriel" class="form-input" placeholder="client@example.com" />
        </div>
        <div class="flex gap-4">
          <button type="button" routerLink="/admin/clients" class="btn btn-secondary flex-1">Cancel</button>
          <button type="submit" [disabled]="form.invalid || isLoading" class="btn btn-primary flex-1">
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      background-color: #ffffff;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input:hover:not(:focus) {
      border-color: #9ca3af;
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    select.form-input {
      cursor: pointer;
    }
  `],
})
export class ClientCreateComponent implements OnInit {
  form: any;
  isEditMode = false;
  clientId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [new Date().toISOString().split('T')[0], Validators.required],
      sexe: ['MASCULIN', Validators.required],
      telephone: [''],
      courriel: ['', Validators.email],
    });
  }

  ngOnInit() {
    // Vérifier que l'utilisateur est admin
    if (!this.authService.isAdmin()) {
      alert('Access denied: Admin only');
      this.router.navigate(['/client/dashboard']);
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.clientId = +id;
        this.loadClientData(this.clientId);
      }
    });
  }

  loadClientData(id: number) {
    this.isLoading = true;
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.form.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          dateNaissance: client.dateNaissance,
          sexe: client.sexe,
          telephone: client.telephone,
          courriel: client.courriel
        });
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load client data');
        this.router.navigate(['/admin/clients']);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = this.form.value;

    if (this.isEditMode && this.clientId) {
      this.clientService.update(this.clientId, payload).subscribe({
        next: () => this.router.navigateByUrl('/admin/clients'),
        error: (err) => {
          console.error('Update failed', err);
          this.isLoading = false;
        }
      });
    } else {
      this.clientService.create(payload).subscribe({
        next: () => this.router.navigateByUrl('/admin/clients'),
        error: (err) => {
          console.error('Create failed', err);
          this.isLoading = false;
        }
      });
    }
  }
}
