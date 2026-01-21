import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      courriel: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      dateNaissance: ['', Validators.required],
      sexe: ['', [Validators.required, Validators.pattern(/^[MF]$/)]],
      adresse: ['', [Validators.required, Validators.maxLength(200)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalite: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      role: ['ROLE_USER', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => {
          if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur.';
          } else if (error.status === 409) {
            this.errorMessage = 'Un utilisateur avec ce courriel existe déjà.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription.';
          }
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      this.markFormGroupTouched(this.registerForm);
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
