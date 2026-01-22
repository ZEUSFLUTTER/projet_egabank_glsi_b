import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { CompteModele, OperationDTO, VirementDTO, CreationCompteDTO } from '../modeles/compte-modele';

@Injectable({
  providedIn: 'root'
})
export class ServiceComptes {
  private readonly urlApi = 'http://localhost:8081/api/comptes-client';

  constructor(private http: HttpClient) {}

  listerMesComptes(): Observable<CompteModele[]> {
    return this.http.get<CompteModele[]>(`${this.urlApi}/mes-comptes`);
  }

  obtenirCompte(id: number): Observable<CompteModele> {
    return this.http.get<CompteModele>(`${this.urlApi}/${id}`);
  }

  effectuerDepot(operation: OperationDTO): Observable<any> {
    console.log('DEBUG - Service: Envoi requête dépôt:', operation);
    return this.http.post(`${this.urlApi}/depot`, operation, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        console.log('DEBUG - Service: Réponse complète dépôt:', response);
        console.log('DEBUG - Service: Status:', response.status);
        console.log('DEBUG - Service: Body:', response.body);
      }),
      map((response: any) => response.body),
      catchError((error) => {
        console.error('DEBUG - Service: Erreur dépôt:', error);
        throw error;
      })
    );
  }

  effectuerRetrait(operation: OperationDTO): Observable<any> {
    return this.http.post(`${this.urlApi}/retrait`, operation);
  }

  effectuerVirement(virement: VirementDTO): Observable<any> {
    return this.http.post(`${this.urlApi}/virement`, virement);
  }

  creerCompte(donnees: CreationCompteDTO): Observable<CompteModele> {
    return this.http.post<CompteModele>(`${this.urlApi}/creer`, donnees);
  }
}