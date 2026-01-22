import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ReleveService {
  private baseUrl = 'http://localhost:9090/api/releve';

  constructor(private http: HttpClient, private auth: Auth) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  genererReleve(numeroCompte: string, debut?: string, fin?: string): Observable<any> {
    let url = `${this.baseUrl}/compte/${numeroCompte}`;
    if (debut && fin) {
      url += `?debut=${debut}&fin=${fin}`;
    }
    return this.http.get(url, { headers: this.getHeaders() });
  }

  genererRelevePDF(numeroCompte: string, debut?: string, fin?: string): Observable<any> {
    let url = `${this.baseUrl}/compte/${numeroCompte}/pdf`;
    if (debut && fin) {
      url += `?debut=${debut}&fin=${fin}`;
    }
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
