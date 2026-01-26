import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-client.html',
  styleUrl: './new-client.scss'
})
export class NewClientComponent {
  clientForm: FormGroup;
    namePattern = "^[a-zA-ZÀ-ÿ\\s'-]+$";
    today: string = new Date().toISOString().split('T')[0];


  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['M', Validators.required],
      adresse: ['', Validators.required],
      nationalite: ['', Validators.required]
    });
  }

  handleSaveClient() {
    let client = this.clientForm.value;
    this.clientService.saveClient(client).subscribe({
      next: (data) => {
        Swal.fire('Succès', 'Le client a été enregistré avec succès !', 'success');
        this.router.navigateByUrl("/admin/clients");
      },
      error: (err) => {
       const message = err.error?.message || "Erreur lors de l'enregistrement";
         Swal.fire('Erreur', message, 'error');      }
    });
  }
}