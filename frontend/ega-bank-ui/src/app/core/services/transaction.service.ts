import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OperationRequest, Transaction, TransferRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private readonly apiUrl = `${environment.apiUrl}/transactions`;

    constructor(private http: HttpClient) { }

    deposit(numeroCompte: string, request: OperationRequest): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/${numeroCompte}/deposit`, request);
    }

    withdraw(numeroCompte: string, request: OperationRequest): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/${numeroCompte}/withdraw`, request);
    }

    transfer(request: TransferRequest): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/transfer`, request);
    }

    getHistory(numeroCompte: string, debut: string, fin: string): Observable<Transaction[]> {
        const params = new HttpParams()
            .set('debut', debut)
            .set('fin', fin);
        return this.http.get<Transaction[]>(`${this.apiUrl}/${numeroCompte}/history`, { params });
    }

    getAllByAccount(numeroCompte: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/${numeroCompte}`);
    }

    downloadStatement(numeroCompte: string, debut: string, fin: string): Observable<Blob> {
        const params = new HttpParams()
            .set('debut', debut)
            .set('fin', fin);
        return this.http.get(`${environment.apiUrl}/statements/${numeroCompte}`, {
            params,
            responseType: 'blob'
        });
    }
}
