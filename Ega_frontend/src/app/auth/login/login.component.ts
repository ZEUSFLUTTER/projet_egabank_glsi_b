import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginData = { username: '', password: '' };
  isLoading = false;

  onSubmit() {
     localStorage.clear();
    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Redirection intelligente
        if(user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/client']);
        }
        Swal.fire({
          icon: 'success',
          title: 'Bienvenue',
          text: 'Connexion réussie',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Identifiants incorrects', 'error');
      }
    });
  }


}
