import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  effectuerDepot(compteId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteId', compteId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, null, { params });
  }

  effectuerRetrait(compteId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteId', compteId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, null, { params });
  }

  effectuerVirement(compteSourceId: number, compteDestId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteSourceId', compteSourceId.toString())
      .set('compteDestinationId', compteDestId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/transfert`, null, { params });
  }

  getTransactionsByCompte(compteId: number, dateDebut?: string, dateFin?: string): Observable<Transaction[]> {
    let params = new HttpParams();
    if (dateDebut) {
      params = params.set('dateDebut', dateDebut);
    }
    if (dateFin) {
      params = params.set('dateFin', dateFin);
    }
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`, { params });
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  downloadReleve(compteId: number, dateDebut?: string, dateFin?: string): Observable<Blob> {
    let params = new HttpParams();
    if (dateDebut) {
      params = params.set('dateDebut', dateDebut);
    }
    if (dateFin) {
      params = params.set('dateFin', dateFin);
    }
    return this.http.get(`http://localhost:8080/api/releves/compte/${compteId}`, {
      params,
      responseType: 'blob'
    });
  }
}

