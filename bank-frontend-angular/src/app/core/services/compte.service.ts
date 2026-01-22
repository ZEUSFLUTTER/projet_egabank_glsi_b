import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Compte, CreateCompteDto, CompteAvecProprietaire } from '../models/client.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private readonly API_URL = `${environment.apiUrl}/comptes`;

  constructor(private http: HttpClient) {}

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.API_URL);
  }

  getAllComptesAvecProprietaire(): Observable<CompteAvecProprietaire[]> {
    return this.http.get<CompteAvecProprietaire[]>(`${this.API_URL}/avec-proprietaire`);
  }

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.API_URL}/${id}`);
  }

  getCompteByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.API_URL}/numero/${numeroCompte}`);
  }

  getComptesByClientId(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.API_URL}/client/${clientId}`);
  }

  getComptesByClientIdAndType(clientId: number, typeCompte: string): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.API_URL}/client/${clientId}/type/${typeCompte}`);
  }

  createCompte(compteDto: CreateCompteDto): Observable<Compte> {
    return this.http.post<Compte>(this.API_URL, compteDto);
  }

  updateCompte(id: number, compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.API_URL}/${id}`, compte);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}