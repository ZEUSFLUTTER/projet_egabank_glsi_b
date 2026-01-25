import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  dateNaissance = ''; // ✅ Ajout
  sexe = '';          // ✅ Ajout
  adresse = '';       // ✅ Ajout
  telephone = '';     // ✅ Ajout
  nationalite = '';   // ✅ Ajout

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // ✅ Envoie tous les champs requis
    const userData = {
      nom: this.lastName,
      prenom: this.firstName,
      email: this.email,
      password: this.password,
      dateNaissance: this.dateNaissance,
      sexe: this.sexe,
      adresse: this.adresse,
      telephone: this.telephone,
      nationalite: this.nationalite,
      role: 'CLIENT'
    };

    console.log('Envoi des données:', userData);

    const success = await this.authService.register(userData);
    
    if (success) {
      const loginSuccess = await this.authService.login({ email: this.email, password: this.password });
      
      if (loginSuccess) {
        this.router.navigate(['/first-account']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      alert('Erreur lors de l\'inscription');
    }
  }
}