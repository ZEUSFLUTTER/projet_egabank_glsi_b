import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number;
  typeTransaction: string; // DEPOT, RETRAIT, VIREMENT
  montant: number;
  dateTransaction: string;
  compteSource?: any;
  compteDestination?: any;
}

export interface DepotRequest {
  montant: number;
}

export interface RetraitRequest {
  montant: number;
}

export interface VirementRequest {
  compteDestinationId: number;
  montant: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8081/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactionsByCompte(compteId: number, dateDebut: string, dateFin: string): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('debut', dateDebut)
      .set('fin', dateFin);

    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`, { params });
  }

  faireDepot(compteId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, {
      compteId,
      montant
    });
  }

  faireRetrait(compteId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, {
      compteId,
      montant
    });
  }

  faireVirement(compteSourceId: number, compteDestinationId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, {
      compteSourceId,
      compteDestinationId,
      montant
    });
  }

  getTransactionsByCompteOnly(compteId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`);
  }
}
