import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  // Historique d'un client en JSON
  getHistoriqueClient(clientId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // Historique d'un client en PDF
  getHistoriqueClientPdf(clientId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/client/${clientId}/pdf`, {
      responseType: 'blob'
    });
  }

  // Toutes les transactions (pour admin)
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/all`);
  }

  // Export des transactions
  exportTransactions(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    });
  }
}
