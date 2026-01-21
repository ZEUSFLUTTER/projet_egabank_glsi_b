import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StockageJeton } from './stockage-jeton';

export const gardeAuthentification: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!StockageJeton.estConnecte()) {
    router.navigate(['/connexion'], {
      queryParams: { retour: state.url }
    });
    return false;
  }

  return true;
};
