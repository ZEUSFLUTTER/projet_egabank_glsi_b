import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-gestionnaire',
  imports: [ReactiveFormsModule ,CommonModule],
  templateUrl: './register-gestionnaire.component.html',
  styleUrl: './register-gestionnaire.component.scss'
})
export class RegisterGestionnaireComponent {

  public register_gestionnaireForm! : FormGroup;

  private readonly authService : AuthService = inject(AuthService);

  constructor(
    private fb : FormBuilder,
    private router : Router
  ) {}

    ngOnInit(): void {
    this.register_gestionnaireForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      username: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+228\d{8}|\+228\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/)]]
    });
  } 

  onRegisterGestionnaireSubmit(): void {
    if(this.register_gestionnaireForm.invalid){
      this.register_gestionnaireForm.markAllAsTouched();
      return;
    }
        const { firstName, lastName, username, password, email, phoneNumber } = this.register_gestionnaireForm.value;
    console.log('Données du formulaire :', this.register_gestionnaireForm.value);

    this.authService.registerGestionnaire(firstName, lastName, username, password, email, phoneNumber).subscribe({
      next: (response) => {
        console.log('Réponse du serveur :', response);
        this.register_gestionnaireForm.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription du caissier :', err);
      }
    });
  }
}
