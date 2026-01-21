import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, Operation, Virement } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByCompteId(compteId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`);
  }

  getTransactionsByCompteIdAndPeriod(
    compteId: number,
    dateDebut: string,
    dateFin: string
  ): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}/periode`, { params });
  }

  faireDepot(operation: Operation): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, operation);
  }

  faireRetrait(operation: Operation): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, operation);
  }

  faireVirement(virement: Virement): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, virement);
  }
}
