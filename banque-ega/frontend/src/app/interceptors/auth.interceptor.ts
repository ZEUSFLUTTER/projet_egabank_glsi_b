import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si erreur 401 (Non autorisé) - généralement token invalide/expiré
      if (error.status === 401) {
        // Vérifier si c'est une erreur d'authentification (token invalide) 
        // ou une erreur métier
        const errorMessage = error.error?.message || '';
        
        // Si le message indique un problème d'authentification (token), déconnecter
        if (errorMessage.includes('token') || 
            errorMessage.includes('authentification') || 
            errorMessage.includes('JWT') ||
            errorMessage === '') {
          authService.logout();
          router.navigate(['/login']);
        }
        // Sinon, c'est probablement une erreur métier, on la laisse passer
      }
      // Pour 403 (Interdit), on ne déconnecte JAMAIS automatiquement
      // car cela peut être une erreur métier (ex: pas les droits pour cette action spécifique)
      // Les erreurs métier doivent être affichées à l'utilisateur, pas causer une déconnexion
      return throwError(() => error);
    })
  );
};

