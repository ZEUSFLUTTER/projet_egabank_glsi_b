import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          // Token expiré ou invalide - déconnexion
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Accès refusé - ne pas déconnecter, juste afficher l'erreur
          console.error('Accès refusé:', error.message);
          // Optionnel: rediriger vers une page d'erreur ou le dashboard approprié
        }

        return throwError(() => error);
      })
    );
  }
}