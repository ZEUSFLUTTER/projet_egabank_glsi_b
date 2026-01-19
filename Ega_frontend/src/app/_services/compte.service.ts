import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte, CreateCompteDto, StatutCompte } from '../_models/models';

@Injectable({ providedIn: 'root' })
export class CompteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/comptes';

  // 1. Créer un compte
  creerCompte(dto: CreateCompteDto): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, dto);
  }

  // 2. Chercher par Numéro / IBAN
  getCompteByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${numeroCompte}`);
  }

  // 3. Lister les comptes d'un client
  getComptesClient(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // 4. Lister par type
  getComptesByType(type: string): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/type/${type}`);
  }

  // 5. Changer le statut
  changerStatut(numeroCompte: string, statut: StatutCompte): Observable<Compte> {
    // Utilisation de Patch avec paramètre de requête
    return this.http.patch<Compte>(
      `${this.apiUrl}/${numeroCompte}/statut?statut=${statut}`,
      {}
    );
  }

  // 6. Clôturer définitivement
  cloturerCompte(numeroCompte: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numeroCompte}`);
  }
}
