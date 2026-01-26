import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as Array<'CLIENT' | 'AGENT' | 'ADMIN'>;

  const user = authState.getUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  // Accès refusé
  router.navigate(['/login']);
  return false;
};