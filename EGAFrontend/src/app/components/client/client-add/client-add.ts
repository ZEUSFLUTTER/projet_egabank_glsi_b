  import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPlus, Save, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './client-add.html',
  styleUrl: './client-add.css',
})
export class ClientAdd {
  readonly UserPlus = UserPlus;
  readonly Save = Save;
  fb = inject(FormBuilder);
  clientService = inject(ClientService);
  router = inject(Router);
  constructor(private snack: MatSnackBar) {}
  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    sexe: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    nationalite: ['', Validators.required],
    typeCompte: ['Epargne', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      client: {
        nom: this.form.value.nom!,
        prenom: this.form.value.prenom!,
        dateNaissance: this.form.value.dateNaissance!,
        sexe: this.form.value.sexe!,
        telephone: this.form.value.telephone!,
        email: this.form.value.email!,
        nationalite: this.form.value.nationalite!,
      },
      typeCompte: this.form.value.typeCompte!
    };

    this.clientService.ajouterClient(payload).subscribe({
      
      next: () => { 
        this.snack.open('Client ajouté avec succès', '', {
          duration: 4000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate(['/client']);
      },
      error: err => console.error(err)
    });
  }
}