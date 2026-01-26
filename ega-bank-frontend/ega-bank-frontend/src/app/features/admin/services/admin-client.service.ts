// features/admin/services/admin-client.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Client } from '../models/client.model';
import { ClientCreate } from '../models/client-create.model';
import { ClientUpdate } from '../models/client-update.model';

@Injectable({
  providedIn: 'root',
})
export class AdminClientService {
  private readonly API_URL = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  // ===============================
  // READ
  // ===============================

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.API_URL);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  // ===============================
  // CREATE
  // ===============================

  createClient(payload: ClientCreate): Observable<Client> {
    return this.http.post<Client>(this.API_URL, payload);
  }

  // ===============================
  // UPDATE
  // ===============================

  updateClient(id: number, payload: ClientUpdate): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, payload);
  }

  // ===============================
  // DELETE
  // ===============================

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}