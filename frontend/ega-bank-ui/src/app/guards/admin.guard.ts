import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour protéger les routes réservées aux administrateurs
 */
export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.isAdmin()) {
    // Rediriger vers le dashboard si l'utilisateur n'est pas admin
    router.navigate(['/client/dashboard']);
    return false;
  }

  return true;
};
