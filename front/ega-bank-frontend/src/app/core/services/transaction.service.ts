import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transactions'; // URL de base pour les transactions

  constructor(private http: HttpClient) { }

  // Récupérer toutes les transactions
  getTransactions(): Observable<Operation[]> {
    return this.http.get<Operation[]>(this.baseUrl);
  }

  // Créer une nouvelle transaction
  createTransaction(transaction: Operation): Observable<Operation> {
    return this.http.post<Operation>(this.baseUrl, transaction);
  }

  // Supprimer une transaction par ID
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer une transaction par ID
  getTransactionById(id: number): Observable<Operation> {
    return this.http.get<Operation>(`${this.baseUrl}/${id}`);
  }
}