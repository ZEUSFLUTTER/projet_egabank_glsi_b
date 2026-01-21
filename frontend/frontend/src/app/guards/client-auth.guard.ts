import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ClientAuthService } from '../services/client-auth.service';

export const clientAuthGuard: CanActivateFn = (route, state) => {
  const clientAuthService = inject(ClientAuthService);
  const router = inject(Router);

  if (clientAuthService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/client/login']);
  return false;
};
