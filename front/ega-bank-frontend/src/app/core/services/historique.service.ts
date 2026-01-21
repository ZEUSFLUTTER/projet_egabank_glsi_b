import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private baseUrl = 'http://localhost:8080/api/historique'; // URL de base pour les requêtes

  constructor(private http: HttpClient) { }

  // Récupérer l'historique des opérations pour un compte spécifique
  getHistoriqueByCompteId(compteId: number): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.baseUrl}/comptes/${compteId}`);
  }

  // Récupérer l'historique des opérations pour un client spécifique
  getHistoriqueByClientId(clientId: number): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.baseUrl}/clients/${clientId}`);
  }
}