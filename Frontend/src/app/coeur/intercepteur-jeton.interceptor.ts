import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StockageJeton } from './stockage-jeton';

export const intercepteurJeton: HttpInterceptorFn = (requete, suivant) => {
  const router = inject(Router);
  const jeton = StockageJeton.lire();

  const urlsSansAuth = ['/auth/connexion', '/auth/refresh'];

  if (!jeton || urlsSansAuth.some(u => requete.url.includes(u))) {
    return suivant(requete);
  }

  if (StockageJeton.estExpire(jeton)) {
    StockageJeton.supprimer();
    router.navigate(['/connexion']);
    return suivant(requete);
  }

  const requeteClonee = requete.clone({
    setHeaders: { Authorization: `Bearer ${jeton}` }
  });

  return suivant(requeteClonee);
};
