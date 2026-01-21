import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { CompteModele } from '../modeles/compte-modele';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceComptes {
  private URL_API = `${environment.apiUrl}/comptes`;

  constructor(private http: HttpClient) {}

  lister(): Observable<CompteModele[]> {
    return this.http.get<CompteModele[]>(this.URL_API).pipe(
      catchError((e) => throwError(() => 'Erreur du chargement des comptes'))
    );
  }

  creerCourant(idClient: number, decouvertAutorise: number): Observable<CompteModele> {
    return this.http.post<CompteModele>(`${this.URL_API}/courant`, { idClient, decouvertAutorise });
  }

  creerEpargne(idClient: number, tauxInteret: number): Observable<CompteModele> {
    return this.http.post<CompteModele>(`${this.URL_API}/epargne`, { idClient, tauxInteret });
  }

  consulter(numeroCompte: string): Observable<CompteModele> {
    return this.http.get<CompteModele>(`${this.URL_API}/${encodeURIComponent(numeroCompte)}`);
  }

  depot(numeroCompte: string, montant: number, libelle: string): Observable<void> {
    if (montant <= 0) return throwError(() => 'Montant invalide');
    return this.http.post<void>(`${this.URL_API}/depot`, { numeroCompte, montant, libelle });
  }

  retrait(numeroCompte: string, montant: number, libelle: string): Observable<void> {
    if (montant <= 0) return throwError(() => 'Montant invalide');
    return this.http.post<void>(`${this.URL_API}/retrait`, { numeroCompte, montant, libelle });
  }

  virement(src: string, dst: string, montant: number, libelle: string): Observable<void> {
    if (src === dst) return throwError(() => 'Comptes identiques');
    return this.http.post<void>(`${this.URL_API}/virement`, {
      numeroCompteSource: src,
      numeroCompteDestination: dst,
      montant,
      libelle
    });
  }
}
