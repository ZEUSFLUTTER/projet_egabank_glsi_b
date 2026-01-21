import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientUpdateDto } from '../../shared/models/client.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://localhost:8080/api/client';

  constructor(private http: HttpClient) {}

  getClientByCode(codeClient: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/detail/${codeClient}`);
  }

  getClientByEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/details/${email}`);
  }

  getAllActiveClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/clientActif`);
  }

  getAllInactiveClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/clientInactif`);
  }

  deleteClient(codeClient: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/delete/${codeClient}`, {});
  }

  updateClient(codeClient: string, clientDto: ClientUpdateDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/modifier/${codeClient}`, clientDto);
  }
}
