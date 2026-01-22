import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public isSubmitting = false; // Pour désactiver le bouton pendant la soumission
  public errorMessage: string | null = null; // Pour afficher les erreurs

  private readonly authService: AuthService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    // Réinitialiser le message d'erreur
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    // Désactiver le bouton pendant la soumission
    this.isSubmitting = true;

    const { username, password } = this.loginForm.value;
    console.log('Tentative de connexion pour:', username);

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Réponse du serveur :', response);
        
        // 1. Stocker le token
        localStorage.setItem('authToken', response.token);

        // 2. Récupérer et stocker les rôles
        const roles = this.authService.getRoles(); 
        console.log('Rôles utilisateur :', roles);

        // 3. Stocker le premier rôle (le plus important)
        const userRole = roles.length > 0 ? roles[0] : null;
      
        if (userRole) {
          localStorage.setItem('userRole', userRole);
          console.log('Rôle stocké :', userRole);
        }


        localStorage.setItem('userName', username); 
        

        // Réinitialiser le formulaire
        this.loginForm.reset();
        this.isSubmitting = false;

        console.log('Redirection vers la page du rôle:', userRole);
        
        if (userRole === 'CAISSIERE') {
          this.router.navigate(['/transactions/operations']);
        } else if (userRole === 'GESTIONNAIRE') {
          this.router.navigate(['/accounts/list']);
        } else if (userRole === 'ADMIN') {
          this.router.navigate(['/users/list']);
        } else {
          console.warn('Rôle non reconnu, redirection par défaut');
          this.router.navigate(['/accounts/list']);
        }
       // window.location.reload()
      },
      error: (err) => {
        console.error('Erreur de connexion :', err);
        this.isSubmitting = false;
      }
    });
  }
}