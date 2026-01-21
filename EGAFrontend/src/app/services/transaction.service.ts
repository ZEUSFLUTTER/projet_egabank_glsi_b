import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = `${env.apiUrl}/transaction`;
  constructor(private http: HttpClient) {}

  deposer(numeroCompte: string, montant: number): Observable<string> {
    const dto = {
      numeroCompteDestination: numeroCompte,
      solde: montant
    };
    return this.http.post(`${this.apiUrl}/deposer`, dto, { responseType: 'text' });
  }

  retirer(numeroCompte: string, montant: number): Observable<string> {
    const dto = {
      numeroCompteSource: numeroCompte, 
      solde: montant 
    };
    return this.http.post(`${this.apiUrl}/retirer`, dto, { responseType: 'text' });
  }

  virement(source: string, destination: string, montant: number): Observable<string> {
    const dto = {
      numeroCompteSource: source,
      numeroCompteDestination: destination,
      solde: montant
    };
    return this.http.post(`${this.apiUrl}/virement`, dto, { responseType: 'text' });
  }

  getHistorique(numeroCompte: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${numeroCompte}`);
  }

  envoyerReleve(numeroCompte: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/releve/envoyer/${numeroCompte}`, 
      {}
    );
  }

  telechargerReleve(numeroCompte: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/releve/pdf/${numeroCompte}`, {
      responseType: 'blob'
    });
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/all`);
  }
}