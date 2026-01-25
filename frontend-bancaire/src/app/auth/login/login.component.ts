import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    console.log('Envoi des données:', credentials);

    // Utilise le service d'authentification
    const success = await this.authService.login(credentials);
    
    if (success) {
      // ✅ Le AuthService a déjà correctement stocké les infos utilisateur dans localStorage
      // ✅ Suppression du code redondant qui écrasait le 'role'
      this.router.navigate(['/dashboard']);
    } else {
      alert('Identifiants incorrects');
    }
  }
}