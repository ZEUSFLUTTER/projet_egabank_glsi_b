import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api';

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string | Date;
  sexe: 'MASCULIN' | 'FEMININ';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  dateCreation?: string | Date;
}

export interface ClientCreationDTO {
  nom: string;
  prenom: string;
  dateNaissance: string | Date;
  sexe: 'MASCULIN' | 'FEMININ';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${API_URL}/clients`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${API_URL}/clients/${id}`);
  }

  create(client: ClientCreationDTO): Observable<Client> {
    return this.http.post<Client>(`${API_URL}/clients`, client);
  }

  update(id: number, client: ClientCreationDTO): Observable<Client> {
    return this.http.put<Client>(`${API_URL}/clients/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/clients/${id}`);
  }
}
