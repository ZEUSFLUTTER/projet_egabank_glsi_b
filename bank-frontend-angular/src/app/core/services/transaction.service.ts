import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transaction, OperationDto, VirementDto, TransactionAvecCompte } from '../models/client.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.API_URL);
  }

  getAllTransactionsAvecCompte(): Observable<TransactionAvecCompte[]> {
    return this.http.get<TransactionAvecCompte[]>(`${this.API_URL}/avec-compte`);
  }

  getTransactionsByCompte(numeroCompte: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_URL}/compte/${numeroCompte}`);
  }

  getTransactionsByComptePeriode(
    numeroCompte: string, 
    dateDebut: string, 
    dateFin: string
  ): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    
    return this.http.get<Transaction[]>(`${this.API_URL}/compte/${numeroCompte}/periode`, { params });
  }

  effectuerDepot(operation: OperationDto): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}/depot`, operation);
  }

  effectuerRetrait(operation: OperationDto): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}/retrait`, operation);
  }

  effectuerOperation(operation: OperationDto, type: string): Observable<Transaction> {
    if (type === 'DEPOT') {
      return this.effectuerDepot(operation);
    } else if (type === 'RETRAIT') {
      return this.effectuerRetrait(operation);
    } else {
      throw new Error(`Type d'opération non supporté: ${type}`);
    }
  }

  effectuerVirement(virement: VirementDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.API_URL}/virement`, virement);
  }
}