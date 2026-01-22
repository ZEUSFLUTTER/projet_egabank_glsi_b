import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:9090/api/diagnostic';

  /**
   * Test basique sans authentification
   */
  ping(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ping`);
  }

  /**
   * Teste si le token JWT est correctement envoyé
   */
  checkToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-token`);
  }

  /**
   * Teste une connexion POST
   */
  testConnection(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/test-connection`, data);
  }
}
