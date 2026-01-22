import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompteService {

  private baseUrl = 'http://localhost:9090/api/comptes';

  constructor(private http: HttpClient) {}

  getComptes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  creerCompte(compte: { clientId: number; typeCompte: string }): Observable<any> {
    // Endpoint: POST /api/comptes/creer
    const url = `${this.baseUrl}/creer`;
    console.log('📤 POST vers:', url);
    console.log('📦 Payload:', JSON.stringify(compte));
    
    return this.http.post<any>(url, JSON.stringify(compte), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  depot(numeroCompte: string, montant: number, source?: string): Observable<any> {
    const body: any = { numeroCompte, montant };
    if (source) body.source = source;
    return this.http.post<any>(`${this.baseUrl}/depot`, body);
  }

  retrait(numeroCompte: string, montant: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/retrait`, { numeroCompte, montant });
  }

  virement(source: string, destination: string, montant: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/virement`, { source, destination, montant });
  }

  supprimerCompte(compteId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${compteId}`);
  }
}