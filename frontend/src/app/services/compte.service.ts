import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Compte {
  id?: number;
  numeroCompte: string;
  typeCompte: string;
  dateCreation: string;
  solde: number;
  clientId?: number;
}

export interface CompteCreateDTO {
  clientId: number;
  typeCompte: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  private apiUrl = 'http://localhost:8081/api/comptes';

  constructor(private http: HttpClient) { }

  getComptesByClient(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  createCompte(dto: CompteCreateDTO): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, dto);
  }

  getCompteByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/numero/${numeroCompte}`);
  }
}
