import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api';

export interface Compte {
  id?: number;
  numeroCompte: string;
  solde: number;
  dateCreation: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  proprietaire: any;
  decouvertAutorise?: number;
  tauxInteret?: number;
}

export interface CompteCourantCreationDTO {
  idClient: number;
  decouvertAutorise: number;
}

export interface CompteEpargneCreationDTO {
  idClient: number;
  tauxInteret: number;
}

export interface OperationDTO {
  numeroCompte: string;
  montant: number;
  libelle: string;
}

export interface VirementDTO {
  numeroCompteSource: string;
  numeroCompteDestination: string;
  montant: number;
  libelle: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${API_URL}/comptes`);
  }

  getByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${API_URL}/comptes/${numeroCompte}`);
  }

  createCourant(dto: CompteCourantCreationDTO): Observable<Compte> {
    return this.http.post<Compte>(`${API_URL}/comptes/courant`, dto);
  }

  createEpargne(dto: CompteEpargneCreationDTO): Observable<Compte> {
    return this.http.post<Compte>(`${API_URL}/comptes/epargne`, dto);
  }

  depot(dto: OperationDTO): Observable<void> {
    return this.http.post<void>(`${API_URL}/comptes/depot`, dto);
  }

  retrait(dto: OperationDTO): Observable<void> {
    return this.http.post<void>(`${API_URL}/comptes/retrait`, dto);
  }

  virement(dto: VirementDTO): Observable<void> {
    return this.http.post<void>(`${API_URL}/comptes/virement`, dto);
  }
}
