import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { env } from '../../env/env';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiUrl = `${env.apiUrl}/client`;

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }

  ajouterClient(data: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ajouter`, data);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/modifier/${id}`, client);
  }

  deleteClient(id: number): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/supprimer/${id}`,
      {},
      {
        responseType: 'text'
      }
    );
  }
}
