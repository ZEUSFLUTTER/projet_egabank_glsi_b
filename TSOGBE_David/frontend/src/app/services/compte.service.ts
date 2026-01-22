import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte, TypeCompte } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes';

  constructor(private http: HttpClient) {}

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${id}`);
  }

  getCompteByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/numero/${numeroCompte}`);
  }

  getComptesByClientId(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getComptesByClientIdAndType(clientId: number, typeCompte: TypeCompte): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}/type/${typeCompte}`);
  }

  createCompte(compte: Compte): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, compte);
  }

  updateCompte(id: number, compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.apiUrl}/${id}`, compte);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

