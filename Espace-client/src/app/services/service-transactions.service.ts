import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionModele } from '../modeles/transaction-modele';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactions {
  private readonly urlApi = 'http://localhost:8081/api/transactions-client';

  constructor(private http: HttpClient) {}

  listerTransactionsCompte(compteId: number): Observable<TransactionModele[]> {
    return this.http.get<TransactionModele[]>(`${this.urlApi}/compte/${compteId}`);
  }

  listerMesTransactions(): Observable<TransactionModele[]> {
    return this.http.get<TransactionModele[]>(`${this.urlApi}/mes-transactions`);
  }

  listerTransactionsPeriode(compteId: number, dateDebut: string, dateFin: string): Observable<TransactionModele[]> {
    return this.http.get<TransactionModele[]>(
      `${this.urlApi}/compte/${compteId}/periode?dateDebut=${dateDebut}&dateFin=${dateFin}`
    );
  }
}