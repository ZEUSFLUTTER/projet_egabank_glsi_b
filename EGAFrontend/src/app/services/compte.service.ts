import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';
import { Compte } from '../models/compte.model';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private readonly apiUrl = `${env.apiUrl}`;
  constructor(private http: HttpClient) {}

  getComptesByClientId(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}/comptes`);
  }

  creerCompte(clientId: number, typeCompte: string): Observable<Compte> {
    const params = new HttpParams()
      .set('id', clientId.toString())
      .set('type', typeCompte);
    return this.http.post<Compte>(`${this.apiUrl}/compte/ajouter`, null, { params });
  }

  supprimerCompte(id: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/compte/supprimer/${id}`, {}, { responseType: 'text' });
  }

  loadAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/compte`);
  }
}