import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Client } from '../models/client.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.API_URL);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  getClientByEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/email/${email}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.API_URL, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  searchClients(term: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/search?term=${term}`);
  }
}