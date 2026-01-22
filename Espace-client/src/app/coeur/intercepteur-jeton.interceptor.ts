import { HttpInterceptorFn } from '@angular/common/http';
import { StockageJeton } from './stockage-jeton';

export const intercepteurJetonInterceptor: HttpInterceptorFn = (req, next) => {
  const jeton = StockageJeton.obtenirJeton();
  
  if (jeton) {
    const reqAvecJeton = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jeton}`
      }
    });
    return next(reqAvecJeton);
  }
  
  return next(req);
};