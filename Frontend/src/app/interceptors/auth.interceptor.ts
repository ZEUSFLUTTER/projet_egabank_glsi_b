import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token invalide ou expiré
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
