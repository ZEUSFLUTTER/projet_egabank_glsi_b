import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StockageJeton } from './stockage-jeton';

export const gardeAuthentificationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (StockageJeton.estConnecte()) {
    return true;
  }
  
  router.navigate(['/connexion']);
  return false;
};