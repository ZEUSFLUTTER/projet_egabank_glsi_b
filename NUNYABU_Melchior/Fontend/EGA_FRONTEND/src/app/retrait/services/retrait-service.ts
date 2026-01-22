import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetraitService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:9090/api/comptes'; // adapter selon ton backend

  getRetraits(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  effectuerRetrait(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/retrait`, payload);
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }
}
