import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number | null = null;
  errorMessage: string = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateNaissance: ['', Validators.required],
      sexe: ['', [Validators.required, Validators.pattern(/^[MF]$/)]],
      adresse: ['', [Validators.required, Validators.maxLength(200)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      courriel: ['', [Validators.required, Validators.email]],
      nationalite: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clientId = +params['id'];
        this.isEditMode = true;
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue({
          ...client,
          dateNaissance: client.dateNaissance.split('T')[0]
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement du client';
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData: Client = this.clientForm.value;
      
      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la modification';
          }
        });
      } else {
        this.clientService.createClient(clientData).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la création';
          }
        });
      }
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      this.markFormGroupTouched(this.clientForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
