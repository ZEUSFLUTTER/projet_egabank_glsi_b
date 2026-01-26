import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 handleLogin() {
  const { username, password } = this.loginForm.value;
  this.authService.login(username, password).subscribe({
    next: (token) => {
      // Attendre 100ms que le localStorage se remplisse
      setTimeout(() => {
        const role = this.authService.getRole();
        console.log("Rôle détecté :", role);
        if (role === 'ADMIN') {
          this.router.navigateByUrl("/admin/home");
        } else {
          this.router.navigateByUrl("/admin/home"); // Le dashboard s'adaptera via *ngIf
        }
      }, 100);
    },
    error:(err) => {
        this.authService.logout(); 
      
      // 2. On affiche le message du Backend ("Ce compte a été clôturé...")
      const msg = err.error?.message || "Identifiants incorrects";
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: msg,
        confirmButtonColor: '#0d6efd'
      });
    }
  });
}
}