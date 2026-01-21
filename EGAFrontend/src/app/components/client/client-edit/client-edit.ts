import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Check, Edit, LucideAngularModule } from 'lucide-angular';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-edit',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.css',
})
export class ClientEdit implements OnInit {
  readonly Edit = Edit;
  readonly Check = Check;
  form!: FormGroup;
  clientId!: number;
  loadingData = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.clientId) {
      this.loadClientData();
    }
  }

  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      nationalite: ['', [Validators.required]],
    });
  }

  loadClientData() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.form.patchValue(client);
        this.loadingData = false;
      },
      error: () => {
        alert("Erreur lors de la récupération du client");
        this.router.navigate(['/client']);
      }
    });
  }

  onUpdate() {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.clientService.updateClient(this.clientId, this.form.value).subscribe({
        next: () => {
        this.snack.open('Client modifié avec succès', 'X', {
          duration: 4000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate(['/client']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error("Erreur de mise à jour", err);
        }
      });
    }
  }
}