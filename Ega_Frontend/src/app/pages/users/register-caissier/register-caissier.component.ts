import { Component, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-caissier',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './register-caissier.component.html',
  styleUrl: './register-caissier.component.scss'
})
export class RegisterCaissierComponent {

  public register_caissierForm! : FormGroup;

  private readonly authService : AuthService = inject(AuthService);

  constructor(
    private fb : FormBuilder,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.register_caissierForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      username: ['' , [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+228\d{8}|\+228\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/)]]
    });
  } 

  onRegisterCaissierSubmit(): void {
    if(this.register_caissierForm.invalid){
      this.register_caissierForm.markAllAsTouched();
      return;
    }
    
    const { firstName, lastName, username, password, email, phoneNumber } = this.register_caissierForm.value;
    console.log('Données du formulaire :', this.register_caissierForm.value);

    this.authService.registerCaissier(firstName, lastName, username, password, email, phoneNumber).subscribe({
      next: (response) => {
        console.log('Réponse du serveur :', response);
        this.register_caissierForm.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription du caissier :', err);
      }
    });
  }
}
