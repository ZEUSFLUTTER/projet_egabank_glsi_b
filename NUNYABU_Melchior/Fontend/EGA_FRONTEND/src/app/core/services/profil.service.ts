import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientDTO {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  adresse: string;
  telephone: string;
  email: string;
  nationalite: string;
  dateCreation?: string;
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
export class ProfilService {
  private apiUrl = 'http://localhost:9090/api/profil';

  constructor(private http: HttpClient) { }

  // Obtenir le profil de l'utilisateur connecté
  getProfil(): Observable<ApiResponse<ClientDTO>> {
    return this.http.get<ApiResponse<ClientDTO>>(`${this.apiUrl}`);
  }

  // Mettre à jour le profil
  updateProfil(client: ClientDTO): Observable<ApiResponse<ClientDTO>> {
    return this.http.put<ApiResponse<ClientDTO>>(`${this.apiUrl}`, client);
  }
}
