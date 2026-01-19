import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../_models/models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/clients'; // Ajuster le port selon config

  // 1. Liste de tous les clients (Admin)
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // 2. Chercher par ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  updateProfile(id: number, clientData: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, clientData);
  }

  // 3. Création Manuelle (Admin)
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // 4. Mise à jour
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  // 5. Suppression (Soft Delete)
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 6. Recherche Intelligente (Nom, Tel, Email)
  searchClients(query: string): Observable<Client[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Client[]>(`${this.apiUrl}/search`, { params });
  }
}
