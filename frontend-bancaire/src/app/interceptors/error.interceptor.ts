import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // <--- Ajouté

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar // <--- Maintenant disponible
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        console.log(`[HTTP SUCCESS] ${req.method} ${req.urlWithParams}`, event);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`[HTTP ERROR] ${req.method} ${req.urlWithParams}`, error);

        let errorMessage = 'Une erreur inconnue est survenue.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur : ${error.error.message}`;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Requête mal formée.';
              break;
            case 401:
              errorMessage = 'Session expirée. Veuillez vous reconnecter.';
              this.router.navigate(['/login']);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              break;
            case 403:
              errorMessage = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée.';
              break;
            case 500:
              errorMessage = 'Erreur serveur interne.';
              break;
            default:
              errorMessage = `Erreur ${error.status}: ${error.message}`;
          }
        }

        // Afficher le message d'erreur via MatSnackBar
        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}