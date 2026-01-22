import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  // Pour admin : récupérer toutes les transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`).pipe(
      catchError((err) => {
        console.error('[TransactionService] getAllTransactions failed:', err);
        return of([] as Transaction[]);
      })
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/user`).pipe(
      catchError((err) => {
        console.error('[TransactionService] getTransactions failed:', err);
        return of([] as Transaction[]);
      })
    );
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`);
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction);
  }

  updateTransaction(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByDateRange(startDate: string, endDate: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  }

  getAccountTransactions(accountId: number, limit?: number): Observable<Transaction[]> {
    const url = limit
      ? `${this.apiUrl}/account/${accountId}?limit=${limit}`
      : `${this.apiUrl}/account/${accountId}`;
    return this.http.get<Transaction[]>(url);
  }

  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`);
  }

  // Méthodes pour les opérations bancaires
  deposit(request: { accountNumber: string; amount: number }): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/deposit`, request);
  }

  withdraw(request: { accountNumber: string; amount: number }): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/withdraw`, request);
  }

  transfer(request: { fromAccount: string; toAccount: string; amount: number }): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transfer`, request);
  }
}