import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log('AuthGuard - isAuthenticated:', isAuth);
  console.log('AuthGuard - token:', authService.getToken());

  if (isAuth) {
    return true;
  }

  console.log('AuthGuard - Redirection vers /login');
  router.navigate(['/login']);
  return false;
};
