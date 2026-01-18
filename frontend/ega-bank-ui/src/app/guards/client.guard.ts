import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour protéger les routes réservées aux clients
 */
export const ClientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.isClient()) {
    // Rediriger vers le dashboard admin si l'utilisateur n'est pas un client
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};
