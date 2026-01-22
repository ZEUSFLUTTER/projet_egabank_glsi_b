import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  
  // Ne pas ajouter le token pour les routes d'authentification
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  const token = authService.getToken();

  let clonedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    }
  });

  if (token && !authService.isTokenExpired()) {
    clonedReq = clonedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      console.error('❌ Erreur HTTP interceptée:', error);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('Response:', error.error);
      return throwError(() => error);
    })
  );
};
