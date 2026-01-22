import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:9090/api/admin';

  constructor(private http: HttpClient, private auth: Auth) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients`, { headers: this.getHeaders() });
  }

  getAllComptes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/comptes`, { headers: this.getHeaders() });
  }

  getAllTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/transactions`, { headers: this.getHeaders() });
  }

  getStatistiques(): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistiques`, { headers: this.getHeaders() });
  }

  getClientDetails(clientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients/${clientId}/details`, { headers: this.getHeaders() });
  }
}
