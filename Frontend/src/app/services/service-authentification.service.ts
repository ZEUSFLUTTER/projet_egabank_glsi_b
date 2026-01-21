import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockageJeton } from '../coeur/stockage-jeton';

@Injectable({ providedIn: 'root' })
export class ServiceAuthentification {
  private URL_API = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  connexion(nomUtilisateur: string, motDePasse: string): Observable<void> {
    return this.http
      .post<{ jeton: string }>(`${this.URL_API}/connexion`, { nomUtilisateur, motDePasse })
      .pipe(
        tap(r => StockageJeton.enregistrer(r.jeton)),
        map(() => void 0),
        catchError(err => {
          if (err.status === 401) return throwError(() => 'Identifiants incorrects');
          return throwError(() => 'Erreur serveur');
        })
      );
  }

  deconnexion(): void {
    StockageJeton.supprimer();
  }
}
