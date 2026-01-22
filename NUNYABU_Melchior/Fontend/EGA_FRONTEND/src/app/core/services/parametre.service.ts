import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parametre {
  id?: number;
  cle: string;
  valeur: string;
  dateCreation?: string;
  dateModification?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ParametreService {
  private apiUrl = 'http://localhost:9090/api/parametres';

  constructor(private http: HttpClient) { }

  // Obtenir tous les paramètres
  getParametres(): Observable<ApiResponse<Parametre[]>> {
    return this.http.get<ApiResponse<Parametre[]>>(`${this.apiUrl}`);
  }

  // Obtenir un paramètre spécifique
  getParametre(cle: string): Observable<ApiResponse<Parametre>> {
    return this.http.get<ApiResponse<Parametre>>(`${this.apiUrl}/${cle}`);
  }

  // Créer/Mettre à jour un paramètre
  saveParametre(cle: string, valeur: string): Observable<ApiResponse<Parametre>> {
    return this.http.post<ApiResponse<Parametre>>(`${this.apiUrl}`, { cle, valeur });
  }

  // Supprimer un paramètre
  deleteParametre(cle: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${cle}`);
  }
}
