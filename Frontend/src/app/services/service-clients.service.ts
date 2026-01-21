import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ClientModele } from '../modeles/client-modele';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceClients {
  private URL_API = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  lister(): Observable<ClientModele[]> {
    return this.http.get<ClientModele[]>(this.URL_API)
      .pipe(catchError(() => throwError(() => 'Erreur du chargement des clients')));
  }

  creer(client: ClientModele): Observable<ClientModele> {
    return this.http.post<ClientModele>(this.URL_API, client);
  }

  modifier(id: number, client: ClientModele): Observable<ClientModele> {
    return this.http.put<ClientModele>(`${this.URL_API}/${id}`, client);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL_API}/${id}`);
  }
}
 