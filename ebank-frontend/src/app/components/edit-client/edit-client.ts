import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-client.html'
})
export class EditClientComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadClientData();
  }

  initForm() {
    this.clientForm = this.fb.group({
   nom: ['', [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ\\s'-]+$")]],
  prenom: ['', [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ\\s'-]+$")]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      adresse: ['', Validators.required],
      nationalite: ['', Validators.required]
    });
  }

  loadClientData() {
    this.clientService.getClient(this.clientId).subscribe({
      next: (data: any) => {
        // --- FORMATAGE DE LA DATE POUR L'INPUT HTML ---
        if (data.dateNaissance) {
          const date = new Date(data.dateNaissance);
          const year = date.getFullYear();
          const month = ('0' + (date.getMonth() + 1)).slice(-2);
          const day = ('0' + date.getDate()).slice(-2);
          data.dateNaissance = `${year}-${month}-${day}`;
        }
        
        // --- NORMALISATION DU SEXE ---
        if (data.sexe) {
          data.sexe = data.sexe.toUpperCase();
        }

        this.clientForm.patchValue(data);
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger le client', 'error')
    });
  }

  handleUpdateClient() {
    if (this.clientForm.invalid) return;

    this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
      next: () => {
        Swal.fire('Succès', 'Profil mis à jour avec succès !', 'success');
        this.router.navigateByUrl("/admin/clients");
      },
      error: (err) => {
  const message = err.error?.message || "Échec de la mise à jour";
  Swal.fire('Erreur', message, 'error');
}
    });
  }
}