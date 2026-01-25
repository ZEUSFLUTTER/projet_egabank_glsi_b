import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajuste le chemin si nécessaire

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AdminGuard: canActivate appelé');

    // Vérifie si l'utilisateur est connecté ET s'il est admin
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdmin = this.authService.isAdmin();

    console.log('AdminGuard: isLoggedIn =', isLoggedIn);
    console.log('AdminGuard: isAdmin =', isAdmin);
    console.log('AdminGuard: currentUser.role =', this.authService.currentUser?.role);
    console.log('AdminGuard: localStorage role =', JSON.parse(localStorage.getItem('user') || '{}').role);

    if (isLoggedIn && isAdmin) {
      console.log('AdminGuard: Accès autorisé');
      return true; // Autorise l'accès
    } else {
      console.log('AdminGuard: Accès refusé, redirection vers /dashboard');
      // Redirige vers le dashboard ou une page d'erreur
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}