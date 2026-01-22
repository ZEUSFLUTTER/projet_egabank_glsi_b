import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from '../../core/services/auth';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private http = inject(HttpClient);
  private auth = inject(Auth);
  private baseUrl = 'http://localhost:9090/api/transactions';

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getHistorique(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mes-transactions`, { headers: this.getHeaders() });
  }

  getTransactionsByCompte(numeroCompte: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/compte/${numeroCompte}`, { headers: this.getHeaders() });
  }

  getTransactionsByPeriod(numeroCompte: string, debut: string, fin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/compte/${numeroCompte}/periode?debut=${debut}&fin=${fin}`, { headers: this.getHeaders() });
  }
}
