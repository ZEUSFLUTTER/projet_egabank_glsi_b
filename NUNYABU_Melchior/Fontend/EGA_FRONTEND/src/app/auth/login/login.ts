import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';


@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private authService: Auth, private router: Router) { }

  onLogin(): void {
    console.log('📤 Envoi login pour:', this.username);
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('✅ Réponse complète du serveur:', response);
        console.log('📋 ID reçu:', response.id);
        console.log('🔑 Token reçu:', response.token ? response.token.substring(0, 20) + '...' : 'VIDE');
        console.log('👤 Username reçu:', response.username);
        console.log('🎭 Role reçu:', response.role);
        console.log('💾 Token stocké:', localStorage.getItem('jwtToken'));
        console.log('📱 UserId stocké:', localStorage.getItem('userId'));
        
        // Stocker le rôle et l'ID utilisateur
        if (response.role) {
          localStorage.setItem('userRole', response.role);
          console.log('✅ Role stocké en localStorage');
        }
        if (response.id) {
          localStorage.setItem('userId', response.id);
          console.log('✅ UserId stocké en localStorage');
        }
        
        // Rediriger selon le rôle
        const role = response.role || this.authService.getRole();
        console.log('🚀 Redirection vers:', role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        console.error('❌ Erreur login:', err);
        console.error('Détails erreur:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message,
          error: err.error?.error
        });
        this.errorMessage = err.error?.error || err.error || 'Erreur lors de la connexion';
      }
    });
  }

}
