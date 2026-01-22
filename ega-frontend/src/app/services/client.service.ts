import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client, ClientCreateRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('[ClientService] getAllClients failed:', err);
        return of([] as Client[]);
      })
    );
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  getCurrentClient(): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/current`);
  }

  createClient(client: ClientCreateRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
