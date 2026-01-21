import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes'; // URL de l'API pour les comptes

  constructor(private http: HttpClient) { }

  // Récupérer tous les comptes
  getComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  // Récupérer un compte par ID
  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau compte
  createCompte(compte: Compte): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, compte);
  }

  // Mettre à jour un compte existant
  updateCompte(compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.apiUrl}/${compte.id}`, compte);
  }

  // Supprimer un compte
  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}