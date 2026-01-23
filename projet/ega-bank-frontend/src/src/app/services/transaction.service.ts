import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Transaction,
  DepotRequest,
  RetraitRequest,
  VirementRequest,
  TransactionFilter
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  depot(request: DepotRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, request);
  }

  retrait(request: RetraitRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, request);
  }

  virement(request: VirementRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, request);
  }

  getTransactionsByAccount(numeroCompte: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${numeroCompte}`);
  }

  getTransactionsByPeriod(filter: TransactionFilter): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/filter`, filter);
  }

  generateReleve(filter: TransactionFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/releve`, filter, {
      responseType: 'blob'
    });
  }
}
